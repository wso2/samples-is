/*
 * Copyright (c) 2025, WSO2 Inc. (http://www.wso2.com).
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

package org.wso2.custom.password.decrypt;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;
import org.apache.axiom.om.util.Base64;
import org.bouncycastle.jce.provider.BouncyCastleProvider;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.Charset;
import java.security.Security;
import java.util.Scanner;

public class SymmetricKeyDecryptImpl {

    private static final String DEFAULT_SYMMETRIC_CRYPTO_ALGORITHM = "AES";
    public static final int GCM_TAG_LENGTH = 128;
    private static Gson gson = new Gson();

    public static void main(String[] args) throws Exception {

        Scanner scanner = new Scanner(System.in);
        String plainText;
        if (args.length == 2) {
            plainText = decrypt(Base64.decode(args[0]), args[1]);
        } else {
            System.out.print("Encrypted Text : ");
            String encryptedText = scanner.next();
            System.out.print("Encryption Key : ");
            String encryptionKey = scanner.next();
            plainText = decrypt(Base64.decode(encryptedText), encryptionKey);
        }

        System.out.println("*** Plain Text ***\n" + plainText + "\n******************");
    }

    private static String decrypt(byte[] ciphertext, String encryptionKey) throws Exception{

        String cipherTransformation = "AES/GCM/NoPadding";
        Security.addProvider(new BouncyCastleProvider());
        Cipher keyStoreCipher;
        CipherMetaDataHolder cipherHolder = cipherTextToCipherHolder(ciphertext);

        if (cipherHolder != null) {
            // cipher with meta data.
            System.out.println("Cipher transformation for decryption : " + cipherHolder.getTransformation());
            keyStoreCipher = Cipher.getInstance(cipherHolder.getTransformation(), "BC");
            ciphertext = cipherHolder.getCipherBase64Decoded();
        } else {
            keyStoreCipher = Cipher.getInstance(cipherTransformation, "BC");
        }
        CipherMetaDataHolder cipherMetaDataHolder = getCipherMetaDataHolderFromCipherText(ciphertext);
        keyStoreCipher.init(Cipher.DECRYPT_MODE,
                getSecretKey(encryptionKey), getGCMParameterSpec(cipherMetaDataHolder.getIvBase64Decoded()));
        return new String(keyStoreCipher.doFinal(cipherMetaDataHolder.getCipherBase64Decoded()), Charset.defaultCharset());
    }

    /**
     * This method will return the CipherMetaDataHolder object containing original cipher text and initialization
     * vector.
     * This method is used when using AES-GCM mode encryption
     * @param cipherTextBytes cipher text which contains original ciphertext and iv value.
     * @return CipherMetaDataHolder object
     */
    private static CipherMetaDataHolder getCipherMetaDataHolderFromCipherText(byte[] cipherTextBytes) {

        CipherMetaDataHolder cipherMetaDataHolder = new CipherMetaDataHolder();
        cipherMetaDataHolder.setIvAndOriginalCipherText(cipherTextBytes);
        return cipherMetaDataHolder;
    }

    /**
     * Function to convert cipher byte array to {@link CipherMetaDataHolder}.
     *
     * @param cipherText cipher text as a byte array
     * @return if cipher text is not a cipher with meta data
     */
    private static CipherMetaDataHolder cipherTextToCipherHolder(byte[] cipherText) {

        String cipherStr = new String(cipherText, Charset.defaultCharset());
        try {
            return gson.fromJson(cipherStr, CipherMetaDataHolder.class);
        } catch (JsonSyntaxException e) {
            System.out.println("Deserialization failed since cipher string is not representing cipher with metadata");
            return null;
        }
    }

    /**
     * This method is to create GCMParameterSpec which is needed to encrypt and decrypt operation with AES-GCM
     * @param iv
     * @return
     */
    private static GCMParameterSpec getGCMParameterSpec(byte[] iv) {

        //The GCM parameter authentication tag length we choose is 128.
        return new GCMParameterSpec(GCM_TAG_LENGTH, iv);
    }

    private static SecretKeySpec getSecretKey(String encryptionKey) {

        return new SecretKeySpec(encryptionKey.getBytes(), 0, encryptionKey.getBytes().length,
                DEFAULT_SYMMETRIC_CRYPTO_ALGORITHM);
    }

    /**
     * This the POJO class to hold metadata of the cipher.
     *
     * IMPORTANT: this is copy of org.wso2.carbon.crypto.api.CipherMetaDataHolder, what ever changes applied here need to update
     *              here
     */
    private static class CipherMetaDataHolder {

        // Base64 encoded ciphertext.
        private String c;

        // Transformation used for encryption, default is "RSA".
        private String t = "RSA";

        // Thumbprint of the certificate.
        private String tp;

        // Digest used to generate certificate thumbprint.
        private String tpd;

        // Initialization vector used in AES-GCM mode.
        private String iv;


        public String getTransformation() {

            return t;
        }

        public void setTransformation(String transformation) {

            this.t = transformation;
        }

        public String getCipherText() {

            return c;
        }

        public byte[] getCipherBase64Decoded() {

            return Base64.decode(c);
        }

        public void setCipherText(String cipher) {

            this.c = cipher;
        }

        public String getThumbPrint() {

            return tp;
        }

        public void setThumbPrint(String tp) {

            this.tp = tp;
        }

        public String getThumbprintDigest() {

            return tpd;
        }

        public void setThumbprintDigest(String digest) {

            this.tpd = digest;
        }

        /**
         * Method to return the initialization vector in AES/GCM/NoPadding transformation.
         *
         * @return initialization vector value in String format.
         */
        public String getIv() {

            return iv;
        }

        /**
         * Method to set the initialization vector in AES/GCM/NoPadding transformation.
         *
         * @param iv initialization vector value in String format
         */
        public void setIv(String iv) {

            this.iv = iv;
        }

        /**
         * Method to return initialization vector as a byte array
         *
         * @return byte array
         */
        public byte[] getIvBase64Decoded() {

            return Base64.decode(iv);
        }

        /**
         * Function to base64 encode ciphertext and set ciphertext
         * @param cipher
         */
        public void setCipherBase64Encoded(byte[] cipher) {

            this.c = Base64.encode(cipher);
        }

        /**
         * Function to set thumbprint
         * @param tp thumb print
         * @param digest digest (hash algorithm) used for to create thumb print
         */
        public void setThumbPrint(String tp, String digest) {

            this.tp = tp;
            this.tpd = digest;
        }

        public byte[] getSelfContainedCiphertextWithIv(byte[] originalCipher, byte[] iv) {

            Gson gson = new GsonBuilder().disableHtmlEscaping().create();;
            CipherInitializationVectorHolder cipherInitializationVectorHolder = new CipherInitializationVectorHolder();
            cipherInitializationVectorHolder.setCipher(Base64.encode(originalCipher));
            cipherInitializationVectorHolder.setInitializationVector(Base64.encode(iv));
            String cipherWithMetadataStr = gson.toJson(cipherInitializationVectorHolder);

            return cipherWithMetadataStr.getBytes(Charset.defaultCharset());
        }

        /**
         * This method will extract the initialization vector and original ciphertext from input ciphertext and set them
         * to metadata in CipherMetaDataHolder object.
         *
         * @param cipherTextBytes This input cipher text contains both original cipher and iv.
         */
        public void setIvAndOriginalCipherText(byte[] cipherTextBytes) {

            Gson gson = new GsonBuilder().disableHtmlEscaping().create();
            String cipherStr = new String(cipherTextBytes, Charset.defaultCharset());
            CipherInitializationVectorHolder cipherInitializationVectorHolder = gson.fromJson(cipherStr,
                    CipherInitializationVectorHolder.class);
            setIv(cipherInitializationVectorHolder.getInitializationVector());
            setCipherText(cipherInitializationVectorHolder.getCipher());
        }

        @Override
        public String toString() {

            Gson gson = new Gson();
            return gson.toJson(this);
        }

        private class CipherInitializationVectorHolder{

            private String cipher;

            private String initializationVector;

            public String getCipher() {

                return cipher;
            }

            public void setCipher(String cipher) {

                this.cipher = cipher;
            }

            public String getInitializationVector() {

                return initializationVector;
            }

            public void setInitializationVector(String initializationVector) {

                this.initializationVector = initializationVector;
            }
        }
    }
}
