package com.wso2_sample.api_auth_sample.ui.activities.main

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.ProgressBar
import androidx.appcompat.app.AppCompatActivity
import com.wso2_sample.api_auth_sample.R
import com.wso2_sample.api_auth_sample.api.oauth_client.OauthClient
import com.wso2_sample.api_auth_sample.model.api.oauth_client.AuthorizeFlow
import com.wso2_sample.api_auth_sample.ui.activities.login.Login
import com.wso2_sample.api_auth_sample.util.UiUtil

class MainActivity : AppCompatActivity() {

    private lateinit var signInLoader: ProgressBar
    private lateinit var getStartedButton: Button
    lateinit var layout: View;

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState);

        initializeComponents();

        // hide action bar and status bar
        UiUtil.hideActionBar(supportActionBar!!)
        UiUtil.hideStatusBar(window, resources, theme, R.color.asgardeo_secondary)

        getStartedButtonOnClick()
    }

    private fun initializeComponents() {
        setContentView(R.layout.activity_main);
        layout = findViewById(R.id.layout)
        getStartedButton = findViewById(R.id.getStarted)
        signInLoader = findViewById(R.id.signinLoader)
    }

    private fun getStartedButtonOnClick() {
        getStartedButton.setOnClickListener {
            OauthClient.authorize(
                applicationContext,
                ::whenAuthentication,
                ::finallyAuthentication,
                ::onAuthenticationSuccess,
                ::onAuthenticationFail
            );
        }
    }

    private fun onAuthenticationSuccess(authorizeFlow: AuthorizeFlow) {
        val intent = Intent(this@MainActivity, Login::class.java);
        intent.putExtra(
            Login.FLOW_ID,
            authorizeFlow.flowId
        )
        intent.putExtra(
            Login.NEXT_STEP,
            authorizeFlow.nextStep.toString()
        )
        startActivity(intent)
    }

    private fun onAuthenticationFail() {
        UiUtil.showSnackBar(layout, getString(R.string.error_api_auth_failed))
        runOnUiThread {
            signInLoader.visibility = View.GONE;
        }
    }

    private fun whenAuthentication() {
        runOnUiThread {
            signInLoader.visibility = View.VISIBLE;
        }
    }

    private fun finallyAuthentication() {
        runOnUiThread {
            signInLoader.visibility = View.GONE;
        }
    }
}