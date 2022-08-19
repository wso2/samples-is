import callEditUser from "../../apiCall/settings/callEditUser";

export default async function decodeEditUser(session, id, name, email, username) {
    const editUserEncode = {
        "schemas": [
            "urn:ietf:params:scim:api:messages:2.0:PatchOp"
        ],
        "Operations": [
            {
                "op": "replace",
                "value": {
                    "name": {
                        "givenName": name
                    },
                    "userName": username,
                    "emails": [
                        {
                            "value": email,
                            "primary": true
                        }
                    ]
                }
            }
        ]
    }

    try {
        const usersData = await callEditUser(session,id,editUserEncode);
        return true;
    } catch (err) {
        return false
    }
}