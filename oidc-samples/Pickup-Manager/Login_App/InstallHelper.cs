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

using System;
using System.Xml;
using System.ComponentModel;
using System.Collections;
using System.Windows;
using org.wso2.identity.sdk.oidc;

namespace org.wso2.sample.identity.PickupManager
{
    /// <summary>
    /// Interaction logic for Installer
    /// </summary>
    [RunInstaller(true)]
    public class InstallHelper : System.Configuration.Install.Installer
    {
        /// <summary>
        /// Constructor for InstallHelper class.
        /// </summary>
        public InstallHelper()
        {
        }

        /// <summary>
        /// Interaction logic for Installers' Install method.
        /// </summary>
        /// <param name="stateSaver"></param>
        public override void Install(System.Collections.IDictionary stateSaver)
        {
            base.Install(stateSaver);
        }

        /// <summary>
        /// Interaction logic for Installers' Commit method.
        /// </summary>
        /// <param name="savedState"></param>
        public override void Commit(IDictionary savedState)
        {
            base.Commit(savedState);
            try
            {
                AddConfigurationFileDetails();
            }
            catch (Exception e)
            {
                MessageBox.Show("Error : " + e.Message);
                base.Rollback(savedState);
            }
        }

        /// <summary>
        /// Interaction logic for Installers' Rollback method.
        /// </summary>
        /// <param name="savedState"></param>
        public override void Rollback(IDictionary savedState)
        {
            base.Rollback(savedState);
        }

        /// <summary>
        /// Interaction logic for Installers' Uninstall method.
        /// </summary>
        /// <param name="savedState"></param>
        public override void Uninstall(IDictionary savedState)
        {
            base.Uninstall(savedState);
        }

        /// <summary>
        /// Method to save configuration details given by user to 'app.config' file.
        /// </summary>
        private void AddConfigurationFileDetails()
        {
            try
            {
                string ClientId = Context.Parameters[Constants.ClientId];
                string ClientSecret = Context.Parameters[Constants.ClientSecret];
                string AuthorizationEndpoint = Context.Parameters[Constants.AuthorizationEndpoint];
                string TokenEndpoint = Context.Parameters[Constants.TokenEndpoint];
                string UserInfoEndpoint = Context.Parameters[Constants.UserInfoEndpoint];
                string LogoutEndpoint = Context.Parameters[Constants.LogoutEndpoint];
                string RedirectURI = Context.Parameters[Constants.RedirectURI];
                string PostLogoutRedirectURI = Context.Parameters[Constants.PostLogoutRedirectURI];

                // Get the path to the executable file that is being installed on the target computer.  
                string assemblypath = Context.Parameters["assemblypath"];
                string appConfigPath = assemblypath + ".config";

                // Write the path to the 'app.config' file.  
                XmlDocument doc = new XmlDocument();
                doc.Load(appConfigPath);

                XmlNode configuration = null;
                foreach (XmlNode node in doc.ChildNodes)
                    if (node.Name == "configuration")
                        configuration = node;

                if (configuration != null)
                {
                    // If "configuration != null", Get the <appSettings> node.  
                    XmlNode settingNode = null;
                    foreach (XmlNode node in configuration.ChildNodes)
                    {
                        if (node.Name == "appSettings")
                            settingNode = node;
                    }

                    if (settingNode != null)
                    {
                        // If "settingNode != null", Reassign values in the config file  
                        foreach (XmlNode node in settingNode.ChildNodes)
                        {
                            if (node.Attributes == null)
                                continue;
                            XmlAttribute attribute = node.Attributes["value"];
                            if (node.Attributes["key"] != null)
                            {
                                // Save user inputs to config. file while installing process
                                switch (node.Attributes["key"].Value)
                                {
                                    case "ClientId":
                                        attribute.Value = ClientId;
                                        break;
                                    case "ClientSecret":
                                        attribute.Value = ClientSecret;
                                        break;
                                    case "AuthorizationEndpoint":
                                        attribute.Value = AuthorizationEndpoint;
                                        break;
                                    case "TokenEndpoint":
                                        attribute.Value = TokenEndpoint;
                                        break;
                                    case "UserInfoEndpoint":
                                        attribute.Value = UserInfoEndpoint;
                                        break;
                                    case "LogoutEndpoint":
                                        attribute.Value = LogoutEndpoint;
                                        break;
                                    case "RedirectURI":
                                        attribute.Value = RedirectURI;
                                        break;
                                    case "PostLogoutRedirectURI":
                                        attribute.Value = PostLogoutRedirectURI;
                                        break;
                                }
                            }
                        }
                    }
                    doc.Save(appConfigPath);
                }
            }
            catch
            {
                throw;
            }
        }
    }
}
