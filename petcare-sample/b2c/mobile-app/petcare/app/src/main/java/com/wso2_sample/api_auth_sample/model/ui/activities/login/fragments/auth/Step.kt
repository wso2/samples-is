package com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth

import com.wso2_sample.api_auth_sample.controller.ui.activities.fragments.auth.data.authenticator.Authenticator

/**
 * Authenticator data class
 */
data class Step(
    /**
     * Authenticator id
     */
    val stepType: String,
    /**
     * Authenticator type
     */
    val authenticators: ArrayList<Authenticator>
)
