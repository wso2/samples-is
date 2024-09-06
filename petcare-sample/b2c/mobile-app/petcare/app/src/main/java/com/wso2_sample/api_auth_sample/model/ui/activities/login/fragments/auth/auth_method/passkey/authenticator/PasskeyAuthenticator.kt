package com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.passkey.authenticator

import com.wso2_sample.api_auth_sample.controller.ui.activities.fragments.auth.data.authenticator.Authenticator
import com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.passkey.authenticator.metadata.PasskeyMetaData

data class PasskeyAuthenticator(
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
    override val metadata: PasskeyMetaData,
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
        const val AUTHENTICATOR_TYPE = "Passkey"
    }
}
