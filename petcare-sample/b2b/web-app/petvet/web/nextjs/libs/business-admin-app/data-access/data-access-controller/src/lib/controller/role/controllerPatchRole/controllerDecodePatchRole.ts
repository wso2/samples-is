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

import { Role } from "@pet-management-webapp/business-admin-app/data-access/data-access-common-models-util";
import { commonControllerDecode } from "@pet-management-webapp/shared/data-access/data-access-common-api-util";
import { PatchBody } from "@pet-management-webapp/shared/data-access/data-access-common-models-util";
import { PatchMethod } from "@pet-management-webapp/shared/util/util-common";
import { Session } from "next-auth";
import { controllerCallPatchRole } from "./controllerCallPatchRole";

export function getAddReplaceBody(patchMethod: PatchMethod, path: string, values: string[] | string): PatchBody {
    
    const valuesList = Array.isArray(values) 
        ? values.map((val) => { return { "value": val }; })
        : [ { "value": values } ];

    const patchBody: any = {
        "Operations": [
            {
                "op": patchMethod,
                "value": {}
            }
        ]
    };
    
    patchBody["Operations"][0]["value"][path] = valuesList;

    return patchBody as PatchBody;
}

export function getRemoveBody(patchMethod: PatchMethod, path: string, value: string[] | string): PatchBody {
    return {
        "Operations": [
            {
                "op": patchMethod,
                "path": `${path}[value eq ${value}]`
            }
        ]
    };
}

export function getPatchBody(patchMethod: PatchMethod, path: string, value: string[] | string) {
    switch (patchMethod) {
        case PatchMethod.ADD:

            return getAddReplaceBody(patchMethod, path, value);

        case PatchMethod.REPLACE:

            return getAddReplaceBody(patchMethod, path, value);
        case PatchMethod.REMOVE:

            return getRemoveBody(patchMethod, path, value);
        default:

            return;
    }
}


/**
 * 
 * @param session - session object
 * @param roleUri - uri of the role
 * @param patchMethod - `PatchMethod.ADD`, `PatchMethod.REPLACE` or `PatchMethod.REMOVE`
 * @param path - path
 * @param value - edited value
 * 
 * @returns - whehter the patch was successful or not
 */
export async function controllerDecodePatchRole(
    session: Session, roleId: string, patchMethod: PatchMethod, path: string, value: string[] | string)
    : Promise<Role | null> {

    const patchBody: PatchBody = (getPatchBody(patchMethod, path, value) as PatchBody);
    console.log(patchBody);

    const res = (
        await commonControllerDecode(() => controllerCallPatchRole(session, roleId, patchBody), null) as Role | null);

    return res;
}

export default controllerDecodePatchRole;
