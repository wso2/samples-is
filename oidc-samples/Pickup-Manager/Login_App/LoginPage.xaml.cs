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
    /// Interaction logic for LoginPage.xaml.
    /// </summary> 
    public partial class LoginPage : Window
    {
        private string accessToken;
        private string userInfo;
        readonly AuthenticationHelper authenticationHelper = new AuthenticationHelper();

        /// <summary>
        /// Constructor for LoginPage class.
        /// </summary>
        public LoginPage()
        {
            InitializeComponent();          
        }

        /// <summary>
        /// Button_Click event for 'Login' button. This method awaits for 'Login()' method in 
        /// authenticationHelper class and redirect app to the 'Home Page'. 
        /// </summary>
        private async void LoginButton_Click(object sender, RoutedEventArgs e)
        {
            await authenticationHelper.Login();
            this.Activate();
            accessToken = authenticationHelper.AccessToken;
            userInfo = authenticationHelper.UserInfo;

            HomePage home = new HomePage(accessToken, userInfo);
            home.Show();
            this.Close();
        }
    }
}
