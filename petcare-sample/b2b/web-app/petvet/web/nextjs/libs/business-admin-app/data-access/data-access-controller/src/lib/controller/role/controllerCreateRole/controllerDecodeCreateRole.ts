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

import { Role, RoleUsers } from "@pet-management-webapp/business-admin-app/data-access/data-access-common-models-util";
import { commonControllerDecode } from "@pet-management-webapp/shared/data-access/data-access-common-api-util";
import { Session } from "next-auth";
import { controllerCallCreateRole } from "./controllerCallCreateRole";


function getUsersList(users: string[]): RoleUsers[] {

    return users.map((user) => { return { "value": user }; });
}

function getRoleBody(displayName: string, permissions: string[], users: string[]): Role {
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
export async function controllerDecodeCreateRole(session: Session, displayName: string, permissions: string[]
    , users: string[]): Promise<Role | null> {

    const role: Role = getRoleBody(displayName, permissions, users);

    const res = (await commonControllerDecode(() => controllerCallCreateRole(session, role), null) as Role | null);

    return res;
}

export default controllerDecodeCreateRole;
