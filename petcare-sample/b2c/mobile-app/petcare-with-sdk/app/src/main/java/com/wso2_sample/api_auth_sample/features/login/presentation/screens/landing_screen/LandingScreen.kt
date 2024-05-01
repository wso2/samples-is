package com.wso2_sample.api_auth_sample.features.login.presentation.screens.landing_screen

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.AssistChipDefaults
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.wso2_sample.api_auth_sample.R
import com.wso2_sample.api_auth_sample.features.login.presentation.util.common_component.FooterImage
import com.wso2_sample.api_auth_sample.features.login.presentation.util.common_component.LandingPageLogo
import com.wso2_sample.api_auth_sample.util.ui.LoadingDialog
import com.wso2_sample.api_auth_sample.ui.theme.Api_authenticator_sdkTheme

@Composable
internal fun LandingScreen(
    viewModel: LandingScreenViewModel = hiltViewModel()
) {
    val state = viewModel.state.collectAsStateWithLifecycle()
    LandingScreenContent(state.value, loginOnClick = viewModel::initializeAuthentication)
}


@Composable
fun LandingScreenContent(
    state: LandingScreenState,
    loginOnClick: () -> Unit
) {
    Column(modifier = Modifier.fillMaxSize()) {
        LoadingDialog(state.isLoading)
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(top = 96.dp),
            verticalArrangement = Arrangement.SpaceBetween,
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(-8.dp)
            ) {
                LandingPageLogo()
                Text(
                    text = "Helping you to take " + "\n good care  of your pets",
                    textAlign = TextAlign.Center,
                    style = MaterialTheme.typography.labelMedium
                )
            }
            LoginButton(Modifier, loginOnClick)
            FooterImage()
        }
    }
}

@Composable
private fun LoginButton(modifier: Modifier = Modifier, onClcik: () -> Unit) {
    Button(
        modifier = modifier,
        onClick = onClcik
    ) {
        Image(
            painter = painterResource(id = R.drawable.small_white_logo),
            contentDescription = "Logo",
            modifier = Modifier
                .size(AssistChipDefaults.IconSize)
        )
        Spacer(modifier = Modifier.size(ButtonDefaults.IconSpacing))
        Text(
            text = "Getting Started",
            color = MaterialTheme.colorScheme.surface,
        )
    }
}

@Preview(showBackground = true, backgroundColor = 0xFFFFFFFF)
@Composable
fun LandingScreenPreview() {
    Api_authenticator_sdkTheme {
        LandingScreenContent(
            LandingScreenState(
                isLoading = false
            ),
            loginOnClick = {}
        )
    }
}
