package com.wso2_sample.api_auth_sample.api.data_source.pet

import com.wso2_sample.api_auth_sample.model.data.Pet
import com.wso2_sample.api_auth_sample.model.data.Vaccination

class PetDataStore() {

    companion object {
        private val pets: List<Pet> = listOf(
            Pet(
                id = "1",
                owner = "John Doe",
                name = "Max",
                breed = "Golden Retriever",
                dateOfBirth = "2018-01-01",
                vaccinations = emptyList()
            ),
            Pet(
                id = "2",
                owner = "Jane Doe",
                name = "Luna",
                breed = "Poodle",
                dateOfBirth = "2019-01-01",
                vaccinations = emptyList()
            ),
            Pet(
                id = "3",
                owner = "Jane Doe",
                name = "Kitty",
                breed = "Cat",
                dateOfBirth = "2014-01-01",
                vaccinations = emptyList()
            )
        )

        fun getAllPets(): ArrayList<Pet> {
            return ArrayList(pets)
        }

        fun getPetById(id: String): Pet? {
            return pets.find { it.id == id }
        }
    }
}
