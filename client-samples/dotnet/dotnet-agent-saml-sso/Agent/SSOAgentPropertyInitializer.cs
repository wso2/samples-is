using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.Linq;
using System.Web;
using Agent.util;
using static Agent.util.SSOAgentConstants.SSOAgentConfig;
using static Agent.util.SSOAgentConstants.SSOAgentConfig.SAML2;

namespace Agent
{
    public class SSOAgentPropertyInitializer
    {
        public void InitializePropertySet() {

            Dictionary<string, string> ssoProperties = new Dictionary<string, string>();
            
            //assign default values for properties
            LoadDefaultValuesForProperties(ssoProperties);

            //load values from Settings.settings file
            LoadSettingsFileValuesForProperties(ssoProperties);
           
            SSOAgentConfig ssoAgentConfig = new SSOAgentConfig(ssoProperties);
           
            HttpContext.Current.Application[SSOAgentConstants.CONFIG_BEAN_NAME] = ssoAgentConfig;
        }

        private void LoadSettingsFileValuesForProperties(Dictionary<string, string> ssoProperties)
        {
            //overriding default values with proeprties defined under appSettings in web.config file
            NameValueCollection appSettings = ConfigurationManager.AppSettings;
            for(int i = 0; i < appSettings.Count; i++)
            {
                if (ssoProperties.Keys.Contains(appSettings.GetKey(i)))
                {
                    ssoProperties[appSettings.GetKey(i)] = appSettings.Get(i);
                }               
            }
        }

        private void LoadDefaultValuesForProperties(Dictionary<string, string> ssoProperties)
        {
            ssoProperties.Add(ENABLE_SAML2_SSO_LOGIN, "false");
            ssoProperties.Add(SAML2_SSO_URL, "samlsso");
            ssoProperties.Add(HTTP_BINDING,SSOAgentConstants.SAML2SSO.SAML2_POST_BINDING_URI);
            ssoProperties.Add(SP_ENTITY_ID, null);
            ssoProperties.Add(ACS_URL, null);
            ssoProperties.Add(IDP_ENTITY_ID, "localhost");
            ssoProperties.Add(IDP_URL, "https://localhost:9443/samlsso");
            ssoProperties.Add(ATTRIBUTE_CONSUMING_SERVICE_INDEX, null);
            ssoProperties.Add(ENABLE_SLO, "false");
            ssoProperties.Add(SLO_URL, "samllogout");
            ssoProperties.Add(ENABLE_ASSERTION_SIGNING, "false");
            ssoProperties.Add(ENABLE_ASSERTION_ENCRYPTION, "false");
            ssoProperties.Add(ENABLE_RESPONSE_SIGNING, "false");
            ssoProperties.Add(ENABLE_REQUEST_SIGNING, "false");
            ssoProperties.Add(IS_PASSIVE_AUTHN, "false");
            ssoProperties.Add(IS_FORCE_AUTHN, "false");
            ssoProperties.Add(RELAY_STATE, null);
            ssoProperties.Add(POST_BINDING_REQUEST_HTML_PAYLOAD, null);
            ssoProperties.Add(TIME_STAMP_SKEW, "300");
            ssoProperties.Add(POST_LOGOUT_REDIRECT_URL, null);
            ssoProperties.Add(SSOAgentConstants.CERT_FRIENDLY_NAME, "wso2carbon");
        }
    }
}
