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

package com.wso2is.androidsample.oidc;

import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.support.customtabs.CustomTabsIntent;
import android.util.Log;

import com.wso2is.androidsample.activities.LoginActivity;
import com.wso2is.androidsample.activities.UserActivity;
import com.wso2is.androidsample.mgt.AuthStateManager;
import com.wso2is.androidsample.mgt.ConfigManager;

import java.lang.ref.WeakReference;
import java.util.concurrent.atomic.AtomicReference;

import net.openid.appauth.AppAuthConfiguration;
import net.openid.appauth.AuthState;
import net.openid.appauth.AuthorizationRequest;
import net.openid.appauth.AuthorizationService;
import net.openid.appauth.AuthorizationServiceConfiguration;
import net.openid.appauth.CodeVerifierUtil;
import net.openid.appauth.ResponseTypeValues;
import net.openid.appauth.browser.AnyBrowserMatcher;
import net.openid.appauth.browser.BrowserMatcher;

import static net.openid.appauth.AuthorizationRequest.CODE_CHALLENGE_METHOD_S256;

/**
 * This class facilitates carrying out of the authorization request.
 */
public class AuthRequest {

    private static final String TAG = AuthRequest.class.getSimpleName();

    private final AtomicReference<String> clientId = new AtomicReference<>();
    private final AtomicReference<AuthorizationRequest> authRequest = new AtomicReference<>();
    private final AtomicReference<CustomTabsIntent> customTabIntent = new AtomicReference<>();
    private final BrowserMatcher browserMatcher = AnyBrowserMatcher.INSTANCE;
    private final ConfigManager configuration;
    private final Context context;

    private static WeakReference<AuthRequest> instance = new WeakReference<>(null);
    private static AuthStateManager authStateManager;

    private AuthorizationService authService;

    private AuthRequest(Context context) {

        this.context = context;
        configuration = ConfigManager.getInstance(context);
    }

    /**
     * Creates an instance of the AuthRequest class.
     *
     * @param context Application context.
     * @return An instance of the AuthRequest class.
     */
    public static AuthRequest getInstance(Context context) {

        AuthRequest authRequest = instance.get();
        if (authRequest == null) {
            authRequest = new AuthRequest(context);
            instance = new WeakReference<>(authRequest);
            authStateManager = AuthStateManager.getInstance(context);
        }

        return authRequest;
    }

    /**
     * Performs the authorization request.
     */
    public void doAuth() {

        initializeAppAuth();
        Intent completionIntent = new Intent(context, UserActivity.class);
        Intent cancelIntent = new Intent(context, LoginActivity.class);
        cancelIntent.putExtra("failed", true);
        cancelIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);

        authService.performAuthorizationRequest(authRequest.get(), PendingIntent.getActivity(context, 0,
                completionIntent, 0), PendingIntent.getActivity(context, 0, cancelIntent, 0),
                customTabIntent.get());
    }

    /**
     * Creates an authorization service and initializes the authorization service configuration if necessary.
     */
    private void initializeAppAuth() {

        Log.i(TAG, "Initializing AppAuth");
        recreateAuthorizationService();

        if (authStateManager.getCurrentState().getAuthorizationServiceConfiguration() != null) {
            Log.i(TAG, "Authorization configuration already established.");

        } else {
            Log.i(TAG, "Creating authorization configuration from res/raw/config.json file.");
            AuthorizationServiceConfiguration config = new AuthorizationServiceConfiguration(
                    configuration.getAuthEndpointUri(), configuration.getTokenEndpointUri());

            authStateManager.replaceState(new AuthState(config));
        }

        if (configuration.getClientId() != null) {
            clientId.set(configuration.getClientId());
            createAuthRequest();
            warmUpBrowser();
        } else {
            Log.e(TAG, "Client ID is not specified.");
        }
    }

    /**
     * Creates a new authorization service.
     */
    private void recreateAuthorizationService() {

        if (authService != null) {
            Log.i(TAG, "Discarding existing AuthService instance.");
            authService.dispose();
        }

        authService = createAuthorizationService();
        authRequest.set(null);
        customTabIntent.set(null);
    }

    /**
     * Creates an authorization service.
     *
     * @return New authorization service.
     */
    private AuthorizationService createAuthorizationService() {

        Log.i(TAG, "Creating authorization service.");

        AppAuthConfiguration.Builder builder = new AppAuthConfiguration.Builder();
        builder.setBrowserMatcher(browserMatcher);
        builder.setConnectionBuilder(configuration.getConnectionBuilder());

        return new AuthorizationService(context, builder.build());
    }

    /**
     * Warms up the custom tab by specifying the possible request URI.
     */
    private void warmUpBrowser() {

        Log.i(TAG, "Warming up browser instance for auth request.");

        CustomTabsIntent.Builder intentBuilder = authService.createCustomTabsIntentBuilder(authRequest.get().toUri());
        customTabIntent.set(intentBuilder.build());
    }

    /**
     * Creates the authorization request with PKCE.
     */
    private void createAuthRequest() {

        Log.i(TAG, "Creating authorization request.");

        String codeVerifier = CodeVerifierUtil.generateRandomCodeVerifier();
        String codeChallenge = CodeVerifierUtil.deriveCodeVerifierChallenge(codeVerifier);

        AuthorizationRequest.Builder authRequestBuilder = new AuthorizationRequest.Builder(authStateManager
                .getCurrentState().getAuthorizationServiceConfiguration(), clientId.get(),
                ResponseTypeValues.CODE, configuration.getRedirectUri()).setScope(configuration.getScope())
                .setCodeVerifier(codeVerifier, codeChallenge, CODE_CHALLENGE_METHOD_S256);

        authRequest.set(authRequestBuilder.build());
    }
}
