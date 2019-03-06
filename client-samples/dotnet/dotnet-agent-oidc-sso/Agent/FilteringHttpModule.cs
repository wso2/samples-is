using Agent.OIDC;
using Agent.Util;
using System;
using System.Web;

namespace Agent
{
    class FilteringHttpModule : IHttpModule
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

            SSOAgentConfig ssoAgentConfig = (SSOAgentConfig)HttpContext.Current.Application[SSOAgentConstants.CONFIG_BEAN_NAME];
            SSOAgentRequestResolver requestResolver = new SSOAgentRequestResolver(context.Request, ssoAgentConfig);
            OIDCManager oidcManager;

            if (requestResolver.IsOIDCCodeResponse())
            {
                oidcManager = new OIDCManager(ssoAgentConfig);
                oidcManager.ProcessCodeResponse(context.Request);
                context.Response.Redirect(HttpContext.Current.Session["loginRequestedFrom"].ToString());
            }

            if (requestResolver.IsOIDCSSOURL())
            {
                oidcManager = new OIDCManager(ssoAgentConfig);

                HttpContext.Current.Session["loginRequestedFrom"] = GetLoginRequstedLocation(context.Request);
                context.Response.Redirect(oidcManager.BuildAuthorizationRequest(context.Request));
            }

            if (requestResolver.IsSLOURL())
            {
                oidcManager = new OIDCManager(ssoAgentConfig);
                context.Response.Redirect(oidcManager.BuildLogoutURL());
            }

            // Following IF block is related to oidc single logout. 
            // This block gets hit when passive authentication falis.
            if (context.Request.Params["error"] != null) {
                context.Session.Abandon();
                context.Response.Redirect(ssoAgentConfig.Oidc.PostLogoutRedirectUri);
            }

            //Handling idp redirection to callback url after successful logout.
            if (requestResolver.IsSLOResponse())
            {
                context.Session.Abandon();
                context.Response.Redirect(ssoAgentConfig.Oidc.PostLogoutRedirectUri);
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

        public void Dispose() { }
    }
}
