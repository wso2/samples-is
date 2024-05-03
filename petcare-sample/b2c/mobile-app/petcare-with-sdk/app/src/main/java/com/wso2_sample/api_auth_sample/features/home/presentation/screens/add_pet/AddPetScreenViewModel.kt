package com.wso2_sample.api_auth_sample.features.home.presentation.screens.add_pet

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import com.wso2_sample.api_auth_sample.features.login.domain.repository.AsgardeoAuthRepository
import com.wso2_sample.api_auth_sample.util.navigation.NavigationViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class AddPetScreenViewModel @Inject constructor(
    asgardeoAuthRepository: AsgardeoAuthRepository,
    @ApplicationContext private val applicationContext: Context,
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
}
