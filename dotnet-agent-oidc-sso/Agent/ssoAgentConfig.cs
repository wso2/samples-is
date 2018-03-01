using Agent.Exceptions;
using Agent.Util;
using System.Collections.Generic;

namespace Agent
{
    class SSOAgentConfig
    {
        private bool oidcLoginEnabled;
        public bool OIDCLoginEnabled
        {
            get { return oidcLoginEnabled; }
        }
        public string SetOIDCLoginEnabled
        {
            set {
                if(string.IsNullOrWhiteSpace(value))
                {
                    throw new SSOAgentException(SSOAgentConstants.SSOAgentConfig.ENABLE_OIDC_SSO_LOGIN
                            + "is not specified. Cannot proceed further.");
                }oidcLoginEnabled = bool.Parse(value);
            }
        }

        private string x509CertificateFriendlyName;
        public string X509CertificateFriendlyName
        {
            get
            {
                return x509CertificateFriendlyName;
            }
            set
            {
                if (string.IsNullOrWhiteSpace(value))
                {
                    throw new SSOAgentException(SSOAgentConstants.CERT_FRIENDLY_NAME + " is not specified properly. Cannot proceed Further.");
                }
                else
                {
                    x509CertificateFriendlyName = value;
                }
            }
        }

        public string OIDCURL { get; set; } = null;
        public OIDC Oidc { get; set; } = new OIDC();

        public SSOAgentConfig(Dictionary<string, string> properties)
        {
            InitConfig(properties);
        }

        private void InitConfig(Dictionary<string, string> properties)
        {
            SetOIDCLoginEnabled =  properties[SSOAgentConstants.SSOAgentConfig.ENABLE_OIDC_SSO_LOGIN];
            OIDCURL = properties[SSOAgentConstants.SSOAgentConfig.OIDC_SSO_URL];
            X509CertificateFriendlyName = properties[SSOAgentConstants.CERT_FRIENDLY_NAME];

            Oidc.SpName = properties[SSOAgentConstants.SSOAgentConfig.OIDC.SERVICE_PROVIDER_NAME];
            Oidc.ClientId = properties[SSOAgentConstants.SSOAgentConfig.OIDC.CLIENT_ID];
            Oidc.ClientSecret = properties[SSOAgentConstants.SSOAgentConfig.OIDC.CLIENT_SECRET];
            Oidc.CallBackUrl = properties[SSOAgentConstants.SSOAgentConfig.OIDC.CALL_BACK_URL];
            Oidc.AuthzEndpoint = properties[SSOAgentConstants.SSOAgentConfig.OIDC.OAUTH2_AUTHZ_ENDPOINT];
            Oidc.TokenEndpoint = properties[SSOAgentConstants.SSOAgentConfig.OIDC.OAUTH2_TOKEN_ENDPOINT];
            Oidc.UserInfoEndpoint = properties[SSOAgentConstants.SSOAgentConfig.OIDC.OAUTH2_USER_INFO_ENDPOINT];
            Oidc.AuthzGrantType = properties[SSOAgentConstants.SSOAgentConfig.OIDC.OAUTH2_GRANT_TYPE];
            Oidc.OIDCLogoutEndpoint = properties[SSOAgentConstants.SSOAgentConfig.OIDC.OIDC_LOGOUT_ENDPOINT];
            Oidc.SetIsIDTokenValidationEnabled = properties[SSOAgentConstants.SSOAgentConfig.OIDC.ENABLE_ID_TOKEN_VALIDATION];
            Oidc.Scope = properties[SSOAgentConstants.SSOAgentConfig.OIDC.SCOPE];

            Oidc.SLOURL = properties[SSOAgentConstants.SSOAgentConfig.OIDC.SLO_URL];
            Oidc.SessionIFrameEndpoint = properties[SSOAgentConstants.SSOAgentConfig.OIDC.OIDC_SESSION_IFRAME_ENDPOINT];
            Oidc.PostLogoutRedirectUri = properties[SSOAgentConstants.SSOAgentConfig.OIDC.POST_LOGOUT_REDIRECT_URI];
        }

