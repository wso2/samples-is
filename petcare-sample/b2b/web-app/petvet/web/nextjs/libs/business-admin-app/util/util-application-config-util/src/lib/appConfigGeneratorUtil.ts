/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import getNextConfig from "next/config";
import config from "../../../../../../config.json";

interface ConfigObject {
  CommonConfig: {
    AuthorizationConfig: {
      BaseUrl: string;
      BaseOrganizationUrl: string;
      ClientId: string;
    };
    ApplicationConfig: {
      SampleOrganization: {
        id: string;
        name: string;
      }[];
    };
  };
  BusinessAdminAppConfig: {
    ApplicationConfig: {
      HostedUrl?: string;
      APIScopes?: string[];
      Branding: {
        name?: string;
        tag?: string;
      };
    };
    resourceServerURLs: {
      channellingService?: string;
      petManagementService?: string;
      personalizationService?: string;
    };
    ManagementAPIConfig: {
      SharedApplicationName: string,
      UserStore: string
    };
  };
}


/**
 * 
 * get config
 */
export function getConfig(): ConfigObject {

    const { publicRuntimeConfig } = getNextConfig();

    const configObj = {
        CommonConfig: {
            ApplicationConfig: {
                SampleOrganization: config.CommonConfig.ApplicationConfig.SampleOrganization
            },
            AuthorizationConfig: {
                BaseOrganizationUrl: publicRuntimeConfig.baseOrgUrl,
                BaseUrl: publicRuntimeConfig.baseUrl,
                ClientId: publicRuntimeConfig.clientId
            }
        },
        // eslint-disable-next-line sort-keys
        BusinessAdminAppConfig: {

            // eslint-disable-next-line sort-keys
            ApplicationConfig: {
                HostedUrl: publicRuntimeConfig.hostedUrl,
                // eslint-disable-next-line sort-keys
                APIScopes: config.BusinessAdminAppConfig.ApplicationConfig.APIScopes,
                Branding: {
                    name: config.BusinessAdminAppConfig.ApplicationConfig.Branding.name,
                    tag: config.BusinessAdminAppConfig.ApplicationConfig.Branding.tag
                }
            },
            ManagementAPIConfig: {
                SharedApplicationName: publicRuntimeConfig.sharedAppName,
                UserStore: config.BusinessAdminAppConfig.ManagementAPIConfig.UserStore
            },
            resourceServerURLs: {
                channellingService: publicRuntimeConfig.channellingServiceUrl,
                personalizationService: publicRuntimeConfig.personalizationServiceUrl,
                petManagementService: publicRuntimeConfig.petManagementServiceUrl
            }
        }
    };

    return configObj;
}

export default { getConfig };
