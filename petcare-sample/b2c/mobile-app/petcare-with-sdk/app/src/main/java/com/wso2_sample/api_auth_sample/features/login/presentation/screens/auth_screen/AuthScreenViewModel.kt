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

package com.wso2_sample.api_auth_sample.features.login.presentation.screens.auth_screen

import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.activity.result.ActivityResult
import androidx.activity.result.ActivityResultLauncher
import androidx.annotation.RequiresApi
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.wso2_sample.api_auth_sample.features.login.domain.repository.AsgardeoAuthRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import io.asgardeo.android.core.models.autheniticator.Authenticator
import io.asgardeo.android.core.models.authentication_flow.AuthenticationFlow
import io.asgardeo.android.core.models.authentication_flow.AuthenticationFlowNotSuccess
import io.asgardeo.android.core.provider.providers.authentication.AuthenticationProvider
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class AuthScreenViewModel @Inject constructor(
    @ApplicationContext private val applicationContext: Context,
    asgardeoAuthRepository: AsgardeoAuthRepository
) : ViewModel() {

    companion object {
        const val TAG = "AuthScreen"
    }

    private val _state = MutableStateFlow(AuthScreenState())
    val state = _state

    private var authenticationProvider: AuthenticationProvider

    init {
        authenticationProvider = asgardeoAuthRepository.getAuthenticationProvider()
        _state.update {
            it.copy(isLoading = false)
        }
    }

    fun setAuthenticationFlow(authenticationFlow: AuthenticationFlow) {
        _state.update {
            it.copy(
                authenticationFlow = authenticationFlow as AuthenticationFlowNotSuccess,
                isLoading = false
            )
        }
    }

    fun selectAuthenticator(authenticator: Authenticator) {
        viewModelScope.launch {
            _state.update {
                it.copy(
                    isLoading = true
                )
            }
            val detailedAuthenticator: Authenticator? =
                authenticationProvider.selectAuthenticator(authenticator)
            _state.update {
                it.copy(
                    isLoading = false,
                    detailedAuthenticator = detailedAuthenticator
                )
            }
        }
    }

    fun authenticate(
        detailedAuthenticator: Authenticator?,
        authParams: LinkedHashMap<String, String>
    ) {
        viewModelScope.launch {
            _state.update {
                it.copy(
                    isLoading = true
                )
            }
            authenticationProvider.authenticate(
                applicationContext,
                detailedAuthenticator,
                authParams
            )
            _state.update {
                it.copy(
                    isLoading = false
                )
            }
        }
    }

    fun authenticateWithUsernamePassword(
        authenticatorId: String,
        username: String,
        password: String
    ) {
        viewModelScope.launch {
            _state.update {
                it.copy(
                    isLoading = true
                )
            }
            authenticationProvider.authenticateWithUsernameAndPassword(
                applicationContext,
                authenticatorId,
                username,
                password
            )
            _state.update {
                it.copy(
                    isLoading = false
                )
            }
        }
    }

    fun authenticateWithTotp(authenticatorId: String, token: String) {
        viewModelScope.launch {
            _state.update {
                it.copy(
                    isLoading = true
                )
            }
            authenticationProvider.authenticateWithTotp(
                applicationContext,
                authenticatorId,
                token
            )
            _state.update {
                it.copy(
                    isLoading = false
                )
            }
        }
    }

    fun authenticateWithEmailOTP(authenticatorId: String, otpCode: String) {
        viewModelScope.launch {
            _state.update {
                it.copy(
                    isLoading = true
                )
            }
            authenticationProvider.authenticateWithEmailOtp(
                applicationContext,
                authenticatorId,
                otpCode
            )
            _state.update {
                it.copy(
                    isLoading = false
                )
            }
        }
    }

    fun authenticateWithSMSOTP(authenticatorId: String, otpCode: String) {
        viewModelScope.launch {
            _state.update {
                it.copy(
                    isLoading = true
                )
            }
            authenticationProvider.authenticateWithSMSOtp(
                applicationContext,
                authenticatorId,
                otpCode
            )
            _state.update {
                it.copy(
                    isLoading = false
                )
            }
        }
    }

    fun authenticateWithOpenIdConnect(authenticatorId: String) {
        viewModelScope.launch {
            _state.update {
                it.copy(
                    isLoading = true
                )
            }
            authenticationProvider.authenticateWithOpenIdConnect(
                applicationContext,
                authenticatorId
            )
            _state.update {
                it.copy(
                    isLoading = false
                )
            }
        }
    }

    @RequiresApi(Build.VERSION_CODES.UPSIDE_DOWN_CAKE)
    fun authenticateWithGoogleNative(authenticatorId: String) {
        viewModelScope.launch {
            _state.update {
                it.copy(
                    isLoading = true
                )
            }
            authenticationProvider.authenticateWithGoogleNative(applicationContext, authenticatorId)
            _state.update {
                it.copy(
                    isLoading = false
                )
            }
        }
    }

    @RequiresApi(Build.VERSION_CODES.UPSIDE_DOWN_CAKE)
    fun authenticateWithPasskey(authenticatorId: String) {
        viewModelScope.launch {
            _state.update {
                it.copy(
                    isLoading = true
                )
            }
            authenticationProvider.authenticateWithPasskey(applicationContext, authenticatorId)
            _state.update {
                it.copy(
                    isLoading = false
                )
            }
        }
    }

    fun authenticateWithGoogleNativeLegacy(
        authenticatorId: String,
        googleAuthenticateResultLauncher: ActivityResultLauncher<Intent>
    ) {
        viewModelScope.launch {
            _state.update {
                it.copy(
                    isLoading = true
                )
            }
            authenticationProvider.authenticateWithGoogleNativeLegacy(
                applicationContext,
                authenticatorId,
                googleAuthenticateResultLauncher
            )
            _state.update {
                it.copy(
                    isLoading = false
                )
            }
        }
    }

    fun handleGoogleNativeLegacyAuthenticateResult(result: ActivityResult) {
        viewModelScope.launch {
            authenticationProvider.handleGoogleNativeLegacyAuthenticateResult(
                applicationContext,
                result.resultCode,
                result.data!!
            )
        }
    }

    fun authenticateWithGithub(authenticatorId: String) {
        viewModelScope.launch {
            _state.update {
                it.copy(
                    isLoading = true
                )
            }
            authenticationProvider.authenticateWithGithub(
                applicationContext,
                authenticatorId
            )
            _state.update {
                it.copy(
                    isLoading = false
                )
            }
        }
    }
}
