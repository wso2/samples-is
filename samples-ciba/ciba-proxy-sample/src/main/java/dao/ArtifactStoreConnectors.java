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
 * Abstracts artifact store connector.
 */
public interface ArtifactStoreConnectors {

    /**
     * Add Authentication request object to authrequest cache.
     *
     * @param authReqId   Ciba Authentication request identifier.
     * @param authrequest Ciba Authentication request.
     */
    void addAuthRequest(String authReqId, Object authrequest);

    /**
     * Add Authentication response object to auth response cache.
     *
     * @param authReqID    Ciba Authentication request identifier.
     * @param authresponse Ciba Authentication response.
     */
    void addAuthResponse(String authReqID, Object authresponse);

    /**
     * Add Token request object to token request cache.
     *
     * @param authReqID    Ciba Authentication request identifier.
     * @param tokenrequest TokenRequest Object.
     */
    void addTokenRequest(String authReqID, Object tokenrequest);

    /**
     * Add Authentication response object to token cache.
     *
     * @param authReqID     Ciba Authentication request identifier.
     * @param tokenresponse Token Response.
     */
    void addTokenResponse(String authReqID, Object tokenresponse);

    /**
     * Add pollingAttributeDO polling attribute cache.
     *
     * @param authReqID        Ciba Authentication request identifier.
     * @param pollingattribute Polling attribute DO.
     */
    void addPollingAttribute(String authReqID, Object pollingattribute);

    /**
     * Remove Authentication request object from auth request cache.
     *
     * @param authReqID Ciba Authentication request identifier.
     */
    void removeAuthRequest(String authReqID);

    /**
     * Remove Authentication response object from auth response cache.
     *
     * @param authReqID Ciba Authentication request identifier.
     */
    void removeAuthResponse(String authReqID);

    /**
     * Remove token request object from token request cache.
     *
     * @param authReqID Ciba Authentication request identifier.
     */
    void removeTokenRequest(String authReqID);

    /**
     * Remove Authentication response object from auth response cache.
     *
     * @param authReqID Ciba Authentication request identifier.
     */
    void removeTokenResponse(String authReqID);

    /**
     * Remove Polling attribute DO from cache.
     *
     * @param authReqID Ciba Authentication request identifier.
     */
    void removePollingAttribute(String authReqID);

    /**
     * Get CIBA auth request  from Auth request cache.
     *
     * @param authReqID Ciba Authentication request identifier.
     * @return Ciba Authentication request DO.
     */
    CIBAauthRequest getAuthRequest(String authReqID);

    /**
     * Get CIBA auth response  from Authresponse cache.
     *
     * @param authReqID Ciba Authentication request identifier.
     * @return Ciba Authentication response.
     */
    CIBAauthResponse getAuthResponse(String authReqID);

    /**
     * Get Token request  from token request cache.
     *
     * @param authReqID Ciba Authentication request identifier.
     * @return Token Request.
     */
    TokenRequest getTokenRequest(String authReqID);

    /**
     * Get token response  from token response cache.
     *
     * @param authReqID Ciba Authentication request identifier.
     * @return Token Response.
     */
    TokenResponse getTokenResponse(String authReqID);

    /**
     * Get token response  from token response cache.
     *
     * @param authReqID Ciba Authentication request identifier.
     * @return Polling attribute DO.
     */
    PollingAtrribute getPollingAttribute(String authReqID);

    /**
     * Register to authentication request observer list.
     *
     * @param authRequestHandler Authentication request handler.
     */
    void registerToAuthRequestObservers(Object authRequestHandler);

    /**
     * Register to authentication response observer list.
     *
     * @param authResponseHandler Authentication response handler.
     */
    void registerToAuthResponseObservers(Object authResponseHandler);

    /**
     * Register to token request observer list.
     *
     * @param tokenRequestHandler Token request handler.
     */
    void registerToTokenRequestObservers(Object tokenRequestHandler);

    /**
     * Register to token response observer list.
     *
     * @param tokenResponseHandler Token response handler.
     */
    void registerToTokenResponseObservers(Object tokenResponseHandler);

    /**
     * Register to authentication response observer list.
     *
     * @param pollingatrribute Polling handler.
     */
    void registerToPollingAttribute(Object pollingatrribute);

}

