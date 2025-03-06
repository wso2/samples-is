package com.wso2_sample.api_auth_sample.model.api

/**
 * Callback to be used when requesting data from the API.
 * @param T The type of the result of the request.
 */
abstract class Callback<T> {
    /**
     * Called when the request has failed.
     * @param error Optional parameter to provide additional information about the failure.
     */
    open fun onFailure(error: Exception? = null) {

    }

    /**
     * Called when the request is waiting for a response.
     */
    open fun onWaiting() {
        // Default implementation (do nothing)
    }

    /**
     * Called when the request is finished successfully.
     * @param result Optional parameter representing the result of the successful request.
     */
    open fun onSuccess(result: T? = null) {
        // Default implementation (do nothing)
    }

    /**
     * Called when the request is finished.
     */
    open fun onFinally() {
        // Default implementation (do nothing)
    }
}

