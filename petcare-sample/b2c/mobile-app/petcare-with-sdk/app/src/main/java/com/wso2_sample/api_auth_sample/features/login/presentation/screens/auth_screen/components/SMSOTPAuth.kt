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
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import io.asgardeo.android.core.models.autheniticator.Authenticator
import com.wso2_sample.api_auth_sample.R
import com.wso2_sample.api_auth_sample.features.login.presentation.screens.auth_screen.AuthScreenViewModel
import com.wso2_sample.api_auth_sample.features.login.presentation.util.common_component.AuthButton

@Composable
internal fun SMSOTPAuth(
    viewModel: AuthScreenViewModel = hiltViewModel(),
    authenticator: Authenticator
) {
    SMSOTPAuthComponent(
        onSubmit = { otpCode ->
            viewModel.authenticateWithSMSOTP(authenticator.authenticatorId, otpCode)
        }
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BottomSheetWithFormForSMSOTP(
    isOpen: Boolean,
    onDismiss: () -> Unit,
    onSubmit: (otpCode: String) -> Unit
) {
    var otpCode by remember { mutableStateOf("") }

    if (isOpen) {
        ModalBottomSheet(
            onDismissRequest = {
                onDismiss()
            }
        ) {
            Column(
                modifier = Modifier
                    .padding(32.dp)
                    .fillMaxWidth(),
                verticalArrangement = Arrangement.Center
            ) {
                Text(
                    text = "Enter SMS OTP",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Medium
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Enter the SMS OTP sent to your mobile number",
                    style = MaterialTheme.typography.labelSmall,
                )
                Spacer(modifier = Modifier.height(24.dp))
                OutlinedTextField(
                    value = otpCode,
                    onValueChange = { otpCode = it },
                    label = { Text(text = "SMS OTP") },
                    shape = MaterialTheme.shapes.medium,
                    colors = OutlinedTextFieldDefaults.colors(
                        unfocusedContainerColor = MaterialTheme.colorScheme.background,
                        focusedContainerColor = MaterialTheme.colorScheme.background,
                        focusedBorderColor = MaterialTheme.colorScheme.primary,
                        unfocusedBorderColor = MaterialTheme.colorScheme.tertiaryContainer,
                        unfocusedLabelColor = MaterialTheme.colorScheme.tertiaryContainer,
                        focusedLabelColor = MaterialTheme.colorScheme.tertiaryContainer
                    ),
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(16.dp))
                Button(
                    onClick = {
                        onSubmit(otpCode)
                        onDismiss()
                    },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = "Submit",
                        color = MaterialTheme.colorScheme.surface
                    )
                }
            }
        }
    }
}

@Composable
fun SMSOTPAuthComponent(
    onSubmit: (SMSOTP: String) -> Unit
) {
    var bottomSheetOpen by remember { mutableStateOf(false) }

    AuthButton(
        onSubmit = { bottomSheetOpen = true },
        label = "Continue with SMS OTP",
        imageResource = R.drawable.sms_otp,
        imageContextDescription = "SMS OTP"
    )

    BottomSheetWithForm(
        isOpen = bottomSheetOpen,
        onDismiss = { bottomSheetOpen = false },
        onSubmit = onSubmit
    )
}

@Preview(showBackground = true, backgroundColor = 0xFFFFFFFF)
@Composable
fun SMSOTPAuthPreview() {
    SMSOTPAuthComponent(onSubmit = {})
}
