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

import com.nimbusds.jose.jwk.ECKey;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.Curve;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.FileOutputStream;
import java.io.IOException;
import java.security.*;
import java.security.interfaces.ECPublicKey;
import java.security.interfaces.RSAPublicKey;
import java.util.Scanner;

import static org.wso2.dpop.proof.generator.Constant.EC;
import static org.wso2.dpop.proof.generator.Constant.PRIVATE_KEY_FILE_NAME;
import static org.wso2.dpop.proof.generator.Constant.PUB_KEY_FILE_NAME;
import static org.wso2.dpop.proof.generator.Constant.RSA;

/**
 * Utility class to generate a public-private key pair and store them in files.
 * <p>
 * This class allows the user to generate key pairs of type EC (Elliptic Curve) or RSA,
 * and saves the keys in separate files (`dpop.key` for the private key and `dpop.pub` for the public key).
 * </p>
 */
public class GeneratePublicKeyPair {

    private static final Log log = LogFactory.getLog(GeneratePublicKeyPair.class);

    public static void main(String[] args) {

        try (Scanner scanner = new Scanner(System.in)) {
            log.info("Enter the public and private key pair type (EC or RSA): ");
            String keyPairType = scanner.nextLine().trim().toUpperCase();

            if (!EC.equals(keyPairType) && !RSA.equals(keyPairType)) {
                log.error("Invalid key pair type. Please enter 'EC' or 'RSA'.");
                return;
            }

            KeyPair keyPair = generateKeyPair(keyPairType);
            JWK jwk = generateJWK(keyPairType, keyPair);

            log.info("Generated JWK: " + jwk);

            saveKeyToFile(PRIVATE_KEY_FILE_NAME, keyPair.getPrivate().getEncoded());
            saveKeyToFile(PUB_KEY_FILE_NAME, keyPair.getPublic().getEncoded());

            log.info("Keys generated successfully.");
        } catch (Exception e) {
            log.error("Error generating key pair: ", e);
        }
    }

    /**
     * Generates a key pair of the specified type (EC or RSA).
     *
     * @param keyPairType The type of key pair (EC or RSA).
     * @return The generated key pair.
     * @throws NoSuchAlgorithmException If the specified algorithm is not available.
     * @throws InvalidAlgorithmParameterException If invalid parameters are provided.
     */
    private static KeyPair generateKeyPair(String keyPairType)
            throws NoSuchAlgorithmException, InvalidAlgorithmParameterException {

        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance(keyPairType);

        if (EC.equals(keyPairType)) {
            keyPairGenerator.initialize(Curve.P_256.toECParameterSpec());
        } else {
            keyPairGenerator.initialize(2048);
        }

        return keyPairGenerator.generateKeyPair();
    }

    /**
     * Generates a JWK (JSON Web Key) representation of the given key pair.
     *
     * @param keyPairType The type of key pair (EC or RSA).
     * @param keyPair The generated key pair.
     * @return The corresponding JWK object.
     */
    private static JWK generateJWK(String keyPairType, KeyPair keyPair) {

        if (EC.equals(keyPairType)) {
            return new ECKey.Builder(Curve.P_256, (ECPublicKey) keyPair.getPublic()).build();
        } else {
            return new RSAKey.Builder((RSAPublicKey) keyPair.getPublic()).build();
        }
    }

    /**
     * Saves the given key bytes to a file.
     *
     * @param filename The name of the file to save the key.
     * @param keyBytes The key bytes to write to the file.
     */
    private static void saveKeyToFile(String filename, byte[] keyBytes) {

        try (FileOutputStream out = new FileOutputStream(filename)) {
            out.write(keyBytes);
        } catch (IOException e) {
            log.error("Error saving key to file: " + filename, e);
        }
    }
}
