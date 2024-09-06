package com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.passkey.authenticator.passkey_data

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.JsonNode
import com.wso2_sample.api_auth_sample.util.Util

@JsonIgnoreProperties(ignoreUnknown = true)
data class ChallengeInfo(
    val requestId: String,
    val publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions,
    val request: Any?
) {
    companion object {
        fun getChallengeInfoFromChallengeString(challengeString: String): ChallengeInfo {

            val challengeJsonString: String = Util.base64UrlDecode(challengeString)
            val challengeJson: JsonNode = Util.getJsonObject(challengeJsonString)

            val stepTypeReference = object : TypeReference<ChallengeInfo>() {}
            return Util.jsonNodeToObject(challengeJson, stepTypeReference)
        }
    }

    fun getPasskeyChallenge(): PasskeyChallenge {
        return PasskeyChallenge(
            challenge = this.publicKeyCredentialRequestOptions.challenge,
            allowCredentials = emptyList(),
            timeout = 1800000,
            userVerification = "required",
            rpId = this.publicKeyCredentialRequestOptions.rpId
        )
    }
}
