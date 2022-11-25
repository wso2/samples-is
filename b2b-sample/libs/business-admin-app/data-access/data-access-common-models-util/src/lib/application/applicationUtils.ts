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

import { ENTERPRISE_ID, GOOGLE_ID } from "@b2bsample/shared/util/util-common";
import enterpriseFederatedAuthenticators from "../identityProvider/data/templates/enterprise-identity-provider.json";
import googleFederatedAuthenticators from "../identityProvider/data/templates/google.json";

/**
 * 
 * @param templateId - application details template id
 * 
 * @returns template related to the template id.
 */

export function selectedTemplateBaesedonTemplateId(templateId: string) {
    switch (templateId) {
        case GOOGLE_ID:

            return googleFederatedAuthenticators;
        case ENTERPRISE_ID:

            return enterpriseFederatedAuthenticators;
        default:

            return null;
    }
}

/**
 * 
 * @param template - applicaiton details template
 * @param idpDetails - identity provider details
 
 * @returns `[check,onlyIdp]`
 * `check` - if the idp is in authentication sequence, 
 * `onlyIdp` - is the idp is the only idp in the sequence
 */
export function checkIfIdpIsinAuthSequence(template, idpDetails) {
    const authenticationSequenceModel = template.authenticationSequence;
    const idpName = idpDetails.name;
    let check = false;
    let onlyIdp = false;

    authenticationSequenceModel.steps.map((step) => {
        step.options.map((option) => {
            if (option.idp === idpName) {
                check = true;
            }
        });

        if (step.options.length == 1) {
            onlyIdp = true;
        }
    });

    return [ check, onlyIdp ];
}

/**
 * 
 * @param template - applicaiton details template
 * @returns `true` if BASIC AUTH is available in auth sequence, else `false`
 */
export function checkIfBasicAvailableinAuthSequence(template) {
    const authenticationSequenceModel = template.authenticationSequence;
    let check = false;

    authenticationSequenceModel.steps.map((step) => {
        step.options.map((option) => {
            if (option.authenticator === "BasicAuthenticator") {
                check = true;
            }
        });
    });

    return check;
}

/**
 * PatchApplicationAuthMethod mentioned whether we are adding or removing the idp.
 * `REMOVE` Will remove the idp from every step
 */
export const PatchApplicationAuthMethod = {
    ADD: true,
    REMOVE: false
};

export default {
    selectedTemplateBaesedonTemplateId, checkIfIdpIsinAuthSequence, checkIfBasicAvailableinAuthSequence,
    PatchApplicationAuthMethod
};
