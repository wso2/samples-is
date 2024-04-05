package com.wso2_sample.api_auth_sample.model.api.oauth_client.authenticator

import com.wso2_sample.api_auth_sample.controller.ui.activities.fragments.auth.data.authenticator.Authenticator
import com.wso2_sample.api_auth_sample.model.api.Callback

class AllAuthenticatorsCallback (
    private val onSuccess: (authenticators: ArrayList<Authenticator>) -> Unit,
    private val onFailure: () -> Unit
) : Callback<ArrayList<Authenticator>>() {

    /**
     * Called when the request is finished successfully.
     */
    override fun onSuccess(result: ArrayList<Authenticator>?) {
        onSuccess.invoke(result!!)
    }

    /**
     * Called when the request has failed.
     */
    override fun onFailure(error: Exception?) {
        error?.printStackTrace();
        println("AuthenticatorCallback ${error?.message}")
        onFailure.invoke()
    }
}