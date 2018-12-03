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
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Resources;
import android.net.Uri;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.text.TextUtils;

import com.wso2is.androidsample.utils.ConnectionBuilderForTesting;
import com.wso2is.androidsample.R;

import java.io.IOException;
import java.lang.ref.WeakReference;
import java.nio.charset.Charset;

import net.openid.appauth.connectivity.ConnectionBuilder;
import net.openid.appauth.connectivity.DefaultConnectionBuilder;

import okio.Buffer;
import okio.BufferedSource;
import okio.Okio;

import org.json.JSONException;
import org.json.JSONObject;

import static com.wso2is.androidsample.utils.Constants.HTTP;
import static com.wso2is.androidsample.utils.Constants.HTTPS;
import static com.wso2is.androidsample.utils.Constants.KEY_LAST_HASH;
import static com.wso2is.androidsample.utils.Constants.PREFS_NAME;
import static com.wso2is.androidsample.utils.Constants.UTF_8;

/**
 * Reads and validates the configuration from res/raw/config.json file.
 */
public class ConfigManager {

    private static WeakReference<ConfigManager> sInstance = new WeakReference<>(null);

    private final Context context;
    private final SharedPreferences prefs;
    private final Resources resources;

    private JSONObject configJson;
    private String configHash;
    private String configError;
    private String clientId;
    private String clientSecret;
    private String scope;
    private Uri redirectUri;
    private Uri authEndpointUri;
    private Uri tokenEndpointUri;
    private Uri userInfoEndpointUri;
    private Uri logoutEndpointUri;
    private Boolean httpsRequired;

    private ConfigManager(Context context) {

        this.context = context;
        prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        resources = context.getResources();

        try {
            readConfiguration();
        } catch (InvalidConfigurationException ex) {
            configError = ex.getMessage();
        }
    }

    /**
     * Gives an instance of the ConfigManager class.
     *
     * @param context Context object with information about the current state of the application.
     * @return ConfigManager instance.
     */
    public static ConfigManager getInstance(Context context) {

        ConfigManager config = sInstance.get();
        if (config == null) {
            config = new ConfigManager(context);
            sInstance = new WeakReference<>(config);
        }

        return config;
    }

    /**
     * Indicates whether the configuration has changed from the last known valid state.
     *
     * @return Gives a true if the last known configuration has changed, false if it has not changed.
     */
    public boolean hasConfigurationChanged() {

        String lastHash = getLastKnownConfigHash();

        return !configHash.equals(lastHash);
    }

    /**
     * Indicates whether the current configuration is valid.
     *
     * @return True if the current configuration is valid, false if it is not valid.
     */
    public boolean isValid() {

        return configError == null;
    }

    /**
     * Returns a description of the configuration error, if the configuration is invalid.
     *
     * @return ConfigManager error.
     */
    @Nullable
    public String getConfigurationError() {

        return configError;
    }

    /**
     * Indicates that the current configuration should be accepted as the last known valid configuration.
     */
    public void acceptConfiguration() {

        prefs.edit().putString(KEY_LAST_HASH, configHash).apply();
    }

    /**
     * Returns the client id specified in the res/raw/config.json file.
     *
     * @return Client ID.
     */
    @Nullable
    public String getClientId() {

        return clientId;
    }

    /**
     * Returns the authorization scope specified in the res/raw/config.json file.
     *
     * @return Authorization Scope.
     */
    @NonNull
    public String getScope() {

        return scope;
    }

    /**
     * Returns the redirect URI specified in the res/raw/config.json file.
     *
     * @return Redirect URI.
     */
    @NonNull
    public Uri getRedirectUri() {

        return redirectUri;
    }

    /**
     * Returns the authorization endpoint URI specified in the res/raw/config.json file.
     *
     * @return Authorization Endpoint URI.
     */
    @Nullable
    public Uri getAuthEndpointUri() {

        return authEndpointUri;
    }

    /**
     * Returns the token endpoint URI specified in the res/raw/config.json file.
     *
     * @return Token Endpoint URI.
     */
    @Nullable
    public Uri getTokenEndpointUri() {

        return tokenEndpointUri;
    }

    /**
     * Returns the user info endpoint URI specified in the res/raw/config.json file.
     *
     * @return User Info Endpoint URI.
     */
    @Nullable
    public Uri getUserInfoEndpointUri() {

        return userInfoEndpointUri;
    }

    /**
     * Returns the logout endpoint URI specified in the res/raw/config.json file.
     *
     * @return LogoutRequest Endpoint URI.
     */
    @Nullable
    public Uri getLogoutEndpointUri() {

        return logoutEndpointUri;
    }

    /**
     * Returns the client secret specified in the res/raw/config.json file.
     *
     * @return Client secret.
     */
    @Nullable
    public String getClientSecret() {

        return clientSecret;
    }

    /**
     * Returns the boolean specified in the res/raw/config.json for https_required.
     * This can be made false to test the application without SSL Certification.
     *
     * @return True if https is required, false if https is not required.
     */
    public boolean isHttpsRequired() {

        return httpsRequired;
    }

    /**
     * Gives an instance of Connection Builder.
     *
     * @return Connection builder instance.
     */
    public ConnectionBuilder getConnectionBuilder() {

        if (isHttpsRequired()) {
            return DefaultConnectionBuilder.INSTANCE;
        } else {
            return ConnectionBuilderForTesting.INSTANCE;
        }
    }

