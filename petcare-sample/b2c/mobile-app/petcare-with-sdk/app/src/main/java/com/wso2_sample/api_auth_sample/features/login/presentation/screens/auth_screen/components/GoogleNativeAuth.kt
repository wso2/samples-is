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

import android.content.Intent
import android.os.Build
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.annotation.RequiresApi
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import androidx.hilt.navigation.compose.hiltViewModel
import io.asgardeo.android.core.models.autheniticator.Authenticator
import com.wso2_sample.api_auth_sample.R
import com.wso2_sample.api_auth_sample.features.login.presentation.screens.auth_screen.AuthScreenViewModel
import com.wso2_sample.api_auth_sample.features.login.presentation.util.common_component.AuthButton

//@RequiresApi(Build.VERSION_CODES.UPSIDE_DOWN_CAKE)
@RequiresApi(Build.VERSION_CODES.UPSIDE_DOWN_CAKE)
@Composable
internal fun GoogleNativeAuth(
    viewModel: AuthScreenViewModel = hiltViewModel(),
    authenticator: Authenticator
) {
    val launcher: ActivityResultLauncher<Intent> = rememberLauncherForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        viewModel.handleGoogleNativeLegacyAuthenticateResult(result)
    }

    GoogleNativeAuthComponent(
        onSubmit = {
            viewModel.authenticateWithGoogleNativeLegacy(
                authenticator.authenticatorId,
                launcher
            )

            // Using the Google Credential Manager API
            //viewModel.authenticateWithGoogleNative(authenticator.authenticatorId)
        }
    )
}

@Composable
fun GoogleNativeAuthComponent(
    onSubmit: () -> Unit
) {
    AuthButton(
        onSubmit = onSubmit,
        label = "Continue with Google",
        imageResource = R.drawable.google,
        imageContextDescription = "Google"
    )
}


@Preview(showBackground = true, backgroundColor = 0xFFFFFFFF)
@Composable
fun GoogleNativeAuthPreview() {
    GoogleNativeAuthComponent(onSubmit = {})
}
