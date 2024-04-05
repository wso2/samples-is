package com.wso2_sample.api_auth_sample.api.oauth_client

import android.content.Context
import com.fasterxml.jackson.databind.JsonNode
import com.wso2_sample.api_auth_sample.api.cutom_trust_client.CustomTrust
import com.wso2_sample.api_auth_sample.controller.ui.activities.fragments.auth.auth_method.GoogleAuthenticatorController
import com.wso2_sample.api_auth_sample.util.Util
import com.wso2_sample.api_auth_sample.util.config.OauthClientConfiguration
import okhttp3.Call
import okhttp3.Callback
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import java.io.IOException

/**
 * API class to handle Google Authenticator related operations
 */
class GoogleAuthenticatorAPI {
    companion object {

        private val client: OkHttpClient = CustomTrust.getInstance().client

        /**
         * Get the google access token
         */
        fun getGoogleAccessToken(
            context: Context,
            authCode: String,
            onSuccessCallback: (accessToken: String, idToken: String) -> Unit,
            onFailureCallback: () -> Unit
        ) {

            val googleWebClientId: String =
                OauthClientConfiguration.getInstance(context).googleWebClientId
            val googleWebClientSecret: String =
                OauthClientConfiguration.getInstance(context).googleWebClientSecret
            val redirectUri: String =
                OauthClientConfiguration.getInstance(context).googleWebClientRedirectUri.toString()

            val url: String =
                OauthClientConfiguration.getInstance(context).googleTokenUri.toString()

            val request: Request = Request.Builder().url(url).post(
                GoogleAuthenticatorController.buildRequestBodyToGetAccessTokenFromGoogle(
                    authCode,
                    googleWebClientId,
                    googleWebClientSecret,
                    redirectUri
                )
            ).build()

            client.newCall(request).enqueue(object : Callback {
                override fun onFailure(call: Call, e: IOException) {
                    onFailureCallback()
                }

                @Throws(IOException::class)
                override fun onResponse(call: Call, response: Response) {
                    try {
                        if (response.code == 200) {
                            // reading the json
                            val model: JsonNode = Util.getJsonObject(response.body!!.string())
                            val accessToken: String = model["access_token"].asText()
                            val idToken: String = model["id_token"].asText()

                            onSuccessCallback(accessToken, idToken)
                        } else {
                            onFailureCallback()
                        }
                    } catch (e: IOException) {
                        onFailureCallback()
                    }
                }
            })
        }
    }
}
