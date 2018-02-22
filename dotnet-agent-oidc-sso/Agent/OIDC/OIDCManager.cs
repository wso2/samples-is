using Agent.Exceptions;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Net;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.SessionState;

namespace Agent.OIDC
{
    class OIDCManager : IRequiresSessionState
    {
        SSOAgentConfig ssoAgentConfig = null;

        public OIDCManager(SSOAgentConfig ssoAgentConfig)
        {
            this.ssoAgentConfig = ssoAgentConfig;
        }

        public string BuildAuthorizationRequest(HttpRequest request)
        {
            string redirectUri = ssoAgentConfig.Oidc.CallBackUrl;
            string clientId = ssoAgentConfig.Oidc.ClientId;
            string scope = ssoAgentConfig.Oidc.Scope;
            string responseType = ssoAgentConfig.Oidc.AuthzGrantType;
            string authzEndpoint = ssoAgentConfig.Oidc.AuthzEndpoint;
            string nonce = GetMd5Hash(MD5.Create(), HttpContext.Current.Session.SessionID);

            HttpContext.Current.Session.Add("hashOfSessionId", nonce);

            return authzEndpoint + "?client_id=" + clientId + "&scope=" + scope + "&redirect_uri=" + redirectUri +
                "&response_type=" + responseType + "&nonce=" + nonce;
        }

        public void ProcessCodeResponse(HttpRequest request)
        {
            bool validIDToken = true;

            //setting session state
            HttpContext.Current.Session["session_state"] = request.Params["session_state"]; 

            NameValueCollection param = new NameValueCollection();
            param.Add("client_id", ssoAgentConfig.Oidc.ClientId);
            param.Add("client_secret", ssoAgentConfig.Oidc.ClientSecret);
            param.Add("grant_type", "authorization_code");
            param.Add("code", request.Params["code"]);
            param.Add("redirect_uri", ssoAgentConfig.Oidc.CallBackUrl);

            WebClient client = new WebClient();
            dynamic data;

            try
            {
                var result = client.UploadValues(ssoAgentConfig.Oidc.TokenEndpoint, param);

                var response = Encoding.UTF8.GetString(result);

                JavaScriptSerializer javaScriptSerialiser = new JavaScriptSerializer();
                data = javaScriptSerialiser.Deserialize<dynamic>(response);
            }
            catch (Exception e)
            {
                throw new SSOAgentException("Failed to communicate with token endpoint.", e);
            }

            string accessToken = data["access_token"];
            string refreshToken = data["refresh_token"];
            string scope = data["scope"];

            string idToken = data["id_token"];
            HttpContext.Current.Session["id_token"] = data["id_token"];

            if (ssoAgentConfig.Oidc.IsIDTokenValidationEnabled)
            {
                validIDToken = ValidateIDTokenPayload(idToken, request) && (ValidateIDTokenSignature(idToken) != null);
            }

            if (validIDToken)
            {
                Dictionary<string, string> claims = new Dictionary<string, string>();

                JObject jObject = FetchUserInfo(accessToken);

                foreach (var v in jObject.Properties())
                {
                    claims.Add(v.Name, v.Value.ToString());
                }

                HttpContext.Current.Session["claims"] = claims;
            }
        }

        internal string BuildLogoutURL()
        {
            string logoutUrl = null;
            logoutUrl = ssoAgentConfig.Oidc.OIDCLogoutEndpoint + "?post_logout_redirect_uri=" +
                        ssoAgentConfig.Oidc.CallBackUrl + "&id_token_hint=" +
                        HttpContext.Current.Session["id_token"];
            return logoutUrl;
        }

        private SecurityToken ValidateIDTokenSignature(string idToken)
        {
            var validationParams = new TokenValidationParameters()
            {
                ValidAudience = ssoAgentConfig.Oidc.ClientId,
                ValidIssuer = ssoAgentConfig.Oidc.TokenEndpoint,
                ValidateLifetime = false,
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new X509SecurityKey(LoadX509Certificate())
            };

            var handler = new JwtSecurityTokenHandler();

            handler.ValidateToken(idToken, validationParams, out SecurityToken validatedToken);
            return validatedToken;
        }

