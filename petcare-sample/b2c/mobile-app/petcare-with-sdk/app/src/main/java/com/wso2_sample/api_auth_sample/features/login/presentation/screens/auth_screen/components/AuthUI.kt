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