    /**
     * Returns the last known config hash.
     *
     * @return Config hash.
     */
    private String getLastKnownConfigHash() {

        return prefs.getString(KEY_LAST_HASH, null);
    }

    /**
     * Reads the configuration values.
     *
     * @throws InvalidConfigurationException Invalid configuration exception.
     */
    private void readConfiguration() throws InvalidConfigurationException {

        BufferedSource configSource = Okio.buffer(Okio.source(resources.openRawResource(R.raw.config)));
        Buffer configData = new Buffer();

        try {
            configSource.readAll(configData);
            configJson = new JSONObject(configData.readString(Charset.forName(UTF_8)));
        } catch (IOException ex) {
            throw new InvalidConfigurationException("failed to read configuration: " + ex.getMessage());
        } catch (JSONException ex) {
            throw new InvalidConfigurationException("unable to parse configuration: " + ex.getMessage());
        }

        configHash = configData.sha256().base64();
        clientId = getConfigString("client_id");
        clientSecret = getConfigString("client_secret");
        scope = getRequiredConfigString("authorization_scope");
        redirectUri = getRequiredConfigUri("redirect_uri");

        if (!isRedirectUriRegistered()) {
            throw new InvalidConfigurationException("redirect_uri is not handled by any activity in this app! "
                    + "ensure that the appAuthRedirectScheme in your build.gradle file "
                    + "is correctly configured, or that an appropriate intent filter "
                    + "exists in your app manifest.");
        }

        authEndpointUri = getRequiredConfigWebUri("authorization_endpoint");
        tokenEndpointUri = getRequiredConfigWebUri("token_endpoint");
        userInfoEndpointUri = getRequiredConfigWebUri("userinfo_endpoint");
        logoutEndpointUri = getRequiredConfigWebUri("end_session_endpoint");
        httpsRequired = configJson.optBoolean("https_required", true);
    }

    /**
     * Returns the Config String of the the particular property name.
     *
     * @param propName Property name.
     * @return Property value.
     */
    @Nullable
    private String getConfigString(String propName) {

        String value = configJson.optString(propName);

        if (value != null) {
            value = value.trim();
            if (TextUtils.isEmpty(value)) {
                value = null;
            }
        }

        return value;
    }

    /**
     * Returns the Config String of the the particular property name.
     *
     * @param propName Property name.
     * @return Property value.
     * @throws InvalidConfigurationException Invalid configuration exception.
     */
    @NonNull
    private String getRequiredConfigString(String propName) throws InvalidConfigurationException {

        String value = getConfigString(propName);

        if (value == null) {
            throw new InvalidConfigurationException(propName + " is required but not specified in the configuration");
        }

        return value;
    }

    /**
     * Returns the Config URI specified by the property name.
     *
     * @param propName Property name.
     * @return Config URI.
     * @throws InvalidConfigurationException Invalid configuration exception.
     */
    @NonNull
    private Uri getRequiredConfigUri(String propName) throws InvalidConfigurationException {

        String uriStr = getRequiredConfigString(propName);
        Uri uri;

        try {
            uri = Uri.parse(uriStr);
        } catch (Throwable ex) {
            throw new InvalidConfigurationException(propName + " could not be parsed: ", ex);
        }

        if (!uri.isHierarchical() || !uri.isAbsolute()) {
            throw new InvalidConfigurationException(propName + " must be hierarchical and absolute");
        }

        if (!TextUtils.isEmpty(uri.getEncodedUserInfo())) {
            throw new InvalidConfigurationException(propName + " must not have user info");
        }

        if (!TextUtils.isEmpty(uri.getEncodedQuery())) {
            throw new InvalidConfigurationException(propName + " must not have query parameters");
        }

        if (!TextUtils.isEmpty(uri.getEncodedFragment())) {
            throw new InvalidConfigurationException(propName + " must not have a fragment");
        }

        return uri;
    }

    /**
     * Returns the Config URI specified by the property name.
     *
     * @param propName Property name.
     * @return Config Web URI.
     * @throws InvalidConfigurationException Invalid configuration exception.
     */
    private Uri getRequiredConfigWebUri(String propName) throws InvalidConfigurationException {

        Uri uri = getRequiredConfigUri(propName);
        String scheme = uri.getScheme();

        if (TextUtils.isEmpty(scheme) || !(HTTP.equals(scheme) || HTTPS.equals(scheme))) {
            throw new InvalidConfigurationException(propName + " must have an http or https scheme");
        }

        return uri;
    }

    /**
     * Ensure that the redirect URI declared in the configuration is handled by some activity
     * in the app, by querying the package manager speculatively.
     *
     * @return True if redirect URI is registered, false if not registered.
     */
    private boolean isRedirectUriRegistered() {

        Intent redirectIntent = new Intent();

        redirectIntent.setPackage(context.getPackageName());
        redirectIntent.setAction(Intent.ACTION_VIEW);
        redirectIntent.addCategory(Intent.CATEGORY_BROWSABLE);
        redirectIntent.setData(redirectUri);

        return !context.getPackageManager().queryIntentActivities(redirectIntent, 0).isEmpty();
    }

    /**
     * Invalid configuration exception class.
     */
    static final class InvalidConfigurationException extends Exception {

        InvalidConfigurationException(String reason) {

            super(reason);
        }

        InvalidConfigurationException(String reason, Throwable cause) {

            super(reason, cause);
        }
    }
}
