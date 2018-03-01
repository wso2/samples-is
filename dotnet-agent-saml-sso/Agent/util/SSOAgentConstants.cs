
namespace Agent.util
{
    class SSOAgentConstants
    {
        public static readonly string CONFIG_BEAN_NAME = "org.wso2.carbon.identity.sso.agent.SSOAgentConfig";
        public static readonly string PROPERTY_FILE_PARAMETER_NAME = "property-file";
        public static readonly string CERTIFICATE_FILE_PARAMETER_NAME = "certificate-file";
       
        public static readonly string CERT_FRIENDLY_NAME = "CertFriendlyName";
      
        public static class SAML2SSO
        {
            public static readonly string HTTP_POST_PARAM_SAML2_AUTH_REQ = "SAMLRequest";
            public static readonly string HTTP_POST_PARAM_SAML2_RESP = "SAMLResponse";

            public static readonly string SAML2_REDIRECT_BINDING_URI = "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect";
            public static readonly string SAML2_POST_BINDING_URI = "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST";
            public static readonly string NameIDFormatPersistentUri = "urn:oasis:names:tc:SAML:2.0:nameid-format:persistent";
        }

        private SSOAgentConstants()
        {
        }

        public static class SSOAgentConfig
        {
            public static readonly string ENABLE_SAML2_SSO_LOGIN = "EnableSAML2SSOLogin";
            public static readonly string ENABLE_OPENID_SSO_LOGIN = "EnableOpenIDLogin";       
            public static readonly string SAML2_SSO_URL = "SAML2SSOURL";
            public static readonly string SKIP_URIS = "SkipURIs";
            public static readonly string QUERY_PARAMS = "QueryParams";
            public static readonly string SAML_REQUEST_QUERY_PARAM = "SAML.Request.Query.Param";

            public static class SAML2
            {

                public static readonly string HTTP_BINDING = "HTTPBinding";
                public static readonly string SP_ENTITY_ID = "SPEntityId";
                public static readonly string ACS_URL = "AssertionConsumerURL";
                public static readonly string IDP_ENTITY_ID = "IdPEntityId";
                public static readonly string IDP_URL = "IdPURL";
                public static readonly string ATTRIBUTE_CONSUMING_SERVICE_INDEX = "AttributeConsumingServiceIndex";
                public static readonly string ENABLE_SLO = "EnableSLO";
                public static readonly string SLO_URL = "SLOURL";
                public static readonly string ENABLE_ASSERTION_SIGNING = "EnableAssertionSigning";
                public static readonly string ENABLE_ASSERTION_ENCRYPTION = "EnableAssertionEncryption";
                public static readonly string ENABLE_RESPONSE_SIGNING = "EnableResponseSigning";
                public static readonly string ENABLE_REQUEST_SIGNING = "EnableRequestSigning";
                public static readonly string IS_PASSIVE_AUTHN = "IsPassiveAuthn";
                public static readonly string IS_FORCE_AUTHN = "IsForceAuthn";
                public static readonly string RELAY_STATE = "RelayState";
                public static readonly string POST_BINDING_REQUEST_HTML_PAYLOAD = "PostBindingRequestHTMLPayload";
                public static readonly string POST_BINDING_REQUEST_HTML_FILE_PATH = "PostBindingRequestHTMLFilePath";
                public static readonly string SIGNATURE_VALIDATOR = "SignatureValidatorImplClass";
                public static readonly string TIME_STAMP_SKEW = "TimestampSkewSeconds";
                public static readonly string POST_LOGOUT_REDIRECT_URL = "PostLogoutRedirectUrl";
            }

            public static class SSL
            {
                public static readonly string ENABLE_SSL_VERIFICATION = "SSL.EnableSSLVerification";
                public static readonly string ENABLE_SSL_HOST_NAME_VERIFICATION = "SSL.EnableSSLHostNameVerification";
            }
        }
    }
}
