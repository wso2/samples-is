package com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.totp.authenticator

import com.wso2_sample.api_auth_sample.controller.ui.activities.fragments.auth.AuthParams

/**
 * TOTP authenticator parameters data class
 */
data class TotpAuthParams(
    override val totp: String
): AuthParams(
    totp = totp
)
