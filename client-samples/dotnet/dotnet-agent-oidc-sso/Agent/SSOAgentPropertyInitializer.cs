using Agent.Util;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.Linq;
using System.Web;
using static Agent.Util.SSOAgentConstants.SSOAgentConfig;
using static Agent.Util.SSOAgentConstants.SSOAgentConfig.OIDC;

namespace Agent
{
    class SSOAgentPropertyInitializer
    {
        public void InitializePropertySet()
        {
            Dictionary<string, string> ssoProperties = new Dictionary<string, string>();

            //assign default values for properties
            LoadDefaultValuesForProperties(ssoProperties);

            //load values from Settings.settings file
            LoadSettingsFileValuesForProperties(ssoProperties);

            SSOAgentConfig ssoAgentConfig = new SSOAgentConfig(ssoProperties);

            HttpContext.Current.Application[SSOAgentConstants.CONFIG_BEAN_NAME] = ssoAgentConfig;
        }

        private void LoadDefaultValuesForProperties(Dictionary<string, string> ssoProperties)
        {
            ssoProperties.Add(ENABLE_OIDC_SSO_LOGIN, "false");
            ssoProperties.Add(OIDC_SSO_URL, "oidcsso");
            ssoProperties.Add(SERVICE_PROVIDER_NAME, null);
            ssoProperties.Add(CLIENT_ID, null);
            ssoProperties.Add(CLIENT_SECRET, null);
            ssoProperties.Add(CALL_BACK_URL, null);
            ssoProperties.Add(OIDC_LOGOUT_ENDPOINT, "https://localhost:9443/oidc/logout");
            ssoProperties.Add(SLO_URL,"oidclogout");
            ssoProperties.Add(OIDC_SESSION_IFRAME_ENDPOINT, null);
            ssoProperties.Add(POST_LOGOUT_REDIRECT_URI, null);
            ssoProperties.Add(OAUTH2_AUTHZ_ENDPOINT, "https://localhost:9443/oauth2/authorize");
            ssoProperties.Add(OAUTH2_TOKEN_ENDPOINT, "https://localhost:9443/oauth2/token");
            ssoProperties.Add(OAUTH2_USER_INFO_ENDPOINT, "https://localhost:9443/oauth2/userinfo?schema=openid");
            ssoProperties.Add(OAUTH2_GRANT_TYPE, "code");
            ssoProperties.Add(ENABLE_ID_TOKEN_VALIDATION, "false");
            ssoProperties.Add(SCOPE, "openid");
            ssoProperties.Add(SSOAgentConstants.CERT_FRIENDLY_NAME,"wso2carbon");
        }

        private void LoadSettingsFileValuesForProperties(Dictionary<string, string> ssoProperties)
        {
            // Overriding default values with properties defined under appSettings in web.config file.
            NameValueCollection appSettings = ConfigurationManager.AppSettings;
            for (int i = 0; i < appSettings.Count; i++)
            {
                if (ssoProperties.Keys.Contains(appSettings.GetKey(i)))
                {
                    ssoProperties[appSettings.GetKey(i)] = appSettings.Get(i);
                }
            }
        }
    }
}
