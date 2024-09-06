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

import { getConfig } from "@pet-management-webapp/business-admin-app/util/util-application-config-util";
import InternalUser from "./internalUser";
import User from "./user";

/**
 * 
 * @param user - (user object return from the IS)
 * 
 * @returns user object that can be view in front end side
 */
export function decodeUser(user: User): InternalUser {

    return {
        "email": user.emails ? user.emails[0] : "-",
        "familyName": user.name ? (user.name.familyName ? user.name.familyName : "-") : "-",
        "firstName": user.name ? (user.name.givenName ? user.name.givenName : "-") : "-",
        "id": user.id ? user.id : "-",
        "username": user.userName ? getUsername(user.userName) : "-"
    };
}

/**
 * 
 * @param email - email
 * 
 * @returns set email.
 */
export function setEmail(email: string) {
    const regex = /^DEFAULT\//g;

    email = email.replace(regex, "");

    return email;
}

/**
 * 
 * @param userName - user name
 * 
 * @returns set username.
 */
export function setUsername(userName: string) {

    const userStore = getConfig().BusinessAdminAppConfig.ManagementAPIConfig.UserStore;

    if(userStore.trim()===""){
        return userName;
    } else {
        return `${userStore}/${userName}`;
    }
}

/**
 * 
 * @param userName - user name
 * 
 * @returns get username. If the IS is Asgardeo DEFAULT/ is removed from the username else returns the original username
 */
export function getUsername(userName: string) {

    return userName;
}

export default { decodeUser, setUsername, setEmail };
