interface Meta {
    location: string,
    resourceType?: string
}

interface Users {
    $ref: string,
    value: string
}

interface Groups {
    $ref: string,
    value: string
}

export interface Role {
    displayName: string,
    meta: Meta,
    schemas?: [string],
    id: string,
    users?: [Users],
    groups?: [Groups],
    permissions?: [string]
}
