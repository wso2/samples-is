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

import { getManagementAPIServerBaseUrl } from "../apiUtil/getUrls";

/**
 * check if the user is an administrator of the logged in identity server
 * 
 * @param scopes - scopes of the logged in user
 * 
 * @returns `true` if the user is an administrator, else `false`
 */
function checkAdmin(scopes): boolean {
    const adminScopes = [ "email", "internal_login", "internal_user_mgt_create", "internal_user_mgt_delete",
        "internal_user_mgt_list", "internal_user_mgt_update", "internal_user_mgt_view", "openid", "profile" ];

    for (let i = 0; i < adminScopes.length; i++) {
        if (!scopes.includes(adminScopes[i])) {

            return false;
        }
    }

    return true;
}

function getOrgUrl(orgId): string {

    const managementAPIServerBaseUrl = getManagementAPIServerBaseUrl();

    return `${managementAPIServerBaseUrl}/o/${orgId}`;
}

export {
    checkAdmin, getOrgUrl
};
