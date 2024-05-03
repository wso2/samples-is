package com.wso2_sample.api_auth_sample.features.home.impl.less_secure_client

import okhttp3.OkHttpClient
import okhttp3.Protocol
import java.lang.ref.WeakReference
import java.security.GeneralSecurityException
import java.util.concurrent.TimeUnit
import javax.net.ssl.SSLContext
import javax.net.ssl.SSLSocketFactory
import javax.net.ssl.TrustManager
import javax.net.ssl.X509TrustManager

/**
 * Use to create the [LessSecureHttpClient] for API calls in the SDK.
 */
internal class LessSecureHttpClient private constructor() {
    private val client: OkHttpClient

    companion object {
        private var lessSecureHttpClientInstance = WeakReference<LessSecureHttpClient?>(null)

        /**
         * Returns an instance of the [LessSecureHttpClient] class.
         *
         * @return [LessSecureHttpClient] instance.
         */
        internal fun getInstance(): LessSecureHttpClient {
            var lessSecureHttpClient = lessSecureHttpClientInstance.get()
            if (lessSecureHttpClient == null) {
                lessSecureHttpClient = LessSecureHttpClient()
                lessSecureHttpClientInstance = WeakReference(lessSecureHttpClient)
            }
            return lessSecureHttpClient
        }
    }

    init {
        val trustManager: X509TrustManager
        val sslSocketFactory: SSLSocketFactory
        try {
            // Use a custom X509TrustManager that accepts all certificates
            trustManager = trustAllTrustManager()

            val sslContext = SSLContext.getInstance("TLS")
            sslContext.init(null, arrayOf<TrustManager>(trustManager), null)
            sslSocketFactory = sslContext.socketFactory
        } catch (e: GeneralSecurityException) {
            throw RuntimeException(e)
        }
        client = OkHttpClient.Builder()
            .sslSocketFactory(sslSocketFactory, trustManager)
            .hostnameVerifier { _, _ -> true } // Bypass hostname verification
            .connectTimeout(45, TimeUnit.SECONDS)
            .readTimeout(45, TimeUnit.SECONDS)
            .protocols(listOf(Protocol.HTTP_1_1))
            .build()
    }

    private fun trustAllTrustManager(): X509TrustManager {
        return object : X509TrustManager {
            override fun checkClientTrusted(
                chain: Array<out java.security.cert.X509Certificate>?,
                authType: String?
            ) {
                // Do nothing, trust all clients
            }

            override fun checkServerTrusted(
                chain: Array<out java.security.cert.X509Certificate>?,
                authType: String?
            ) {
                // Do nothing, trust all servers
            }

            override fun getAcceptedIssuers(): Array<java.security.cert.X509Certificate> {
                return emptyArray()
            }
        }
    }

    /**
     * Returns the [OkHttpClient] instance.
     *
     * @return [OkHttpClient] instance.
     */
    fun getClient(): OkHttpClient {
        return client
    }
}