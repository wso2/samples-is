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
class DataSourceConfiguration private constructor(context: Context) {
    private val mResources: Resources
    private var mResourceServerUrl: Uri? = null

    init {
        mResources = context.resources
        readConfiguration()
    }

    val resourceServerUrl: Uri
        /**
         * Returns the resource server URL specified in the res/values/config file.
         *
         * @return Resource Server URL.
         */
        get() = mResourceServerUrl!!

    /**
     * Reads the configuration values.
     */
    private fun readConfiguration() {
        mResourceServerUrl =
            getRequiredUri(mResources.getString(R.string.data_source_resource_server_url))
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
        private var sInstance = WeakReference<DataSourceConfiguration?>(null)

        /**
         * Returns an instance of the FileBasedConfiguration class.
         *
         * @param context Context object with information about the current state of the application.
         * @return FileBasedConfiguration instance.
         */
        fun getInstance(context: Context): DataSourceConfiguration {
            var config = sInstance.get()
            if (config == null) {
                config = DataSourceConfiguration(context)
                sInstance = WeakReference(config)
            }
            return config
        }
    }
}