
using System.Linq;
using System.Web;

namespace Agent.Util
{
    class SSOAgentRequestResolver
    {
        HttpRequest request;
        SSOAgentConfig ssoAgentConfig;

        public SSOAgentRequestResolver(HttpRequest request, SSOAgentConfig ssoAgentConfig)
        {
            this.request = request;
            this.ssoAgentConfig = ssoAgentConfig;
        }

        internal bool IsOIDCSSOURL()
        {
            return ssoAgentConfig.OIDCLoginEnabled && request.RawUrl.EndsWith(ssoAgentConfig.OIDCURL);
        }

        internal bool IsOIDCCodeResponse()
        {
            string acsEndSegment = ssoAgentConfig.Oidc.CallBackUrl.Split('/').Last();

            return ssoAgentConfig.OIDCLoginEnabled && (request.Url.AbsolutePath.EndsWith(acsEndSegment)
                && request.Params["code"] != null);
        }

        internal bool IsSLOURL()
        {
            return ssoAgentConfig.OIDCLoginEnabled && (request.Url.AbsolutePath.EndsWith(ssoAgentConfig.Oidc.SLOURL));
        }

        internal bool IsSLOResponse()
        {
            string acsEndSegment = ssoAgentConfig.Oidc.CallBackUrl.Split('/').Last();
            return request.Url.AbsolutePath.EndsWith(acsEndSegment);
        }
    }
}
