/*
 *  Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
 *
 *  WSO2 LLC. licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied. See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 */

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
