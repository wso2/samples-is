/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

interface Config {
    baseUrl: string;
    clientID: string;
    scope: string[];
    signInRedirectURL: string;
    signOutRedirectURL: string;
    myAccountAppURL: string;
    petManagementServiceURL: string;
    billingServerURL: string;
    salesforceServerURL: string;
    enableOIDCSessionManagement: boolean;
  }

declare global {
    interface Window {
      config: Config;
    }
}  

const authConfig = {
    baseUrl: window.config.baseUrl,
    clientID: window.config.clientID,
    signInRedirectURL: window.config.signInRedirectURL,
    signOutRedirectURL: window.config.signOutRedirectURL,
    myAccountAppURL: window.config.myAccountAppURL,
    petManagementServiceURL: window.config.petManagementServiceURL,
    billingServerURL: window.config.billingServerURL,
    salesforceServerURL: window.config.salesforceServerURL,
    enableOIDCSessionManagement: true,
    scope: ["openid", "profile", "email", "acr"]
  };

export function getConfig() {
    return authConfig;
}


