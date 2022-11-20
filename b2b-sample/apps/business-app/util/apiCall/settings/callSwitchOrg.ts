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

import { geetInternalApiRequestOptionsForSwitchCallWithParam } from "../../util/apiUtil/getInteralApiRequestOptions";
import { getHostedUrl } from "../../util/apiUtil/getUrls";

/**
 * call the switch organization API endpoint
 * 
 * @param subOrgId - sub organization id
 * @param accessToken - access token recieved from the login function
 */
export default async function callSwitchOrg(subOrgId, accessToken) {

    try {

        const res = await fetch(
            `${getHostedUrl()}/api/settings/switchOrg`,
            geetInternalApiRequestOptionsForSwitchCallWithParam(subOrgId, accessToken)
        );

        if (res.status != 200) {

            return null;
        }

        const data = await res.json();

        return data;
    } catch (err) {

        return null;
    }
}
