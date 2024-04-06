package com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.passkey.authenticator.passkey_data

import com.fasterxml.jackson.annotation.JsonIgnoreProperties

@JsonIgnoreProperties(ignoreUnknown = true)
data class PublicKeyCredentialRequestOptions(
    val challenge: String?,
    val rpId: String?,
    val extensions: Any?
)
