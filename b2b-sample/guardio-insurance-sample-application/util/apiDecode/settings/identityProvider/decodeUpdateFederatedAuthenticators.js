

/*
 * Copyright (c) 2022 WSO2 LLC. (http://www.wso2.com).
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

import callPatchGeneralSettingsIdp from "../../../apiCall/settings/identityProvider/callPatchGeneralSettingsIdp";

function refactorFederatedAuthenticatorsForUpdate(federatedAuthenticators) {
    delete federatedAuthenticators.authenticatorId;
    delete federatedAuthenticators.tags;
    return federatedAuthenticators;
}

function updateProperties(federatedAuthenticators, changedProperty) {
    federatedAuthenticators.properties.filter((obj)=>obj.key===changedProperty.key)[0].value = changedProperty.value;
    return federatedAuthenticators;
}

export default async function decodeUpdateFederatedAuthenticators(session, federatedAuthenticators, changedValues) {
    console.log(federatedAuthenticators);
    federatedAuthenticators = refactorFederatedAuthenticatorsForUpdate(federatedAuthenticators);
    changedValues.filter((property)=>{
        federatedAuthenticators = updateProperties(federatedAuthenticators, property);
    });

    console.log(federatedAuthenticators);
//     let x = {
//         "name": "GoogleOIDCAuthenticator",
//         "isEnabled": true,
//         "isDefault": true,
//         "properties": [
//             { "key": "ClientId", "value": "asd112" },
//             { "key": "callbackUrl", "value": "https://localhost:9443/commonauth" },
//             { "key": "AdditionalQueryParameters", "value": "scope=email openid profile" },
//             { "key": "ClientSecret", "value": "asd12" }
//         ]
//     }

//     let body = [
//         { "operation": "REPLACE", "path": "/description", "value": description },
//         { "operation": "REPLACE", "path": "/isPrimary", "value": false },
//         { "operation": "REPLACE", "path": "/name", "value": name }
//     ];

//     try {
//         const res = await callPatchGeneralSettingsIdp(session, idpId, body);
//         return res;
//     } catch (err) {
//         return null;
//     }
 }

