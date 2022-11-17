interface FederatedAuthenticatorForIdentityProvider {
    defaultAuthenticatorId : string,
    [key: string]: any,
}

export interface IdentityProvider {
    id: string,
    name: string,
    image : string,
    description : string,
    federatedAuthenticators: [FederatedAuthenticatorForIdentityProvider],
    [key: string]: any,
}

export interface AllIdentityProvidersIdentityProvider {
    id: string,
    [key: string]: any
}

export interface AllIdentityProviders {
    count: number
    identityProviders: [AllIdentityProvidersIdentityProvider]
    totalResults: number,
    [key: string]: any
}

export interface FederatedAuthenticatorsProperty {
    key: string,
    value: string
}

export interface FederatedAuthenticators {
    authenticatorId: string,
    name: string,
    properties: [FederatedAuthenticatorsProperty],
    [key: string]: any,

}
