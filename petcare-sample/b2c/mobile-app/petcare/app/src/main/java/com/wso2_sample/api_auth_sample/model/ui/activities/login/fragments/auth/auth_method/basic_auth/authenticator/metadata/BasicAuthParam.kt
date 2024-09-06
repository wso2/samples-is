package com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.basic_auth.authenticator.metadata

import com.wso2_sample.api_auth_sample.controller.ui.activities.fragments.auth.data.authenticator.metadata.Param

data class BasicAuthParam (
    /**
     * Param name
     */
    override val param: String?,
    /**
     * Param type
     */
    override val type: String?,
    /**
     * Order of the param
     */
    override val order: Int?,
    /**
     * I18n key of the param
     */
    override val i18nKey: String?,
    /**
     * Display name of the param
     */
    override val displayName: String?,
    /**
     * Is param confidential
     */
    override val confidential: Boolean?
): Param(
    param,
    type,
    order,
    i18nKey,
    displayName,
    confidential
)
