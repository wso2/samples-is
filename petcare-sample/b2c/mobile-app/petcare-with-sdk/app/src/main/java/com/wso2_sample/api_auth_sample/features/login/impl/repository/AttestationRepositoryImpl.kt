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

package com.wso2_sample.api_auth_sample.features.login.impl.repository

import android.content.ContentValues
import android.content.Context
import android.util.Base64
import android.util.Log
import com.google.android.gms.tasks.Task
import com.google.android.play.core.integrity.IntegrityManagerFactory
import com.google.android.play.core.integrity.IntegrityTokenRequest
import com.google.android.play.core.integrity.IntegrityTokenResponse
import com.wso2_sample.api_auth_sample.features.login.domain.repository.AttestationRepository
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.CompletableDeferred
import javax.inject.Inject
import kotlin.math.floor

class AttestationRepositoryImpl @Inject constructor(
    @ApplicationContext private val applicationContext: Context
): AttestationRepository {
    private var playIntegrityTokenResponse: String? = null
    private val initializationDeferred = CompletableDeferred<Unit>()

    init {
        setPlayIntegrityTokenResponse(applicationContext)
    }

    private fun setPlayIntegrityTokenResponse(context: Context) {
        getPlayIntegrityTokenResponse(context) {
            playIntegrityTokenResponse = it
            initializationDeferred.complete(Unit)
        }
    }

    private fun getPlayIntegrityTokenResponse(
        context: Context,
        callback: (String?) -> Unit
    ) {
        var playIntegrityTokenResponse: String? = null

        try {
            val nonce: String = generateNonce()

            // Create an instance of a manager.
            val integrityManager = IntegrityManagerFactory.create(context)

            // Request the integrity token by providing a nonce.
            val integrityTokenResponse: Task<IntegrityTokenResponse> =
                integrityManager.requestIntegrityToken(
                    IntegrityTokenRequest.builder()
                        .setNonce(nonce)
                        .build()
                )

            integrityTokenResponse.addOnSuccessListener {
                playIntegrityTokenResponse = it.token()
                callback(playIntegrityTokenResponse)
            }.addOnFailureListener {
                Log.d(ContentValues.TAG, "API Error, see Android UI for error message")
                callback(null)
            }
        } catch (e: Exception) {
            Log.e(
                "AttestationCallPlayIntegrity",
                "Error in playIntegrityRequest: ${e.message}"
            )

            callback(null)
        }
    }

    /**
     * Generates a nonce locally
     */
    private fun generateNonce(): String = getNonceLocal()

    private fun String.encode(): String =
        Base64.encodeToString(
            this.toByteArray(charset("UTF-8")),
            Base64.URL_SAFE
        )

    /**
     * generates a nonce locally
     */
    private fun getNonceLocal(): String {
        var nonce = ""
        val allowed = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        for (i in 0 until 50) {
            nonce += allowed[floor(Math.random() * allowed.length).toInt()].toString()
        }
        return nonce.encode()
    }

    override suspend fun getPlayIntegrityTokenResponse(): String? {
        initializationDeferred.await()
        return playIntegrityTokenResponse
    }
}