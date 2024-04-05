package com.wso2_sample.api_auth_sample.model.api.oauth_client

import com.wso2_sample.api_auth_sample.model.api.Callback

/**
 * Callback to be used when requesting an attestation.
 * @param onSuccess Callback to be called when the request is finished successfully.
 * @param onFailure Callback to be called when the request has failed.
 */
class AttestationCallback(
    private val onSuccess: (integrityToken: String) -> Unit,
    private val onFailure: () -> Unit
) : Callback<String>() {

    /**
     * Called when the request is finished successfully.
     */
    override fun onSuccess(result: String?) {
        onSuccess.invoke(result!!)
    }

    /**
     * Called when the request has failed.
     */
    override fun onFailure(error: Exception?) {
        error?.printStackTrace();
        println("AttestationCallback ${error?.message}")
        onFailure.invoke()
    }
}