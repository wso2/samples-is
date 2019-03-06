using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace sample.util
{
    public class SSOAgentRequestResolver
    {
        HttpRequest request = null;
        
        public SSOAgentRequestResolver(HttpRequest request) {
            this.request = request;
            foreach(var v in Properties.Settings.Default.Properties){
              
            }
        }
        
        public Boolean isSAML2SSOURL() {
            return request.RawUrl.EndsWith("/samlsso");
        }

        public bool isSAML2SSOResponse(HttpRequest request)
        {
            return request.Params["SAMLResponse"] != null;                
        }
    }
}