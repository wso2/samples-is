package com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.passkey.paskey_credential

import android.content.Context
import android.util.Log
import androidx.credentials.CredentialManager
import androidx.credentials.GetCredentialRequest
import androidx.credentials.GetCredentialResponse
import androidx.credentials.GetPublicKeyCredentialOption
import androidx.credentials.PublicKeyCredential
import androidx.credentials.exceptions.GetCredentialCancellationException
import androidx.credentials.exceptions.NoCredentialException
import com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.passkey.authenticator.auth_params.PasskeyCredentialAuthParams
import com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.passkey.authenticator.passkey_data.ChallengeInfo
import com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.passkey.authenticator.passkey_data.PasskeyChallenge
import com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.passkey.authenticator.passkey_data.PasskeyCredential

class PasskeyCredentialManger(context: Context) {

    private val context: Context = context
    private val credentialManager: CredentialManager = CredentialManager.create(context)
    private lateinit var challengeInfo: ChallengeInfo
    private lateinit var publicKeyCredentialOption: GetPublicKeyCredentialOption
    private lateinit var requestJson: PasskeyChallenge
    private lateinit var result: GetCredentialResponse

    private fun setChallengeInfo(challengeString: String) {
        challengeInfo = ChallengeInfo.getChallengeInfoFromChallengeString(challengeString)
    }

    private fun setPublicKeyCredentialOption() {
        this.publicKeyCredentialOption = GetPublicKeyCredentialOption(
            requestJson = requestJson.toString()
        )
    }

    private fun setRequestJson() {
        requestJson = challengeInfo.getPasskeyChallenge()
    }

    private suspend fun setResult(context: Context) {
        try {
            val getCredRequest = GetCredentialRequest(
                listOf(publicKeyCredentialOption)
            )

            result = credentialManager.getCredential(
                // Use an activity-based context to avoid undefined system UI
                // launching behavior.
                context,
                getCredRequest,
            )
        } catch (e: NoCredentialException) {
            Log.e("PasskeyCredentialManger", "No credential available", e)
        } catch (e: GetCredentialCancellationException) {
            Log.e("PasskeyCredentialManger", "GetCredentialCancellationException", e)
        } catch (e: Exception) {
            Log.e("PasskeyCredentialManger", "Exception", e)
        }
    }

    private fun handleSignIn(result: GetCredentialResponse): PasskeyCredentialAuthParams? {
        // Handle the successfully returned credential.

        return when (val credential = result.credential) {
            is PublicKeyCredential -> {
                val responseJson: String = credential.authenticationResponseJson
                val passkeyCredential: PasskeyCredential = PasskeyCredential.getPasskeyCredentialFromResponseString(responseJson)

                PasskeyCredentialAuthParams(
                    requestId = challengeInfo.requestId,
                    credential = passkeyCredential
                )
            }

            else -> {
                // Catch any unrecognized credential type here.
                Log.e("PasskeyCredentialManger", "Unexpected type of credential")
                null
            }
        }
    }

    suspend fun handlePasskeySignIn(challengeString: String): PasskeyCredentialAuthParams? {
        // Set the initial data
        setChallengeInfo(challengeString)
        setRequestJson()
        setPublicKeyCredentialOption()

        setResult(this.context).let {
            return handleSignIn(this.result)!!
        }
    }
}