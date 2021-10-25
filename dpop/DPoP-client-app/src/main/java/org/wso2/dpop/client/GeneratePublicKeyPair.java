package org.wso2.dpop.client;

import com.nimbusds.jose.jwk.Curve;
import com.nimbusds.jose.jwk.ECKey;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.RSAKey;

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

public class GeneratePublicKeyPair {

    public static void main(String args[]) throws NoSuchAlgorithmException, InvalidAlgorithmParameterException,
            IOException {

        Scanner scan = new Scanner(System.in);
        System.out.println("Enter the public and private key pair type(EC or RSA): ");

        String keyPairType = scan.nextLine();
        KeyPairGenerator gen = KeyPairGenerator.getInstance(keyPairType);
        KeyPair keyPair;
        JWK jwk;
        if (keyPairType.equals("EC")) {
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

        System.out.println("jwk: " + jwk);
        System.out.println("publicKey: " + keyPair.getPublic());
        System.out.println("private: " + keyPair.getPrivate());

        Key pub = keyPair.getPublic();
        Key pvt = keyPair.getPrivate();

        System.out.println("Private key format: " + pvt.getFormat());
        System.out.println("Public key format: " + pub.getFormat());

        String outFile = "dpop";
        FileOutputStream privout = new FileOutputStream(outFile + ".key");
        privout.write(pvt.getEncoded());
        privout.close();

        FileOutputStream pubout = new FileOutputStream(outFile + ".pub");
        pubout.write(pub.getEncoded());
        pubout.close();
    }
}
