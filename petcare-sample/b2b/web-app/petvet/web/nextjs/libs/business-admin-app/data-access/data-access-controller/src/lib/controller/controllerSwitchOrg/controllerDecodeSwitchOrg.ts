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
import { OrgSession } from "@pet-management-webapp/shared/data-access/data-access-common-models-util";
import { JWT } from "next-auth/jwt";
import { controllerCallSwitchOrg } from "./controllerCallSwitchOrg";

function getOrgId(token: JWT): string {

    if(token.user) {
        if (token.user.user_organization) {

            return token.user.user_organization;
        } else {
    
            return token.user.org_id;
        }
    } else {
        
        return "";
    }

}

/**
 * 
 * @param token - token object get from the inital login call
 * 
 * @returns - organization id of the logged in organization
 */
export async function controllerDecodeSwitchOrg(token: JWT): Promise<OrgSession | null> {

    const subOrgId: string = getOrgId(token);
    const accessToken: string = (token.accessToken as string);

    const res =
        (await commonControllerDecode(() => controllerCallSwitchOrg(subOrgId, accessToken), null) as OrgSession | null);

    return res;

}

export default controllerDecodeSwitchOrg;
