package com.wso2_sample.api_auth_sample.controller.ui.activities.fragments.auth.auth_method

import com.wso2_sample.api_auth_sample.util.Util
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.toRequestBody

/**
 * Controller class related to the Google Authenticator.
 */
class GoogleAuthenticatorController {
    companion object {
        /**
         * Build request body to get the access token from google
         */
        fun buildRequestBodyToGetAccessTokenFromGoogle(
            authCode: String,
            googleWebClientId: String,
            googleWebClientSecret: String,
            redirectUri: String
        ): RequestBody {

            val authBody = LinkedHashMap<String, Any>()
            authBody["code"] = authCode
            authBody["client_id"] = googleWebClientId
            authBody["client_secret"] = googleWebClientSecret
            authBody["redirect_uri"] = redirectUri
            authBody["grant_type"] = "authorization_code"

            return Util.getJsonObject(authBody).toString()
                .toRequestBody("application/json".toMediaTypeOrNull())
        }
    }
}
