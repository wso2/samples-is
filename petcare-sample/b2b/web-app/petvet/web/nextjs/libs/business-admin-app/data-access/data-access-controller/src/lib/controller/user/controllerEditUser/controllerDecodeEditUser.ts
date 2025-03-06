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
import { SendEditUser, User, setUsername } 
    from "@pet-management-webapp/shared/data-access/data-access-common-models-util";
import { Session } from "next-auth";
import { controllerCallEditUser } from "./controllerCallEditUser";

/**
 * 
 * @param session - session object
 * @param id - id of the user
 * @param firstName - edited first name
 * @param familyName - edited last name
 * @param email - edited email
 * @param username - edited username
 * 
 * @returns - whether the edit of the user is successful or not
 */
export async function controllerDecodeEditUser(
    session: Session, id: string, firstName: string, familyName: string, email: string)
    : Promise<User | null> {

    const editUserEncode: SendEditUser = {
        "Operations": [
            {
                "op": "replace",
                "value": {
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
                    "userName": setUsername(email)
                }
            }
        ],
        "schemas": [
            "urn:ietf:params:scim:api:messages:2.0:PatchOp"
        ]
    };

    const usersData = (
        await commonControllerDecode(() => controllerCallEditUser(session, id, editUserEncode), false) as User | null);

    return usersData;

}

export default controllerDecodeEditUser;
