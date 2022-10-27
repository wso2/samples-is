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

/**
 * 
 * @param session 
 * @param firstName 
 * @param familyName 
 * @param email 
 * @param username 
 * @param password 
 * @returns `res` (if user added successfully) or `null` (if user addition was not completed)
 */
export default async function decodeAddUser(session, firstName, familyName, email, username, password) {
    const addUserEncode = {
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
    }

    try {
        const res = await commonDecode(() => callAddUser(session, addUserEncode), false);

        return res;
    } catch (err) {

        return false;
    }
}
