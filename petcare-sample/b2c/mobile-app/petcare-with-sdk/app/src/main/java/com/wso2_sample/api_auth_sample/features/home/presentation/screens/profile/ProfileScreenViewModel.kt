package com.wso2_sample.api_auth_sample.features.home.presentation.screens.profile

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import com.wso2_sample.api_auth_sample.features.home.domain.models.UserDetails
import com.wso2_sample.api_auth_sample.features.home.domain.repository.PetRepository
import com.wso2_sample.api_auth_sample.features.login.domain.repository.AsgardeoAuthRepository
import com.wso2_sample.api_auth_sample.util.navigation.NavigationViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ProfileScreenViewModel @Inject constructor(
    @ApplicationContext private val applicationContext: Context,
    asgardeoAuthRepository: AsgardeoAuthRepository,
    private val petRepository: PetRepository
) : ViewModel() {

    companion object {
        const val TAG = "ProfileScreen"
    }

    private val _state = MutableStateFlow(ProfileScreenState())
    val state = _state

    private val authenticationProvider = asgardeoAuthRepository.getAuthenticationProvider()
    private val tokenProvider = asgardeoAuthRepository.getTokenProvider()

    init {
        getBasicUserInfo()
        getDecodedIdToken()
    }

    fun navigateToHome() {
        viewModelScope.launch {
            NavigationViewModel.navigationEvents.emit(
                NavigationViewModel.Companion.NavigationEvent.NavigateToHome
            )
        }
    }

    private fun getBasicUserInfo() {
        _state.update {
            it.copy(
                isLoading = true
            )
        }
        viewModelScope.launch {
            runCatching {
                authenticationProvider.getBasicUserInfo(applicationContext)
            }.onSuccess { userDetails ->
                _state.update {
                    it.copy(
                        user = UserDetails(
                            username = userDetails?.get("sub").toString(),
                            firstName = userDetails?.get("given_name").toString(),
                            lastName = userDetails?.get("family_name").toString(),
                            email = userDetails?.get("email").toString()
                        ),
                        isLoading = false
                    )
                }
                _state.update {
                    it.copy(
                        isLoading = false
                    )
                }
            }.onFailure { e ->
                _state.update {
                    it.copy(
                        error = e.message!!,
                        isLoading = false
                    )
                }
            }
        }
    }

    private fun getDecodedIdToken() {
        viewModelScope.launch {
            tokenProvider.getDecodedIDToken(applicationContext)
        }
    }

    fun logout() {
        viewModelScope.launch {
            _state.update {
                it.copy(
                    isLoading = true
                )
            }
            try {
                authenticationProvider.logout(applicationContext)
                NavigationViewModel.navigationEvents.emit(
                    NavigationViewModel.Companion.NavigationEvent.NavigateToLanding
                )
            } catch (e: Exception) {
                _state.update {
                    it.copy(
                        error = e.message!!,
                        isLoading = false
                    )
                }
            }
        }
    }
}
