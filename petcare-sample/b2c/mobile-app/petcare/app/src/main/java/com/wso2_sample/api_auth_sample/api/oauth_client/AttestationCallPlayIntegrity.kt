package com.wso2_sample.api_auth_sample.api.oauth_client

import android.content.ContentValues
import android.content.Context
import android.util.Base64
import android.util.Log
import com.wso2_sample.api_auth_sample.model.api.oauth_client.AttestationCallback
import com.google.android.gms.tasks.Task
import com.google.android.play.core.integrity.IntegrityManagerFactory
import com.google.android.play.core.integrity.IntegrityTokenRequest
import com.google.android.play.core.integrity.IntegrityTokenResponse
import kotlin.math.floor

class AttestationCallPlayIntegrity {

    companion object {

        fun playIntegrityRequest(
            context: Context,
            authorizeCallback: AttestationCallback,
        ) {
            // Generate nonce
            val nonce: String = try {
                generateNonce()
            } catch (e: Exception) {
                authorizeCallback.onFailure(e)
                return
            }

            // Create an instance of a manager.
            val integrityManager = IntegrityManagerFactory.create(context)

            // Request the integrity token by providing a nonce.
            val integrityTokenResponse: Task<IntegrityTokenResponse> =
                integrityManager.requestIntegrityToken(
                    IntegrityTokenRequest.builder()
                        .setNonce(nonce)
                        .build()
                )

            // do play integrity api call
            integrityTokenResponse.addOnSuccessListener { response ->
                val integrityToken = response.token()
                authorizeCallback.onSuccess(integrityToken)
            }.addOnFailureListener { e ->
                Log.d(ContentValues.TAG, "API Error, see Android UI for error message")
                authorizeCallback.onFailure(e)
            }
        }

        /**
         * Generates a nonce locally
         */
        private fun generateNonce(): String {
            return getNonceLocal(50)
        }

        private fun String.encode(): String {
            return Base64.encodeToString(this.toByteArray(charset("UTF-8")), Base64.URL_SAFE)
        }

        /**
         * generates a nonce locally
         */
        private fun getNonceLocal(length: Int): String {
            var nonce = ""
            val allowed = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
            for (i in 0 until length) {
                nonce += allowed[floor(Math.random() * allowed.length).toInt()].toString()
            }
            return nonce.encode()
        }
    }
}
