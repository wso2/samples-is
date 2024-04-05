package com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.google.authenticator

import com.wso2_sample.api_auth_sample.controller.ui.activities.fragments.auth.data.authenticator.Authenticator
import com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.google.authenticator.metadata.GoogleMetaData

data class GoogleAuthenticator(
    /**
     * Authenticator id
     */
    override val authenticatorId: String,
    /**
     * Authenticator type
     */
    override val authenticator: String,
    /**
     * Idp type
     */
    override val idp: String,
    /**
     * Authenticator metadata
     */
    override val metadata: GoogleMetaData,
    /**
     * Authenticator required parameters
     */
    override val requiredParams: List<String>?
) : Authenticator(
    authenticatorId,
    authenticator,
    idp,
    metadata,
    requiredParams
) {
    companion object {
        const val AUTHENTICATOR_TYPE = "Google"
    }
}
