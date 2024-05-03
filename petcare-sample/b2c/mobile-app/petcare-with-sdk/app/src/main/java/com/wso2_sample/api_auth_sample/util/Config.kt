/*
 *  Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
 *
 *  WSO2 LLC. licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied. See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 */

package com.wso2_sample.api_auth_sample.util

object Config {
    private const val BASE_URL: String = <BASE_URL>
    private const val DISCOVERY_URL: String = <DISCOVERY_URL>
    private const val CLIENT_ID: String = <CLIENT_ID>
    private const val REDIRECT_URI: String = "wso2.apiauth.sample.android://login-callback"
    private const val SCOPE: String = "openid internal_login profile email"
    private const val GOOGLE_WEB_CLIENT_ID = <GOOGLE_WEB_CLIENT_ID>
    /**
     * This value is the URL of the pet care backend server. If you are planning to use this
     * application as a standalone application without a backend server, you must set this value to
     * **null**, else you can set the URL of the backend server here.
     */
    private val DATA_SOURCE_RESOURCE_SERVER_URL: String? = null

    fun getAuthorizeUrl(): String {
        return "$BASE_URL/oauth2/authorize"
    }

    fun getTokenUrl(): String {
        return "$BASE_URL/oauth2/token"
    }

    fun getLogoutUrl(): String {
        return "$BASE_URL/oidc/logout"
    }

    fun getUserInfoUrl(): String {
        return "$BASE_URL/oauth2/userinfo"
    }

    fun getAuthnUrl(): String {
        return "$BASE_URL/oauth2/authn"
    }

    fun getDiscoveryUrl(): String {
        return DISCOVERY_URL
    }

    fun getClientId(): String {
        return CLIENT_ID
    }

    fun getRedirectUri(): String {
        return REDIRECT_URI
    }

    fun getScope(): String {
        return SCOPE
    }

    fun getGoogleWebClientId(): String {
        return GOOGLE_WEB_CLIENT_ID
    }

    fun getDataSourceResourceServerUrl(): String? {
        return DATA_SOURCE_RESOURCE_SERVER_URL
    }
}
