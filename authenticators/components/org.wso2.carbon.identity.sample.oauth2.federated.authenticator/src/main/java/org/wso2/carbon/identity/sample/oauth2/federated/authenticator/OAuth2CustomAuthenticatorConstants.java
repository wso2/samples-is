/*******************************************************************************
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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
 ******************************************************************************/

package org.wso2.carbon.identity.sample.oauth2.federated.authenticator;

/**
 * Class to hold the constants for OAuth2 custom authenticator.
 */
public class OAuth2CustomAuthenticatorConstants {

    public static final String AUTHENTICATOR_NAME = "OAuth2CustomAuthenticator";
    public static final String AUTHENTICATOR_FRIENDLY_NAME = "OAuth2 Custom Authenticator";

    public static final String CLIENT_ID = "ClientId";
    public static final String CLIENT_ID_DP = "Client Id";
    public static final String CLIENT_ID_DESC = "Enter client identifier value";

    public static final String CLIENT_SECRET = "ClientSecret";
    public static final String CLIENT_SECRET_DP = "Client Secret";
    public static final String CLIENT_SECRET_DESC = "Enter client secret value";

    public static final String CALLBACK_URL = "CallbackUrl";
    public static final String CALLBACK_URL_DP = "Callback URL";
    public static final String CALLBACK_URL_DESC = "Enter callback URL";

    public static final String AUTHZ_URL = "AuthEndpoint";
    public static final String AUTHZ_URL_DP = "Authorization Endpoint URL";
    public static final String AUTHZ_URL_DESC = "Enter authorization endpoint URL";

    public static final String TOKEN_URL = "AuthTokenEndpoint";
    public static final String TOKEN_URL_DP = "Token Endpoint URL";
    public static final String TOKEN_URL_DESC = "Enter token endpoint URL";

    public static final String USER_INFO_URL = "UserInfoEndpoint";
    public static final String USER_INFO_URL_DP = "User Information Endpoint URL";
    public static final String USER_INFO_URL_DESC = "Enter user information endpoint URL";
}
