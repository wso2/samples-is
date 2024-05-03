package com.wso2_sample.api_auth_sample.features.home.presentation.screens.home

import com.wso2_sample.api_auth_sample.features.home.domain.models.pet.Pet

data class HomeScreenState(
    val isLoading: Boolean = false,
    val error: String = "",
    val pets: List<Pet> = emptyList()
)
