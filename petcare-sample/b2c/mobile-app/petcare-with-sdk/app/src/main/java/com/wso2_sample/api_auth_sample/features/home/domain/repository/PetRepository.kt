package com.wso2_sample.api_auth_sample.features.home.domain.repository

import com.wso2_sample.api_auth_sample.features.home.domain.models.pet.Pet

interface PetRepository {
    suspend fun getPets(accessToken: String): List<Pet>?

    suspend fun addPet(
        accessToken: String,
        name: String,
        breed: String,
        dateOfBirth: String
    ): Unit?
}
