package com.wso2_sample.api_auth_sample.features.home.domain.repository

import com.wso2_sample.api_auth_sample.features.home.domain.models.Pet

interface PetRepository {
    fun getPets(): List<Pet>
}