        public class OIDC
        {
            private string spName;
            private string clientId = null;
            private string clientSecret = null;
            private string authzEndpoint = null;
            private string tokenEndpoint = null;
            private string userInfoEndpoint = null;
            private string authzGrantType = null;
            private string callBackUrl = null;
            private string oidcLogoutEndpoint = null;
            private string sessionIFrameEndpoint = null;
            private string scope = null;
            private string postLogoutRedirectUri = null;
            private string oidcSLOURL = null;

            private bool isIDTokenValidationEnabled = false;


            public string SpName
            {
                get { return spName; }
                set
                {
                    if (string.IsNullOrWhiteSpace(value))
                    {
                        throw new SSOAgentException(SSOAgentConstants.SSOAgentConfig.OIDC.SERVICE_PROVIDER_NAME
                                + "is not specified. Cannot proceed further.");
                    }
                    spName = value;
                }
            }

            public bool IsIDTokenValidationEnabled
            {
                get { return isIDTokenValidationEnabled; }
            }

            public string SetIsIDTokenValidationEnabled
            {
                set
                {
                    if (!string.IsNullOrWhiteSpace(value))
                    {
                        isIDTokenValidationEnabled = bool.Parse(value);
                    }
                    else
                    {
                        isIDTokenValidationEnabled = false;
                    }
                }
            }

            public string ClientId
            {
                get { return clientId; }
                set
                {
                    if (string.IsNullOrWhiteSpace(value))
                    {
                        throw new SSOAgentException(SSOAgentConstants.SSOAgentConfig.OIDC.CLIENT_ID +
                            "is not specified properly. Cannot proceed further.");
                    }
                    clientId = value;
                }
            }

            public string AuthzEndpoint
            {
                get { return authzEndpoint; }
                set
                {
                    if (string.IsNullOrWhiteSpace(value))
                    {
                        throw new SSOAgentException(SSOAgentConstants.SSOAgentConfig.OIDC.OAUTH2_AUTHZ_ENDPOINT +
                                    "is not specified properly. Cannot proceed further.");
                    }
                    authzEndpoint = value;
                }
            }

            public string UserInfoEndpoint
            {
                get { return userInfoEndpoint; }
                set
                {
                    userInfoEndpoint = value;
                }
            }

            public string AuthzGrantType
            {
                get { return authzGrantType; }
                set
                {
                    authzGrantType = value;
                }
            }

            public string CallBackUrl
            {
                get { return callBackUrl; }
                set
                {
                    if (string.IsNullOrWhiteSpace(value))
                    {
                        throw new SSOAgentException(SSOAgentConstants.SSOAgentConfig.OIDC.CALL_BACK_URL
                                     + "is not specified. Cannot proceed further.");
                    }
                    callBackUrl = value;
                }
            }

            public string Scope
            {
                get { return scope; }
                set { scope = value; }
            }

            public string OIDCLogoutEndpoint
            {
                get { return oidcLogoutEndpoint; }
                set { oidcLogoutEndpoint = value; }
            }

            public string SessionIFrameEndpoint
            {
                get { return sessionIFrameEndpoint; }
                set { sessionIFrameEndpoint = value; }
            }

            public string ClientSecret
            {
                get { return clientSecret; }
                set
                {
                    if (string.IsNullOrWhiteSpace(value))
                    {
                        throw new SSOAgentException(SSOAgentConstants.SSOAgentConfig.OIDC.CLIENT_SECRET
                                + "is not specified. Cannot proceed further.");
                    }
                    clientSecret = value;
                }
            }

            public string TokenEndpoint
            {
                get { return tokenEndpoint; }
                set { tokenEndpoint = value; }
            }

            public string PostLogoutRedirectUri
            {
                get { return postLogoutRedirectUri; }
                set
                {
                    postLogoutRedirectUri = value;
                }
            }

            public string SLOURL {
                get { return oidcSLOURL; }
                set
                {
                    if (!string.IsNullOrWhiteSpace(value))
                    {
                        oidcSLOURL = value;
                    }                   
                }

            }
        }
    }
}
