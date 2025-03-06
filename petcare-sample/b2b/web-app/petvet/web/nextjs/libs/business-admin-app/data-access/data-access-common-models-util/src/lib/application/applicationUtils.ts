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

import { OIDC_IDP, SAML_IDP } from "@pet-management-webapp/shared/util/util-common";
import Application from "./application";
import enterpriseOIDCFederatedAuthenticators 
    from "../identityProvider/data/templates/standard-based-oidc-identity-provider.json";
import enterpriseSAMLFederatedAuthenticators 
    from "../identityProvider/data/templates/standard-based-saml-identity-provider.json";
import IdentityProviderTemplateModel from "../identityProvider/identityProviderTemplateModel";

/**
 * 
 * @param templateId - application details template id
 * 
 * @returns template related to the template id.
 */

export function selectedTemplateBaesedonTemplateId(templateId: string): IdentityProviderTemplateModel | null {
    switch (templateId) {
        case OIDC_IDP:
            return enterpriseOIDCFederatedAuthenticators;
        case SAML_IDP:
            return enterpriseSAMLFederatedAuthenticators;
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
export function checkIfIdpIsinAuthSequence(template: Application, idpDetails): boolean[] {
    const authenticationSequenceModel = template.authenticationSequence;
    const idpName = idpDetails.name;
    let check = false;
    let onlyIdp = false;

    authenticationSequenceModel.steps.forEach((step) => {
        step.options.forEach((option) => {
            if (option.idp === idpName) {
                check = true;
            }
        });

        if (step.options.length === 1) {
            onlyIdp = true;
        }
    });

    return [ check, onlyIdp ];
}

export function checkIfAuthenticatorIsinAuthSequence(template: Application, authenticatorName: string): boolean[] {
    const authenticationSequenceModel = template.authenticationSequence;
    let check = false;
    let onlyIdp = false;

    authenticationSequenceModel.steps.forEach((step) => {
        step.options.forEach((option) => {
            if (option.authenticator === authenticatorName) {
                check = true;
            }
        });

        if (step.options.length === 1) {
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
export function checkIfBasicAvailableinAuthSequence(template): boolean {
    const authenticationSequenceModel = template.authenticationSequence;
    let check = false;

    authenticationSequenceModel.steps.forEach((step) => {
        step.options.forEach((option) => {
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
    PatchApplicationAuthMethod, checkIfBasicAvailableinAuthSequence, checkIfIdpIsinAuthSequence,
    selectedTemplateBaesedonTemplateId

};
