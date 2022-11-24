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

import { commonControllerDecode } from "@b2bsample/shared/data-access/data-access-common-api-util";
import { PatchMethod } from "@b2bsample/shared/util/util-common";
import { contollerCallPatchRole } from "./contollerCallPatchRole";

function getAddReplaceBody(patchMethod: string, path: string, value: string[]) {
    return {
        "operations": [
            {
                "op": patchMethod,
                "path": path,
                "value": value
            }
        ]
    };
}

function getRemoveBody(patchMethod: string, path: string, value: string[]) {
    return {
        "operations": [
            {
                "op": patchMethod,
                "path": `${path}[value eq ${value}]`
            }
        ]
    };
}

function getPatchBody(patchMethod: string, path: string, value: string[]) {
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
 * @param displayName - role name
 * @param permissions - role permissions
 * @param users - users assigned to the role
 * 
 * @returns `res` (if user added successfully) or `false` (if user addition was not completed)
 */
export async function contollerDecodePatchRole(
    session: any, roleUri: string, patchMethod: string, path: string, value: string[]) {
    const patchBody = getPatchBody(patchMethod, path, value);

    const res = await commonControllerDecode(() => contollerCallPatchRole(session, roleUri, patchBody), null);

    return res;
}

export default contollerDecodePatchRole;
