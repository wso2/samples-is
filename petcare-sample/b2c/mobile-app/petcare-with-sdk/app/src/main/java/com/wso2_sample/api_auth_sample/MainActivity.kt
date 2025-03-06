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

package com.wso2_sample.api_auth_sample

import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.repeatOnLifecycle
import androidx.navigation.compose.rememberNavController
import dagger.hilt.android.AndroidEntryPoint
import com.wso2_sample.api_auth_sample.ui.theme.Api_authenticator_sdkTheme
import com.wso2_sample.api_auth_sample.util.Event
import com.wso2_sample.api_auth_sample.util.EventBus
import com.wso2_sample.api_auth_sample.util.navigation.NavDestination
import com.wso2_sample.api_auth_sample.util.navigation.NavGraph
import com.wso2_sample.api_auth_sample.util.navigation.NavigationViewModel

@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            Api_authenticator_sdkTheme {
                val lifecycle = LocalLifecycleOwner.current.lifecycle
                val navigationController = rememberNavController()

                LaunchedEffect(key1 = lifecycle) {
                    repeatOnLifecycle(Lifecycle.State.STARTED) {
                        EventBus.events.collect { event ->
                            when (event) {
                                is Event.Toast -> {
                                    // Show toast
                                    Toast.makeText(
                                        this@MainActivity,
                                        event.message,
                                        Toast.LENGTH_SHORT
                                    ).show()
                                }
                            }
                        }
                    }
                }

                LaunchedEffect(Unit) {
                    NavigationViewModel.navigationEvents.collect {
                        when (it) {
                            is NavigationViewModel.Companion.NavigationEvent.NavigateBack -> {
                                navigationController.popBackStack()
                            }

                            is NavigationViewModel.Companion.NavigationEvent.NavigateToLanding -> {
                                navigationController.navigate(NavDestination.LANDING_SCREEN)
                            }

                            is NavigationViewModel.Companion.NavigationEvent.NavigateToAuthWithData -> {
                                navigationController.navigate(
                                    "${NavDestination.AUTH_SCREEN}?authenticationFlow={authenticationFlow}"
                                        .replace(
                                            "{authenticationFlow}",
                                            newValue = it.data
                                        )
                                )
                            }

                            is NavigationViewModel.Companion.NavigationEvent.NavigateToHome -> {
                                navigationController.navigate(NavDestination.HOME_SCREEN)
                            }

                            is NavigationViewModel.Companion.NavigationEvent.NavigateToProfile -> {
                                navigationController.navigate(NavDestination.PROFILE_SCREEN)
                            }

                            is NavigationViewModel.Companion.NavigationEvent.NavigateToAddPet -> {
                                navigationController.navigate(NavDestination.ADD_PET_SCREEN)
                            }
                        }
                    }
                }

                // A surface container using the 'background' color from the theme
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.surface
                ) {
                    NavGraph(navController = navigationController)
                }
            }
        }
    }
}
