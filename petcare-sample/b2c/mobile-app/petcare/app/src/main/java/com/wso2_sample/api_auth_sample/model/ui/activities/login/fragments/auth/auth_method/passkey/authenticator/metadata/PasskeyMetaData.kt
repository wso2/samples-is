package com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.passkey.authenticator.metadata

import com.wso2_sample.api_auth_sample.controller.ui.activities.fragments.auth.data.authenticator.metadata.MetaData

data class PasskeyMetaData(
    /**
     * I18n key of the param
     */
    override val i18nKey: String?,
    /**
     * Prompt type
     */
    override val promptType: String?,
    /**
     * Additional data
     */
    override val additionalData: PasskeyAdditionalData
) : MetaData(
    i18nKey,
    promptType,
    null,
    additionalData
)
