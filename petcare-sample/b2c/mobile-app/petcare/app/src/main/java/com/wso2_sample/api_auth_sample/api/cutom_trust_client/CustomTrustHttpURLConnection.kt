package com.wso2_sample.api_auth_sample.api.cutom_trust_client

import android.net.Uri
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL
import java.security.KeyManagementException
import java.security.NoSuchAlgorithmException
import javax.net.ssl.HostnameVerifier
import javax.net.ssl.HttpsURLConnection
import javax.net.ssl.SSLContext
import javax.net.ssl.SSLSocketFactory
import javax.net.ssl.TrustManager
import javax.net.ssl.X509TrustManager

/**
 * Use to create the com.wso2_sample.api_auth_sample.api.cutom_trust_client.CustomTrustHttpURLConnection for the token call from `appauth-android`
 */
open class CustomTrustHttpURLConnection(
    uri: Uri,
    trustManager: X509TrustManager,
    sslSocketFactory: SSLSocketFactory
) {

    private val connection: HttpURLConnection

    init {
        val url = URL(uri.toString())
        if (url.protocol != "https") {
            throw IllegalArgumentException("Only HTTPS connections are supported")
        }

        try {
            val httpsURLConnection = url.openConnection() as HttpsURLConnection
            httpsURLConnection.sslSocketFactory = sslSocketFactory
            httpsURLConnection.hostnameVerifier = HostnameVerifier { _, _ -> true }

            val trustManagers = arrayOf<TrustManager>(trustManager)
            val sslContext = SSLContext.getInstance("TLS")
            sslContext.init(null, trustManagers, null)

            httpsURLConnection.sslSocketFactory = sslContext.socketFactory

            this.connection = httpsURLConnection
        } catch (e: NoSuchAlgorithmException) {
            throw RuntimeException("Failed to initialize SSL context", e)
        } catch (e: KeyManagementException) {
            throw RuntimeException("Failed to initialize SSL context", e)
        } catch (e: IOException) {
            throw RuntimeException("Failed to open connection", e)
        }
    }

    fun getConnection(): HttpURLConnection {
        return this.connection
    }
}