using Agent;
using Agent.util;
using System.Web;

namespace org.wso2.carbon.identity.agent.util
{
    public class SSOAgentRequestResolver
    {
        HttpRequest request;
        SSOAgentConfig ssoAgentConfig;

        public SSOAgentRequestResolver(HttpRequest request, SSOAgentConfig ssoAgentConfig) {
            this.request = request;
            this.ssoAgentConfig = ssoAgentConfig;
        }

        public bool IsSLORequest()
        {
            return ssoAgentConfig.SAML2SSOLoginEnabled && ssoAgentConfig.Saml2.IsSLOEnabled &&
                request.Params[SSOAgentConstants.SAML2SSO.HTTP_POST_PARAM_SAML2_AUTH_REQ] != null;
        }

        public bool IsSAML2SSOURL() {
            return ssoAgentConfig.SAML2SSOLoginEnabled &&
                request.RawUrl.EndsWith(ssoAgentConfig.SAML2SSOURL);
        }

        public bool IsSAML2SSOResponse(HttpRequest request)
        {
            return ssoAgentConfig.SAML2SSOLoginEnabled &&
                request.Params[SSOAgentConstants.SAML2SSO.HTTP_POST_PARAM_SAML2_RESP] != null;                
        }

        public bool IsSLOURL()
        {
            return ssoAgentConfig.SAML2SSOLoginEnabled && ssoAgentConfig.Saml2.IsSLOEnabled &&
                request.RawUrl.EndsWith(ssoAgentConfig.Saml2.SLOURL);

        }
    }
}