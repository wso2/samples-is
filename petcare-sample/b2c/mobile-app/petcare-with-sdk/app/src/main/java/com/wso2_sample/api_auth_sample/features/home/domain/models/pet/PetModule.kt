package com.wso2_sample.api_auth_sample.features.home.domain.models.pet

import com.fasterxml.jackson.databind.Module
import com.fasterxml.jackson.databind.module.SimpleModule

class PetModule : SimpleModule() {
    init {
        addDeserializer(Pet::class.java, PetDeserializer())
    }
}
