package com.wso2_sample.api_auth_sample.util.config

import android.content.Context
import android.content.res.Resources
import android.net.Uri
import android.text.TextUtils
import com.wso2_sample.api_auth_sample.R
import java.lang.ref.WeakReference

/**
 * Reads and validates the configuration from the res/values/config file.
 */
class OauthClientConfiguration private constructor(context: Context) {
    private val mResources: Resources
    private var mBaseUri: Uri? = null
    private var mAuthorizeUri: Uri? = null
    private var mAuthorizeNextUri: Uri? = null
    private var mTokenUri: Uri? = null
    private var mClientId: String? = null
    private var mRedirectUri: Uri? = null
    private var mScope: String? = null
    private var mResponseMode: String? = null
    private var mResponseType: String? = null
    private var mGoogleWebClientId: String? = null
    private var mGoogleWebClientSecret: String? = null
    private var mGoogleWebClientRedirectUri: Uri? = null

    init {
        mResources = context.resources
        readConfiguration()
    }

    val authorizeUri: Uri
        /**
         * Returns the authorize endpoint URI specified in the res/values/config file.
         *
         * @return Authorize URI.
         */
        get() = mAuthorizeUri!!

    val authorizeNextUri: Uri
        /**
         * Returns the next authorize endpoint URI specified in the res/values/config file.
         *
         * @return Next Authorize URI.
         */
        get() = mAuthorizeNextUri!!

    val tokenUri: Uri
        /**
         * Returns the token endpoint URI specified in the res/values/config file.
         *
         * @return Token URI.
         */
        get() = mTokenUri!!

    val clientId: String
        /**
         * Returns the client id specified in the res/values/config file.
         *
         * @return Client ID.
         */
        get() = mClientId!!
    val redirectUri: Uri
        /**
         * Returns the redirect URI specified in the res/values/config file.
         *
         * @return Redirect URI.
         */
        get() = mRedirectUri!!

    val scope: String
        /**
         * Returns the scope specified in the res/values/config file.
         *
         * @return Scope.
         */
        get() = mScope!!

    val responseMode: String
        /**
         * Returns the response mode specified in the res/values/config file.
         *
         * @return Response Mode.
         */
        get() = mResponseMode!!

    val responseType: String
        /**
         * Returns the response type specified in the res/values/config file.
         *
         * @return Response Type.
         */
        get() = mResponseType!!

    val googleWebClientId: String
        /**
         * Returns the google web client id specified in the res/values/config file.
         *
         * @return Google Web Client ID.
         */
        get() = mGoogleWebClientId!!

    val googleWebClientSecret: String
        /**
         * Returns the google web client secret specified in the res/values/config file.
         *
         * @return Google Web Client Secret.
         */
        get() = mGoogleWebClientSecret!!

    val googleWebClientRedirectUri: Uri
        /**
         * Returns the google web client redirect uri specified in the res/values/config file.
         *
         * @return Google Web Client Redirect URI.
         */
        get() = mGoogleWebClientRedirectUri!!

    val googleTokenUri: Uri
        /**
         * Returns the google token endpoint URI specified in the res/values/config file.
         *
         * @return Google Token URI.
         */
        get() = Uri.parse("https://oauth2.googleapis.com/token")

    /**
     * Reads the configuration values.
     */
    private fun readConfiguration() {

        mBaseUri = getRequiredUri(mResources.getString(R.string.oauth_client_base_url))

        mAuthorizeUri = getRequiredUri(mBaseUri.toString() + "/oauth2/authorize")
        mAuthorizeNextUri = getRequiredUri(mBaseUri.toString() + "/oauth2/authn")
        mTokenUri = getRequiredUri(mBaseUri.toString() + "/oauth2/token")
        mClientId = getRequiredConfigString(mResources.getString(R.string.oauth_client_client_id))
        mRedirectUri = getRequiredUri(mResources.getString(R.string.oauth_client_redirect_uri))
        mScope = getRequiredConfigString(mResources.getString(R.string.oauth_client_scope))
        mResponseMode =
            getRequiredConfigString(mResources.getString(R.string.oauth_client_response_mode))
        mResponseType =
            getRequiredConfigString(mResources.getString(R.string.oauth_client_response_type))
        mGoogleWebClientId =
            getRequiredConfigString(mResources.getString(R.string.oauth_client_google_web_client_id))
        mGoogleWebClientSecret = getRequiredConfigString(
            mResources.getString(
                R.string.oauth_client_google_web_client_secret
            )
        )
        mGoogleWebClientRedirectUri = getRequiredUri("https://localhost:9443" + "/commonauth")
    }

    /**
     * Returns the Config String of the the particular property name.
     *
     * @param configString Property name.
     * @return Property value.
     */
    private fun getRequiredConfigString(configString: String): String? {
        var value: String? = configString
        if (TextUtils.isEmpty(value)) {
            value = null
        }
        return value
    }

    /**
     * Returns Config URI.
     *
     * @param endpoint Endpoint
     * @return Uri
     */
    @Throws(Exception::class)
    private fun getRequiredUri(endpoint: String): Uri {
        val uri = Uri.parse(endpoint)
        if (!uri.isHierarchical || !uri.isAbsolute) {
            throw Exception("$endpoint must be hierarchical and absolute")
        }
        if (!TextUtils.isEmpty(uri.encodedUserInfo)) {
            throw Exception("$endpoint must not have user info")
        }
        if (!TextUtils.isEmpty(uri.encodedQuery)) {
            throw Exception("$endpoint must not have query parameters")
        }
        if (!TextUtils.isEmpty(uri.encodedFragment)) {
            throw Exception("$endpoint must not have a fragment")
        }
        return uri
    }

    companion object {
        private var sInstance = WeakReference<OauthClientConfiguration?>(null)
        private const val LOG_TAG = "Configuration"

        /**
         * Returns an instance of the FileBasedConfiguration class.
         *
         * @param context Context object with information about the current state of the application.
         * @return FileBasedConfiguration instance.
         */
        fun getInstance(context: Context): OauthClientConfiguration {
            var config = sInstance.get()
            if (config == null) {
                config = OauthClientConfiguration(context)
                sInstance = WeakReference(config)
            }
            return config
        }
    }
}