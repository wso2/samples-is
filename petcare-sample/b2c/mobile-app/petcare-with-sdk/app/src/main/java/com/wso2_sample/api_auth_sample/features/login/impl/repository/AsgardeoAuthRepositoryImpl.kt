package com.wso2_sample.api_auth_sample.features.login.impl.repository

import com.wso2_sample.api_auth_sample.features.login.domain.repository.AsgardeoAuthRepository
import com.wso2_sample.api_auth_sample.util.Config
import io.asgardeo.android.core.asgardeo_auth.AsgardeoAuth
import io.asgardeo.android.core.core_config.AuthenticationCoreConfig
import io.asgardeo.android.core.provider.providers.authentication.AuthenticationProvider
import io.asgardeo.android.core.provider.providers.token.TokenProvider
import javax.inject.Inject

class AsgardeoAuthRepositoryImpl @Inject constructor() : AsgardeoAuthRepository {
    private val asgardeoAuth: AsgardeoAuth = AsgardeoAuth.getInstance(
        AuthenticationCoreConfig(
//            Enable these configs at your discretion
            authorizeEndpoint = Config.getAuthorizeUrl(),
            tokenEndpoint = Config.getTokenUrl(),
            logoutEndpoint = Config.getLogoutUrl(),
            userInfoEndpoint = Config.getUserInfoUrl(),
            //discoveryEndpoint = Config.getDiscoveryUrl(),
            authnEndpoint = Config.getAuthnUrl(),
            redirectUri = Config.getRedirectUri(),
            clientId = Config.getClientId(),
            scope = Config.getScope(),
            googleWebClientId = Config.getGoogleWebClientId(),
            isDevelopment = true
        )
    )

    override fun getAuthenticationProvider(): AuthenticationProvider =
        asgardeoAuth.getAuthenticationProvider()

    override fun getTokenProvider(): TokenProvider = asgardeoAuth.getTokenProvider()
}
