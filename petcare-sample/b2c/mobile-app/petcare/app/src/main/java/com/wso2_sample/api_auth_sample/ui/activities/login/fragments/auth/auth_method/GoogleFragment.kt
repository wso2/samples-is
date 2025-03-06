package com.wso2_sample.api_auth_sample.ui.activities.login.fragments.auth.auth_method

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import androidx.activity.result.ActivityResultLauncher
import androidx.fragment.app.Fragment
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import com.google.android.gms.tasks.Task
import com.wso2_sample.api_auth_sample.R
import com.wso2_sample.api_auth_sample.api.oauth_client.GoogleAuthenticatorAPI
import com.wso2_sample.api_auth_sample.api.oauth_client.OauthClient
import com.wso2_sample.api_auth_sample.controller.ui.activities.fragments.auth.AuthParams
import com.wso2_sample.api_auth_sample.controller.ui.activities.fragments.auth.auth_method.AuthenticatorFragment
import com.wso2_sample.api_auth_sample.controller.ui.activities.fragments.auth.data.authenticator.Authenticator
import com.wso2_sample.api_auth_sample.model.api.oauth_client.AuthorizeFlow
import com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.google.GoogleSignInActivityResultContract
import com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.google.authenticator.GoogleAuthParams
import com.wso2_sample.api_auth_sample.util.config.OauthClientConfiguration

class GoogleFragment : Fragment(), AuthenticatorFragment {

    private val tag = "GoogleFragment"

    private lateinit var googleButton: Button
    private lateinit var layout: View
    override var authenticator: Authenticator? = null

    private lateinit var googleSignInOptions: GoogleSignInOptions
    private lateinit var mGoogleSignInClient: GoogleSignInClient
    private lateinit var signInLauncher: ActivityResultLauncher<Unit>
    private lateinit var googleAccount: GoogleSignInAccount
    private lateinit var googleAccessToken: String
    private lateinit var googleIdToken: String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Configure sign-in to request the user's ID, email address, and basic
        // profile. ID and basic profile are included in DEFAULT_SIGN_IN.
        googleSignInOptions = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestServerAuthCode(OauthClientConfiguration.getInstance(requireContext()).googleWebClientId)
            .requestIdToken(OauthClientConfiguration.getInstance(requireContext()).googleWebClientId)
            .requestEmail()
            .build()

        // Build a GoogleSignInClient with the options specified by gso.
        mGoogleSignInClient = GoogleSignIn.getClient(requireActivity(), googleSignInOptions)

        signInLauncher = registerForActivityResult(
            GoogleSignInActivityResultContract(mGoogleSignInClient)
        ) { result ->
            if (result != null) {
                val task: Task<GoogleSignInAccount> =
                    GoogleSignIn.getSignedInAccountFromIntent(result)
                handleSignInResult(task)
            } else {
                // Handle the sign-in failure or cancellation
                onAuthorizeFail()
            }
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        // Inflate the layout for this fragment
        val view: View =
            inflater.inflate(R.layout.fragment_login_auth_auth_method_google, container, false)

        initializeComponents(view)

        googleButtonOnClick()

        return view
    }

    private fun initializeComponents(view: View) {
        googleButton = view.findViewById(R.id.googleButton)

        layout = view.findViewById(R.id.googleIdpView)
    }

    override fun getAuthParams(): AuthParams {
        return GoogleAuthParams(
            googleAccessToken,
            googleIdToken
        )
    }

    override fun onAuthorizeSuccess(authorizeFlow: AuthorizeFlow?) {
        this.handleActivityTransition(requireContext(), authorizeFlow)
    }

    override fun onAuthorizeFail() {
        this.showSignInError(layout, requireContext())
    }

    override fun whenAuthorizing() {
        requireActivity().runOnUiThread {
            googleButton.isEnabled = false
        }
    }

    override fun finallyAuthorizing() {
        requireActivity().runOnUiThread {
            googleButton.isEnabled = true
        }
    }

    private fun googleButtonOnClick() {
        googleButton.setOnClickListener {
            signInLauncher.launch(Unit)
        }
    }

    /**
     * This method is called when the Google access token is retrieved successfully
     */
    private fun onGoogleAccessTokenSuccess(accessToken: String, idToken: String) {
        googleAccessToken = accessToken
        googleIdToken = idToken
        OauthClient.authenticate(
            requireContext(),
            authenticator!!,
            getAuthParams(),
            ::whenAuthorizing,
            ::finallyAuthorizing,
            ::onAuthorizeSuccess,
            ::onAuthorizeFail
        )
    }

    private fun handleSignInResult(completedTask: Task<GoogleSignInAccount>) {
        try {
            googleAccount = completedTask.getResult(ApiException::class.java)

            GoogleAuthenticatorAPI.getGoogleAccessToken(
                requireContext(),
                googleAccount.serverAuthCode!!,
                ::onGoogleAccessTokenSuccess,
                ::onAuthorizeFail
            )
        } catch (e: ApiException) {
            // The ApiException status code indicates the detailed failure reason.
            // Please refer to the GoogleSignInStatusCodes class reference for more information.
            Log.w(tag, "signInResult:failed code=" + e.statusCode)
            onAuthorizeFail()
        }
    }
}
