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

import { getInternalApiRequestOptions } from "../../../util/apiUtil/getInteralApiRequestOptions";
import { getHostedUrl } from "../../../util/apiUtil/getUrls";

/**
 * call GET `getManagementAPIServerBaseUrl()/o/<subOrgId>/api/server/v1/organizations/<subOrgId>/users/<id>/roles` 
 * to list all the roles of a user
 * 
 * @param session 
 * @param id - user id
 * 
 * @returns roles of a user, if the call failed `null`
 */
export default async function callUserRole(session, id) {

    try {
        const res = await fetch(
            `${getHostedUrl()}/api/settings/role/userRoles/${id}`,
            getInternalApiRequestOptions(session)
        );

        const data = await res.json();

        return data;
    } catch (err) {

        return null;
    }
}