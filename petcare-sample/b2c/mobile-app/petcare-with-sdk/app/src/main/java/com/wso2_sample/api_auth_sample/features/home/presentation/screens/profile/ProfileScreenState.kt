package com.wso2_sample.api_auth_sample.features.home.presentation.screens.profile

import com.wso2_sample.api_auth_sample.features.home.domain.models.UserDetails

data class ProfileScreenState(
    val isLoading: Boolean = false,
    val error: String = "",
    val user: UserDetails? = null,
)
