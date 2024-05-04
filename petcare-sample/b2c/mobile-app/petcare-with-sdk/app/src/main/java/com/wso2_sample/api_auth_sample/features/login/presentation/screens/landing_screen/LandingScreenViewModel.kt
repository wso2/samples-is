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

package com.wso2_sample.api_auth_sample.features.login.presentation.screens.landing_screen

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.wso2_sample.api_auth_sample.features.login.domain.repository.AsgardeoAuthRepository
import com.wso2_sample.api_auth_sample.features.login.domain.repository.AttestationRepository
import com.wso2_sample.api_auth_sample.util.Event
import com.wso2_sample.api_auth_sample.util.navigation.NavigationViewModel
import com.wso2_sample.api_auth_sample.util.ui.sendEvent
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import io.asgardeo.android.core.models.state.AuthenticationState
import io.asgardeo.android.core.provider.providers.authentication.AuthenticationProvider
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.net.URLEncoder
import javax.inject.Inject

@HiltViewModel
class LandingScreenViewModel @Inject constructor(
    @ApplicationContext private val applicationContext: Context,
    asgardeoAuthRepository: AsgardeoAuthRepository,
    attestationRepository: AttestationRepository
) : ViewModel() {
    companion object {
        const val TAG = "LandingScreen"
    }

    private val _state = MutableStateFlow(LandingScreenState())
    val state = _state

    private lateinit var authenticationProvider: AuthenticationProvider
    private lateinit var authenticationStateFlow: SharedFlow<AuthenticationState>

    init {
        var integrityToken: String? = null

        viewModelScope.launch {
            integrityToken = attestationRepository.getPlayIntegrityTokenResponse()

            asgardeoAuthRepository.initializeAsgardeoAuth(integrityToken)
            authenticationProvider = asgardeoAuthRepository.getAuthenticationProvider()
            authenticationStateFlow = authenticationProvider.getAuthenticationStateFlow()

            handleAuthenticationState()
            isLoggedInStateFlow()
        }
    }

    fun initializeAuthentication() {
        _state.update { landingScreenState ->
            landingScreenState.copy(isLoading = true)
        }
        viewModelScope.launch {
            authenticationProvider.initializeAuthentication(applicationContext)
            _state.update { landingScreenState ->
                landingScreenState.copy(isLoading = false)
            }
        }
    }

    private fun isLoggedInStateFlow() {
        viewModelScope.launch {
            authenticationProvider.isLoggedInStateFlow(applicationContext)
            _state.update { landingScreenState ->
                landingScreenState.copy(isLoading = false)
            }
        }
    }

    private fun handleAuthenticationState() {
        viewModelScope.launch {
            authenticationStateFlow.collect {
                when (it) {
                    is AuthenticationState.Initial -> {
                        _state.update { landingScreenState ->
                            landingScreenState.copy(isLoading = false)
                        }
                    }

                    is AuthenticationState.Unauthenticated -> {
                        _state.update { landingScreenState ->
                            landingScreenState.copy(isLoading = false)
                        }
                        NavigationViewModel.navigationEvents.emit(
                            NavigationViewModel.Companion.NavigationEvent.NavigateToAuthWithData(
                                URLEncoder.encode(it.authenticationFlow!!.toJsonString(), "utf-8")
                            )
                        )
                    }

                    is AuthenticationState.Error -> {
                        _state.update { landingScreenState ->
                            landingScreenState.copy(error = it.toString(), isLoading = false)
                        }
                        sendEvent(Event.Toast(it.toString()))
                    }

                    is AuthenticationState.Authenticated -> {
                        _state.update { landingScreenState ->
                            landingScreenState.copy(isLoading = false)
                        }
                        NavigationViewModel.navigationEvents.emit(
                            NavigationViewModel.Companion.NavigationEvent.NavigateToHome
                        )
                    }

                    else -> {
                        _state.update { landingScreenState ->
                            landingScreenState.copy(isLoading = true)
                        }
                    }
                }
            }
        }
    }
}
