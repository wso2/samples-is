package com.wso2_sample.api_auth_sample.model.api.oauth_client.authenticator

import com.wso2_sample.api_auth_sample.model.api.Callback
import com.wso2_sample.api_auth_sample.model.api.oauth_client.AuthorizeFlow

class AuthorizeFlowCallback(
    private val onSuccess: (authorizeFlow: AuthorizeFlow) -> Unit,
    private val onFailure: () -> Unit
) : Callback<AuthorizeFlow>() {

    /**
     * Called when the request is finished successfully.
     */
    override fun onSuccess(result: AuthorizeFlow?) {
        onSuccess.invoke(result!!)
    }

    /**
     * Called when the request has failed.
     */
    override fun onFailure(error: Exception?) {
        error?.printStackTrace()
        println("AuthenticatorCallback ${error?.message}")
        onFailure.invoke()
    }
}