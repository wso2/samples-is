/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package org.wso2.sample.identity.oauth2;

public final class OAuth2Constants {

    // Oauth response parameters and session attributes
    public static final String SCOPE = "scope";
    public static final String ERROR = "error";
    public static final String ACCESS_TOKEN = "access_token";
    public static final String SESSION_STATE = "session_state";

    // application specific request parameters and session attributes
    public static final String CONSUMER_KEY = "consumerKey";
    public static final String CALL_BACK_URL = "callbackurl";
    public static final String OAUTH2_GRANT_TYPE = "grantType";
    public static final String OAUTH2_AUTHZ_ENDPOINT = "authorizeEndpoint";
    public static final String OIDC_LOGOUT_ENDPOINT = "logoutEndpoint";
    public static final String OIDC_SESSION_IFRAME_ENDPOINT = "sessionIFrameEndpoint";
    public static final String NAME = "name";

    // application specific session attributes
    public static final String CODE = "code";

    // request headers
    public static final String REFERER = "referer";

}
