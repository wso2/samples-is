package com.wso2_sample.api_auth_sample.model.api.app_auth_manager

import com.wso2_sample.api_auth_sample.model.api.Callback

/**
 * Callback to be used when requesting an access token.
 * @param onSuccess Callback to be called when the token request is finished successfully.
 * @param onFailure Callback to be called when the token request has failed.
 */
class TokenRequestCallback(
    private val onSuccess: (accessToken: String) -> Unit,
    private val onFailure: (error: Exception) -> Unit
) : Callback<String>() {

    /**
     * Called when the token request is finished successfully.
     * @param result The access token.
     */
    override fun onSuccess(result: String?) {
        onSuccess.invoke(result!!)
    }

    /**
     * Called when the token request has failed.
     * @param error The error that caused the failure.
     */
    override fun onFailure(error: Exception?) {
        error?.printStackTrace()
        println("TokenRequestCallback ${error?.message}")
        onFailure.invoke(error!!)
    }
}
