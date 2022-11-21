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

import { checkAdmin } from "@b2bsample/shared/util/util-application-config-util";

const LOADING_DISPLAY_NONE = {
    display: "none"
};
const LOADING_DISPLAY_BLOCK = {
    display: "block"
};

/**
 * hide content based on the user's realated privilages
 * 
 * @param scopes - scopes related for the user
 * 
 * @returns `LOADING_DISPLAY_BLOCK` if admin, else `LOADING_DISPLAY_NONE` 
 */
function hideBasedOnScopes(scopes) {

    if (checkAdmin(scopes)) {

        return LOADING_DISPLAY_BLOCK;
    } else {

        return LOADING_DISPLAY_NONE;
    }
}

export{
    hideBasedOnScopes, LOADING_DISPLAY_NONE, LOADING_DISPLAY_BLOCK
};
