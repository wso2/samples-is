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

import enterpriseFederatedAuthenticators from
    "../../../components/sections/sections/settingsSection/idpSection/data/templates/enterprise-identity-provider.json";
import googleFederatedAuthenticators from
    "../../../components/sections/sections/settingsSection/idpSection/data/templates/google.json";

const { GOOGLE_ID, ENTERPRISE_ID } = require("../common/common");

/**
 * 
 * @param templateId
 * 
 * @returns template related to the template id.
 */
function selectedTemplateBaesedonTemplateId(templateId) {
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
 * @param template
 * @param idpDetails 

 * @returns `[check,onlyIdp]`
 * `check` - if the idp is in authentication sequence, 
 * `onlyIdp` - is the idp is the only idp in the sequence
 */
function checkIfIdpIsinAuthSequence(template, idpDetails) {
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
function checkIfBasicAvailableinAuthSequence(template) {
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
 * @REMOVE Will remove the idp from every step
 */
const PatchApplicationAuthMethod = {
    ADD: true,
    REMOVE: false
};

export{
    selectedTemplateBaesedonTemplateId, checkIfIdpIsinAuthSequence, checkIfBasicAvailableinAuthSequence,
    PatchApplicationAuthMethod
};
