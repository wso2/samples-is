package com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.google.authenticator

import com.wso2_sample.api_auth_sample.controller.ui.activities.fragments.auth.AuthParams

/**
 * Google authenticator parameters data class
 */
data class GoogleAuthParams(
    override val accessToken: String?,
    override val idToken: String?,
): AuthParams(
    accessToken = accessToken,
    idToken = idToken
)
