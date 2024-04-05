package com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.basic_auth.authenticator

import com.wso2_sample.api_auth_sample.controller.ui.activities.fragments.auth.data.authenticator.Authenticator
import com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.basic_auth.authenticator.metadata.BasicAuthMetaData

data class BasicAuthAuthenticator(
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
    override val metadata: BasicAuthMetaData,
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
        const val AUTHENTICATOR_TYPE = "Username & Password"
    }
}
