package com.wso2_sample.api_auth_sample.features.login.presentation.screens.auth_screen.components

import android.content.Intent
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import androidx.hilt.navigation.compose.hiltViewModel
import io.asgardeo.android.core.models.autheniticator.Authenticator
import com.wso2_sample.api_auth_sample.R
import com.wso2_sample.api_auth_sample.features.login.presentation.screens.auth_screen.AuthScreenViewModel
import com.wso2_sample.api_auth_sample.features.login.presentation.util.common_component.AuthButton

//@RequiresApi(Build.VERSION_CODES.UPSIDE_DOWN_CAKE)
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
            //viewModel.authenticateWithGoogle(authenticatorType.authenticatorId)
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
