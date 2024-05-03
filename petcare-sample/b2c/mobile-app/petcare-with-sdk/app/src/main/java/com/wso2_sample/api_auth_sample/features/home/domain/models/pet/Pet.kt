package com.wso2_sample.api_auth_sample.features.home.domain.models.pet

import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.wso2_sample.api_auth_sample.util.Util

@JsonDeserialize(using = PetDeserializer::class)
data class Pet(
    val name: String? = null,
    val breed: String? = null,
    val nextAppointment: String? = null,
    val imageUrl: String? = null
) {
    companion object {
        /**
         * Create a pet with random data if the API response is empty or the application
         * is used as a standalone application.
         *
         * @param name The name of the pet
         * @param breed The breed of the pet
         *
         * @return The pet [Pet]
         */
        fun createPetWithRandomData(name: String?, breed: String?): Pet {
            val randomImageUrl = Util.getPetImageUrls().random()
            val randomDate = Util.generateRandomDate()
            return Pet(
                name = name,
                breed = breed,
                nextAppointment = "Next appointment on $randomDate",
                imageUrl = randomImageUrl
            )
        }
    }
}
