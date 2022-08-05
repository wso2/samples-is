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

import com.nimbusds.jose.jwk.Curve;
import com.nimbusds.jose.jwk.ECKey;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.RSAKey;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.FileOutputStream;
import java.io.IOException;
import java.security.InvalidAlgorithmParameterException;
import java.security.Key;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.ECPublicKey;
import java.security.interfaces.RSAPublicKey;
import java.util.Scanner;

/**
 * GeneratePublicKeyPair will create a public private key pair and store it in a file.
 */
public class GeneratePublicKeyPair {

    private static final Log log = LogFactory.getLog(GeneratePublicKeyPair.class);

    public static void main(String args[]) throws NoSuchAlgorithmException, InvalidAlgorithmParameterException,
            IOException {

        Scanner scan = new Scanner(System.in);
        System.out.println("Enter the public and private key pair type(EC or RSA): ");

        String keyPairType = scan.nextLine();
        KeyPairGenerator gen = KeyPairGenerator.getInstance(keyPairType);
        KeyPair keyPair;
        JWK jwk;
        if ("EC".equals(keyPairType)) {
            gen.initialize(Curve.P_256.toECParameterSpec());
            keyPair = gen.generateKeyPair();
            jwk = new ECKey.Builder(Curve.P_256, (ECPublicKey) keyPair.getPublic())
                    .build();
        } else {
            gen = KeyPairGenerator.getInstance("RSA");
            gen.initialize(2048);
            keyPair = gen.generateKeyPair();
            jwk = new RSAKey.Builder((RSAPublicKey) keyPair.getPublic()).build();
        }

        log.info("jwk: " + jwk);
        log.info("publicKey: " + keyPair.getPublic());
        log.info("private: " + keyPair.getPrivate());

        Key pub = keyPair.getPublic();
        Key pvt = keyPair.getPrivate();

        log.info("Private key format: " + pvt.getFormat());
        log.info("Public key format: " + pub.getFormat());

        String outFile = "dpop";
        FileOutputStream privout = new FileOutputStream(outFile + ".key");
        privout.write(pvt.getEncoded());
        privout.close();

        FileOutputStream pubout = new FileOutputStream(outFile + ".pub");
        pubout.write(pub.getEncoded());
        pubout.close();
    }
}
