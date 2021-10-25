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

public class DPOPProofGeneratorFromPP {

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
        if (keyPairType.equals("EC")) {
            jwk = new ECKey.Builder(Curve.P_256, (ECPublicKey) publicCert)
                    .build();
        } else {
            jwk = new RSAKey.Builder((RSAPublicKey) publicCert).build();
        }

        System.out.println("jwk: " + jwk);
        System.out.println("publicKey: " + publicCert);
        System.out.println("private: " + privateKey);

        JWTClaimsSet.Builder jwtClaimsSetBuilder = new JWTClaimsSet.Builder();
        jwtClaimsSetBuilder.issuer("issuer");
        jwtClaimsSetBuilder.subject("sub");
        jwtClaimsSetBuilder.issueTime(new Date(System.currentTimeMillis()));
        jwtClaimsSetBuilder.jwtID(UUID.randomUUID().toString());
        jwtClaimsSetBuilder.notBeforeTime(new Date(System.currentTimeMillis()));
        jwtClaimsSetBuilder.claim("htm", httpMethod);
        jwtClaimsSetBuilder.claim("htu", httpUrl);

        JWSHeader.Builder headerBuilder;
        if (keyPairType.equals("EC")) {
            headerBuilder = new JWSHeader.Builder(ES256);
        } else {
            headerBuilder = new JWSHeader.Builder(RS384);
        }
        headerBuilder.type(new JOSEObjectType("dpop+jwt"));
        headerBuilder.jwk(jwk);
        SignedJWT signedJWT = new SignedJWT(headerBuilder.build(), jwtClaimsSetBuilder.build());

        if (keyPairType.equals("EC")) {
            ECDSASigner ecdsaSigner = new ECDSASigner(privateKey, Curve.P_256);
            signedJWT.sign(ecdsaSigner);
        } else {
            RSASSASigner rsassaSigner = new RSASSASigner(privateKey);
            signedJWT.sign(rsassaSigner);
        }

        System.out.println("[Signed JWT from File] : " + signedJWT.serialize());
        JWK parseJwk = JWK.parse(String.valueOf(jwk));
        if (keyPairType.equals("EC")) {
            ECKey ecKey = (ECKey) parseJwk;
            System.out.println("[ThumbPrint] : " + ecKey.computeThumbprint().toString());
        } else {
            RSAKey rsaKey = (RSAKey) parseJwk;
            System.out.println("[ThumbPrint] : " + rsaKey.computeThumbprint().toString());
        }
    }
}
