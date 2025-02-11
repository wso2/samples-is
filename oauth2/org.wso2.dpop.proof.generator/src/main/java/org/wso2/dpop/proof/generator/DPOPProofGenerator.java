/*
 *  Copyright (c) 2025, WSO2 LLC. (http://www.wso2.com).
 *
 *  WSO2 LLC. licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.  See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 *
 */

package org.wso2.dpop.proof.generator;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JOSEObjectType;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.ECDSASigner;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jose.jwk.Curve;
import com.nimbusds.jose.jwk.ECKey;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.KeyFactory;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.interfaces.ECPublicKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Date;
import java.util.UUID;

import static org.wso2.dpop.proof.generator.Constant.CLAIM_ATH;
import static org.wso2.dpop.proof.generator.Constant.CLAIM_HTM;
import static org.wso2.dpop.proof.generator.Constant.CLAIM_HTU;
import static org.wso2.dpop.proof.generator.Constant.DPOP_JWT_TYPE;
import static org.wso2.dpop.proof.generator.Constant.EC;
import static org.wso2.dpop.proof.generator.Constant.EXPIRATION_TIME_MILLIS;
import static org.wso2.dpop.proof.generator.Constant.ISSUER;
import static org.wso2.dpop.proof.generator.Constant.RSA;
import static org.wso2.dpop.proof.generator.Constant.SUBJECT;

/**
 * Generates a DPoP (Demonstrating Proof-of-Possession) proof using an existing key pair.
 * <p>
 * This class loads a private and public key from specified file paths and generates a signed JWT,
 * following the OAuth 2.0 DPoP Proof JWT format.
 * </p>
 */
public class DPOPProofGenerator {

    private static final Log log = LogFactory.getLog(DPOPProofGenerator.class);

