package com.wso2_sample.api_auth_sample.features.login.presentation.screens.auth_screen.components

import android.os.Build
import androidx.annotation.RequiresApi
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import androidx.hilt.navigation.compose.hiltViewModel
import io.asgardeo.android.core.models.autheniticator.Authenticator
import com.wso2_sample.api_auth_sample.R
import com.wso2_sample.api_auth_sample.features.login.presentation.screens.auth_screen.AuthScreenViewModel
import com.wso2_sample.api_auth_sample.features.login.presentation.util.common_component.AuthButton

@RequiresApi(Build.VERSION_CODES.UPSIDE_DOWN_CAKE)
@Composable
internal fun PasskeyAuth(
    viewModel: AuthScreenViewModel = hiltViewModel(),
    authenticator: Authenticator
) {
    PasskeyAuthComponent(
        onSubmit = {
            viewModel.authenticateWithPasskey(authenticator.authenticatorId)
        }
    )
}

@Composable
fun PasskeyAuthComponent(
    onSubmit: () -> Unit
) {
    AuthButton(
        onSubmit = onSubmit,
        label = "Continue with Passkey",
        imageResource = R.drawable.passkey,
        imageContextDescription = "Passkey"
    )
}


@Preview(showBackground = true, backgroundColor = 0xFFFFFFFF)
@Composable
fun PasskeyAuthPreview() {
    PasskeyAuthComponent(onSubmit = {})
}
