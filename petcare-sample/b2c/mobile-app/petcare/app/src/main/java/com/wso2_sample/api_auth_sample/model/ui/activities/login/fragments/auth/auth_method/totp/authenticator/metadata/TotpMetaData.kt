package com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.totp.authenticator.metadata

import com.wso2_sample.api_auth_sample.controller.ui.activities.fragments.auth.data.authenticator.metadata.MetaData
import com.wso2_sample.api_auth_sample.controller.ui.activities.fragments.auth.data.authenticator.metadata.Param

data class TotpMetaData(
    /**
     * I18n key of the param
     */
    override val i18nKey: String,
    /**
     * Prompt type
     */
    override val promptType: String?,
    /**
     * Params
     */
    override var params: ArrayList<Param>?,
): MetaData(
    i18nKey,
    promptType,
    params,
    null
)
