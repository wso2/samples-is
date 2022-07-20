/*******************************************************************************
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
 ******************************************************************************/

package org.wso2.carbon.identity.sample.oauth2.federated.authenticator;

public class OAuth2CustomAuthenticatorConstants {

    public static final String AUTHENTICATOR_NAME = "OAuth2CustomAuthenticator";
    public static final String AUTHENTICATOR_FRIENDLY_NAME = "OAuth2 Custom Authenticator";
    public static final String CLIENT_ID = "ClientId";
    public static final String CLIENT_SECRET = "ClientSecret";
    public static final String CALLBACK_URL = "CallbackUrl";

    // TODO: Change URLs to match the identity provider
    public static final String AUTH_URL = "https://kauth.kakao.com/oauth/authorize";
    public static final String TOKEN_URL = "https://kauth.kakao.com/oauth/token";
    public static final String INFO_URL = "https://kapi.kakao.com/v2/user/me";
}

