package com.wso2_sample.api_auth_sample.features.login.domain.repository

import io.asgardeo.android.core.provider.providers.authentication.AuthenticationProvider
import io.asgardeo.android.core.provider.providers.token.TokenProvider

/**
 * Use as a repository to handle the authentication related operations using Asgardeo authentication SDK.
 */
interface AsgardeoAuthRepository {
    fun getAuthenticationProvider(): AuthenticationProvider
    fun getTokenProvider(): TokenProvider
}
