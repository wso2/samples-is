package com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.passkey.authenticator.passkey_data

import com.fasterxml.jackson.core.type.TypeReference
import com.wso2_sample.api_auth_sample.util.Util

data class PasskeyCredential(
    val rawId: String?,
    val authenticatorAttachment: String?,
    val id: String,
    val response: Any,
    val clientExtensionResults: Any,
    val type: String
) {
    companion object {
        fun getPasskeyCredentialFromResponseString(responseString: String): PasskeyCredential {
            val responseJsonNode = Util.getJsonObject(responseString)
            val stepTypeReference = object : TypeReference<PasskeyCredential>() {}

            return Util.jsonNodeToObject(responseJsonNode, stepTypeReference)
        }
    }
}
