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

import Group from "./group";
import InternalGroup from "./internalGroup";


/**
 * 
 * @param group - (group object return from the IS)
 * 
 * @returns group object that can be view in front end side
 */
export function decodeGroup(group: Group): InternalGroup {

    const displayName = group.displayName?.split("/")?.[1] || "-";
    const userstore = group.displayName?.split("/")?.[0] || "-";


    return {
        "displayName": displayName,
        "id": group.id ? group.id : "-",
        "userStore": userstore
    };
}

