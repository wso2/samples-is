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
using System;
using System.Windows;
using log4net;
using org.wso2.identity.sdk.oidc;

namespace org.wso2.identity.sample.PickupManager
{
    /// <summary>
    /// Interaction logic for TokenInfoPage.xaml.
    /// </summary> 
    public partial class TokenInfoPage : Window
    {
        // Declare an instance for log4net.
        private static readonly ILog Log = LogManager.GetLogger(System.Reflection.MethodBase.
            GetCurrentMethod().DeclaringType);

        // Variable declaration.
        public string idToken = null;
        private string accessToken;

        ServerConfiguration config = new ServerConfiguration();

        /// <summary>
        /// Constructor for TokenInfoPage class.
        /// </summary>
        /// <param name="accessToken"> Refers to AuthenticationHelper class login() function in org.wso2.identity.sdk.oidc.dll file. </param>
        public TokenInfoPage(string accessToken)
        {
            InitializeComponent();
            this.accessToken = accessToken;
            Display();
        }

        /// <summary>
        /// Method to display the ID token from the given access token. 
        /// </summary>
        public void Display()
        {
            // Get id_token.  
            dynamic json = JsonConvert.DeserializeObject(this.accessToken);
            idToken = json.id_token;

            // Display token information.
            tokenInfoTextBox.Text += "\r\n\n" + accessToken + Environment.NewLine;
            Log.Info(accessToken);
        }

        /// <summary>
        /// Button_Click event for 'Back' button.
        /// </summary>
        private void Back_button_click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }

        /// <summary>
        /// Method generate for TextBoxOutput_TextChanged event.
        /// </summary>
        private void TextBoxOutput_TextChanged(object sender, System.Windows.Controls.TextChangedEventArgs e)
        {
        }
    }
}
