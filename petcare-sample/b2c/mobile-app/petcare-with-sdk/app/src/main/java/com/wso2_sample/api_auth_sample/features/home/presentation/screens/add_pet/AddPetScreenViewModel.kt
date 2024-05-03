package com.wso2_sample.api_auth_sample.features.home.presentation.screens.add_pet

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.wso2_sample.api_auth_sample.features.home.domain.repository.PetRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import com.wso2_sample.api_auth_sample.features.login.domain.repository.AsgardeoAuthRepository
import com.wso2_sample.api_auth_sample.util.navigation.NavigationViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class AddPetScreenViewModel @Inject constructor(
    asgardeoAuthRepository: AsgardeoAuthRepository,
    @ApplicationContext private val applicationContext: Context,
    private val petRepository: PetRepository
) : ViewModel() {

    companion object {
        const val TAG = "AddPetScreen"
    }

    private val _state = MutableStateFlow(AddPetScreenState())
    val state = _state

    private val tokenProvider = asgardeoAuthRepository.getTokenProvider()

    fun navigateToHome() {
        viewModelScope.launch {
            NavigationViewModel.navigationEvents.emit(
                NavigationViewModel.Companion.NavigationEvent.NavigateToHome
            )
        }
    }

    fun addPets(
        name: String,
        breed: String,
        dateOfBirth: String
    ) {
        viewModelScope.launch {
            _state.update {
                it.copy(
                    isLoading = true
                )
            }
            tokenProvider.performAction(applicationContext) { accessToken, _ ->
                viewModelScope.launch {
                    runCatching {
                        petRepository.addPet(
                            accessToken = accessToken!!,
                            name = name,
                            breed = breed,
                            dateOfBirth = dateOfBirth
                        )
                    }.onSuccess {
                        _state.update {
                            it.copy(isLoading = false)
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
}
