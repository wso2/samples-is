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
import { commonControllerDecode } from "@pet-management-webapp/shared/data-access/data-access-common-api-util";
import { PatchOperation } from "@pet-management-webapp/shared/data-access/data-access-common-models-util";
import { Session } from "next-auth";
import { controllerCallPatchGeneralSettingsIdp } from "./controllerCallPatchGeneralSettingsIdp";

/**
 * 
 * @param session - session object
 * @param name - name of the identity provider
 * @param description - description of the identity provider
 * @param idpId - identity provider id
 * 
 * @returns - patch the general settings in the identity provider
 */
export async function controllerDecodePatchGeneralSettingsIdp(session: Session, name: string, description: string,
    idpId: string): Promise<IdentityProvider | null> {

    const body: PatchOperation[] = [
        { "operation": "REPLACE", "path": "/description", "value": description },
        { "operation": "REPLACE", "path": "/isPrimary", "value": false },
        { "operation": "REPLACE", "path": "/name", "value": name }
    ];

    const res = (await commonControllerDecode(() => controllerCallPatchGeneralSettingsIdp(session, idpId, body),
        null) as IdentityProvider | null);

    return res;
}

export default controllerDecodePatchGeneralSettingsIdp;
