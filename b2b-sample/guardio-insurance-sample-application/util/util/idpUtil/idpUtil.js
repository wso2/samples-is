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

import { ENTERPRISE_ID, GOOGLE_ID } from "../common/common";
import { getOrgUrl } from "../orgUtil/orgUtil";
import { getManagementAPIServerBaseUrl } from "../apiUtil/getUrls";
import config from "../../../config.json";

/**
 * 
 * @returns callBackUrl of the idp
 */
function getCallbackUrl(orgId) {
    return `${getOrgUrl(orgId)}/commonauth`;
}

/**
 * 
 * @param model - template of the idp as a JSON
 * @param templateId 
 * @param formValues 
 * @param orgId
 * 
 * @returns - idp readay to sent to the IS 
 */
function setIdpTemplate(model, templateId, formValues, orgId) {

    let name = formValues.application_name.toString();
    let clientId = formValues.client_id.toString();
    let clientSecret = formValues.client_secret.toString();

    model.name = name;

    switch (templateId) {
        case GOOGLE_ID:
            model = googleIdpTemplate(model, clientId, clientSecret, orgId);
            break;
        case ENTERPRISE_ID:
            model = enterpriseIdpTemplate(model, clientId, clientSecret, formValues, orgId);
            break;
        default:
            break;
    }

    model.federatedAuthenticators.authenticators[0].isEnabled = true;

    return model;

}

/**
 * 
 * @param model 
 * @param clientId 
 * @param clientSecret 
 * @param orgId
 * 
 * @returns - create google IDP template
 */
function googleIdpTemplate(model, clientId, clientSecret, orgId) {

    model.image =
        `${config.ManagementAPIConfig.ImageBaseUrl}/libs/themes/default/assets` +
        `/images/identity-providers/google-idp-illustration.svg`;

    model.alias = `${getManagementAPIServerBaseUrl()}/oauth2/token`;

    model.federatedAuthenticators.authenticators[0].properties = [
        {
            "key": "ClientId",
            "value": clientId
        },
        {
            "key": "ClientSecret",
            "value": clientSecret
        },
        {
            "key": "callbackUrl",
            "value": getCallbackUrl(orgId)
        },
        {
            "key": "Scopes",
            "value": "email openid profile"
        }
    ];

    return model;
}

/**
 * 
 * @param model 
 * @param clientId 
 * @param clientSecret 
 * @param formValues 
 * @param orgId
 * 
 * @returns create enterprise IDP template
 */
function enterpriseIdpTemplate(model, clientId, clientSecret, formValues, orgId) {

    let authorizationEndpointUrl = formValues.authorization_endpoint_url.toString();
    let tokenEndpointUrl = formValues.token_endpoint_url.toString();
    let certificate = formValues.certificate.toString();

    model.image =
        `${config.ManagementAPIConfig.ImageBaseUrl}/libs/themes/default/assets` +
        `/images/identity-providers/enterprise-idp-illustration.svg`;

    model.federatedAuthenticators.authenticators[0].properties = [
        {
            "key": "ClientId",
            "value": clientId
        },
        {
            "key": "ClientSecret",
            "value": clientSecret
        },
        {
            "key": "OAuth2AuthzEPUrl",
            "value": authorizationEndpointUrl
        },
        {
            "key": "OAuth2TokenEPUrl",
            "value": tokenEndpointUrl
        },
        {
            "key": "callbackUrl",
            "value": getCallbackUrl(orgId)
        },
        {
            "key": "Scopes",
            "value": "email openid profile"
        }
    ];

    model.certificate.jwksUri = certificate;

    return model;
}

module.exports = {
    setIdpTemplate, getCallbackUrl
};
