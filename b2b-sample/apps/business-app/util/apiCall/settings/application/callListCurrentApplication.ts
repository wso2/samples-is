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
 * call GET `getManagementAPIServerBaseUrl()/o/<subOrgId>/api/server/v1/applications?filter=name+eq+<appName>` 
 * to get the initial applicaion details
 * 
 * @param session - session object
 * 
 * @returns application initial details, if call failed `null`
 */
export default async function callListCurrentApplication(session) {
    try {
        const res = await fetch(
            `${getHostedUrl()}/api/settings/application/listCurrentApplication`,
            getInternalApiRequestOptions(session)
        );

        const data = await res.json();

        return data;
    } catch (err) {

        return null;
    }
}
