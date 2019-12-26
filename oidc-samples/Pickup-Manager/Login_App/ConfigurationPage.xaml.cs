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

using org.wso2.identity.sdk.oidc;
using System.Windows;

namespace org.wso2.identity.sample.PickupManager
{
    /// <summary>
    /// Interaction logic for ConfigurationPage.xaml.
    /// </summary> 
    public partial class ConfigurationPage : Window
    {
        /// <summary>
        /// 'config' is an object that refers ServerConfiguration class 
        /// in 'org.wso2.identity.sdk.oidc' library. 
        /// </summary>
        readonly ServerConfiguration config = new ServerConfiguration();

        /// <summary>
        /// Constructor for ConfigurationPage class and this used to set configuration data 
        /// in 'App.config' to textboxes.
        /// </summary>
        public ConfigurationPage()
        {
            InitializeComponent();

            // Set configuration data in 'App.config' to textboxes.
            idTxt.Text = config.ClientId;
            clientSecretTxt.Password = config.ClientSecret;
            authenticationTxt.Text = config.AuthorizationEndpoint;
            tokenTxt.Text = config.TokenEndpoint;
            userinfoTxt.Text = config.UserInfoEndpoint;
            logoutTxt.Text = config.LogoutEndpoint;
            callbackTxt.Text = config.RedirectUri;
            postLogoutTxt.Text = config.PostLogoutRedirectUri;
        }

        /// <summary>
        /// Button click event for 'Update' button. This method refers to 
        /// ServerConfigurationManager class --> UpdateAppSettings() method in 'org.wso2.identity.sdk.oidc' library
        /// and save user given data to 'app.config' file.  
        /// </summary>
        private void UpdateButton_Click(object sender, RoutedEventArgs e)
        {
            ServerConfigurationManager.UpdateAppSettings(Constants.ClientId, this.idTxt.Text);
            ServerConfigurationManager.UpdateAppSettings(Constants.ClientSecret, this.clientSecretTxt.Password);
            ServerConfigurationManager.UpdateAppSettings(Constants.AuthorizationEndpoint, this.authenticationTxt.Text);
            ServerConfigurationManager.UpdateAppSettings(Constants.TokenEndpoint, this.tokenTxt.Text);
            ServerConfigurationManager.UpdateAppSettings(Constants.UserInfoEndpoint, this.userinfoTxt.Text);
            ServerConfigurationManager.UpdateAppSettings(Constants.LogoutEndpoint, this.logoutTxt.Text);
            ServerConfigurationManager.UpdateAppSettings(Constants.RedirectURI, this.callbackTxt.Text);
            ServerConfigurationManager.UpdateAppSettings(Constants.PostLogoutRedirectURI, this.postLogoutTxt.Text);

            if (SSLcheckbox.IsChecked == true)
            {
                MessageBox.Show("Successfully Updated !", "Information");
                this.Close();
            }
            else 
            {
                MessageBox.Show("Please enable ssl veification checkbox to establish trust relationship for the " +
                    "SSL/TLS secure channel.", "Information");
                this.Show();
            }
        }
    }
}
