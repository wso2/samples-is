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

import callPatchUsers from
    "../../../apiCall/settings/role/callPatchUsers";
import { commonDecode } from "../../../util/apiUtil/commonDecode";

const PatchUsersMethod = {
    ADD: "ADD",
    REMOVE: "REMOVE"
};

function getAddBody(userId) {
    return {
        "operations": [
            {
                "op": "ADD",
                "path": "users",
                "value": [userId]
            }
        ]
    }
}

function getRemoveBody(userId) {
    return {
        "operations": [
            {
                "op": "REMOVE",
                "path": `users[value eq ${userId}]`
            }
        ]
    }
}

function getPatchBody(patchUsersMethod, userId) {
    switch (patchUsersMethod) {
        case PatchUsersMethod.ADD:

            return getAddBody(userId);
        case PatchUsersMethod.REMOVE:

            return getRemoveBody(userId);
    }
}

async function decodePatchUsers(session, roleUri, userId, patchUsersMethod) {

    try {
        const res = await commonDecode(() => callPatchUsers(session, roleUri,
            getPatchBody(patchUsersMethod, userId)), null);

        return res;
    } catch (err) {

        return null;
    }
}

module.exports = { PatchUsersMethod, decodePatchUsers }
