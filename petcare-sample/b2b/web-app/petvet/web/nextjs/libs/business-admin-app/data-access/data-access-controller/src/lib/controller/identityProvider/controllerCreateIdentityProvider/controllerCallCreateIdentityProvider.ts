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

import { IdentityProvider, IdentityProviderTemplateModel } from
    "@pet-management-webapp/business-admin-app/data-access/data-access-common-models-util";
import { commonControllerCall } from "@pet-management-webapp/shared/data-access/data-access-common-api-util";
import { Session } from "next-auth";

/**
 * call POST `getManagementAPIServerBaseUrl()/o/<subOrgId>/api/server/v1/identity-providers` 
 * to create an identity provider
 * 
 * @param session - Session object
 * @param model - body of the identity provider that will be created
 *  
 * @returns created identity provider, if the call failed `null`
 */
export async function controllerCallCreateIdentityProvider(session: Session,
    model: IdentityProviderTemplateModel): Promise<IdentityProvider | null> {

    const data = (await commonControllerCall("/api/settings/identityProvider/createIdentityProvider", session,
        model) as IdentityProvider | null);

    return data;
}
