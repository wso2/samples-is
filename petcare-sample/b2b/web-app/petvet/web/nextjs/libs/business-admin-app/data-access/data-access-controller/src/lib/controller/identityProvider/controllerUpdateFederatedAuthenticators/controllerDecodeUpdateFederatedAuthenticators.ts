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

import { IdentityProviderFederatedAuthenticator } from
    "@pet-management-webapp/business-admin-app/data-access/data-access-common-models-util";
import { commonControllerDecode } from "@pet-management-webapp/shared/data-access/data-access-common-api-util";
import { Session } from "next-auth";
import { controllerCallUpdateFederatedAuthenticators } from "./controllerCallUpdateFederatedAuthenticators";

function refactorFederatedAuthenticatorsForUpdate(federatedAuthenticators: IdentityProviderFederatedAuthenticator) {
    delete federatedAuthenticators.authenticatorId;
    delete federatedAuthenticators.tags;

    return federatedAuthenticators;
}

function updateProperties(federatedAuthenticators: IdentityProviderFederatedAuthenticator, keyProperty: string,
    valueProperty: string) {
    federatedAuthenticators.properties.filter((property) => property.key === keyProperty)[0].value = valueProperty;

    return federatedAuthenticators;
}

/**
 * 
 * @param session - session object
 
 * @returns logged in users object. If failed `null`
 */
export async function controllerDecodeUpdateFederatedAuthenticators(
    session: Session, idpId: string, federatedAuthenticators: IdentityProviderFederatedAuthenticator,
    changedValues: Record<string, string>): Promise<IdentityProviderFederatedAuthenticator | null> {

    const federatedAuthenticatorId = federatedAuthenticators.authenticatorId;

    federatedAuthenticators = refactorFederatedAuthenticatorsForUpdate(federatedAuthenticators);
    Object.keys(changedValues).filter((key) => {
        federatedAuthenticators = updateProperties(federatedAuthenticators, key, changedValues[key]);

        return null;
    });

    const body = [ federatedAuthenticatorId, federatedAuthenticators ];

    const res = (await commonControllerDecode(() => controllerCallUpdateFederatedAuthenticators(session, idpId, body),
        null) as IdentityProviderFederatedAuthenticator | null);

    return res;

}

export default controllerDecodeUpdateFederatedAuthenticators;
