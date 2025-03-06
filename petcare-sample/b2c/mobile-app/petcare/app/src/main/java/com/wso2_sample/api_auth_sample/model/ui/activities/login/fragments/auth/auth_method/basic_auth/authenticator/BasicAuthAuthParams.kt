package com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.basic_auth.authenticator

import com.wso2_sample.api_auth_sample.controller.ui.activities.fragments.auth.AuthParams

/**
 * Basic Auth authenticator parameters data class
 */
data class BasicAuthAuthParams(
    override val username: String,
    override val password: String
): AuthParams(
    username = username,
    password = password
)
