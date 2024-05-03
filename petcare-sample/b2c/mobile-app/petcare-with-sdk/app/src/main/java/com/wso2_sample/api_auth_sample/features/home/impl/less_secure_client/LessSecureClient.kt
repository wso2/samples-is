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