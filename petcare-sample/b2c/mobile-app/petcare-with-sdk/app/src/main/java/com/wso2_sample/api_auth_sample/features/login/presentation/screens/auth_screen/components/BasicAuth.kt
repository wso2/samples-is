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

package com.wso2_sample.api_auth_sample.features.login.presentation.screens.auth_screen.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.wso2_sample.api_auth_sample.features.login.presentation.screens.auth_screen.AuthScreenViewModel
import com.wso2_sample.api_auth_sample.ui.theme.Api_authenticator_sdkTheme
import io.asgardeo.android.core.models.autheniticator.Authenticator

@Composable
internal fun BasicAuth(
    viewModel: AuthScreenViewModel = hiltViewModel(),
    authenticator: Authenticator
) {
    val state = viewModel.state.collectAsStateWithLifecycle()

    LaunchedEffect(key1 = authenticator.authenticatorId) {
        viewModel.selectAuthenticator(authenticator)
    }
    BasicAuthComponent(
        onLoginClick = { username, password ->
            viewModel.authenticate(
                state.value.detailedAuthenticator,
                LinkedHashMap(
                    mapOf(
                        "username" to username,
                        "password" to password
                    )
                )
            )
        }
    )
}

@Composable
fun BasicAuthComponent(
    onLoginClick: (username: String, password: String) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 16.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        var username by remember { mutableStateOf("") }
        var password by remember { mutableStateOf("") }

        OutlinedTextField(
            value = username,
            onValueChange = { username = it },
            label = { Text(text = "Username") },
            modifier = Modifier.fillMaxWidth(),
            shape = MaterialTheme.shapes.medium,
            colors = OutlinedTextFieldDefaults.colors(
                unfocusedContainerColor = MaterialTheme.colorScheme.background,
                focusedContainerColor = MaterialTheme.colorScheme.background,
                focusedBorderColor = MaterialTheme.colorScheme.primary,
                unfocusedBorderColor = MaterialTheme.colorScheme.tertiaryContainer,
                unfocusedLabelColor = MaterialTheme.colorScheme.tertiaryContainer,
                focusedLabelColor = MaterialTheme.colorScheme.tertiaryContainer
            )

        )
        Spacer(
            modifier = Modifier.height(4.dp),
        )
        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text(text = "Password") },
            modifier = Modifier.fillMaxWidth(),
            visualTransformation = PasswordVisualTransformation(),
            shape = MaterialTheme.shapes.medium,
            colors = OutlinedTextFieldDefaults.colors(
                unfocusedContainerColor = MaterialTheme.colorScheme.background,
                focusedContainerColor = MaterialTheme.colorScheme.background,
                focusedBorderColor = MaterialTheme.colorScheme.primary,
                unfocusedBorderColor = MaterialTheme.colorScheme.tertiaryContainer,
                unfocusedLabelColor = MaterialTheme.colorScheme.tertiaryContainer,
                focusedLabelColor = MaterialTheme.colorScheme.tertiaryContainer
            )
        )

        Spacer(modifier = Modifier.height(16.dp))
        Button(
            onClick = { onLoginClick(username, password) },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(
                text = "Sign In",
                color = MaterialTheme.colorScheme.surface
            )
        }
    }
}

@Preview(showBackground = true, backgroundColor = 0xFFFFFFFF)
@Composable
fun BasicAuthPreview() {
    Api_authenticator_sdkTheme {
        BasicAuthComponent(
            onLoginClick = { _, _ -> }
        )
    }
}
