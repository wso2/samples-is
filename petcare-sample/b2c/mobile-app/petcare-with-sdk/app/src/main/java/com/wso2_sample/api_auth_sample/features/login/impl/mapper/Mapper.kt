package com.wso2_sample.api_auth_sample.features.login.impl.mapper

import com.wso2_sample.api_auth_sample.features.login.domain.model.error.AuthenticationError

fun Throwable.toAuthenticationError(): AuthenticationError {
    val errorMessage: String = if (this.message != null) this.message!! else "Something went wrong"
    return AuthenticationError(errorMessage, this)
}
