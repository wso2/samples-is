package com.wso2_sample.api_auth_sample.model.data

data class Vaccination(
    /**
     * Enable alerts for vaccination
     */
    val enableAlerts: Boolean? = null,
    /**
     * Last vaccination date
     */
    val lastVaccinationDate: String? = null,
    /**
     * Name of vaccination
     */
    val name: String? = null,
    /**
     * Next vaccination date
     */
    val nextVaccinationDate: String? = null
)
