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

package dao;

import jdbc.CibaProxyJdbcStore;
import transactionartifacts.CIBAauthRequest;
import transactionartifacts.CIBAauthResponse;
import transactionartifacts.PollingAtrribute;
import transactionartifacts.TokenRequest;
import transactionartifacts.TokenResponse;

/**
 * Artifact store connector for JDBC.
 */
public class JdbcArtifactStoreConnector implements ArtifactStoreConnectors {

    private CibaProxyJdbcStore cibaProxyJdbcStore = CibaProxyJdbcStore.getcibaProxyJdbcStoreInstance();

    private static JdbcArtifactStoreConnector jdbcArtifactStoreConnectorInstance = new JdbcArtifactStoreConnector();

    public static JdbcArtifactStoreConnector getInstance() {

        if (jdbcArtifactStoreConnectorInstance == null) {

            synchronized (JdbcArtifactStoreConnector.class) {

                if (jdbcArtifactStoreConnectorInstance == null) {

                    /* instance will be created at request time */
                    jdbcArtifactStoreConnectorInstance = new JdbcArtifactStoreConnector();
                }
            }
        }
        return jdbcArtifactStoreConnectorInstance;
    }

    @Override
    public void addAuthRequest(String authReqID, Object authrequest) {

        if (authrequest instanceof CIBAauthRequest) {
            cibaProxyJdbcStore.getAuthRequestDB().add(authReqID, authrequest);
        }
    }

    @Override
    public void addAuthResponse(String authReqID, Object authresponse) {

        if (authresponse instanceof CIBAauthResponse) {
            cibaProxyJdbcStore.getAuthResponseDB().add(authReqID, authresponse);
        }
    }

    @Override
    public void addTokenRequest(String authReqID, Object tokenrequest) {

        if (tokenrequest instanceof TokenRequest) {
            cibaProxyJdbcStore.getTokenRequestDB().add(authReqID, tokenrequest);
        }
    }

    @Override
    public void addTokenResponse(String authReqID, Object tokenresponse) {

        if (tokenresponse instanceof TokenResponse) {
            cibaProxyJdbcStore.getTokenResponseDB().add(authReqID, tokenresponse);
        }
    }

    @Override
    public void addPollingAttribute(String authReqID, Object pollingattribute) {

        if (pollingattribute instanceof PollingAtrribute) {
            cibaProxyJdbcStore.getPollingAttributeDB().add(authReqID, pollingattribute);
        }
    }

    @Override
    public void removeAuthRequest(String authReqID) {

        cibaProxyJdbcStore.getAuthRequestDB().remove(authReqID);
    }

    @Override
    public void removeAuthResponse(String authReqID) {

        cibaProxyJdbcStore.getAuthResponseDB().remove(authReqID);
    }

    @Override
    public void removeTokenRequest(String authReqID) {

        cibaProxyJdbcStore.getTokenRequestDB().remove(authReqID);
    }

    @Override
    public void removeTokenResponse(String authReqID) {

        cibaProxyJdbcStore.getTokenResponseDB().remove(authReqID);
    }

    @Override
    public void removePollingAttribute(String authReqID) {

        cibaProxyJdbcStore.getPollingAttributeDB().remove(authReqID);
    }

    @Override
    public CIBAauthRequest getAuthRequest(String authReqID) {

        return (CIBAauthRequest) cibaProxyJdbcStore.getAuthRequestDB().get(authReqID);
    }

    @Override
    public CIBAauthResponse getAuthResponse(String authReqID) {

        return (CIBAauthResponse) cibaProxyJdbcStore.getAuthResponseDB().get(authReqID);
    }

    @Override
    public TokenRequest getTokenRequest(String authReqID) {

        return (TokenRequest) cibaProxyJdbcStore.getTokenRequestDB().get(authReqID);
    }

    @Override
    public TokenResponse getTokenResponse(String authReqID) {

        return (TokenResponse) cibaProxyJdbcStore.getTokenResponseDB().get(authReqID);
    }

    @Override
    public PollingAtrribute getPollingAttribute(String authReqID) {

        return (PollingAtrribute) cibaProxyJdbcStore.getPollingAttributeDB().get(authReqID);
    }

    @Override
    public void registerToAuthRequestObservers(Object authRequestHandler) {

        cibaProxyJdbcStore.getAuthRequestDB().register(authRequestHandler);

    }

    @Override
    public void registerToAuthResponseObservers(Object authResponseHandler) {

        cibaProxyJdbcStore.getAuthResponseDB().register(authResponseHandler);
    }

    @Override
    public void registerToTokenRequestObservers(Object tokenRequestHandler) {

        cibaProxyJdbcStore.getTokenRequestDB().register(tokenRequestHandler);
    }

    @Override
    public void registerToTokenResponseObservers(Object tokenResponseHandler) {

        cibaProxyJdbcStore.getTokenResponseDB().register(tokenResponseHandler);
    }

    @Override
    public void registerToPollingAttribute(Object pollingAttribute) {
        //implement if needed
    }

}



