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

import {
    IdentityProvider, IdentityProviderConfigureType, IdentityProviderDiscoveryUrl, IdentityProviderTemplate,
    IdentityProviderTemplateModel, setIdpTemplate
} from
    "@pet-management-webapp/business-admin-app/data-access/data-access-common-models-util";
import { commonControllerDecode } from "@pet-management-webapp/shared/data-access/data-access-common-api-util";
import { OIDC_IDP, SAML_IDP } from "@pet-management-webapp/shared/util/util-common";
import { Session } from "next-auth";
import { controllerCallCreateIdentityProvider } from "./controllerCallCreateIdentityProvider";
import controllerDecodeGetDiscoveryUrl from "../controllerGetDiscoveryUrl/controllerDecodeGetDiscoveryUrl";

/**
 * get the identity provider details from the discovery url
 * 
 * @param discoveryUrl - discovery url
 */
async function getIdentityProviderFromDiscoveryUrl(session: Session, discoveryUrl: string)
    : Promise<IdentityProviderDiscoveryUrl | null> {
    const identityProviderDiscoveryUrl = await controllerDecodeGetDiscoveryUrl(session, discoveryUrl);

    return identityProviderDiscoveryUrl;
}

/**
 * 
 * @param session - session object
 * @param template - template
 * @param formValues - values of the form that user filled
 * 
 * @returns - whether the identity provider is created or not
 */
export async function controllerDecodeCreateIdentityProvider(session: Session, template: IdentityProviderTemplate,
    formValues: Record<string, string>, configureType?: IdentityProviderConfigureType)
    : Promise<IdentityProvider | null> {

    let model: IdentityProviderTemplateModel = JSON.parse(JSON.stringify(template.idp));

    if (template.id === SAML_IDP) {
        model = setIdpTemplate(model, (template.templateId as string), formValues, (session.orgId as string));
    }
    
    if (template.id === OIDC_IDP && configureType) {
        switch (configureType) {
            case IdentityProviderConfigureType.AUTO: {
                const identityProviderDiscoveryUrl: IdentityProviderDiscoveryUrl | null
                    = await getIdentityProviderFromDiscoveryUrl(session, formValues["discovery_url"].toString());

                if (identityProviderDiscoveryUrl) {
                    model = setIdpTemplate(model, (template.templateId as string), formValues, (session.orgId as string)
                        , identityProviderDiscoveryUrl);
                }

                break;
            }

            case IdentityProviderConfigureType.MANUAL: {

                model = setIdpTemplate(model, (template.templateId as string), formValues, (session.orgId as string));

                break;
            }
        }
    }

    console.log("model", model);

    const res = (await commonControllerDecode(() => controllerCallCreateIdentityProvider(session, model),
        null) as IdentityProvider | null);

    return res;

}

export default controllerDecodeCreateIdentityProvider;
