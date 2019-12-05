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

import com.sun.net.ssl.X509TrustManager;

import java.security.cert.X509Certificate;
import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLSession;

/**
 * Temporary Host name Verifier.
 */
public class TempHostNameVerifier implements X509TrustManager, HostnameVerifier {

    private TempHostNameVerifier() {

    }

    private static TempHostNameVerifier tempHostNameVerifierInstance = new TempHostNameVerifier();

    public static TempHostNameVerifier getInstance() {

        if (tempHostNameVerifierInstance == null) {

            synchronized (TempHostNameVerifier.class) {

                if (tempHostNameVerifierInstance == null) {

                    /* instance will be created at request time */
                    tempHostNameVerifierInstance = new TempHostNameVerifier();
                }
            }
        }
        return tempHostNameVerifierInstance;

    }

    @Override
    public boolean isClientTrusted(X509Certificate[] x509Certificates) {

        return true;
    }

    @Override
    public boolean isServerTrusted(X509Certificate[] x509Certificates) {

        return true;
    }

    public X509Certificate[] getAcceptedIssuers() {

        return null;
    }

    @Override
    public boolean verify(String s, SSLSession sslSession) {

        return true;
    }
}
