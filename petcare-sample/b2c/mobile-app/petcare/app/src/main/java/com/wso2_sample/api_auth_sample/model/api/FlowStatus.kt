package com.wso2_sample.api_auth_sample.model.api

enum class FlowStatus(val flowStatus: String) {
    /**
     * Flow status is fail.
     */
    FAIL_INCOMPLETE("FAIL_INCOMPLETE"),

    /**
     * Flow status is incomplete.
     */
    INCOMPLETE("INCOMPLETE"),

    /**
     * Flow status is success.
     */
    SUCCESS("SUCCESS_COMPLETED"),
}