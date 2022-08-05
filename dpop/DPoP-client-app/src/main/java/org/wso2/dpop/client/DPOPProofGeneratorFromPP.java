/*
 *  Copyright (c) 2022, WSO2 LLC (http://www.wso2.org) All Rights Reserved.
 *
 *  WSO2 LLC licenses this file to you under the Apache license,
 *  Version 2.0 (the "license"); you may not use this file except
 *  in compliance with the license.
 *  You may obtain a copy of the license at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.  See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 *
 */

package org.wso2.dpop.client;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JOSEObjectType;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.ECDSASigner;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jose.jwk.Curve;
import com.nimbusds.jose.jwk.ECKey;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.interfaces.ECPublicKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.text.ParseException;
import java.util.Date;
import java.util.Scanner;
import java.util.UUID;

import static com.nimbusds.jose.JWSAlgorithm.ES256;
import static com.nimbusds.jose.JWSAlgorithm.RS384;

/**
 * DPOPProofGeneratorFromPP will use the already generated key pairs and load and generate the DPoP Proof.
 */
public class DPOPProofGeneratorFromPP {

    private static final Log log = LogFactory.getLog(DPOPProofGeneratorFromPP.class);

    public static void main(String args[]) throws NoSuchAlgorithmException, JOSEException, ParseException,
            IOException, InvalidKeySpecException {

        Scanner scan = new Scanner(System.in);
        System.out.println("File path to private key: ");
        String privateKeyPath = scan.nextLine();
        System.out.println("File path to public key: ");
        String publicKeyPath = scan.nextLine();
        System.out.println("Enter the public and private key pair type(EC or RSA): ");
        String keyPairType = scan.nextLine();
        System.out.println("Enter the HTTP Method: ");
        String httpMethod = scan.nextLine();
        System.out.println("Enter the HTTP Url: ");
        String httpUrl = scan.nextLine();

        /* Read all bytes from the private key file */
        Path path = Paths.get(privateKeyPath);
        byte[] bytes = Files.readAllBytes(path);

        /* Generate private key. */
        PKCS8EncodedKeySpec privateKs = new PKCS8EncodedKeySpec(bytes);
        KeyFactory privateKf = KeyFactory.getInstance(keyPairType);
        PrivateKey privateKey = privateKf.generatePrivate(privateKs);

        /* Read all the public key bytes */
        Path pubPath = Paths.get(publicKeyPath);
        byte[] pubBytes = Files.readAllBytes(pubPath);

        /* Generate public key. */
        X509EncodedKeySpec ks = new X509EncodedKeySpec(pubBytes);
        KeyFactory kf = KeyFactory.getInstance(keyPairType);
        PublicKey publicCert = kf.generatePublic(ks);

        JWK jwk = null;
        if ("EC".equals(keyPairType)) {
            jwk = new ECKey.Builder(Curve.P_256, (ECPublicKey) publicCert)
                    .build();
        } else {
            jwk = new RSAKey.Builder((RSAPublicKey) publicCert).build();
        }

        log.info("jwk: " + jwk);
        log.info("publicKey: " + publicCert);
        log.info("private: " + privateKey);

        JWTClaimsSet.Builder jwtClaimsSetBuilder = new JWTClaimsSet.Builder();
        jwtClaimsSetBuilder.issuer("issuer");
        jwtClaimsSetBuilder.subject("sub");
        jwtClaimsSetBuilder.issueTime(new Date(System.currentTimeMillis()));
        jwtClaimsSetBuilder.jwtID(UUID.randomUUID().toString());
        jwtClaimsSetBuilder.notBeforeTime(new Date(System.currentTimeMillis()));
        jwtClaimsSetBuilder.claim("htm", httpMethod);
        jwtClaimsSetBuilder.claim("htu", httpUrl);

        JWSHeader.Builder headerBuilder;
        if ("EC".equals(keyPairType)) {
            headerBuilder = new JWSHeader.Builder(ES256);
        } else {
            headerBuilder = new JWSHeader.Builder(RS384);
        }
        headerBuilder.type(new JOSEObjectType("dpop+jwt"));
        headerBuilder.jwk(jwk);
        SignedJWT signedJWT = new SignedJWT(headerBuilder.build(), jwtClaimsSetBuilder.build());

        if ("EC".equals(keyPairType)) {
            ECDSASigner ecdsaSigner = new ECDSASigner(privateKey, Curve.P_256);
            signedJWT.sign(ecdsaSigner);
        } else {
            RSASSASigner rsassaSigner = new RSASSASigner(privateKey);
            signedJWT.sign(rsassaSigner);
        }

        log.info("[Signed JWT from File] : " + signedJWT.serialize());
        JWK parseJwk = JWK.parse(String.valueOf(jwk));
        if ("EC".equals(keyPairType)) {
            ECKey ecKey = (ECKey) parseJwk;
            log.info("[ThumbPrint] : " + ecKey.computeThumbprint().toString());
        } else {
            RSAKey rsaKey = (RSAKey) parseJwk;
            log.info("[ThumbPrint] : " + rsaKey.computeThumbprint().toString());
        }
    }
}
