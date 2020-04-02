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

using System.Configuration;

namespace org.wso2.identity.sdk.oidc
{
    /// <summary>
    /// Manage all server configurations.
    /// </summary>
    public class ServerConfiguration
    {
        private string clientId;
        private string clientSecret;
        private string authorizationEndpoint;
        private string tokenEndpoint;
        private string userInfoEndpoint;
        private string logoutEndpoint;
        private string redirectUri;
        private string postLogoutRedirectUri;

        public string ClientId { get => clientId; set => clientId = value; }
        public string ClientSecret { get => clientSecret; set => clientSecret = value; }
        public string AuthorizationEndpoint { get => authorizationEndpoint; set => authorizationEndpoint = value; }
        public string TokenEndpoint { get => tokenEndpoint; set => tokenEndpoint = value; }
        public string UserInfoEndpoint { get => userInfoEndpoint; set => userInfoEndpoint = value; }
        public string LogoutEndpoint { get => logoutEndpoint; set => logoutEndpoint = value; }
        public string RedirectUri { get => redirectUri; set => redirectUri = value; }
        public string PostLogoutRedirectUri { get => postLogoutRedirectUri; set => postLogoutRedirectUri = value; }

        /// <summary>
        /// Retrieves data to the frontend from 'app.config' file.
        /// </summary>
        public ServerConfiguration()
        {
            this.ClientId = ConfigurationManager.AppSettings[Constants.ClientId];
            this.ClientSecret = ConfigurationManager.AppSettings[Constants.ClientSecret];
            this.AuthorizationEndpoint = ConfigurationManager.AppSettings[Constants.AuthorizationEndpoint];
            this.TokenEndpoint = ConfigurationManager.AppSettings[Constants.TokenEndpoint];
            this.UserInfoEndpoint = ConfigurationManager.AppSettings[Constants.UserInfoEndpoint];
            this.LogoutEndpoint = ConfigurationManager.AppSettings[Constants.LogoutEndpoint];
            this.RedirectUri = ConfigurationManager.AppSettings[Constants.RedirectURI];
            this.PostLogoutRedirectUri = ConfigurationManager.AppSettings[Constants.PostLogoutRedirectURI];
        }
    }
}
