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

using Newtonsoft.Json;
using System.Windows;
using log4net;
using org.wso2.identity.sdk.oidc;

namespace org.wso2.identity.sample.PickupManager
{
    /// <summary>
    /// Interaction logic for HomePage.xaml.
    /// </summary> 
    public partial class HomePage : Window
    {
        // Declare an instance for log4net.
        private static readonly ILog Log = LogManager.GetLogger(System.Reflection.MethodBase.
            GetCurrentMethod().DeclaringType);

        // Variable declaration.
        public string idToken = null;
        private readonly string accessToken;
        private readonly string userInfo;
        private string request;

        /// <summary>
        /// 'config' is an object that refers ServerConfiguration class 
        /// in 'org.wso2.identity.sdk.oidc' library.
        /// </summary>
        readonly ServerConfiguration config = new ServerConfiguration();
        readonly AuthenticationHelper authenticationHelper = new AuthenticationHelper();

        /// <summary>
        /// Constructor for HomePage class.
        /// </summary>
        /// <param name="accessToken"> Refers to accessToken in 'LoginPage.xaml.cs' file. </param>
        /// <param name="userInfo"> Refers to userInfo in 'LoginPage.xaml.cs' file. </param>
        public HomePage(string accessToken, string userInfo)
        {
            InitializeComponent();
            this.userInfo = userInfo;
            this.accessToken = accessToken;
            Display();
        }

        /// <summary>
        /// Method to display the ID token and user_name from the access token. 
        /// </summary>
        public void Display()
        {
            // Get id_token.  
            dynamic json1 = JsonConvert.DeserializeObject(this.accessToken);
            idToken = json1.id_token;

            // Display the logged users' name.  
            dynamic json = JsonConvert.DeserializeObject(this.userInfo);
            var name = json.sub;
            clientNameTextBox.Text = $"Hi {name}";
        }

        /// <summary>
        /// Method generate for TextBoxOutput_TextChanged event.
        /// </summary>
        private void TextBoxOutput_TextChanged(object sender, System.Windows.Controls.TextChangedEventArgs e)
        {
        }

        /// <summary>
        /// Button_Click event for 'Settings' button.
        /// </summary>
        private void Settings_button_click(object sender, RoutedEventArgs e)
        {
            TokenInfoPage tokenInfo = new TokenInfoPage(accessToken);
            tokenInfo.Show();
        }

        /// <summary>
        /// Button_Click event for 'Logout' button.
        /// </summary>
        private async void Logout_button_click(object sender, RoutedEventArgs e)
        {
            MessageBoxResult result = MessageBox.Show("Would you like to LOGOUT from this application ?",
                "Logout", MessageBoxButton.YesNoCancel);

            switch (result)
            {
                case MessageBoxResult.Yes:
                    // Redirect to Logout method in org.wso2.identity.sdk.oidc.dll file.
                    await authenticationHelper.Logout(accessToken);
                    request = authenticationHelper.Request;

                    if (request.Contains("error"))
                    {
                        // Show current window.
                        this.Show();
                        this.Activate();
                    }
                    else
                    {
                        // Brings this app back to the foreground.
                        LoginPage login = new LoginPage();
                        login.Show();
                        login.Activate();
                        this.Close();
                    }
                    break;

                case MessageBoxResult.No:
                    this.Show();
                    break;

                case MessageBoxResult.Cancel:
                    this.Show();
                    break;
            }
        }

        /// <summary>
        /// Button_Click event for 'Add' button.
        /// </summary>
        private void Add_button_click(object sender, RoutedEventArgs e)
        {
            MessageBox.Show("Sample application functionalities are added for display purpose only.",
                "You cannot perform this action");
        }

        /// <summary>
        /// Button_Click event for 'Update Configuration Details' button.
        /// </summary>
        private void Config_button_click(object sender, RoutedEventArgs e)
        {
            ConfigurationPage config = new ConfigurationPage();
            config.Show();
        }
    }
}
