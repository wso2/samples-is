package com.wso2_sample.api_auth_sample.util

object Config {
    private const val BASE_URL: String = "https://10.0.2.2:9443"
    private const val DISCOVERY_URL: String = "https://10.0.2.2:9443/oauth2/token/.well-known/openid-configuration"
    private const val CLIENT_ID: String = "DemBfWSfjhJO2ieDeI67urt7O_0a"
    private const val REDIRECT_URI: String = "wso2.apiauth.sample.android://login-callback"
    private const val SCOPE: String = "openid internal_login profile email"
    private const val GOOGLE_WEB_CLIENT_ID = "1064044497616-0326pu24eaael3u9lhs6huarj935pmti.apps.googleusercontent.com"


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
