package com.wso2_sample.api_auth_sample.controller.ui.activities.fragments.auth.data.authenticator

import com.wso2_sample.api_auth_sample.controller.ui.activities.fragments.auth.data.authenticator.metadata.MetaData
import com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.passkey.authenticator.PasskeyAuthenticator
import com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.passkey.authenticator.metadata.PasskeyAdditionalData
import com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.passkey.authenticator.metadata.PasskeyMetaData

open class Authenticator(
    open val authenticatorId: String,
    open val authenticator: String,
    open val idp: String,
    open val metadata: MetaData?,
    open val requiredParams: List<String>?
) {

    fun convertToPasskeyAuthenticator(): PasskeyAuthenticator {
        return PasskeyAuthenticator(
            authenticatorId,
            authenticator,
            idp,
            PasskeyMetaData(
                metadata?.i18nKey,
                metadata?.promptType,
                PasskeyAdditionalData(
                    (metadata?.additionalData as LinkedHashMap<*, *>)["challengeData"].toString()
                )
            ),
            requiredParams
        )
    }
}
