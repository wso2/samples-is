/*
 * Copyright (c) 2022 WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *http://www.apache.org/licenses/LICENSE-2.
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import callUpdateFederatedAuthenticators from "../../../apiCall/settings/identityProvider/callUpdateFederatedAuthenticators";

function refactorFederatedAuthenticatorsForUpdate(federatedAuthenticators) {
    delete federatedAuthenticators.authenticatorId;
    delete federatedAuthenticators.tags;
    return federatedAuthenticators;
}

function updateProperties(federatedAuthenticators, keyProperty, valueProperty) {
    federatedAuthenticators.properties.filter((obj) => obj.key === keyProperty)[0].value = valueProperty;
    return federatedAuthenticators;
}

export default async function decodeUpdateFederatedAuthenticators(session, idpId, federatedAuthenticators, changedValues) {
    let federatedAuthenticatorId = federatedAuthenticators.authenticatorId;
    federatedAuthenticators = refactorFederatedAuthenticatorsForUpdate(federatedAuthenticators);
    Object.keys(changedValues).filter((key)=>{
        federatedAuthenticators = updateProperties(federatedAuthenticators, key, changedValues[key]);
    })

    let body = [federatedAuthenticatorId, federatedAuthenticators];

    try {
        const res = await callUpdateFederatedAuthenticators(session, idpId, body);
        return res;
    } catch (err) {
        return null;
    }
}

