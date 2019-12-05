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

import transactionartifacts.CIBAauthRequest;
import transactionartifacts.CIBAauthResponse;
import transactionartifacts.PollingAtrribute;
import transactionartifacts.TokenRequest;
import transactionartifacts.TokenResponse;

/**
 * Artifact store connector for Redis.
 */
public class RedisArtifactStoreConnector implements ArtifactStoreConnectors {

    private static RedisArtifactStoreConnector redisArtifactStoreConnectorInstance = new RedisArtifactStoreConnector();

    public static RedisArtifactStoreConnector getInstance() {

        if (redisArtifactStoreConnectorInstance == null) {

            synchronized (RedisArtifactStoreConnector.class) {

                if (redisArtifactStoreConnectorInstance == null) {

                    /* instance will be created at request time */
                    redisArtifactStoreConnectorInstance = new RedisArtifactStoreConnector();
                }
            }
        }
        return redisArtifactStoreConnectorInstance;
    }

    @Override
    public void addAuthRequest(String authReqID, Object authrequest) {

    }

    @Override
    public void addAuthResponse(String authReqID, Object authresponse) {

    }

    @Override
    public void addTokenRequest(String authReqID, Object tokenrequest) {

    }

    @Override
    public void addTokenResponse(String authReqID, Object authresponse) {

    }

    @Override
    public void addPollingAttribute(String authReqID, Object pollingattribute) {

    }

    @Override
    public void removeAuthRequest(String authReqID) {

    }

    @Override
    public void removeAuthResponse(String authReqID) {

    }

    @Override
    public void removeTokenRequest(String authReqID) {

    }

    @Override
    public void removeTokenResponse(String authReqID) {

    }

    @Override
    public void removePollingAttribute(String authReqID) {

    }

    @Override
    public CIBAauthRequest getAuthRequest(String authReqID) {

        return null;
    }

    @Override
    public CIBAauthResponse getAuthResponse(String authReqID) {

        return null;
    }

    @Override
    public TokenRequest getTokenRequest(String authReqID) {

        return null;
    }

    @Override
    public TokenResponse getTokenResponse(String authReqID) {

        return null;
    }

    @Override
    public PollingAtrribute getPollingAttribute(String authReqID) {

        return null;
    }

    @Override
    public void registerToAuthRequestObservers(Object authRequestHandler) {

    }

    @Override
    public void registerToAuthResponseObservers(Object authResponseHandler) {

    }

    @Override
    public void registerToTokenRequestObservers(Object tokenRequestHandler) {

    }

    @Override
    public void registerToTokenResponseObservers(Object tokenRequestHandler) {

    }

    @Override
    public void registerToPollingAttribute(Object pollingatrribute) {

    }

}
