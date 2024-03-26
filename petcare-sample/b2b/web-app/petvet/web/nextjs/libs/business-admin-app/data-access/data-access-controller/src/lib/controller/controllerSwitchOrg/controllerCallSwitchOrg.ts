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


import { getHostedUrl } from "@pet-management-webapp/business-admin-app/util/util-application-config-util";
import { commonControllerCall } from "@pet-management-webapp/shared/data-access/data-access-common-api-util";
import { OrgSession } from "@pet-management-webapp/shared/data-access/data-access-common-models-util";

/**
 * call the switch organization API endpoint
 * 
 * @param subOrgId - sub organization id
 * @param accessToken - access token
 */
export async function controllerCallSwitchOrg(subOrgId: string, accessToken: string): Promise<OrgSession | null> {
    const data = (await commonControllerCall(`${getHostedUrl()}/api/settings/switchOrg`,
        null,
        {
            accessToken: accessToken,
            subOrgId: subOrgId
        },
        true
    ) as OrgSession | null);

    return data;
}
