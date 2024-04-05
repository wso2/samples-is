package com.wso2_sample.api_auth_sample.model.api.oauth_client

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.JsonNode
import com.wso2_sample.api_auth_sample.util.Util

/**
 * Authorize flow data class.
 */
data class AuthorizeFlow(
    val flowId: String,
    val flowStatus: String,
    val flowType: String,
    var nextStep: AuthorizeFlowNextStep,
    val links: Any
) {
    companion object {
        fun getAuthorizeFlow(authorizeFlow: JsonNode): AuthorizeFlow {
            val stepTypeReference = object : TypeReference<AuthorizeFlow>() {}

            return Util.jsonNodeToObject(authorizeFlow, stepTypeReference);
        }
    }
}