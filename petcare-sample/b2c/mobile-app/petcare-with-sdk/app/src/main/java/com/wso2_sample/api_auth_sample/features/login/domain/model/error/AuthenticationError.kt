package com.wso2_sample.api_auth_sample.features.login.domain.model.error

data class AuthenticationError(
    val errorMessage: String,
    val t: Throwable? = null
)
