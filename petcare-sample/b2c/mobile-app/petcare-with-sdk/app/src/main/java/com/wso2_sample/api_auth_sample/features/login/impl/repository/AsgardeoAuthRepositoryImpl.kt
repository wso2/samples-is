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

package com.wso2_sample.api_auth_sample.features.login.impl.repository

import com.wso2_sample.api_auth_sample.features.login.domain.repository.AsgardeoAuthRepository
import com.wso2_sample.api_auth_sample.util.Config
import io.asgardeo.android.core.asgardeo_auth.AsgardeoAuth
import io.asgardeo.android.core.core_config.AuthenticationCoreConfig
import io.asgardeo.android.core.provider.providers.authentication.AuthenticationProvider
import io.asgardeo.android.core.provider.providers.token.TokenProvider
import javax.inject.Inject

class AsgardeoAuthRepositoryImpl @Inject constructor() : AsgardeoAuthRepository {
    private lateinit var asgardeoAuth: AsgardeoAuth

    override fun initializeAsgardeoAuth(integrityToken: String?) {
        asgardeoAuth = AsgardeoAuth.getInstance(
            AuthenticationCoreConfig(
                // Change these values at your discretion
                authorizeEndpoint = Config.getAuthorizeUrl(),
                tokenEndpoint = Config.getTokenUrl(),
                logoutEndpoint = Config.getLogoutUrl(),
                userInfoEndpoint = Config.getUserInfoUrl(),
                authnEndpoint = Config.getAuthnUrl(),
                redirectUri = Config.getRedirectUri(),
                clientId = Config.getClientId(),
                scope = Config.getScope(),
                googleWebClientId = Config.getGoogleWebClientId(),
                isDevelopment = true,
                integrityToken = integrityToken
            )
        )
    }

    override fun getAuthenticationProvider(): AuthenticationProvider =
        asgardeoAuth.getAuthenticationProvider()

    override fun getTokenProvider(): TokenProvider =
        asgardeoAuth.getTokenProvider()
}
