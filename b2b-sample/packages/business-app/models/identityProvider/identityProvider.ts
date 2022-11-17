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
