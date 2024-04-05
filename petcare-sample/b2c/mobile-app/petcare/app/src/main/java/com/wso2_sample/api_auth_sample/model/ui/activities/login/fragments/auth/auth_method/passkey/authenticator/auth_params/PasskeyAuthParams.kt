package com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.passkey.authenticator.auth_params

import com.wso2_sample.api_auth_sample.controller.ui.activities.fragments.auth.AuthParams

/**
 * Passkey authenticator parameters data class
 */
data class PasskeyAuthParams(
    override val tokenResponse: String
): AuthParams(
    tokenResponse = tokenResponse
)
