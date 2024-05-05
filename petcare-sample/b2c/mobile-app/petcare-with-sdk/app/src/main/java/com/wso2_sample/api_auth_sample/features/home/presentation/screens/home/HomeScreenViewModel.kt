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

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.wso2_sample.api_auth_sample.features.home.domain.repository.PetRepository
import com.wso2_sample.api_auth_sample.features.login.domain.repository.AsgardeoAuthRepository
import com.wso2_sample.api_auth_sample.util.navigation.NavigationViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import io.asgardeo.android.core.provider.providers.token.TokenProvider
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class HomeScreenViewModel @Inject constructor(
    @ApplicationContext private val applicationContext: Context,
    asgardeoAuthRepository: AsgardeoAuthRepository,
    private val petRepository: PetRepository
) : ViewModel() {

    companion object {
        const val TAG = "HomeScreen"
    }

    private val _state = MutableStateFlow(HomeScreenState())
    val state = _state

    private lateinit var tokenProvider: TokenProvider

    init {
        tokenProvider = asgardeoAuthRepository.getTokenProvider()
        _state.update {
            it.copy(isLoading = false)
        }
    }

    init {
        getPets()
    }

    private fun getPets() {
        viewModelScope.launch {
            _state.update {
                it.copy(
                    isLoading = true
                )
            }
            tokenProvider.performAction(applicationContext) { accessToken, _ ->
                viewModelScope.launch {
                    runCatching {
                        petRepository.getPets(accessToken!!)
                    }.onSuccess { pets ->
                        _state.update {
                            it.copy(pets = pets!!, isLoading = false)
                        }
                    }.onFailure { e ->
                        _state.update {
                            it.copy(error = e.message!!, isLoading = false)
                        }
                    }
                }
            }
        }
    }

    fun navigateToProfile() {
        viewModelScope.launch {
            NavigationViewModel.navigationEvents.emit(
                NavigationViewModel.Companion.NavigationEvent.NavigateToProfile
            )
        }
    }

    fun navigateToAddPet() {
        viewModelScope.launch {
            NavigationViewModel.navigationEvents.emit(
                NavigationViewModel.Companion.NavigationEvent.NavigateToAddPet
            )
        }
    }
}
