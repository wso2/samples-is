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

import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import androidx.hilt.navigation.compose.hiltViewModel
import io.asgardeo.android.core.models.autheniticator.Authenticator
import com.wso2_sample.api_auth_sample.R
import com.wso2_sample.api_auth_sample.features.login.presentation.screens.auth_screen.AuthScreenViewModel
import com.wso2_sample.api_auth_sample.features.login.presentation.util.common_component.AuthButton

@Composable
internal fun MicrosoftAuth(
    viewModel: AuthScreenViewModel = hiltViewModel(),
    authenticator: Authenticator
) {
    MicrosoftAuthComponent(
        onSubmit = {
            viewModel.authenticateWithGithub(authenticator.authenticatorId)
        }
    )
}

@Composable
fun MicrosoftAuthComponent(
    onSubmit: () -> Unit
) {
    AuthButton(
        onSubmit = onSubmit,
        label = "Continue with Microsoft",
        imageResource = R.drawable.microsoft,
        imageContextDescription = "Microsoft"
    )
}


@Preview(showBackground = true, backgroundColor = 0xFFFFFFFF)
@Composable
fun MicrosoftAuthPreview() {
    MicrosoftAuthComponent(onSubmit = {})
}
