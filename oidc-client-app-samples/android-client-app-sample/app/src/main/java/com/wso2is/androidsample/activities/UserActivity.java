/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package com.wso2is.androidsample.activities;

import android.content.Intent;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;
import com.wso2is.androidsample.mgt.AuthStateManager;
import com.wso2is.androidsample.mgt.ConfigManager;
import com.wso2is.androidsample.R;
import com.wso2is.androidsample.models.User;
import com.wso2is.androidsample.openid.LogoutRequest;
import com.wso2is.androidsample.openid.UserInfoRequest;
import net.openid.appauth.AppAuthConfiguration;
import net.openid.appauth.AuthorizationException;
import net.openid.appauth.AuthorizationResponse;
import net.openid.appauth.AuthorizationService;
import net.openid.appauth.ClientAuthentication;
import net.openid.appauth.TokenResponse;
import org.json.JSONObject;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

/**
 * This activity will exchange the authorization code for an access token if not
 * already authorized and redirect to the user profile view.
 */
public class UserActivity extends AppCompatActivity {

    private final String TAG = UserActivity.class.getSimpleName();

    private AuthorizationService authService;
    private static AuthStateManager stateManager;
    private ConfigManager configuration;

    public static String idToken;
    public static String state;
    private static String accessToken;

    private final User user = new User();

    public static final AtomicReference<JSONObject> userInfoJson = new AtomicReference<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        stateManager = AuthStateManager.getInstance(this);
        configuration = ConfigManager.getInstance(this);

        ConfigManager config = ConfigManager.getInstance(this);

        if (config.hasConfigurationChanged()) {
            Toast.makeText(this,"Configuration change detected!", Toast.LENGTH_SHORT).show();
            LogoutRequest.getInstance().signOut(this);
            finish();
        } else {
            authService = new AuthorizationService(this, new AppAuthConfiguration.Builder()
                            .setConnectionBuilder(config.getConnectionBuilder()).build());
        }
    }

    @Override
    protected void onStart() {
        super.onStart();

        if (stateManager.getCurrentState().isAuthorized()) {
            displayAuthorized();
        } else {
            AuthorizationResponse response = AuthorizationResponse.fromIntent(getIntent());
            AuthorizationException ex = AuthorizationException.fromIntent(getIntent());

            if (response != null || ex != null) {

                stateManager.updateAfterAuthorization(response, ex);
                if (response != null && response.authorizationCode != null) {

                    // authorization code exchange is required
                    exchangeAuthorizationCode(response);
                } else if (ex != null) {
                    Log.e(TAG, "Authorization request failed: " + ex.getMessage());
                    LogoutRequest.getInstance().signOut(this);
                    finish();
                }
            } else {
                Log.e(TAG, "No authorization state retained - re-authorization required.");
                LogoutRequest.getInstance().signOut(this);
                finish();
            }
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        authService.dispose();
    }

    /**
     * Once the access token is obtained the User content view will be set.
     */
    private void displayAuthorized() {

        boolean val = UserInfoRequest.getInstance().fetchUserInfo(accessToken, this, user);
        if (val) {
            setContentView(R.layout.activity_user);
            (findViewById(R.id.bLogout)).setOnClickListener((View view) -> {
                LogoutRequest.getInstance().signOut(this);
                finish();
            });
            TextView tvUsername = findViewById(R.id.tvUsername);
            tvUsername.setText(user.getUsername());
            TextView tvEmail = findViewById(R.id.tvEmail);
            tvEmail.setText(user.getEmail());
        } else {
            Toast.makeText(this,"Unable to Fetch User Information", Toast.LENGTH_LONG).show();
            Log.e(TAG, "Error while fetching user information.");
            Intent login = new Intent(this, LoginActivity.class);
            startActivity(login);
        }
    }

    /**
     * Exchanging the authorization code for a token.
     *
     * @param authorizationResponse Response of the authorization request.
     */
    private void exchangeAuthorizationCode(AuthorizationResponse authorizationResponse) {

        // making the extra http parameters for access token request
        Map<String, String> additionalParameters = new HashMap<>();
        additionalParameters.put("client_secret", configuration.getClientSecret());

        // state is stored to generate the logout endpoint request
        state = authorizationResponse.state;
        performTokenRequest(authorizationResponse.createTokenExchangeRequest(additionalParameters),
                            this::handleCodeExchangeResponse);
    }

    /**
     * Performing the token request.
     *
     * @param request Token request.
     * @param callback Token response callback.
     */
    private void performTokenRequest(net.openid.appauth.TokenRequest request,
                                     AuthorizationService.TokenResponseCallback callback) {

        ClientAuthentication clientAuthentication;

        // checks the authentication state of the client
        try {
            clientAuthentication = stateManager.getCurrentState().getClientAuthentication();

        } catch (ClientAuthentication.UnsupportedAuthenticationMethod ex) {
            Log.e(TAG, "Token request cannot be made, client authentication for the token "
                    + "endpoint could not be constructed (%s).", ex);
            return;
        }

        authService.performTokenRequest(request, clientAuthentication, callback);
    }

    /**
     * Processing of the token response.
     *
     * @param tokenResponse Response of the token request.
     * @param authException Exception returned by the token request.
     */
    private void handleCodeExchangeResponse(@Nullable TokenResponse tokenResponse,
                                            @Nullable AuthorizationException authException) {

        stateManager.updateAfterTokenResponse(tokenResponse, authException);

        if (!stateManager.getCurrentState().isAuthorized()) {
            Log.e(TAG, "Authorization code exchange failed.");

        } else {
            idToken = tokenResponse.idToken;
            accessToken = tokenResponse.accessToken;
            runOnUiThread(this::displayAuthorized);
        }
    }
}
