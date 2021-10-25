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

import java.security.InvalidAlgorithmParameterException;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.ECPublicKey;
import java.security.interfaces.RSAPublicKey;
import java.text.ParseException;
import java.util.Date;
import java.util.Scanner;
import java.util.UUID;

import static com.nimbusds.jose.JWSAlgorithm.ES256;
import static com.nimbusds.jose.JWSAlgorithm.RS384;

public class DPOPProofGenerator {

    public static void main(String args[]) throws NoSuchAlgorithmException, JOSEException, ParseException,
            InvalidAlgorithmParameterException {

        Scanner scan = new Scanner(System.in);
        System.out.println("Enter the public and private key pair type(EC or RSA): ");
        String keyPairType = scan.nextLine();
        System.out.println("Enter the HTTP Method: ");
        String httpMethod = scan.nextLine();
        System.out.println("Enter the HTTP Url: ");
        String httpUrl = scan.nextLine();

        KeyPairGenerator gen = KeyPairGenerator.getInstance(keyPairType);
        KeyPair keyPair;
        JWK jwk = null;
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
            ECDSASigner ecdsaSigner = new ECDSASigner(keyPair.getPrivate(), Curve.P_256);
            signedJWT.sign(ecdsaSigner);
        } else {
            RSASSASigner rsassaSigner = new RSASSASigner(keyPair.getPrivate());
            signedJWT.sign(rsassaSigner);
        }

        System.out.println("[Signed JWT] : " + signedJWT.serialize());
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
