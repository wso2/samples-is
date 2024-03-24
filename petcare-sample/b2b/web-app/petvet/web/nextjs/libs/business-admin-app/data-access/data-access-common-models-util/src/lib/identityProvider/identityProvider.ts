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
import { ControllerCallReturn, ControllerDecodeReturn } 
    from "@pet-management-webapp/shared/data-access/data-access-common-models-util";
import IdentityProviderFederatedAuthenticator from "./identityProviderFederatedAuthenticator";

interface FederatedAuthenticatorForIdentityProvider {
    defaultAuthenticatorId : string,
    authenticators: IdentityProviderFederatedAuthenticator
    [key: string]: unknown,
}

export interface IdentityProvider extends ControllerCallReturn, ControllerDecodeReturn {
    id: string,
    name: string,
    image : string,
    description : string,
    federatedAuthenticators?: FederatedAuthenticatorForIdentityProvider,
    templateId: string,
    groups?: IdpGroup[],
    [key: string]: unknown,
}

export interface IdentityProviderGroupMappings extends ControllerCallReturn, ControllerDecodeReturn {
    userIdClaim: {
        uri: string
    },
    roleClaim: {
        uri: string
    },
    provisioningClaims: string[],
    mappings: ClaimMapping[]
}

export interface IdpGroup extends ControllerCallReturn, ControllerDecodeReturn {
    id: string,
    name: string
}

interface ClaimMapping {
    idpClaim: string,
    localClaim: {
        id?: string,
        uri: string,
        displayName?: string
    }
}

export interface LocalClaim extends ControllerCallReturn, ControllerDecodeReturn {
    [key: string]: unknown
}

export default IdentityProvider;
