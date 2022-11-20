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
 * update federated authenticators of an identity provider
 * 
 * call PATCH `getManagementAPIServerBaseUrl()/o/<subOrgId>/api/server/v1/identity-providers/<idpid>`
 * 
 * @param session - session object
 * @param idpid - identity provider id
 * @param body - identity provider body that need to update
 * 
 * @returns 
 */
export default async function callUpdateFederatedAuthenticators(session, idpId, body) {

    try {
        const res = await fetch(
            `${getHostedUrl()}/api/settings/identityProvider/updateFederatedAuthenticators/${idpId}`,
            getInternalApiRequestOptionsWithParam(session, body)
        );

        const data = await res.json();

        return data;
    } catch (err) {

        return null;
    }
}
