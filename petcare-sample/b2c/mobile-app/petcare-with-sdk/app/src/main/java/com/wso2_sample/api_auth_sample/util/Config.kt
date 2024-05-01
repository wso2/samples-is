package com.wso2_sample.api_auth_sample.util

object Config {
    private const val BASE_URL: String = <INSERT_BASE_URL>
    private const val DISCOVERY_URL: String = <INSERT_DISCOVERY_URL>
    private const val CLIENT_ID: String = <INSERT_CLIENT_ID>
    private const val REDIRECT_URI: String = <INSERT_REDIRECT_URI>
    private const val SCOPE: String = "openid internal_login profile email"
    private const val GOOGLE_WEB_CLIENT_ID = <INSERT_GOOGLE_WEB_CLIENT_ID>


    fun getAuthorizeUrl(): String {
        return "$BASE_URL/oauth2/authorize"
    }

    fun getTokenUrl(): String {
        return "$BASE_URL/oauth2/token"
    }

    fun getLogoutUrl(): String {
        return "$BASE_URL/oidc/logout"
    }

    fun getUserInfoUrl(): String {
        return "$BASE_URL/oauth2/userinfo"
    }

    fun getAuthnUrl(): String {
        return "$BASE_URL/oauth2/authn"
    }

    fun getDiscoveryUrl(): String {
        return DISCOVERY_URL
    }

    fun getClientId(): String {
        return CLIENT_ID
    }

    fun getRedirectUri(): String {
        return REDIRECT_URI
    }

    fun getScope(): String {
        return SCOPE
    }

    fun getGoogleWebClientId(): String {
        return GOOGLE_WEB_CLIENT_ID
    }
}
