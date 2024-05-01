package com.wso2_sample.api_auth_sample.features.login.presentation.screens.auth_screen.components

import androidx.compose.runtime.Composable
import com.wso2_sample.api_auth_sample.features.login.presentation.util.common_component.ContinueText
import io.asgardeo.android.core.models.autheniticator.Authenticator
import io.asgardeo.android.core.models.autheniticator.AuthenticatorTypes
import io.asgardeo.android.core.models.authentication_flow.AuthenticationFlowNotSuccess

@Composable
internal fun AuthUI(authenticationFlow: AuthenticationFlowNotSuccess) {

    val authenticators: ArrayList<Authenticator> = authenticationFlow.nextStep.authenticators

    // show basic auth screen if basic auth is available
    authenticators.forEach {
        when (it.authenticator) {
            AuthenticatorTypes.BASIC_AUTHENTICATOR.authenticatorType -> {
                BasicAuth(authenticator = it)
                if (authenticators.size > 1) {
                    ContinueText()
                }
            }
        }
    }

    authenticators.forEach {
        when (it.authenticator) {
            AuthenticatorTypes.GOOGLE_AUTHENTICATOR.authenticatorType -> {
                GoogleNativeAuth(authenticator = it)
            }

            AuthenticatorTypes.OPENID_CONNECT_AUTHENTICATOR.authenticatorType -> {
                OpenIdRedirectAuth(authenticator = it)
            }

            AuthenticatorTypes.GITHUB_REDIRECT_AUTHENTICATOR.authenticatorType -> {
                GithubAuth(authenticator = it)
            }

            AuthenticatorTypes.MICROSOFT_REDIRECT_AUTHENTICATOR.authenticatorType -> {
                MicrosoftAuth(authenticator = it)
            }

            AuthenticatorTypes.PASSKEY_AUTHENTICATOR.authenticatorType -> {
                PasskeyAuth(authenticator = it)
            }

            AuthenticatorTypes.TOTP_AUTHENTICATOR.authenticatorType -> {
                TotpAuth(authenticator = it)
            }

            AuthenticatorTypes.EMAIL_OTP_AUTHENTICATOR.authenticatorType -> {
                EmailOTPAuth(authenticator = it)
            }

            AuthenticatorTypes.SMS_OTP_AUTHENTICATOR.authenticatorType -> {
                SMSOTPAuth(authenticator = it)
            }

            else -> {}
        }
    }
}
