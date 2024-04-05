package com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.google

import android.content.Context
import android.content.Intent
import androidx.activity.result.contract.ActivityResultContract
import com.google.android.gms.auth.api.signin.GoogleSignInClient

class GoogleSignInActivityResultContract(googleSignInClient: GoogleSignInClient) :
    ActivityResultContract<Unit, Intent>() {

    private var mGoogleSignInClient: GoogleSignInClient

    init {
        mGoogleSignInClient = googleSignInClient
    }

    override fun createIntent(context: Context, input: Unit): Intent {
        return mGoogleSignInClient.signInIntent
    }

    override fun parseResult(resultCode: Int, intent: Intent?): Intent {
        return intent!!
    }
}
