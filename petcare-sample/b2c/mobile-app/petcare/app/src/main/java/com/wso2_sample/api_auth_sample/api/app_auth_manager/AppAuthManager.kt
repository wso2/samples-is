package com.wso2_sample.api_auth_sample.api.app_auth_manager

import android.content.Context
import android.net.Uri
import android.util.Log
import com.wso2_sample.api_auth_sample.api.cutom_trust_client.CustomTrust
import com.wso2_sample.api_auth_sample.api.cutom_trust_client.CustomTrustHttpURLConnection
import com.wso2_sample.api_auth_sample.model.api.app_auth_manager.TokenRequestCallback
import com.wso2_sample.api_auth_sample.util.config.OauthClientConfiguration
import net.openid.appauth.AppAuthConfiguration
import net.openid.appauth.AuthorizationService
import net.openid.appauth.AuthorizationServiceConfiguration
import net.openid.appauth.TokenRequest
import okhttp3.OkHttpClient
import javax.net.ssl.X509TrustManager

class AppAuthManager(private val context: Context) {

    private val clientId: String = OauthClientConfiguration.getInstance(context).clientId
    private val redirectUri: Uri = OauthClientConfiguration.getInstance(context).redirectUri
    private val tokenEndpoint: Uri = OauthClientConfiguration.getInstance(context).tokenUri
    private val authorizeEndpoint: Uri = OauthClientConfiguration.getInstance(context).authorizeUri
    private val serviceConfig: AuthorizationServiceConfiguration =
        AuthorizationServiceConfiguration(
            Uri.parse(authorizeEndpoint.toString()),  // Authorization endpoint
            Uri.parse(tokenEndpoint.toString()) // Token endpoint
        )

    companion object {
        private const val TAG =
            "com.wso2_sample.api_auth_sample.api.app_auth_manager.AppAuthManager"
    }

    private val customTrustClient: OkHttpClient = CustomTrust.getInstance().client

    fun exchangeAuthorizationCodeForAccessToken(
        authorizationCode: String,
        callback: TokenRequestCallback
    ) {
        val tokenRequest: TokenRequest = TokenRequest.Builder(
            serviceConfig,
            clientId
        )
            .setAuthorizationCode(authorizationCode)
            .setClientId(clientId)
            .setRedirectUri(redirectUri)
            .build()
        val authService = AuthorizationService(
            context,
            AppAuthConfiguration.Builder()
                .setConnectionBuilder { url ->
                    CustomTrustHttpURLConnection(
                        url,
                        customTrustClient.x509TrustManager as X509TrustManager,
                        customTrustClient.sslSocketFactory
                    ).getConnection()
                }
                .build()
        )

        try {
            authService.performTokenRequest(tokenRequest) { response, ex ->
                if (response != null) {
                    // Access token obtained successfully
                    val accessToken: String = response.accessToken!!
                    Log.d(TAG, "Access Token: $accessToken")
                    // Invoke the callback with the access token
                    callback.onSuccess(accessToken)
                } else {
                    // Token request failed
                    Log.e(TAG, "Token request failed: $ex")
                    // Invoke the callback with the error
                    callback.onFailure(ex ?: RuntimeException("Token request failed"))
                }
            }
        } catch (ex: Exception) {
            Log.e(TAG, "Token request failed: $ex")
            // Invoke the callback with the error
            callback.onFailure(ex)
        } finally {
            authService.dispose()
        }
    }
}