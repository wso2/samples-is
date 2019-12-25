﻿/*
 * Copyright (c) 2019, WSO2 Inc. (http://wso2.com) All Rights Reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.IO;
using System.Security.Cryptography;
using log4net;

namespace org.wso2.identity.sdk.oidc
{
    public class AuthenticationHelper// rename to Authenticat
    {
        private string accessToken;
        private string userInfo;

        public string AccessToken { get => accessToken; set => accessToken = value; }
        public string UserInfo { get => userInfo; set => userInfo = value; }

        ServerConfiguration config = new ServerConfiguration();
        ServerConfigurationManager configurationManager = new ServerConfigurationManager();

        // Declare an instance for log4net
        private static readonly ILog Log =
              LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        public async Task Login()
        { 
            // Generates state and PKCE values.
            string state = RandomDataBase64url(32);
            string codeVerifier = RandomDataBase64url(32);
            string codeChallenge = Base64urlencodeNoPadding(Sha256(codeVerifier));
            string codeChallengeMethod = Constants.CodeChallengeMethod;

            // Creates HttpListener to listen for requests on above redirect URI.
            var http = new HttpListener();
            http.Prefixes.Add(config.PostLogoutRedirectUri);
            // Open the web browser.
            http.Start();

            // Create the OAuth2 authorization request.
            string authorizationRequest = string.Format(Constants.AuthorizationRequest,
                config.AuthorizationEndpoint,
                System.Uri.EscapeDataString(config.PostLogoutRedirectUri),
                config.ClientId,
                state,
                codeChallenge,
                codeChallengeMethod);

            // Opens request in the browser.
            System.Diagnostics.Process.Start(authorizationRequest);

            // Waits for the OAuth authorization response. 
            var context = await http.GetContextAsync();

            // Sends an HTTP response to the browser.
            var response = context.Response;
            string responseString = string.Format(Constants.ResponseString);
            var buffer = System.Text.Encoding.UTF8.GetBytes(responseString);
            response.ContentLength64 = buffer.Length;
            var responseOutput = response.OutputStream;
            Task responseTask = responseOutput.WriteAsync(buffer, 0, buffer.Length).ContinueWith((task) =>
            {
                responseOutput.Close();
                http.Stop();
                Log.Info("HTTP server stopped.");

            });

            // Checks for errors.
            if (context.Request.QueryString.Get("error") != null)
            {
                Log.Info(String.Format("OAuth authorization error: {0}.", context.Request.QueryString.Get("error")));

                return;
            }
            if (context.Request.QueryString.Get(Constants.Code) == null
                || context.Request.QueryString.Get(Constants.State) == null)
            {
                Log.Info("Malformed authorization response. " + context.Request.QueryString);

                return;
            }

            // Extracts the code.
            var code = context.Request.QueryString.Get(Constants.Code);
            var incomingState = context.Request.QueryString.Get(Constants.State);

            // Compares the receieved state to the expected value, 
            //to ensure that this app made the request which resulted in authorization.
            if (incomingState != state)
            {
                Log.Info(String.Format("Received request with invalid state ({0})", incomingState));

                return;
            }
            Log.Info("Authorization code: " + code);

            // Starts the code exchange at the Token Endpoint.
            await PerformCodeExchange(code, codeVerifier, config.PostLogoutRedirectUri);
        }

        // Exchanging code for tokens.
        public async Task PerformCodeExchange(string code, string codeVerifier, string redirectURI)
        {
            // Build the request.
            string tokenRequestBody = string.Format(Constants.TokenRequestBody,
                code,
                System.Uri.EscapeDataString(redirectURI),
                config.ClientId,
                codeVerifier,
                config.ClientSecret
                );

            // Enable ssl veification to establish trust relationship for the SSL/TLS secure channel.           
            configurationManager.EnableSSLverification();

            // Sends the request.
            HttpWebRequest tokenRequest = (HttpWebRequest)WebRequest.Create(config.TokenEndpoint);
            tokenRequest.Method = Constants.MethodPost;
            tokenRequest.ContentType = Constants.ContentType;
            tokenRequest.Accept = Constants.Accept;
            byte[] _byteVersion = Encoding.ASCII.GetBytes(tokenRequestBody);
            tokenRequest.ContentLength = _byteVersion.Length;
            Stream stream = tokenRequest.GetRequestStream();
            await stream.WriteAsync(_byteVersion, 0, _byteVersion.Length);
            stream.Close();

            try
            {
                // Gets the response.
                WebResponse tokenResponse = await tokenRequest.GetResponseAsync();
                using (StreamReader reader = new StreamReader(tokenResponse.GetResponseStream()))
                {
                    // Reads the response body.
                    string responseText = await reader.ReadToEndAsync();
                    this.AccessToken = responseText;

                    // Converts to dictionary.
                    Dictionary<string, string> tokenEndpointDecoded = JsonConvert.DeserializeObject<
                        Dictionary<string, string>>(responseText);

                    string accessToken = tokenEndpointDecoded["access_token"];
                    await UserinfoCall(accessToken);
                }

            }
            catch (WebException ex)
            {
                if (ex.Status == WebExceptionStatus.ProtocolError)
                {
                    if (ex.Response is HttpWebResponse response)
                    {
                        Log.Info("HTTP: " + response.StatusCode);
                        using (StreamReader reader = new StreamReader(response.GetResponseStream()))
                        {
                            // Reads the response body.
                            string responseText = await reader.ReadToEndAsync();
                            Log.Info(responseText);
                        }
                    }

                }
            }
        }

        // Make API call to Userinfo.
        public async Task UserinfoCall(string access_token)
        {
            // Sends request.
            HttpWebRequest userinfoRequest = (HttpWebRequest)WebRequest.Create(config.UserInfoEndpoint);
            userinfoRequest.Method = Constants.MethodGet;
            userinfoRequest.Headers.Add(string.Format("Authorization: Bearer {0}", access_token));
            userinfoRequest.ContentType = Constants.ContentType;
            userinfoRequest.Accept = Constants.Accept;

            // Gets response.
            WebResponse userinfoResponse = await userinfoRequest.GetResponseAsync();
            using (StreamReader userinfoResponseReader = new StreamReader(userinfoResponse.GetResponseStream()))
            {
                // Reads response body.
                string userinfoResponseText = await userinfoResponseReader.ReadToEndAsync();
                this.UserInfo = userinfoResponseText;
            }

        }

        // Returns URI-safe data with a given input length. 
        public static string RandomDataBase64url(uint length)
        {
            RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider();
            byte[] bytes = new byte[length];
            rng.GetBytes(bytes);
            return Base64urlencodeNoPadding(bytes);
        }

        // Returns the SHA256 hash of the input string.
        public static byte[] Sha256(string inputStirng)
        {
            byte[] bytes = Encoding.ASCII.GetBytes(inputStirng);
            SHA256Managed sha256 = new SHA256Managed();
            return sha256.ComputeHash(bytes);
        }

        // Base64url no-padding encodes the given input buffer.
        public static string Base64urlencodeNoPadding(byte[] buffer)
        {
            string base64 = Convert.ToBase64String(buffer);

            // Converts base64 to base64url.
            base64 = base64.Replace("+", "-");
            base64 = base64.Replace("/", "_");
            // Strips padding.
            base64 = base64.Replace("=", "");

            return base64;
        }
    }
}
