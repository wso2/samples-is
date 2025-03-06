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

import { commonControllerDecode } from "@pet-management-webapp/shared/data-access/data-access-common-api-util";
import { SendUser, User, setUsername } from "@pet-management-webapp/shared/data-access/data-access-common-models-util";
import { Session } from "next-auth";
import { controllerCallAddUser } from "./controllerCallAddUser";

export enum InviteConst {
    INVITE = "pwd-method-invite",
    PWD = "pwd-method-pwd"
}

function inviteAddUserBody(firstName: string, familyName: string, email: string): SendUser {
    return {
        "emails": [
            {
                "primary": true,
                "value": email
            }
        ],
        "name": {
            "familyName": familyName,
            "givenName": firstName
        },
        "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User": {
            "askPassword": true
        },
        "userName": setUsername(email)
    };
}

function pwdAddUserBody(firstName: string, familyName: string, email: string, password: string)
    : SendUser {
    return {
        "emails": [
            {
                "primary": true,
                "value": email
            }
        ],
        "name": {
            "familyName": familyName,
            "givenName": firstName
        },
        "password": password,
        "schemas": [],
        "userName": setUsername(email)
    };
}

function getAddUserBody(
    inviteConst: InviteConst,
    firstName: string,
    familyName: string,
    email: string,
    password: string): SendUser | undefined {
    switch (inviteConst) {
        case InviteConst.INVITE:
            return inviteAddUserBody(firstName, familyName, email);

        case InviteConst.PWD:
            return pwdAddUserBody(firstName, familyName, email, password);

        default:

            return;
    }
}

/**
 * 
 * @param session - session object
 * @param inviteConst - `InviteConst.INVITE` or `InviteConst.PWD`
 * @param firstName - first name
 * @param familyName - last name
 * @param email - email
 * @param password - password
 * 
 * @returns - details of the created user
 */
export async function controllerDecodeAddUser(
    session: Session,
    inviteConst: InviteConst,
    firstName: string,
    familyName: string,
    email: string,
    password: string): Promise<User | boolean | any> {

    const addUserEncode: SendUser =
        (getAddUserBody(inviteConst, firstName, familyName, email, password) as SendUser);

    const res = (
        await commonControllerDecode(() => controllerCallAddUser(session, addUserEncode), false) as User | boolean);

    return res;

}

export default { InviteConst, controllerDecodeAddUser };
