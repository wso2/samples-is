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

import { getInternalApiRequestOptionsWithParam } from "../../../util/apiUtil/getInteralApiRequestOptions";
import { getHostedUrl } from "../../../util/apiUtil/getUrls";

/**
 * call POST `getManagementAPIServerBaseUrl()/api/server/v1/organizations/${orgId}/roles` create the role
 * 
 * @param session - session object
 * @param role - role object
 * 
 * @returns created role details, if not created returns `null`
 */

export default async function callCreateRole(session, role) {
    try {
        const res = await fetch(
            `${getHostedUrl()}/api/settings/role/createRole`,
            getInternalApiRequestOptionsWithParam(session, role)
        );

        const data = await res.json();

        return data;
    } catch (err) {

        return null;
    }
}
