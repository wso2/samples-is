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

import { getConfig } from "@pet-management-webapp/business-admin-app/util/util-application-config-util";

/**
 * check if the user is an administrator of the logged in identity server
 * 
 * @param scopes - scopes of the logged in user
 * 
 * @returns `true` if the user is an administrator, else `false`
 */
export function checkAdmin(scopes: string[]): boolean {
    const adminScopes = [ "email", "internal_login", "internal_org_user_mgt_create", "internal_org_user_mgt_delete",
        "internal_org_user_mgt_list", "internal_org_user_mgt_update", "internal_org_user_mgt_view", "openid", 
        "profile" ];

    for (let i = 0; i < adminScopes.length; i++) {
        if (!scopes.includes(adminScopes[i])) {

            return false;
        }
    }

    return true;
}

/**
 * 
 * @param orgId - organization id
 * 
 * @returns organization url
 */
export function getOrgUrl(orgId: string): string {

    return `${getConfig().CommonConfig.AuthorizationConfig.BaseOrganizationUrl}/o`;
}

export function getBaseUrl(orgId: string): string {

    return `${getConfig().CommonConfig.AuthorizationConfig.BaseUrl}/o`;
}

/**
 * URL extracted from the `config.AuthorizationConfig.BaseOrganizationUrl`
 * 
 * @returns get managemnt API server base URL
 */

export function getManagementAPIServerBaseUrl() {

    // todo: implementation will change after changes are done to the IS.
    const baseOrganizationUrl = getConfig().CommonConfig.AuthorizationConfig.BaseOrganizationUrl;
    // eslint-disable-next-line
    if(baseOrganizationUrl) {
        const matches = baseOrganizationUrl.match(/^(http|https)?\:\/\/([^\/?#]+)/i);
        const domain = matches && matches[0];

        return domain;
    }

    return null;
}

/**
 * Tenant domain extracted from the `config.AuthorizationConfig.BaseOrganizationUrl`
 * 
 *  @returns tenatn domain.
 */
export function getTenantDomain() {

    const baseOrganizationUrl = getConfig().CommonConfig.AuthorizationConfig.BaseOrganizationUrl;
    const url = baseOrganizationUrl.split("/");
    const path = url[url.length - 1];

    return path;
}

export default {
    checkAdmin, getOrgUrl, getManagementAPIServerBaseUrl, getTenantDomain
};
