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

import config from '../../../config.json';
import { ENTERPRISE_ID, FACEBOOK_ID, GOOGLE_ID } from '../common/common';

function setIdpTemplate(model, templateId, formValues) {

    let name = formValues.application_name.toString();
    let clientId = formValues.client_id.toString();
    let clientSecret = formValues.client_secret.toString();

    model.name = name;

    switch (templateId) {
        case FACEBOOK_ID:
            model = facebookIdpTemplate(model, clientId, clientSecret);
            break;
        case GOOGLE_ID:
            model = googleIdpTemplate(model, clientId, clientSecret);
            break;
        case ENTERPRISE_ID:
            model = enterpriseIdpTemplate(model, clientId, clientSecret, formValues);
            break;
        default:
            break;
    }

    model.federatedAuthenticators.authenticators[0].isEnabled = true;

    return model;

}

function facebookIdpTemplate(model, clientId, clientSecret) {

    model.image =
        `${config.WSO2IS_HOST}/console/libs/themes/default/assets/images/identity-providers/facebook-idp-illustration.svg`;

    model.alias = `${config.WSO2IS_HOST}/oauth2/token`;

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
            "value": `${config.WSO2IS_HOST}/commonauth`
        }
    ];

    return model;
}

function googleIdpTemplate(model, clientId, clientSecret) {

    model.image =
        `${config.WSO2IS_HOST}/console/libs/themes/default/assets/images/identity-providers/google-idp-illustration.svg`;

    model.alias = `${config.WSO2IS_HOST}/oauth2/token`;

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
            "value": `${config.WSO2IS_HOST}/commonauth`
        },
        {
            "key": "AdditionalQueryParameters",
            "value": "scope=email openid profile"
        }
    ];

    return model;
}

function enterpriseIdpTemplate(model, clientId, clientSecret, formValues) {

    let authorizationEndpointUrl = formValues.authorization_endpoint_url.toString();
    let tokenEndpointUrl = formValues.token_endpoint_url.toString();

    model.image =
        `${config.WSO2IS_HOST}/console/libs/themes/default/assets/images/identity-providers/enterprise-idp-illustration.svg`;

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
            "key": "callBackUrl",
            "value": `${config.WSO2IS_HOST}/commonauth`
        }
    ];

    return model;
}

module.exports = {
    setIdpTemplate
};
