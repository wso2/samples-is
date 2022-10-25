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

import config from "../../../config.json";

/**
 * 
 * @param user (user object return from the IS)
 * @returns user object that can be view in front end side
 */
function decodeUser(user) {

    return {
        "id": user.id ? user.id : "-",
        "username": user.userName ? getUsername(user.userName) : "-",
        "firstName": user.name ? (user.name.givenName ? user.name.givenName : "-") : "-",
        "familyName": user.name ? (user.name.familyName ? user.name.familyName : "-") : "-",
        "email": user.emails ? user.emails[0] : "-"
    };
}

/**
 * 
 * @param userName 
 * @returns set username. If the IS is Asgardeo DEFAULT/ add to the username changed else returns the original username
 */
 function setUsername(userName) {
    if (config.ASGARDEO) {
       
        return  `DEFAULT/${userName}`;
    }

    return userName;
}

/**
 * 
 * @param userName 
 * @returns get username. If the IS is Asgardeo DEFAULT/ is removed from the username else returns the original username
 */
function getUsername(userName) {

    console.log(userName);

    if (config.ASGARDEO) {

        return userName.split("/").pop();
    }

    return userName;
}

module.exports = { decodeUser, setUsername }
