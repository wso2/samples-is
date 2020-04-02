/*
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package org.wso2.carbon.identity.saml.query.profile.test;

import org.apache.xml.security.signature.XMLSignature;
import org.opensaml.security.credential.Credential;
import org.opensaml.security.credential.CredentialContextSet;
import org.opensaml.security.credential.UsageType;
import org.opensaml.security.x509.X509Credential;
import org.wso2.carbon.identity.base.IdentityException;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.cert.Certificate;
import java.security.cert.X509CRL;
import java.security.cert.X509Certificate;
import java.util.Collection;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import javax.crypto.SecretKey;


public class SPSignKeyDataHolder implements X509Credential {

    public static final String SECURITY_KEY_STORE_KEY_ALIAS = "Security.KeyStore.KeyAlias";
    private static final String DSA_ENCRYPTION_ALGORITHM = "DSA";
    private String signatureAlgorithm = null;
    private X509Certificate[] issuerCerts = null;

    private PrivateKey privateKey = null;

    private PublicKey publicKey = null;

    public SPSignKeyDataHolder() throws IdentityException {

        ClassLoader loader = SPSignKeyDataHolder.class.getClassLoader();
        String keyStorePath = new File(loader.getResource("wso2carbon.jks").getPath()).getAbsolutePath();
        System.out.println("Key store path : " + keyStorePath);
        String keyAlias = "wso2carbon";
        String password = "wso2carbon";
        Certificate[] certificates;

        try {

            File file = new File(keyStorePath);
            InputStream is = new FileInputStream(file);
            KeyStore keystore = KeyStore.getInstance(KeyStore.getDefaultType());
            keystore.load(is, password.toCharArray());

            privateKey = (PrivateKey) keystore.getKey(keyAlias, password.toCharArray());

            certificates = keystore.getCertificateChain(keyAlias);

            issuerCerts = new X509Certificate[certificates.length];

            int i = 0;
            for (Certificate certificate : certificates) {
                issuerCerts[i++] = (X509Certificate) certificate;
            }

            signatureAlgorithm = XMLSignature.ALGO_ID_SIGNATURE_RSA;

            publicKey = issuerCerts[0].getPublicKey();
            String pubKeyAlgo = publicKey.getAlgorithm();
            if (DSA_ENCRYPTION_ALGORITHM.equalsIgnoreCase(pubKeyAlgo)) {
                signatureAlgorithm = XMLSignature.ALGO_ID_SIGNATURE_DSA;
            }
            is.close();

        } catch (Exception e) {
            throw IdentityException.error(e.getMessage(), e);
        }

    }

    public String getSignatureAlgorithm() {
        return signatureAlgorithm;
    }

    public void setSignatureAlgorithm(String signatureAlgorithm) {
        this.signatureAlgorithm = signatureAlgorithm;
    }


    @Nullable
    public String getEntityId() {
        return null;
    }

    @Nullable
    public UsageType getUsageType() {
        return null;
    }


    public Collection<String> getKeyNames() {
        return null;
    }

    @Nullable
    public PublicKey getPublicKey() {
        return publicKey;
    }

    @Nullable
    public PrivateKey getPrivateKey() {
        return privateKey;
    }

    @Nullable
    public SecretKey getSecretKey() {
        return null;
    }

    @Nullable
    public CredentialContextSet getCredentialContextSet() {
        return null;
    }


    public Class<? extends Credential> getCredentialType() {
        return null;
    }


    @Nonnull
    public X509Certificate getEntityCertificate() {
        return issuerCerts[0];
    }


    public Collection<X509Certificate> getEntityCertificateChain() {
        return null;
    }

    @Nullable
    public Collection<X509CRL> getCRLs() {
        return null;
    }
}

