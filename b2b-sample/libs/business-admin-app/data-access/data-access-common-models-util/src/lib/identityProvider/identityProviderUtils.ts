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

import { getManagementAPIServerBaseUrl, getOrgUrl } from "@b2bsample/shared/util/util-application-config-util";
import { ENTERPRISE_ID, GOOGLE_ID } from "@b2bsample/shared/util/util-common";
import IdentityProviderTemplateModel from "./identityProviderTemplateModel";
import config from "../../../../../../../config.json";

/**
 * 
 * @returns callBackUrl of the idp
 */
export function getCallbackUrl(orgId: string) {
    return `${getOrgUrl(orgId)}/commonauth`;
}

/**
 * 
 * @param model - template of the idp as a JSON
 * @param templateId - identity provider template id
 * @param formValues - values get from the form inputs
 * @param orgId - organization id
 * 
 * @returns - idp readay to sent to the IS 
 */
export function setIdpTemplate(model: IdentityProviderTemplateModel, templateId: string,
    formValues: Record<string, string>, orgId: string): IdentityProviderTemplateModel {

    const name = formValues["application_name"].toString();
    const clientId = formValues["client_id"].toString();
    const clientSecret = formValues["client_secret"].toString();

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
 * @param model - template of the idp as a JSON
 * @param clientId - client id text entered by the user for the identity provider
 * @param clientSecret - client secret text entered by the user for the identity provider
 * @param orgId - organization id
 * 
 * @returns - create google IDP template
 */
function googleIdpTemplate(model: IdentityProviderTemplateModel, clientId: string, clientSecret: string,
    orgId: string): IdentityProviderTemplateModel {

    model.image =
        `${config.CommonConfig.ManagementAPIConfig.ImageBaseUrl}/libs/themes/default/assets` +
        "/images/identity-providers/google-idp-illustration.svg";

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
 * @param model - template of the idp as a JSON
 * @param clientId - client id text entered by the user for the identity provider
 * @param clientSecret - client secret text entered by the user for the identity provider    
 * @param formValues - values get from the form inputs
 * @param orgId - organization id
 * 
 * @returns create enterprise IDP template
 */
function enterpriseIdpTemplate(model: IdentityProviderTemplateModel, clientId: string, clientSecret: string,
    formValues: Record<string, string>, orgId: string): IdentityProviderTemplateModel {

    const authorizationEndpointUrl = formValues["authorization_endpoint_url"].toString();
    const tokenEndpointUrl = formValues["token_endpoint_url"].toString();
    const certificate = formValues["certificate"].toString();

    model.image =
        `${config.CommonConfig.ManagementAPIConfig.ImageBaseUrl}/libs/themes/default/assets` +
        "/images/identity-providers/enterprise-idp-illustration.svg";

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

export default { setIdpTemplate, getCallbackUrl };
