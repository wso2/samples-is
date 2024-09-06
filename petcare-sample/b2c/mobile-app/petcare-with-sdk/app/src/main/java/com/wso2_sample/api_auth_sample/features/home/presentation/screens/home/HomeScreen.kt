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

package com.wso2_sample.api_auth_sample.features.home.presentation.screens.home

import android.annotation.SuppressLint
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.FabPosition
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.wso2_sample.api_auth_sample.features.home.domain.models.pet.Pet
import com.wso2_sample.api_auth_sample.features.home.presentation.util.AddPetFab
import com.wso2_sample.api_auth_sample.features.home.presentation.util.DoctorSearchField
import com.wso2_sample.api_auth_sample.features.home.presentation.util.EmergencyCard
import com.wso2_sample.api_auth_sample.features.home.presentation.util.TopBar
import com.wso2_sample.api_auth_sample.features.home.presentation.util.VetCard
import com.wso2_sample.api_auth_sample.features.home.presentation.util.pets_list.PetsList
import com.wso2_sample.api_auth_sample.ui.theme.Api_authenticator_sdkTheme

@Composable
internal fun HomeScreen(
    viewModel: HomeScreenViewModel = hiltViewModel()
) {
    val state = viewModel.state.collectAsStateWithLifecycle()

    val navigateToProfile: () -> Unit = viewModel::navigateToProfile
    val navigateToAddPet: () -> Unit = viewModel::navigateToAddPet

    HomeScreenContent(state.value, navigateToProfile, navigateToAddPet)
}

@Composable
@SuppressLint("UnusedMaterial3ScaffoldPaddingParameter")
fun HomeScreenContent(
    state: HomeScreenState,
    navigateToProfile: () -> Unit = {},
    navigateToAddPet: () -> Unit = {}
) {
    Scaffold(
        modifier = Modifier
            .fillMaxSize(),
        containerColor = MaterialTheme.colorScheme.surface,
        topBar = {
            TopBar(navigateToHome = {}, navigateToProfile = navigateToProfile)
        },
        floatingActionButton = { AddPetFab(navigateToAddPet) },
        floatingActionButtonPosition = FabPosition.End,
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .padding(innerPadding)
                .fillMaxSize()
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(32.dp)
        ) {
            Column(
                modifier = Modifier
                    .padding(horizontal = 32.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                DoctorSearchField()
                VetCard()
                EmergencyCard()
            }
            HorizontalDivider(
                modifier = Modifier
                    .fillMaxWidth()
                    .align(Alignment.Start),
                thickness = 0.5.dp
            )
            PetsList(state.pets)
            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}

@Preview(showBackground = true, backgroundColor = 0xFFFFFFFF)
@Composable
fun HomeScreenPreview() {
    Api_authenticator_sdkTheme {
        HomeScreenContent(
            HomeScreenState(
                isLoading = false,
                pets = listOf(
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
            )
        )
    }
}
