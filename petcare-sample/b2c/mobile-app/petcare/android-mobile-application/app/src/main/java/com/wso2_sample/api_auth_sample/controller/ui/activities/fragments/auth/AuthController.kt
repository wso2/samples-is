package com.wso2_sample.api_auth_sample.controller.ui.activities.fragments.auth

import android.util.Log
import android.view.View
import androidx.credentials.GetCredentialResponse
import androidx.credentials.PublicKeyCredential
import com.wso2_sample.api_auth_sample.controller.ui.activities.fragments.auth.data.authenticator.Authenticator
import com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.basic_auth.authenticator.BasicAuthAuthenticator
import com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.google.authenticator.GoogleAuthenticator
import com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.passkey.authenticator.PasskeyAuthenticator
import com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.totp.authenticator.TotpAuthenticator
import com.wso2_sample.api_auth_sample.util.Constants
import com.wso2_sample.api_auth_sample.util.Util
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.toRequestBody

/**
 * AuthController class
 */
class AuthController {
    companion object {

        /**
         * Check if authenticator is available in the authenticators list
         */
        fun isAuthenticatorAvailable(
            authenticators: ArrayList<Authenticator>,
            authenticatorType: String
        ): Authenticator? {
            return authenticators.find {
                it.authenticator == authenticatorType
            }
        }

        /**
         * Get number of authenticators in the authenticators list
         */
        fun numberOfAuthenticators(
            authenticators: ArrayList<Authenticator>,
        ): Int {
            return authenticators.size;
        }

        /**
         * Show authenticator layouts
         */
        fun showAuthenticatorLayouts(
            authenticators: ArrayList<Authenticator>, basicAuthView: View?, fidoAuthView: View?,
            totpAuthView: View?, googleIdpView: View?
        ) {
            authenticators.forEach {
                showAuthenticator(it, basicAuthView, fidoAuthView, totpAuthView, googleIdpView);
            }
        }

        /**
         * Show authenticator layouts
         */
        private fun showAuthenticator(
            authenticator: Authenticator, basicAuthView: View?, passkeyAuthView: View?,
            totpAuthView: View?, googleIdpView: View?
        ) {
            when (authenticator.authenticator) {
                BasicAuthAuthenticator.AUTHENTICATOR_TYPE -> basicAuthView!!.visibility =
                    View.VISIBLE;

                PasskeyAuthenticator.AUTHENTICATOR_TYPE -> passkeyAuthView!!.visibility =
                    View.VISIBLE;

                TotpAuthenticator.AUTHENTICATOR_TYPE -> totpAuthView!!.visibility = View.VISIBLE;

                GoogleAuthenticator.AUTHENTICATOR_TYPE -> googleIdpView!!.visibility = View.VISIBLE
            }
        }

        /**
         * Get param body for basic auth
         */
        private fun getParamBodyForBasicAuth(
            username: String,
            password: String
        ): LinkedHashMap<String, String> {
            val paramBody = LinkedHashMap<String, String>();
            paramBody["username"] = username;
            paramBody["password"] = password;

            return paramBody;
        }

        /**
         * Get param body for google
         */
        private fun getParamBodyForGoogle(
            accessToken: String,
            idToken: String
        ): LinkedHashMap<String, String> {
            val paramBody = LinkedHashMap<String, String>();
            paramBody["idToken"] = idToken;
            paramBody["accessToken"] = accessToken;

            return paramBody;
        }

        /**
         * Get param body for fido
         */
        private fun getParamBodyForFido(tokenResponse: String): LinkedHashMap<String, String> {
            val paramBody = LinkedHashMap<String, String>();
            paramBody["tokenResponse"] = tokenResponse

            return paramBody;
        }

        /**
         * Get param body for totp
         */
        private fun getParamBodyForTotp(otp: String): LinkedHashMap<String, String> {
            val paramBody = LinkedHashMap<String, String>();
            paramBody["token"] = otp

            return paramBody;
        }

        /**
         * Build request body for authenticator
         */
        fun buildRequestBodyForAuthenticator(
            flowId: String?,
            authenticator: Authenticator
        ): RequestBody {

            val authBody = LinkedHashMap<String, Any>();
            authBody["flowId"] = flowId!!;

            val selectedAuthenticator = LinkedHashMap<String, Any>();
            selectedAuthenticator["authenticatorId"] = authenticator.authenticatorId

            authBody["selectedAuthenticator"] = selectedAuthenticator;

            return Util.getJsonObject(authBody).toString()
                .toRequestBody("application/json".toMediaTypeOrNull())
        }

        /**
         * Build request body for auth
         */
        fun buildRequestBodyForAuth(
            flowId: String?,
            authenticator: Authenticator,
            authParams: AuthParams
        ): RequestBody {

            val authBody = LinkedHashMap<String, Any>();
            authBody["flowId"] = flowId!!;

            val selectedAuthenticator = LinkedHashMap<String, Any>();
            selectedAuthenticator["authenticatorId"] = authenticator.authenticatorId;
            when (authenticator.authenticator) {
                BasicAuthAuthenticator.AUTHENTICATOR_TYPE -> {
                    selectedAuthenticator["params"] =
                        getParamBodyForBasicAuth(authParams.username!!, authParams.password!!)
                }

                GoogleAuthenticator.AUTHENTICATOR_TYPE -> selectedAuthenticator["params"] =
                    getParamBodyForGoogle(authParams.accessToken!!, authParams.idToken!!)

                TotpAuthenticator.AUTHENTICATOR_TYPE -> selectedAuthenticator["params"] =
                    getParamBodyForTotp(authParams.totp!!)

                PasskeyAuthenticator.AUTHENTICATOR_TYPE -> selectedAuthenticator["params"] =
                    getParamBodyForFido(authParams.tokenResponse!!)
            }

            authBody["selectedAuthenticator"] = selectedAuthenticator

            Log.i("AuthController", "authBody: $authBody")

            return Util.getJsonObject(authBody).toString()
                .toRequestBody("application/json".toMediaTypeOrNull())
        }
    }
}