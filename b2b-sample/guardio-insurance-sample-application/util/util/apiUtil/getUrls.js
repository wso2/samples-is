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

import config from "../../../config.json";

/**
 * URL extracted from the `config.AuthorizationConfig.BaseOrganizationUrl`
 * 
 * @returns get managemnt API server base URL
 */
function getManagementAPIServerBaseUrl() {

    // todo: implementation will change after changes are done to the IS.

    const baseOrganizationUrl = config.AuthorizationConfig.BaseOrganizationUrl;
    const matches = baseOrganizationUrl.match(/^(http|https)?\:\/\/([^\/?#]+)/i);
    const domain = matches && matches[0];

    console.log(domain);

    return domain;
}

/**
 * Tenant domain extracted from the `config.AuthorizationConfig.BaseOrganizationUrl`
 * 
 *  @return tenatn domain.
 */
function getTenantDomain() {

    const baseOrganizationUrl = config.AuthorizationConfig.BaseOrganizationUrl;
    var url = baseOrganizationUrl.split('/');
    var path = url[url.length - 1];

    return path;
}

function getHostedUrl() {

    return config.ApplicationConfig.HostedUrl;
}

module.exports = { getManagementAPIServerBaseUrl, getTenantDomain, getHostedUrl }
