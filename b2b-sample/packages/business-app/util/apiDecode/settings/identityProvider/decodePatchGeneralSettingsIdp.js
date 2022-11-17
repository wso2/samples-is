/*
 * Copyright (c) 2022 WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *http://www.apache.org/licenses/LICENSE-2.
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import callPatchGeneralSettingsIdp from "../../../apiCall/settings/identityProvider/callPatchGeneralSettingsIdp";
import { commonDecode } from "../../../util/apiUtil/commonDecode";

export default async function decodePatchGeneralSettingsIdp(session, name, description, idpId) {

    let body = [
        { "operation": "REPLACE", "path": "/description", "value": description },
        { "operation": "REPLACE", "path": "/isPrimary", "value": false },
        { "operation": "REPLACE", "path": "/name", "value": name }
    ];

    try {
        const res = await commonDecode(() => callPatchGeneralSettingsIdp(session, idpId, body), null);

        return res;
    } catch (err) {

        return null;
    }
}
