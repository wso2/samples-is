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

 * call PATCH `getManagementAPIServerBaseUrl()/o/<subOrgId>/api/server/v1/applications/<id>` 
 *  to get PATCH the auth steps to the applicaion
 * 
 * @param session - session object
 * @param applicationId - application id
 * @param model - body of the applicaiton that need to patch
 * 
 * @returns details of the updated application, if the call failed `null`
 */
export default async function callPatchApplicationAuthSteps(session, applicationId, model) {

    try {
        const res = await fetch(
            `${getHostedUrl()}/api/settings/application/patchApplicationAuthSteps/${applicationId}`,
            getInternalApiRequestOptionsWithParam(session, model)
        );

        const data = await res.json();

        return data;
    } catch (err) {

        return null;
    }
}
