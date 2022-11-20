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

import callEditUser from "../../apiCall/settings/callEditUser";
import { commonDecode } from "../../util/apiUtil/commonDecode";
import { setUsername } from "../../util/apiUtil/decodeUser";

/**
 * 
 * @param session - session object
 * @param id - id of the user
 * @param firstName - first name of the user
 * @param familyName - family name of the user
 * @param email - email of the user
 * @param username - user name of the user

 * @returns `res` (if user edited successfully) or `false` (if the process was not completed)
 */
export default async function decodeEditUser(session, id, firstName, familyName, email, username) {
    const editUserEncode = {
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
                    "userName": setUsername(username)
                }
            }
        ],
        "schemas": [
            "urn:ietf:params:scim:api:messages:2.0:PatchOp"
        ]
    };

    try {
        const usersData = await commonDecode(() => callEditUser(session, id, editUserEncode), false);

        return usersData;
    } catch (err) {

        return false;
    }
}
