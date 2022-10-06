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

const { GOOGLE_ID, FACEBOOK_ID, ENTERPRISE_ID } = require("../common/common");
import enterpriseFederatedAuthenticators from '../../../components/data/templates/enterprise-identity-provider.json';
import facebookFederatedAuthenticators from '../../../components/data/templates/facebook.json';
import googleFederatedAuthenticators from '../../../components/data/templates/google.json';


function selectedTemplateBaesedonTemplateId(templateId) {
    switch (templateId) {
        case GOOGLE_ID:

            return googleFederatedAuthenticators;
        case FACEBOOK_ID:

            return facebookFederatedAuthenticators;
        case ENTERPRISE_ID:

            return enterpriseFederatedAuthenticators;
        default:

            return null;
    }
}

function checkIfIdpIsinAuthSequence(template, idpDetails) {
    let authenticationSequenceModel = template.authenticationSequence;
    let idpName = idpDetails.name;
    let check = false;

    authenticationSequenceModel.steps.map((step) => {
        step.options.map((option) => {
            if (option.idp === idpName) {
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
}

module.exports = {
    selectedTemplateBaesedonTemplateId, checkIfIdpIsinAuthSequence, PatchApplicationAuthMethod
}
