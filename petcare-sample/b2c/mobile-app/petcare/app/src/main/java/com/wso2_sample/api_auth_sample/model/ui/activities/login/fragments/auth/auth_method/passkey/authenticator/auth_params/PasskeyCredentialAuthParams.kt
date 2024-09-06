package com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.passkey.authenticator.auth_params

import com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.passkey.authenticator.passkey_data.PasskeyCredential
import com.wso2_sample.api_auth_sample.util.Util

data class PasskeyCredentialAuthParams(
    val requestId: String,
    val credential: PasskeyCredential
) {
    override fun toString(): String {
        return Util.base64UrlEncode(this)
    }
}
