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

import { getInternalApiRequestOptionsWithParam } from "../../util/apiUtil/getInteralApiRequestOptions";
import { getHostedUrl } from "../../util/apiUtil/getUrls";

/**
 * call PATCH `getManagementAPIServerBaseUrl()/o/<subOrgId>/scim2/Users/<id>` to edit the user
 * 
 * @param session 
 * @param id 
 * @param user
 *  
 * @returns edited user details, if not edited returns `null`
 */
export default async function callEditUser(session, id, user) {
    try {
        const res = await fetch(
            `${getHostedUrl()}/api/settings/editUser/${id}`,
            getInternalApiRequestOptionsWithParam(session, user)
        );

        const data = await res.json();

        return data;
    } catch (err) {
        return null;
    }
}
