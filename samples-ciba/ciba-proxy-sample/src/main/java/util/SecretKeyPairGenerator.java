/*
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package util;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;

/**
 * Secret Key pair generator.
 */
public class SecretKeyPairGenerator {

    private SecretKeyPairGenerator() {

    }

    private static SecretKeyPairGenerator secretKeyPairGeneratorInstance = new SecretKeyPairGenerator();

    public static SecretKeyPairGenerator getInstance() {

        if (secretKeyPairGeneratorInstance == null) {

            synchronized (SecretKeyPairGenerator.class) {

                if (secretKeyPairGeneratorInstance == null) {

                    /* instance will be created at request time */
                    secretKeyPairGeneratorInstance = new SecretKeyPairGenerator();
                }
            }
        }
        return secretKeyPairGeneratorInstance;

    }

    public KeyPair generatesecretkey() throws NoSuchAlgorithmException {

        try {
            KeyPairGenerator keyPairGen = KeyPairGenerator.getInstance("DSA");

            // Initializing the KeyPairGenerator.
            keyPairGen.initialize(2048);

            // Generating the pair of keys.
            KeyPair pair = keyPairGen.generateKeyPair();

            return pair;

        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();

            return KeyPairGenerator.getInstance("DSA").generateKeyPair();
        }
    }
}
