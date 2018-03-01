using Agent;
using Agent.util;
using org.wso2.carbon.identity.agent.saml;
using org.wso2.carbon.identity.agent.util;
using System;
using System.Web;

namespace org.wso2.carbon.identity.agent
{
    public class FilteringHttpModule : IHttpModule
    {
        public void Init(HttpApplication context)
        {
            context.PostAcquireRequestState += PostAcquireRequestState;

            SSOAgentPropertyInitializer ssoPropertyInitializer = new SSOAgentPropertyInitializer();
            ssoPropertyInitializer.InitializePropertySet();
        }

        private void PostAcquireRequestState(object sender, EventArgs e)
        {
            HttpApplication application = (HttpApplication)sender;
            HttpContext context = application.Context;

            SSOAgentConfig ssoAgentConfig =  (SSOAgentConfig)HttpContext.Current.Application[SSOAgentConstants.CONFIG_BEAN_NAME];
            SSOAgentRequestResolver requestResolver = new SSOAgentRequestResolver(context.Request,ssoAgentConfig);

            // Single logout request, as a result of some other application.
            if (requestResolver.IsSLORequest())
            {
                SAML2SSOManager samlSSOManager = new SAML2SSOManager(ssoAgentConfig);
                samlSSOManager.ProcessSAMLRequest(context);
                
                context.Response.Clear();
                context.Response.StatusCode = 200;
                context.Response.End();
                return;
            }
           
            // Requesting log out by the currently running application.
            else if (requestResolver.IsSLOURL()) {
                SAML2SSOManager samlSSOManager = new SAML2SSOManager(ssoAgentConfig);

                if (ssoAgentConfig.Saml2.HttpBinding == SSOAgentConstants.SAML2SSO.SAML2_REDIRECT_BINDING_URI)
                {
                    context.Response.Redirect(samlSSOManager.BuildRedirectBindingLogoutRequest());
                }
                else
                {
                    samlSSOManager.SendPostBindingLogoutRequest(context);
                }                   
            }

            // Requests with SAMLResponse param is handled by below block.
            else if (requestResolver.IsSAML2SSOResponse(context.Request))
            {
                SAML2SSOManager samlSSOManager = new SAML2SSOManager(ssoAgentConfig);
                samlSSOManager.ProcessSAMLResponse(context.Request, context.Response);
            }

            else if (requestResolver.IsSAML2SSOURL())
            {
                HttpContext.Current.Session["loginRequestedFrom"] = GetLoginRequstedLocation(context.Request);

                SAML2SSOManager samlSSOManager = new SAML2SSOManager(ssoAgentConfig);
                
                if (ssoAgentConfig.Saml2.HttpBinding == SSOAgentConstants.SAML2SSO.SAML2_REDIRECT_BINDING_URI)
                {
                    context.Response.Redirect(samlSSOManager.BuildRedirectBindingLoginRequest());
                }
                else
                {
                    samlSSOManager.SendPostBindingLoginRequest(context);
                }
            }
        }

        private string GetLoginRequstedLocation(HttpRequest request)
        {
            var uri = new Uri(request.Url.AbsoluteUri);

            var requestedLocation = string.Format("{0}://{1}", uri.Scheme, uri.Authority);

            for (int i = 0; i < uri.Segments.Length - 1; i++)
            {
                requestedLocation += uri.Segments[i];
            }

            // Remove trailing '/'.
            requestedLocation = requestedLocation.Trim("/".ToCharArray());
            return requestedLocation;
        }

        public void Dispose()
        {
        }
    }
}