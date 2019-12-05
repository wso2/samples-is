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

import cache.CibaProxyCache;
import transactionartifacts.CIBAauthRequest;
import transactionartifacts.CIBAauthResponse;
import transactionartifacts.PollingAtrribute;
import transactionartifacts.TokenRequest;
import transactionartifacts.TokenResponse;

/**
 * Artifact store connector for in-memory.
 */
public class CacheArtifactStoreConnector implements ArtifactStoreConnectors {

    CibaProxyCache cibaProxyCache;

    private CacheArtifactStoreConnector() {

        cibaProxyCache = CibaProxyCache.getCibaProxyCacheInstance();
    }

    private static CacheArtifactStoreConnector cacheArtifactStoreConnectorInstance = new CacheArtifactStoreConnector();

    public static CacheArtifactStoreConnector getInstance() {

        if (cacheArtifactStoreConnectorInstance == null) {

            synchronized (CacheArtifactStoreConnector.class) {

                if (cacheArtifactStoreConnectorInstance == null) {

                    /* instance will be created at request time */
                    cacheArtifactStoreConnectorInstance = new CacheArtifactStoreConnector();
                }
            }
        }
        return cacheArtifactStoreConnectorInstance;
    }

    @Override
    public void addAuthRequest(String authReqId, Object authrequest) {

        if (authrequest instanceof CIBAauthRequest) {
            cibaProxyCache.getAuthRequestCache().add(authReqId, authrequest);
        }
    }

    @Override
    public void addAuthResponse(String authReqId, Object authresponse) {

        if (authresponse instanceof CIBAauthResponse) {
            cibaProxyCache.getAuthResponseCache().add(authReqId, authresponse);
        }
    }

    @Override
    public void addTokenRequest(String authReqID, Object tokenrequest) {

        if (tokenrequest instanceof TokenRequest) {
            cibaProxyCache.getTokenRequestCache().add(authReqID, tokenrequest);
        }
    }

    @Override
    public void addTokenResponse(String authReqId, Object tokenresponse) {

        if (tokenresponse instanceof TokenResponse) {
            cibaProxyCache.getTokenResponseCache().add(authReqId, tokenresponse);
        }
    }

    @Override
    public void addPollingAttribute(String authReqID, Object pollingattribute) {

        if (pollingattribute instanceof PollingAtrribute) {
            cibaProxyCache.getPollingAtrributeCache().add(authReqID, pollingattribute);
        }
    }

    @Override
    public void removeAuthRequest(String authReqID) {

        cibaProxyCache.getAuthRequestCache().remove(authReqID);
    }

    @Override
    public void removeAuthResponse(String authReqID) {

        cibaProxyCache.getAuthResponseCache().remove(authReqID);
    }

    @Override
    public void removeTokenRequest(String authReqID) {

        cibaProxyCache.getTokenRequestCache().remove(authReqID);
    }

    @Override
    public void removeTokenResponse(String authReqID) {

        cibaProxyCache.getTokenResponseCache().remove(authReqID);
    }

    @Override
    public void removePollingAttribute(String authReqID) {

        cibaProxyCache.getPollingAtrributeCache().remove(authReqID);
    }

    @Override
    public CIBAauthRequest getAuthRequest(String authReqID) {

        return (CIBAauthRequest) cibaProxyCache.getAuthRequestCache().get(authReqID);
    }

    @Override
    public CIBAauthResponse getAuthResponse(String authReqID) {

        return (CIBAauthResponse) cibaProxyCache.getAuthResponseCache().get(authReqID);
    }

    @Override
    public TokenRequest getTokenRequest(String authReqID) {

        return (TokenRequest) cibaProxyCache.getTokenRequestCache().get(authReqID);
    }

    @Override
    public TokenResponse getTokenResponse(String authReqID) {

        return (TokenResponse) cibaProxyCache.getTokenResponseCache().get(authReqID);
    }

    @Override
    public PollingAtrribute getPollingAttribute(String authReqID) {

        return (PollingAtrribute) cibaProxyCache.getPollingAtrributeCache().get(authReqID);
    }

    @Override
    public void registerToAuthRequestObservers(Object authRequestHandler) {

        cibaProxyCache.getAuthRequestCache().register(authRequestHandler);

    }

    @Override
    public void registerToAuthResponseObservers(Object authResponseHandler) {

        cibaProxyCache.getAuthResponseCache().register(authResponseHandler);

    }

    @Override
    public void registerToTokenRequestObservers(Object tokenRequestHandler) {

        cibaProxyCache.getTokenRequestCache().register(tokenRequestHandler);
    }

    @Override
    public void registerToTokenResponseObservers(Object tokenResponseHandler) {

        cibaProxyCache.getTokenResponseCache().register(tokenResponseHandler);
    }

    @Override
    public void registerToPollingAttribute(Object pollingHandler) {
        //No need of validation or implementation
    }

}
