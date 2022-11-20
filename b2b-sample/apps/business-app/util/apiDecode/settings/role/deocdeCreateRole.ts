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

import callCreateRole from "../../../apiCall/settings/role/callCreateRole";
import { commonDecode } from "../../../util/apiUtil/commonDecode";

function getUsersList(users) {

    return users.map((user) => { return { "value": user }; });
}

function getRoleBody(displayName, permissions, users) {
    return {
        "displayName": displayName,
        "groups": [],
        "permissions": permissions,
        "users": getUsersList(users)
    };
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
export async function decodeCreateRole(session, displayName, permissions, users) {
    const role = getRoleBody(displayName, permissions, users);

    try {
        const res = await commonDecode(() => callCreateRole(session, role), false);

        return res;
    } catch (err) {

        return false;
    }
}
