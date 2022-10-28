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

import { decodePatchUsers, PatchUsersMethod } from "./decodePatchUsers";

function getRolesThatNeedToAddUser(initRoleList, roleList) {
    return roleList.filter(roleUri => !initRoleList.includes(roleUri));
}

function getRolesThatNeedToRemoveUser(initRoleList, roleList) {
    return initRoleList.filter(roleUri => !roleList.includes(roleUri));
}

async function getRoleDetailsForAdd(session, userId, initRoleList, roleList) {
    const rolesUriList = getRolesThatNeedToAddUser(initRoleList, roleList);
    let x = [];
    await rolesUriList.forEach(async (uri) => {
        decodePatchUsers(session, uri, userId, PatchUsersMethod.ADD);
    });
}

async function getRoleDetailsForRemove(session, userId, initRoleList, roleList) {
    const rolesUriList = getRolesThatNeedToRemoveUser(initRoleList, roleList);
    let x = [];
    await rolesUriList.forEach(async (uri) => {
        decodePatchUsers(session, uri, userId, PatchUsersMethod.REMOVE);
    });
}


export default async function decodEditRolesToAddOrRemoveUser(session, userId, initRoleList, roleList) {

    try {
        return getRoleDetailsForAdd(session, userId, initRoleList, roleList)
            .then(
                () => getRoleDetailsForRemove(session, userId, initRoleList, roleList)
                .then(()=>true)
                .catch(()=>false)
            ).catch(()=>false);

    } catch (err) {

        return false;
    }
}
