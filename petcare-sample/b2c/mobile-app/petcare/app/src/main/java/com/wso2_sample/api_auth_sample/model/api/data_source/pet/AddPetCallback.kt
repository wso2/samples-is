package com.wso2_sample.api_auth_sample.model.api.data_source.pet

import com.wso2_sample.api_auth_sample.model.api.Callback

/**
 * Callback to be used when adding a pet.
 * @param onSuccess Callback to be called when the request is finished successfully.
 * @param onFailure Callback to be called when the request has failed.
 * @param onWaiting Callback to be called when the request is waiting for a response.
 * @param onFinally Callback to be called when the request is finished.
 */
class AddPetCallback(
    private val onSuccess: () -> Unit,
    private val onFailure: () -> Unit,
    private val onWaiting: () -> Unit,
    private val onFinally: () -> Unit
) : Callback<Any>() {

    /**
     * Called when the request is finished successfully.
     */
    override fun onSuccess(result: Any?) {
        onSuccess.invoke()
    }

    /**
     * Called when the request has failed.
     * @param error The error that caused the failure.
     */
    override fun onFailure(error: Exception?) {
        error?.printStackTrace();
        onFailure.invoke()
    }

    /**
     * Called when the request is waiting for a response.
     */
    override fun onWaiting() {
        onWaiting.invoke()
    }

    /**
     * Called when the request is finished.
     */
    override fun onFinally() {
        onFinally.invoke()
    }
}
