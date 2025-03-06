package com.wso2_sample.api_auth_sample.model.api.oauth_client

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.JsonNode
import com.wso2_sample.api_auth_sample.controller.ui.activities.fragments.auth.data.authenticator.Authenticator
import com.wso2_sample.api_auth_sample.util.Util

/**
 * Authorize flow next step data class.
 */
data class AuthorizeFlowNextStep(
    val stepType: String,
    var authenticators: ArrayList<Authenticator>
) {

    override fun toString(): String {
        return Util.getJsonString(this)
    }

    companion object {
        fun fromJson(jsonString: String): AuthorizeFlowNextStep {
            val stepTypeReference = object : TypeReference<AuthorizeFlowNextStep>() {}
            val jsonNodeAuthorizeFlowNextStep: JsonNode = Util.getJsonObject(jsonString)

            return Util.jsonNodeToObject(jsonNodeAuthorizeFlowNextStep, stepTypeReference)
        }
    }
}
