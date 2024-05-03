package com.wso2_sample.api_auth_sample.features.home.presentation.screens.home

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.wso2_sample.api_auth_sample.features.home.domain.repository.PetRepository
import com.wso2_sample.api_auth_sample.features.login.domain.repository.AsgardeoAuthRepository
import com.wso2_sample.api_auth_sample.util.navigation.NavigationViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
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

    private val authenticationProvider = asgardeoAuthRepository.getAuthenticationProvider()
    private val tokenProvider = asgardeoAuthRepository.getTokenProvider()

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
                            it.copy(pets = pets!!)
                        }
                    }.onFailure { e ->
                        _state.update {
                            it.copy(error = e.message!!)
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
