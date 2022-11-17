interface Name {
    givenName: string,
    familyName: string
}

export interface User {
    id: string,
    name: Name;
    emails : [string]
    userName : string
}
