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

import { getBaseUrl, getOrgUrl } 
    from "@pet-management-webapp/shared/util/util-application-config-util";
import { EMPTY_STRING, OIDC_IDP, SAML_IDP } from "@pet-management-webapp/shared/util/util-common";
import IdentityProviderDiscoveryUrl from "./identityProviderDiscoveryUrl";
import IdentityProviderTemplateModel from "./identityProviderTemplateModel";
import enterpriseImage from "../../../../../ui/ui-assets/src/lib/images/enterprise.svg";

/**
 * @param templateId - template id of the identity provider

 * @returns - local image for the relevant identity provider
 */
export function getImageForTheIdentityProvider(templateId: string): string {
    if (templateId === OIDC_IDP || templateId === SAML_IDP) {
        return enterpriseImage;
    }
    
    return EMPTY_STRING;
}

/**
 * 
 * @returns callBackUrl of the idp
 */
export function getCallbackUrl(orgId: string): string {
    return `${getOrgUrl(orgId)}/commonauth`;
}

/**
 * 
 * @returns callBackUrl of the idp
 */
export function getIdPCallbackUrl(orgId: string): string {
    return `${getBaseUrl(orgId)}/${orgId}/commonauth`;
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
    formValues: Record<string, string>, orgId: string,
    identityProviderDiscoveryUrl?: IdentityProviderDiscoveryUrl): IdentityProviderTemplateModel {

    const name: string = formValues["application_name"].toString();

    model.name = name;

    switch (templateId) {
        case OIDC_IDP: {
            const clientId: string = formValues["client_id"].toString();
            const clientSecret: string = formValues["client_secret"].toString();
            
            model = enterpriseOIDCIdpTemplate(model, clientId, clientSecret, formValues, orgId,
                identityProviderDiscoveryUrl);

            break;
        }
            
        case SAML_IDP:
            model = enterpriseSAMLIdpTemplate(model, formValues);

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
 * @param formValues - values get from the form inputs
 * @param orgId - organization id
 * 
 * @returns create enterprise IDP template
 */
function enterpriseOIDCIdpTemplate(model: IdentityProviderTemplateModel, clientId: string, clientSecret: string,
    formValues: Record<string, string>, orgId: string, identityProviderDiscoveryUrl?: IdentityProviderDiscoveryUrl)
    : IdentityProviderTemplateModel {

    let authorizationEndpointUrl: string;
    let tokenEndpointUrl: string;
    let logoutUrl: string;
    let jwksUri: string;

    if (identityProviderDiscoveryUrl) {
        authorizationEndpointUrl = identityProviderDiscoveryUrl.authorization_endpoint;
        tokenEndpointUrl = identityProviderDiscoveryUrl.token_endpoint;
        logoutUrl = identityProviderDiscoveryUrl.end_session_endpoint;
        jwksUri = identityProviderDiscoveryUrl.jwks_uri;
    } else {
        authorizationEndpointUrl = formValues["authorization_endpoint"].toString();
        tokenEndpointUrl = formValues["token_endpoint"].toString();

        if (formValues["end_session_endpoint"]) {
            logoutUrl = formValues["end_session_endpoint"].toString();
        }

        if (formValues["jwks_uri"]) {
            jwksUri = formValues["jwks_uri"].toString();
        }
    }

    model.image = "https://localhost:9443/console/libs/themes/default/assets/images/" + 
        "identity-providers/enterprise-idp-illustration.svg";

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
            "key": "OIDCLogoutEPUrl",
            "value": logoutUrl
        },
        {
            "key": "callbackUrl",
            "value": getIdPCallbackUrl(orgId)
        },
        {
            "key": "Scopes",
            "value": "email openid profile groups"
        }
    ];

    model.certificate.jwksUri = jwksUri;

    return model;
}

function enterpriseSAMLIdpTemplate(
    model: IdentityProviderTemplateModel, 
    formValues: Record<string, string>
): IdentityProviderTemplateModel {

    // errors = fieldValidate("entity_id", values.entity_id, errors);
    // errors = fieldValidate("meta_data_saml", values.meta_data_saml, errors);
    // errors = fieldValidate("sso_url", values.authorization_endpoint, errors);
    // errors = fieldValidate("entity_id", values.token_endpoint, errors);

    model.image = "https://localhost:9443/console/libs/themes/default/assets/images/" + 
        "identity-providers/enterprise-idp-illustration.svg";

    if (formValues["meta_data_saml"]) {
        model.federatedAuthenticators.authenticators[0].properties = [
            {
                "key": "SPEntityId",
                "value": formValues["sp_entity_id"]
            },
            {
                "key": "meta_data_saml",
                "value": formValues["meta_data_saml"]
            },
            {
                "key": "SelectMode",
                "value": "Metadata File Configuration"
            },
            {
                "key": "IsUserIdInClaims",
                "value": "false"
            },
            {
                "key": "IsSLORequestAccepted",
                "value": "false"
            }
        ];
    }

    if (formValues["sso_url"]) {
        model.federatedAuthenticators.authenticators[0].properties = [
            {
                "key": "IdPEntityId",
                "value": formValues["idp_entity_id"]
            },
            {
                "key": "NameIDType",
                "value": "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified"
            },
            {
                "key": "RequestMethod",
                "value": "post"
            },
            {
                "key": "SPEntityId",
                "value": formValues["sp_entity_id"]
            },
            {
                "key": "SSOUrl",
                "value": formValues["sso_url"]
            },
            {
                "key": "SelectMode",
                "value": "Manual Configuration"
            },
            {
                "key": "IsUserIdInClaims",
                "value": "false"
            },
            {
                "key": "IsSLORequestAccepted",
                "value": "false"
            },
            {
                "key": "SignatureAlgorithm",
                "value": "RSA with SHA256"
            },
            {
                "key": "DigestAlgorithm",
                "value": "SHA256"
            }
        ];
    }

    return model;
}

export default { getCallbackUrl, getImageForTheIdentityProvider, setIdpTemplate };
