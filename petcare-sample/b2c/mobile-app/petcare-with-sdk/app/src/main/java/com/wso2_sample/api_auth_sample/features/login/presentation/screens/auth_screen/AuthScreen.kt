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

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.wso2_sample.api_auth_sample.features.login.presentation.screens.auth_screen.components.AuthUI
import com.wso2_sample.api_auth_sample.features.login.presentation.screens.auth_screen.components.BasicAuthComponent
import com.wso2_sample.api_auth_sample.features.login.presentation.screens.auth_screen.components.GetStarted
import com.wso2_sample.api_auth_sample.features.login.presentation.screens.auth_screen.components.GithubAuthComponent
import com.wso2_sample.api_auth_sample.features.login.presentation.screens.auth_screen.components.GoogleNativeAuthComponent
import com.wso2_sample.api_auth_sample.features.login.presentation.util.common_component.ContinueText
import com.wso2_sample.api_auth_sample.util.ui.LoadingDialog
import com.wso2_sample.api_auth_sample.ui.theme.Api_authenticator_sdkTheme
import com.wso2_sample.api_auth_sample.features.login.presentation.screens.auth_screen.components.PasskeyAuthComponent
import io.asgardeo.android.core.models.authentication_flow.AuthenticationFlow

@Composable
internal fun AuthScreen(
    viewModel: AuthScreenViewModel = hiltViewModel(),
    authenticationFlow: AuthenticationFlow
) {
    val state = viewModel.state.collectAsStateWithLifecycle()
    LaunchedEffect(key1 = authenticationFlow) {
        viewModel.setAuthenticationFlow(authenticationFlow)
    }
    LoadingDialog(isLoading = state.value.isLoading)
    AuthScreenContent(state.value)
}

@Composable
fun AuthScreenContent(state: AuthScreenState) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.Top,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier
                .padding(start = 32.dp, end = 32.dp, bottom = 32.dp)
                .offset(y = 32.dp)
        ) {
            GetStarted()
        }
        Surface(
            color = MaterialTheme.colorScheme.background,
            modifier = Modifier.fillMaxHeight()
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier
                    .padding(
                        top = 16.dp,
                        start = 32.dp,
                        end = 32.dp,
                        bottom = 32.dp
                    )
                    .fillMaxSize()
            ) {
                state.authenticationFlow?.let { authenticationFlow ->
                    AuthUI(authenticationFlow)
                }
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

@Preview(showBackground = true, backgroundColor = 0xFFFFFFFF)
@Composable
fun AuthScreenPreview() {
    Api_authenticator_sdkTheme {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.Top,
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Box(
                modifier = Modifier
                    .padding(start = 32.dp, end = 32.dp, bottom = 32.dp)
                    .offset(y = 42.dp)
            ) {
                GetStarted()
            }
            Surface(
                color = MaterialTheme.colorScheme.background,
                modifier = Modifier.fillMaxHeight()
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier
                        .padding(
                            top = 16.dp,
                            start = 32.dp,
                            end = 32.dp,
                            bottom = 32.dp
                        )
                        .fillMaxSize(1f)
                ) {
                    BasicAuthComponent(onLoginClick = { _, _ -> })
                    ContinueText()
                    GoogleNativeAuthComponent {}
                    PasskeyAuthComponent {}
                    GithubAuthComponent {}
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