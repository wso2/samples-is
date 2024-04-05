package com.wso2_sample.api_auth_sample.model.data

data class Pet(
    /**
     * Id of the pet
     */
    val id: String? = null,
    /**
     * Owner of the pet
     */
    val owner: String? = null,
    /**
     * Name of the pet
     */
    val name: String? = null,
    /**
     * Breed of the pet
     */
    val breed: String? = null,
    /**
     * Date of birth of the pet
     */
    val dateOfBirth: String? = null,
    /**
     * Vaccinations history of the pet
     */
    val vaccinations: List<Vaccination>? = null
)
