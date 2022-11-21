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

import { getHostedUrl } from "@b2bsample/shared/util/util-application-config-util";
import { getInternalApiRequestOptionsWithParam } from "../../../util/apiUtil/getInteralApiRequestOptions";

/**
 * call PATCH `roleUri`
 * 
 * @param session - session object
 * @param roleUri - uri of the role
 * @param patchBody - body of the role that need to be patched
 * 
 * @returns patched role, if the call failed `null`
 */
export default async function callPatchUsers(session, roleUri, patchBody) {

    try {
        const res = await fetch(
            `${getHostedUrl()}/api/settings/role/patchRole?roleUri=${roleUri}`,
            getInternalApiRequestOptionsWithParam(session, patchBody)
        );

        const data = await res.json();

        return data;
    } catch (err) {

        return null;
    }
}