    public static void main(String[] args) {

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(System.in))) {

            // Get user input with validation
            String privateKeyPath = promptUser(reader, "Enter the file path to private key: ");
            String publicKeyPath = promptUser(reader, "Enter the file path to public key: ");

            String keyPairType;
            while (true) {
                keyPairType = promptUser(reader, "Enter the key pair type (EC or RSA): ").toUpperCase();
                if (keyPairType.equals(EC) || keyPairType.equals(RSA)) {
                    break;
                }
                log.warn("Invalid key pair type. Please enter 'EC' or 'RSA'.");
            }

            String httpMethod = promptUser(reader, "Enter the HTTP method (e.g., GET, POST): ");
            String httpUrl = promptUser(reader, "Enter the HTTP URL: ");
            log.info("Enter the access token (Press enter " +
                    "if you don't want to include ath claim: ");
            String accessToken = reader.readLine().trim();

            // Generate DPoP proof
            generateDPoPProof(privateKeyPath, publicKeyPath, keyPairType, httpMethod, httpUrl, accessToken);

        } catch (IOException e) {
            log.error("Error reading user input: ", e);
        } catch (Exception e) {
            log.error("An error occurred while generating the DPoP proof: ", e);
        }
    }

    private static String promptUser(BufferedReader reader, String message) throws IOException {

        String input;
        while (true) {
            log.info(message);
            input = reader.readLine().trim();
            if (!input.isEmpty()) {
                return input;
            }
            log.warn("Input cannot be empty. Please try again.");
        }
    }

    /**
     * Generates a signed DPoP JWT using the provided key files.
     *
     * @param privateKeyPath Path to the private key file.
     * @param publicKeyPath  Path to the public key file.
     * @param keyPairType    Key type (EC or RSA).
     * @param httpMethod     HTTP method (e.g., GET, POST).
     * @param httpUrl        Target HTTP URL.
     * @throws Exception If an error occurs during key loading or JWT signing.
     */
    private static void generateDPoPProof(String privateKeyPath, String publicKeyPath, String keyPairType,
                                          String httpMethod, String httpUrl, String accessToken) throws Exception {

        // Load keys
        PrivateKey privateKey = loadPrivateKey(privateKeyPath, keyPairType);
        PublicKey publicKey = loadPublicKey(publicKeyPath, keyPairType);

        // Create JWK (JSON Web Key)
        JWK jwk = createJWK(keyPairType, publicKey);

        // Build JWT claims
        JWTClaimsSet.Builder jwtClaimsSetBuilder = new JWTClaimsSet.Builder();
        jwtClaimsSetBuilder.issuer(ISSUER)
                .subject(SUBJECT)
                .issueTime(new Date())
                .jwtID(UUID.randomUUID().toString())
                .notBeforeTime(new Date())
                .claim(CLAIM_HTM, httpMethod)
                .claim(CLAIM_HTU, httpUrl)
                .expirationTime(new Date(System.currentTimeMillis() + EXPIRATION_TIME_MILLIS));

        if (StringUtils.isNotBlank(accessToken)) {
            log.info("Access token: " + accessToken);
            jwtClaimsSetBuilder.claim(CLAIM_ATH, generateAccessTokenHash(accessToken));
        }

        JWTClaimsSet jwtClaimsSet = jwtClaimsSetBuilder.build();

        // Create JWT Header
        JWSHeader.Builder headerBuilder = (EC.equals(keyPairType))
                ? new JWSHeader.Builder(JWSAlgorithm.ES256)
                : new JWSHeader.Builder(JWSAlgorithm.RS256);

        headerBuilder.type(new JOSEObjectType(DPOP_JWT_TYPE));
        headerBuilder.jwk(jwk);

        // Sign JWT
        SignedJWT signedJWT = new SignedJWT(headerBuilder.build(), jwtClaimsSet);
        signJWT(signedJWT, privateKey, keyPairType);

        // Log results
        log.info("[Signed JWT] : " + signedJWT.serialize());
        log.info("[ThumbPrint] : " + jwk.computeThumbprint().toString());
    }

    /**
     * Loads a private key from a file.
     *
     * @param keyPath    Path to the private key file.
     * @param keyType    Key type (EC or RSA).
     * @return PrivateKey object.
     * @throws IOException, NoSuchAlgorithmException, InvalidKeySpecException
     */
    private static PrivateKey loadPrivateKey(String keyPath, String keyType)
            throws IOException, NoSuchAlgorithmException, InvalidKeySpecException {

        byte[] keyBytes = Files.readAllBytes(Paths.get(keyPath));
        KeyFactory keyFactory = KeyFactory.getInstance(keyType);
        return keyFactory.generatePrivate(new PKCS8EncodedKeySpec(keyBytes));
    }

    /**
     * Loads a public key from a file.
     *
     * @param keyPath    Path to the public key file.
     * @param keyType    Key type (EC or RSA).
     * @return PublicKey object.
     * @throws IOException, NoSuchAlgorithmException, InvalidKeySpecException
     */
    private static PublicKey loadPublicKey(String keyPath, String keyType)
            throws IOException, NoSuchAlgorithmException, InvalidKeySpecException {

        byte[] keyBytes = Files.readAllBytes(Paths.get(keyPath));
        KeyFactory keyFactory = KeyFactory.getInstance(keyType);
        return keyFactory.generatePublic(new X509EncodedKeySpec(keyBytes));
    }

    /**
     * Creates a JSON Web Key (JWK) from the public key.
     *
     * @param keyPairType Key type (EC or RSA).
     * @param publicKey   The generated public key.
     * @return JWK object.
     */
    private static JWK createJWK(String keyPairType, PublicKey publicKey) {

        return EC.equals(keyPairType)
                ? new ECKey.Builder(Curve.P_256, (ECPublicKey) publicKey).build()
                : new RSAKey.Builder((RSAPublicKey) publicKey).build();
    }

    /**
     * Signs a JWT using the private key.
     *
     * @param signedJWT   The JWT to be signed.
     * @param privateKey  The private key.
     * @param keyPairType The key type (EC or RSA).
     * @throws JOSEException If an error occurs while signing the JWT.
     */
    private static void signJWT(SignedJWT signedJWT, PrivateKey privateKey, String keyPairType) throws JOSEException {

        if (EC.equals(keyPairType)) {
            signedJWT.sign(new ECDSASigner(privateKey, Curve.P_256));
        } else {
            signedJWT.sign(new RSASSASigner(privateKey));
        }
    }

    private static String generateAccessTokenHash(String accessToken) {

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashedBytes = digest.digest(accessToken.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hashedBytes);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not found.", e);
        }
    }
}
