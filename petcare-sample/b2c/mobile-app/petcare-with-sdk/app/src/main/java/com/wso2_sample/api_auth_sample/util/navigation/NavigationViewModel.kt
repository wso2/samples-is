package com.wso2_sample.api_auth_sample.util.navigation

import androidx.lifecycle.ViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableSharedFlow
import javax.inject.Inject

@HiltViewModel
class NavigationViewModel @Inject constructor() : ViewModel() {
    companion object {
        val navigationEvents = MutableSharedFlow<NavigationEvent>()

        sealed class NavigationEvent {
            data object NavigateBack : NavigationEvent()
            data object NavigateToLanding : NavigationEvent()
            data object NavigateToHome : NavigationEvent()
            data object NavigateToProfile : NavigationEvent()
            data object NavigateToAddPet : NavigationEvent()
            data class NavigateToAuthWithData(val data: String) : NavigationEvent()
        }
    }
}
