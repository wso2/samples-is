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

import { IdentityProvider } from "@pet-management-webapp/business-admin-app/data-access/data-access-common-models-util";
import { commonControllerCall } from "@pet-management-webapp/shared/data-access/data-access-common-api-util";
import { PatchOperation } from "@pet-management-webapp/shared/data-access/data-access-common-models-util";
import { Session } from "next-auth";

/**
 * patch general settings of an identity provider
 * 
 * call PUT `getManagementAPIServerBaseUrl()/o/<subOrgId>/api/server/v1/identity-providers/<idpid>/<request[0]>`
 * 
 * @param session - session object
 * @param idpId - identity provider id
 * @param body - identity provider body that need to patch
 * 
 * @returns details of the idp, if the call failed `null`
 */
export async function controllerCallPatchGeneralSettingsIdp(session: Session, idpId: string,
    body: PatchOperation[]): Promise<IdentityProvider | null> {

    const data = (await commonControllerCall(`/api/settings/identityProvider/patchGeneralSettingsIdp/${idpId}`,
        session, body) as IdentityProvider | null);

    return data;
}
