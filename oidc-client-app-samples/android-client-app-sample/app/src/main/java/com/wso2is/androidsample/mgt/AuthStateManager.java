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

package com.wso2is.androidsample.mgt;

import android.content.Context;
import android.content.SharedPreferences;
import android.support.annotation.AnyThread;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.util.Log;
import net.openid.appauth.AuthState;
import net.openid.appauth.AuthorizationException;
import net.openid.appauth.AuthorizationResponse;
import net.openid.appauth.TokenResponse;
import org.json.JSONException;
import java.lang.ref.WeakReference;
import java.util.concurrent.atomic.AtomicReference;
import static com.wso2is.androidsample.utils.Constants.KEY_STATE;
import static com.wso2is.androidsample.utils.Constants.STORE_NAME;

/**
 * A mechanism for handling the AuthState.
 */
public class AuthStateManager {

    private static final AtomicReference<WeakReference<AuthStateManager>> INSTANCE_REF =
            new AtomicReference<>(new WeakReference<AuthStateManager>(null));

    private  final String TAG = AuthStateManager.class.getSimpleName();

    private final SharedPreferences prefs;
    private final AtomicReference<AuthState> currentAuthState;

    /**
     * Returns an instance of the AuthStateManager class.
     *
     * @param context Application context
     * @return AuthStateManager instance
     */
    @AnyThread
    public static AuthStateManager getInstance(@NonNull Context context) {
        AuthStateManager manager = INSTANCE_REF.get().get();
        if (manager == null) {
            manager = new AuthStateManager(context.getApplicationContext());
            INSTANCE_REF.set(new WeakReference<>(manager));
        }

        return manager;
    }

    /**
     * AuthStateManager constructor.
     *
     * @param context Application Context
     */
    private AuthStateManager(Context context) {
        prefs = context.getSharedPreferences(STORE_NAME, Context.MODE_PRIVATE);
        currentAuthState = new AtomicReference<>();
    }

    /**
     * Returns the current AuthState instance.
     *
     * @return Current AuthState
     */
    @AnyThread
    @NonNull
    public AuthState getCurrentState() {
        AuthState current;
        if (currentAuthState.get() != null) {
            current = currentAuthState.get();
        } else {
            AuthState state = readState();
            if (currentAuthState.compareAndSet(null, state)) {
                current = state;
            } else {
                current = currentAuthState.get();
            }
        }
        return current;
    }

    /**
     * Replaces the current AuthState with a new AuthState.
     *
     * @param state AuthState object that should replaceState the existing one.
     */
    @AnyThread
    public void replaceState(@NonNull AuthState state) {
        writeState(state);
        currentAuthState.set(state);
    }

    /**
     * Updates the current AuthState with authorization response and exception.
     *
     * @param response Authorization response
     * @param ex Authorization exception
     */

    @AnyThread
    public void updateAfterAuthorization(@Nullable AuthorizationResponse response,
                                         @Nullable AuthorizationException ex) {
        AuthState current = getCurrentState();
        current.update(response, ex);
        replaceState(current);
    }

    /**
     * Updates the current AuthState with token response and exception.
     *
     * @param response Token response
     * @param ex Authorization exception
     */
    @AnyThread
    public void updateAfterTokenResponse(@Nullable TokenResponse response, @Nullable AuthorizationException ex) {
        AuthState current = getCurrentState();
        current.update(response, ex);
        replaceState(current);
    }

    /**
     * Reads the AuthState.
     *
     * @return AuthState
     */
    @AnyThread
    @NonNull
    private AuthState readState() {
        AuthState auth;
        String currentState = prefs.getString(KEY_STATE, null);
        if (currentState == null) {
            auth = new AuthState();
        } else {
            try {
                auth = AuthState.jsonDeserialize(currentState);
            } catch (JSONException ex) {
                Log.e(TAG, "Failed to deserialize stored auth state - discarding: ", ex);
                auth = new AuthState();
            }
        }
        return auth;
    }

    /**
     * Writes the AuthState.
     *
     * @param state AuthState
     */
    @AnyThread
    private void writeState(@Nullable AuthState state) {

        SharedPreferences.Editor editor = prefs.edit();
        if (state == null) {
            editor.remove(KEY_STATE);
        } else {
            editor.putString(KEY_STATE, state.jsonSerializeString());
        }
        if (!editor.commit()) {
            Log.e(TAG, "Failed to write state to shared prefs.");
        }
    }
}
