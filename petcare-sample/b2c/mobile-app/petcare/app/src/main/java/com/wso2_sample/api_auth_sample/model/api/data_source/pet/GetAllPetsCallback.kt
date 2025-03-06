package com.wso2_sample.api_auth_sample.model.api.data_source.pet

import com.wso2_sample.api_auth_sample.model.api.Callback
import com.wso2_sample.api_auth_sample.model.data.Pet

/**
 * Callback to be used when requesting all pets.
 * @param onSuccess Callback to be called when the request is finished successfully.
 * @param onFailure Callback to be called when the request has failed.
 * @param onWaiting Callback to be called when the request is waiting for a response.
 * @param onFinally Callback to be called when the request is finished.
 */
class GetAllPetsCallback(
    private val onSuccess: (pets: ArrayList<Pet>) -> Unit,
    private val onFailure: () -> Unit,
    private val onWaiting: () -> Unit,
    private val onFinally: () -> Unit
) : Callback<ArrayList<Pet>>() {

    /**
     * Called when the request is finished successfully.
     * @param result The list of pets.
     */
    override fun onSuccess(result: ArrayList<Pet>?) {
        onSuccess.invoke(result!!)
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
