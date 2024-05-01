package com.wso2_sample.api_auth_sample.features.login.presentation.screens.auth_screen

import io.asgardeo.android.core.models.autheniticator.Authenticator
import io.asgardeo.android.core.models.authentication_flow.AuthenticationFlowNotSuccess

data class AuthScreenState(
    val isLoading: Boolean = false,
    val authenticationFlow: AuthenticationFlowNotSuccess? = null,
    val detailedAuthenticator: Authenticator? = null,
    val error: String = ""
)
