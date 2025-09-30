package org.wso2.custom.password.decrypt;

import javax.crypto.Cipher;
import java.io.FileInputStream;
import java.nio.charset.Charset;
import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.Security;
import java.util.Scanner;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import org.apache.axiom.om.util.Base64;
import org.bouncycastle.jce.provider.BouncyCastleProvider;


public class AsymmetricKeyDecryptImpl {

    private static Gson gson = new Gson();

    public static void main(String[] args) throws Exception {
        Scanner scanner = new Scanner(System.in);
        String plainText;
        if (args.length == 4) {
            plainText = decrypt(Base64.decode(args[0]), args[1], args[2], args[3]);
        } else {
            System.out.print("Encrypted Text : ");
            String encryptedText = scanner.next();
            System.out.print("KeyStore file path : ");
            String keystorePath = scanner.next();
            System.out.print("KeyStore alias : ");
            String alias = scanner.next();
            System.out.print("KeyStore password : ");
            String password = scanner.next();
            plainText = decrypt(Base64.decode(encryptedText), keystorePath, alias, password);
        }

        System.out.println("*** Plain Text ***\n" + plainText + "\n******************");
    }

    private static String decrypt(byte[] ciphertext, String keystore, String keystoreAlias, String keystorePassword) throws Exception {
        KeyStore keyStore = getKeyStore(keystore, keystorePassword);
        PrivateKey privateKey = (PrivateKey)keyStore.getKey(keystoreAlias, keystorePassword.toCharArray());
        Security.addProvider(new BouncyCastleProvider());
        Cipher keyStoreCipher;
        String cipherTransformation = "RSA/ECB/OAEPwithSHA1andMGF1Padding";
        CipherHolder cipherHolder = cipherTextToCipherHolder(ciphertext);
        if (cipherHolder != null) {
            // cipher with meta data.
            System.out.println("Cipher transformation for decryption : " + cipherHolder.getTransformation());
            keyStoreCipher = Cipher.getInstance(cipherHolder.getTransformation(), "BC");
            ciphertext = cipherHolder.getCipherBase64Decoded();
        } else {
            keyStoreCipher = Cipher.getInstance(cipherTransformation, "BC");
        }

        keyStoreCipher.init(Cipher.DECRYPT_MODE, privateKey);
        return new String(keyStoreCipher.doFinal(ciphertext), Charset.defaultCharset());
    }

    private static KeyStore getKeyStore(String keystore, String keystorePassword) throws Exception {
        KeyStore keyStore = KeyStore.getInstance("JKS");
        FileInputStream in = null;

        try {
            in = new FileInputStream(keystore);
            keyStore.load(in, keystorePassword.toCharArray());
        } finally {
            if (in != null) {
                in.close();
            }

        }

        return keyStore;
    }


    private static CipherHolder cipherTextToCipherHolder(byte[] cipherText) {

        String cipherStr = new String(cipherText, Charset.defaultCharset());
        try {
            return gson.fromJson(cipherStr, CipherHolder.class);
        } catch (JsonSyntaxException e) {
            System.out.print("Deserialization failed since cipher string is not representing cipher with metadata");
            return null;
        }
    }

    /**
     * Holds encrypted cipher with related metadata.
     *
     * IMPORTANT: this is copy of org.wso2.carbon.core.util.CipherHolder, what ever changes applied here need to update
     *              on above
     */
    private class CipherHolder {

        // Base64 encoded ciphertext.
        private String c;

        // Transformation used for encryption, default is "RSA".
        private String t = "RSA";

        // Thumbprint of the certificate.
        private String tp;

        // Digest used to generate certificate thumbprint.
        private String tpd;


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

        @Override
        public String toString() {
            Gson gson = new Gson();
            return gson.toJson(this);
        }
    }

}
