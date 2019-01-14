
namespace Agent.Util
{
    class SSOAgentConstants
    {
        public static readonly string CONFIG_BEAN_NAME = "org.wso2.carbon.identity.sso.agent.SSOAgentConfig";
        public static readonly string CERT_FRIENDLY_NAME = "CertFriendlyName";

        public static class SSOAgentConfig
        {
            public static readonly string ENABLE_OIDC_SSO_LOGIN = "EnableOIDCSSOLogin";
            public static readonly string ENABLE_DYNAMIC_APP_REGISTRATION = "EnableDynamicAppRegistration";
            public static readonly string ENABLE_DYNAMIC_OIDC_CONFIGURATION = "EnableDynamicOIDCConfiguration";
            public static readonly string OIDC_SSO_URL = "OIDCSSOURL";
            public static readonly string SKIP_URIS = "SkipURIs";
            public static readonly string PASSWORD_FILEPATH = "/conf/password_temp.txt";

            public static class OIDC
            {
                public static readonly string CLIENT_ID = "OIDC.ClientId";
                public static readonly string CLIENT_SECRET = "OIDC.ClientSecret";
                public static readonly string CALL_BACK_URL = "OIDC.CallBackUrl";
                public static readonly string SERVICE_PROVIDER_NAME = "OIDC.spName";
                public static readonly string OAUTH2_GRANT_TYPE = "OIDC.GrantType";
                public static readonly string OAUTH2_AUTHZ_ENDPOINT = "OIDC.AuthorizeEndpoint";
                public static readonly string OAUTH2_TOKEN_ENDPOINT = "OIDC.TokenEndpoint";
                public static readonly string OAUTH2_USER_INFO_ENDPOINT = "OIDC.UserInfoEndpoint";
                public static readonly string OIDC_LOGOUT_ENDPOINT = "OIDC.LogoutEndpoint";
                public static readonly string OIDC_SESSION_IFRAME_ENDPOINT = "OIDC.SessionIFrameEndpoint";
                public static readonly string SCOPE = "OIDC.Scope";
                public static readonly string POST_LOGOUT_REDIRECT_URI = "OIDC.PostLogoutRedirectUri";
                public static readonly string ENABLE_ID_TOKEN_VALIDATION = "OIDC.EnableIDTokenValidation";
                public static readonly string SLO_URL = "OIDC.SLOURL";
            }
        }
    }
}
