package com.wso2_sample.api_auth_sample.features.home.impl.repository

import com.wso2_sample.api_auth_sample.features.home.domain.models.Pet
import com.wso2_sample.api_auth_sample.features.home.domain.repository.PetRepository
import javax.inject.Inject

class PetRepositoryImpl @Inject constructor() : PetRepository {
    override fun getPets(): List<Pet> = listOf(
        Pet(
            "Bella",
            "https://cdn.pixabay.com/photo/2014/11/30/14/11/cat-551554_1280.jpg",
            "Cat - Persian",
            "Next appointment on 29/04/24"
        ),
        Pet(
            "Charlie",
            "https://cdn.pixabay.com/photo/2023/09/19/12/34/dog-8262506_1280.jpg",
            "Rabbit - Holland Lop",
            "Next appointment on 19/06/24"
        ),
        Pet(
            "Luna",
            "https://cdn.pixabay.com/photo/2023/08/18/15/02/dog-8198719_1280.jpg",
            "Dog - Golden Retriever",
            "Next appointment on 04/05/24"
        ),
        Pet(
            "Max",
            "https://cdn.pixabay.com/photo/2024/03/26/15/50/ai-generated-8657140_1280.jpg",
            "Hamster - Syrian",
            "Next appointment on 01/06/24"
        ),
        Pet(
            "Oliver",
            "https://cdn.pixabay.com/photo/2020/04/29/04/01/boy-5107099_1280.jpg",
            "Dog - Poddle",
            "Next appointment on 29/04/24"
        ),
        Pet(
            "Lucy",
            "https://cdn.pixabay.com/photo/2023/09/24/14/05/dog-8272860_1280.jpg",
            "Dog - Beagle",
            "Next appointment on 05/08/24"
        )
    )
}
