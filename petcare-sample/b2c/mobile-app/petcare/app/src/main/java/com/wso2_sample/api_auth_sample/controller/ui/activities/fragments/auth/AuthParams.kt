package com.wso2_sample.api_auth_sample.controller.ui.activities.fragments.auth

/**
 * Authenticator parameters data class
 */
abstract class AuthParams(
    /**
     * Username
     */
    open val username: String? = null,
    /**
     * Password
     */
    open val password: String? = null,
    /**
     * Code
     */
    open val accessToken: String? = null,
    /**
     * State
     */
    open val idToken: String? = null,
    /**
     * Otp code
     */
    open val totp: String? = null,
    /**
     * Token response
     */
    open val tokenResponse: String? = null
)
