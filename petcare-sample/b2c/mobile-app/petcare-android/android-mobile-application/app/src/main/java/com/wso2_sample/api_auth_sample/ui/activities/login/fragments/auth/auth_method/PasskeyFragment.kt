package com.wso2_sample.api_auth_sample.ui.activities.login.fragments.auth.auth_method

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import com.wso2_sample.api_auth_sample.R
import com.wso2_sample.api_auth_sample.api.oauth_client.OauthClient
import com.wso2_sample.api_auth_sample.controller.ui.activities.fragments.auth.AuthParams
import com.wso2_sample.api_auth_sample.controller.ui.activities.fragments.auth.auth_method.AuthenticatorFragment
import com.wso2_sample.api_auth_sample.controller.ui.activities.fragments.auth.data.authenticator.Authenticator
import com.wso2_sample.api_auth_sample.model.api.oauth_client.AuthorizeFlow
import com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.passkey.authenticator.PasskeyAuthenticator
import com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.passkey.authenticator.auth_params.PasskeyAuthParams
import com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.passkey.authenticator.auth_params.PasskeyCredentialAuthParams
import com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.passkey.paskey_credential.PasskeyCredentialManger
import kotlinx.coroutines.launch

class PasskeyFragment : Fragment(), AuthenticatorFragment {

    private lateinit var passkeyButton: Button
    private lateinit var layout: View
    override var authenticator: Authenticator? = null

    private lateinit var passkeyCredentialManger: PasskeyCredentialManger
    private lateinit var passkeyCredentialAuthParams: PasskeyCredentialAuthParams

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        // Inflate the layout for this fragment
        val view: View =
            inflater.inflate(R.layout.fragment_login_auth_auth_method_passkey, container, false)

        passkeyCredentialManger = PasskeyCredentialManger(requireContext())

        initializeComponents(view)
        setPasskeyButtonClickListener()

        return view;
    }

    private fun setPasskeyButtonClickListener() {
        if (::passkeyButton.isInitialized) {
            passkeyButton.setOnClickListener {
                lifecycleScope.launch {
                    val challengeString: String =
                        (authenticator as PasskeyAuthenticator).metadata.additionalData.challengeData

                    passkeyCredentialManger.handlePasskeySignIn(
                        challengeString
                    )?.let {
                        passkeyCredentialAuthParams = it
                        OauthClient.authenticate(
                            requireContext(),
                            authenticator!!,
                            getAuthParams(),
                            ::whenAuthorizing,
                            ::finallyAuthorizing,
                            ::onAuthorizeSuccess,
                            ::onAuthorizeFail
                        )
                    } ?: run {
                        view?.let {
                            onAuthorizeFail()
                        }
                    }
                }
            }
        }
    }

    private fun initializeComponents(view: View) {
        passkeyButton = view.findViewById(R.id.passkeyButton)
        layout = view.findViewById(R.id.passkeyLayout)
    }

    override fun getAuthParams(): AuthParams {
        return PasskeyAuthParams(passkeyCredentialAuthParams.toString())
    }

    override fun onAuthorizeSuccess(authorizeFlow: AuthorizeFlow?) {
        this.handleActivityTransition(requireContext(), authorizeFlow);
    }

    override fun onAuthorizeFail() {
        this.showSignInError(layout, requireContext())
    }

    override fun whenAuthorizing() {
        requireActivity().runOnUiThread {
            passkeyButton.isEnabled = false;
        }
    }

    override fun finallyAuthorizing() {
        requireActivity().runOnUiThread {
            passkeyButton.isEnabled = true;
        }
    }
}
