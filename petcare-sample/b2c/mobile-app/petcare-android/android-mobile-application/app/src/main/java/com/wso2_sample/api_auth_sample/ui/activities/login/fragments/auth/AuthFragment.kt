package com.wso2_sample.api_auth_sample.ui.activities.login.fragments.auth

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentContainerView
import com.wso2_sample.api_auth_sample.R
import com.wso2_sample.api_auth_sample.controller.ui.activities.fragments.auth.AuthController
import com.wso2_sample.api_auth_sample.controller.ui.activities.fragments.auth.data.authenticator.Authenticator
import com.wso2_sample.api_auth_sample.model.api.oauth_client.AuthorizeFlowNextStep
import com.wso2_sample.api_auth_sample.model.ui.activities.login.fragments.auth.auth_method.basic_auth.authenticator.BasicAuthAuthenticator
import com.wso2_sample.api_auth_sample.model.util.uiUtil.SharedPreferencesKeys
import com.wso2_sample.api_auth_sample.util.UiUtil

class AuthFragment : Fragment() {
    private lateinit var flowId: String

    private lateinit var authenticators: ArrayList<Authenticator>
    private lateinit var orSignInText: LinearLayout

    // authenticator views
    private lateinit var basicAuthView: FragmentContainerView
    private lateinit var fidoAuthView: FragmentContainerView
    private lateinit var googleIdpView: FragmentContainerView
    private lateinit var totpIdpView: FragmentContainerView

    private lateinit var authListener: AuthListener

    companion object {
        const val NEXT_STEP = "nextStep"
        const val FLOW_ID = "flowId"
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_login_auth, container, false)
        initializeComponents(view)

        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val bundle: Bundle? = arguments;

        if (bundle != null) {
            setAuthenticators(bundle)
            setFlowId(bundle)

            passAuthenticatorToAuthFragment()

            // show authenticator based on the authenticators return
            AuthController.showAuthenticatorLayouts(
                authenticators,
                basicAuthView,
                fidoAuthView,
                totpIdpView,
                googleIdpView
            )

            // hide `or sign in with` text
            hideOrSignInText()
        }
    }

    private fun initializeComponents(view: View) {
        orSignInText = view.findViewById(R.id.orSignInText)

        // set authenticator view
        basicAuthView = view.findViewById(R.id.basicAuthView)
        fidoAuthView = view.findViewById(R.id.passkeyAuthView)
        googleIdpView = view.findViewById(R.id.googleIdpView)
        totpIdpView = view.findViewById(R.id.totpIdpView)
    }

    private fun setAuthenticators(bundle: Bundle) {

        val authorizeFlowNextStep: AuthorizeFlowNextStep =
            AuthorizeFlowNextStep.fromJson(bundle.getString(NEXT_STEP)!!)
        authenticators = authorizeFlowNextStep.authenticators
    }

    private fun setFlowId(bundle: Bundle) {
        flowId = bundle.getString(FLOW_ID)!!

        // save flowId to shared preferences to be used when authenticating user
        UiUtil.writeToSharedPreferences(
            requireContext().getSharedPreferences(
                R.string.app_name.toString(),
                Context.MODE_PRIVATE
            ), SharedPreferencesKeys.FLOW_ID.key, flowId
        )
    }

    private fun hideOrSignInText() {

        if (AuthController.isAuthenticatorAvailable(
                authenticators,
                BasicAuthAuthenticator.AUTHENTICATOR_TYPE
            ) != null
            && AuthController.numberOfAuthenticators(authenticators) > 1
        ) {
            orSignInText.visibility = View.VISIBLE
        }
    }

    override fun onAttach(context: Context) {
        super.onAttach(context)
        if (context is AuthListener) {
            authListener = context
        }
    }

    private fun passAuthenticatorToAuthFragment() {

        authenticators.forEach {
            authListener.onAuthenticatorPassed(it)
        }
    }

    interface AuthListener {
        fun onAuthenticatorPassed(authenticator: Authenticator)
    }
}