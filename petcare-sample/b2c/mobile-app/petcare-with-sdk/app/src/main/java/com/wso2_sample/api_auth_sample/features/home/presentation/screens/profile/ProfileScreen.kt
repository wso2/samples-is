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

package com.wso2_sample.api_auth_sample.features.home.presentation.screens.profile

import android.annotation.SuppressLint
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.wso2_sample.api_auth_sample.R
import com.wso2_sample.api_auth_sample.features.home.domain.models.UserDetails
import com.wso2_sample.api_auth_sample.features.home.presentation.util.TopBar
import com.wso2_sample.api_auth_sample.features.home.presentation.util.profile.NameSection
import com.wso2_sample.api_auth_sample.features.home.presentation.util.profile.ProfileAttribute
import com.wso2_sample.api_auth_sample.features.home.presentation.util.profile.ProfileImage
import com.wso2_sample.api_auth_sample.features.home.presentation.util.profile.SettingsAttribute
import com.wso2_sample.api_auth_sample.ui.theme.Api_authenticator_sdkTheme
import com.wso2_sample.api_auth_sample.util.ui.LoadingDialog

@Composable
internal fun ProfileScreen(
    viewModel: ProfileScreenViewModel = hiltViewModel()
) {
    val state = viewModel.state.collectAsStateWithLifecycle()

    val navigateToHome: () -> Unit = viewModel::navigateToHome

    val logout: () -> Unit = viewModel::logout

    LoadingDialog(isLoading = state.value.isLoading)
    ProfileScreenContent(state.value, navigateToHome, logout)
}

@Composable
@SuppressLint("UnusedMaterial3ScaffoldPaddingParameter")
fun ProfileScreenContent(
    state: ProfileScreenState,
    navigateToHome: () -> Unit = {},
    logout: () -> Unit
) {
    Scaffold(
        modifier = Modifier
            .fillMaxSize(),
        containerColor = MaterialTheme.colorScheme.surface,
        topBar = {
            TopBar(navigateToHome = navigateToHome, navigateToProfile = {})
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .padding(innerPadding)
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
        ) {
            Column(
                modifier = Modifier
                    .padding(start = 32.dp, end = 32.dp, top = 32.dp)
                    .fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                ProfileImage(imageUrl = state.user?.imageUrl ?: "")
                if (state.user?.firstName != null || state.user?.lastName != null) {
                    NameSection(
                        firstName = state.user.firstName,
                        lastName = state.user.lastName
                    )
                }
            }
            Spacer(modifier = Modifier.height(32.dp))
            Column(
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                ProfileAttribute(label = "Username", value = state.user?.username)
                ProfileAttribute(label = "Email", value = state.user?.email)
                ProfileAttribute(label = "First Name", value = state.user?.firstName)
                ProfileAttribute(label = "Last Name", value = state.user?.lastName)
            }
            Spacer(modifier = Modifier.height(32.dp))
            Surface(
                color = MaterialTheme.colorScheme.background,
                modifier = Modifier.fillMaxHeight()
            ) {
                Column(
                    horizontalAlignment = Alignment.Start,
                    verticalArrangement = Arrangement.spacedBy(16.dp),
                    modifier = Modifier
                        .padding(
                            top = 32.dp,
                            start = 32.dp,
                            bottom = 32.dp
                        )
                        .fillMaxSize()

                ) {
                    SettingsAttribute(
                        title = "Dark Mode",
                        iconId = R.drawable.dark_mode,
                        onClick = {}
                    )
                    SettingsAttribute(
                        title = "Cards",
                        iconId = R.drawable.credit_card,
                        onClick = {}
                    )
                    SettingsAttribute(
                        title = "Language",
                        iconId = R.drawable.language,
                        onClick = {}
                    )
                    SettingsAttribute(
                        title = "Data Saver Mode",
                        iconId = R.drawable.data_saver_on,
                        onClick = {}
                    )
                    SettingsAttribute(
                        title = "Help",
                        iconId = R.drawable.help_outline,
                        onClick = {}
                    )
                    SettingsAttribute(
                        title = "Support Inbox",
                        iconId = R.drawable.support_inbox,
                        onClick = {}
                    )
                    SettingsAttribute(
                        title = "Report a Problem",
                        iconId = R.drawable.report,
                        onClick = {}
                    )
                    SettingsAttribute(
                        title = "Contact Us",
                        iconId = R.drawable.call,
                        onClick = {}
                    )
                    SettingsAttribute(
                        title = "Rate Us",
                        iconId = R.drawable.star_rate,
                        onClick = {}
                    )
                    SettingsAttribute(
                        title = "Log Out",
                        iconId = R.drawable.logout,
                        onClick = logout
                    )
                }
            }
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .weight(1f)
                    .background(MaterialTheme.colorScheme.background)
            )
        }
    }
}

@Preview(showBackground = true, backgroundColor = 0xFFFFFFFF)
@Composable
fun HomeScreenPreview() {
    Api_authenticator_sdkTheme {
        ProfileScreenContent(
            ProfileScreenState(
                isLoading = false,
                user = UserDetails(
                    imageUrl = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    username = "johndoe",
                    email = "john@wso2.com",
                    firstName = "John",
                    lastName = "Doe"
                )
            ),
            {},
            {}
        )
    }
}