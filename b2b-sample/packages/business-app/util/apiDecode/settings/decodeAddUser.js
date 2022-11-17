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

import { setUsername } from "../../../util/util/apiUtil/decodeUser";
import callAddUser from "../../apiCall/settings/callAddUser";
import { commonDecode } from "../../util/apiUtil/commonDecode";

const InviteConst = {
    INVITE: "pwd-method-invite",
    PWD: "pwd-method-pwd"
}


function inviteAddUserBody(firstName, familyName, email, username) {
    return {
        "emails": [
            {
                "value": email,
                "primary": true
            }
        ],
        "userName": setUsername(username),
        "name": {
            "givenName": firstName,
            "familyName": familyName
        },
        "urn:scim:wso2:schema": {
            "askPassword": "true"
        }
    }
}

function pwdAddUserBody(firstName, familyName, email, username, password) {
    return {
        "schemas": [],
        "name": {
            "givenName": firstName,
            "familyName": familyName
        },
        "userName": setUsername(username),
        "password": password,
        "emails": [
            {
                "value": email,
                "primary": true
            }
        ]
    };
}

function getAddUserBody(inviteConst, firstName, familyName, email, username, password) {
    switch (inviteConst) {
        case InviteConst.INVITE:
            return inviteAddUserBody(firstName, familyName, email, username);

        case InviteConst.PWD:
            return pwdAddUserBody(firstName, familyName, email, username, password);

        default:
            break;
    }
}

/**
 * 
 * @param session 
 * @param firstName 
 * @param familyName 
 * @param email 
 * @param username 
 * @param password
 * 
 * @returns `res` (if user added successfully) or `null` (if user addition was not completed)
 */
async function decodeAddUser(session, inviteConst, firstName, familyName, email, username, password) {
    const addUserEncode = getAddUserBody(inviteConst, firstName, familyName, email, username, password);

    try {
        const res = await commonDecode(() => callAddUser(session, addUserEncode), false);

        return res;
    } catch (err) {

        return false;
    }
}

module.exports = { InviteConst, decodeAddUser }
