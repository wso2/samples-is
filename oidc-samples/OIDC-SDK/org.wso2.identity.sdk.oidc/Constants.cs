/* 
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

namespace org.wso2.identity.sdk.oidc
{
    /// <summary>
    /// A collection of all constants.
    /// </summary>
    public class Constants
    {
        private const string clientId = "ClientId";
        private const string clientSecret = "ClientSecret";
        private const string authorizationEndpoint = "AuthorizationEndpoint";
        private const string tokenEndpoint = "TokenEndpoint";
        private const string userInfoEndpoint = "UserInfoEndpoint";
        private const string logoutEndpoint = "LogoutEndpoint";
        private const string redirectURI = "RedirectURI";
        private const string postLogoutRedirectURI = "PostLogoutRedirectURI";
        private const string codeChallengeMethod = "S256";
        private const string authorizationRequest = "{0}?response_type=code&scope=openid%20profile&" +
                "redirect_uri={1}&client_id={2}&state={3}&code_challenge={4}&code_challenge_method={5}";
        private const string responseString = "<html><head><meta http-equiv='refresh' content='10;" +
                "url=https://google.com'></head><body>Please close the browser and return to the app.</body></html>";
        private const string code = "code";
        private const string state = "state";
        private const string tokenRequestBody = "code={0}&redirect_uri={1}&client_id={2}&code_verifier={3}" +
                "&client_secret={4}&scope=&grant_type=authorization_code";
        private const string methodPost = "POST";
        private const string methodGet = "GET";
        private const string contentType = "application/x-www-form-urlencoded";
        private const string accept = "Accept=text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";
        private const string postRedirectURI = "{0}?id_token_hint={1}&post_logout_redirect_uri={2}";

        public static string ClientId => clientId;
        public static string ClientSecret => clientSecret;
        public static string AuthorizationEndpoint => authorizationEndpoint;
        public static string TokenEndpoint => tokenEndpoint;
        public static string UserInfoEndpoint => userInfoEndpoint;
        public static string LogoutEndpoint => logoutEndpoint;
        public static string RedirectURI => redirectURI;
        public static string PostLogoutRedirectURI => postLogoutRedirectURI;
        public static string AuthorizationRequest => authorizationRequest;
        public static string ResponseString => responseString;
        public static string TokenRequestBody => tokenRequestBody;
        public static string Code => code;
        public static string State => state;
        public static string MethodPost => methodPost;
        public static string MethodGet => methodGet;
        public static string ContentType => contentType;
        public static string Accept => accept;
        public static string CodeChallengeMethod => codeChallengeMethod;
        public static string PostRedirectURI => postRedirectURI;
    }
}