        private bool ValidateIDTokenPayload(string idToken, HttpRequest request)
        {
            JwtSecurityToken securityToken = new JwtSecurityToken(idToken);
            bool validIssuer = false;
            bool validAudience = false;
            bool validTimeParams = false;
            bool validNonce = false;

            if (ssoAgentConfig.Oidc.TokenEndpoint == securityToken.Issuer)
            {
                validIssuer = true;
            }
            else
            {
                throw new SSOAgentException("Issuer in JWT token does not match with the registered issuer:" +
                        ssoAgentConfig.Oidc.TokenEndpoint);
            }

            foreach (var aud in securityToken.Audiences)
            {
                if (aud == ssoAgentConfig.Oidc.ClientId)
                {
                    validAudience = true;
                    break;
                }
            }

            if (!validAudience)
            {
                throw new SSOAgentException("Audience of JWT token does not contains the registered id:"
                        + ssoAgentConfig.Oidc.ClientId);
            }

            DateTime exp = UnixTimeStampToDateTime(Convert.ToDouble(securityToken.Payload.Exp));
            DateTime iat = UnixTimeStampToDateTime(Convert.ToDouble(securityToken.Payload.Iat));

            if (iat < DateTime.UtcNow && exp > DateTime.UtcNow)
            {
                validTimeParams = true;
            }
            else throw new SSOAgentException("Validation of exp, iat failed for the JWT token.");

            if (securityToken.Payload.Nonce != null)
            {
                if (HttpContext.Current.Session["hashOfSessionId"].Equals(securityToken.Payload.Nonce))
                {
                    validNonce = true;
                }
                else
                {
                    throw new SSOAgentException("Nonce validation failed for the JWT token.");
                }
            }
            else
            {
                validNonce = true;
            }
            return validIssuer && validAudience && validTimeParams && validNonce;
        }

        public JObject FetchUserInfo(string accessToken)
        {
            try
            {
                WebClient webClient = new WebClient();
                webClient.Headers.Set(HttpRequestHeader.ContentType, "application/x-www-form-urlencoded");
                webClient.Headers.Set(HttpRequestHeader.Authorization, "Bearer " + accessToken);
                webClient.Headers.Set(HttpRequestHeader.ContentLanguage, "en-US");

                Stream stream = webClient.OpenRead(ssoAgentConfig.Oidc.UserInfoEndpoint);

                //myURLConnection.setUseCaches(false);
                // myURLConnection.setDoInput(true);
                //myURLConnection.setDoOutput(true);

                StreamReader streamReader = new StreamReader(stream);
                string result = streamReader.ReadToEnd();

                JObject jsonObject = JObject.Parse(result);
                return jsonObject;
            }
            catch (Exception e)
            {
                throw new SSOAgentException("Error occured while trying to fetch user information!", e);
            }
        }

        public static DateTime UnixTimeStampToDateTime(double unixTimeStamp)
        {
            DateTime dtDateTime;
            try
            {
                // Unix timestamp is seconds past epoch.
                dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
                dtDateTime = dtDateTime.AddSeconds(unixTimeStamp).ToUniversalTime();
            }
            catch (ArgumentException e)
            {
                throw new SSOAgentException("An error occurred while trying to convert Unix timestamp to DateTime object", e);
            }
            return dtDateTime;
        }

        public static string GetMd5Hash(MD5 md5Hash, string input)
        {
            // Convert the input string to a byte array and compute the hash.
            byte[] data = md5Hash.ComputeHash(Encoding.UTF8.GetBytes(input));

            // Create a new Stringbuilder to collect the bytes
            // and create a string.
            StringBuilder sBuilder = new StringBuilder();

            // Loop through each byte of the hashed data 
            // and format each one as a hexadecimal string.
            for (int i = 0; i < data.Length; i++)
            {
                sBuilder.Append(data[i].ToString("x2"));
            }

            // Return the hexadecimal string.
            return sBuilder.ToString();
        }

        private X509Certificate2 LoadX509Certificate()
        {
            // Commented code below code can be incorporated if you want to use custom location for certificate.
            // var baseFolder = AppDomain.CurrentDomain.BaseDirectory;
            // string certificateFilePath = $"{baseFolder}\\wso2carbon.p12";

            X509Store store = new X509Store(StoreLocation.LocalMachine);

            try
            {
                store.Open(OpenFlags.ReadOnly);
            }
            catch (Exception e)
            {
                throw new SSOAgentException("Failed to open X509 certificate store of the local machine.", e);
            }

            X509Certificate2Collection certificatesCollection = store.Certificates;

            X509Certificate2 cert = null;

            foreach (X509Certificate2 ce in certificatesCollection)
            {
                if (ce.FriendlyName.Equals(ssoAgentConfig.X509CertificateFriendlyName) && ce.HasPrivateKey)
                {
                    cert = new X509Certificate2(ce);
                }
            }
            return cert;
        }
    }
}
