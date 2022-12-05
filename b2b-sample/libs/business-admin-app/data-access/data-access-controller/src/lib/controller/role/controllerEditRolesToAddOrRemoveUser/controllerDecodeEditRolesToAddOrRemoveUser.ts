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
import { Session } from "next-auth";
import { controllerDecodePatchRole } from "../controllerPatchRole/controllerDecodePatchRole";

function getRolesThatNeedToAddUser(initRoleList: string[], roleList: string[]): string[] {
    return roleList.filter(roleUri => !initRoleList.includes(roleUri));
}

function getRolesThatNeedToRemoveUser(initRoleList: string[], roleList: string[]): string[] {
    return initRoleList.filter(roleUri => !roleList.includes(roleUri));
}

async function getRoleDetailsForAdd(session: Session, userId: string, initRoleList: string[], roleList: string[])
    : Promise<void> {
    const rolesUriList = getRolesThatNeedToAddUser(initRoleList, roleList);

    await rolesUriList.forEach(async (uri) => {
        await controllerDecodePatchRole(session, uri, PatchMethod.ADD, "users", [userId]);
    });
}

async function getRoleDetailsForRemove(session: Session, userId: string, initRoleList: string[]
    , roleList: string[]): Promise<void> {
    const rolesUriList = getRolesThatNeedToRemoveUser(initRoleList, roleList);

    await rolesUriList.forEach(async (uri) => {
        await controllerDecodePatchRole(session, uri, PatchMethod.REMOVE, "users", userId);
    });
}

/**
 * 
 * @param session - session
 * @param userId - id of the user
 * @param initRoleList - inital list of roles assigned for the user
 * @param roleList - current list of roles assigned for the user
 * 
 * @returns - `true` if the operation is successfull, else `false`
 */
export async function controllerDecodeEditRolesToAddOrRemoveUser(
    session: Session, userId: string, initRoleList: string[], roleList: string[]): Promise<boolean> {

    try {
        return getRoleDetailsForAdd(session, userId, initRoleList, roleList)
            .then(
                () => getRoleDetailsForRemove(session, userId, initRoleList, roleList)
                    .then(() => true)
                    .catch(() => false)
            ).catch(() => false);

    } catch (err) {

        return false;
    }

}

export default controllerDecodeEditRolesToAddOrRemoveUser;
