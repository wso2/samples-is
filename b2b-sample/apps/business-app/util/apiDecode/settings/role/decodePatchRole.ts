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

import { PatchMethod } from "@b2bsample/shared/util/util-common";
import callPatchRole from
    "../../../apiCall/settings/role/callPatchRole";
import { commonDecode } from "../../../util/apiUtil/commonDecode";

function getAddReplaceBody(patchMethod, path, value) {
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

function getRemoveBody(patchMethod, path, value) {
    return {
        "operations": [
            {
                "op": patchMethod,
                "path": `${path}[value eq ${value}]`
            }
        ]
    };
}

function getPatchBody(patchMethod, path, value) {
    switch (patchMethod) {
        case PatchMethod.ADD:

            return getAddReplaceBody(patchMethod, path, value);

        case PatchMethod.REPLACE:

            return getAddReplaceBody(patchMethod, path, value);
        case PatchMethod.REMOVE:

            return getRemoveBody(patchMethod, path, value);
    }
}

/**
 * 
 * @param session - session
 * @param roleUri - uri of the role
 * @param patchMethod - `PatchMethod` value
 * @param path - path variable (`users` | `permission` | `displayName`)
 * @param value - value that need to be updated. If `patchMethod` is `PatchMethod.ADD` then `value` 
 * should be an `array`
 * 
 * @returns - API return call 
 */
export default async function decodePatchRole(session, roleUri, patchMethod, path, value) {

    try {
        const res = await commonDecode(() => callPatchRole(session, roleUri,
            getPatchBody(patchMethod, path, value)), null);

        return res;
    } catch (err) {

        return null;
    }
}
