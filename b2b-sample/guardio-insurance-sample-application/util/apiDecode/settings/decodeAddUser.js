import callAddUser from "../../apiCall/settings/callAddUser";

export default async function decodeAddUser(session, name, email, username, password) {
    const addUserEncode = {
        "schemas": [],
        "name": {
            "givenName": name
        },
        "userName": username,
        "password": password,
        "emails": [
            {
                "value": email,
                "primary": true
            }
        ]
    }

    try {
        await callAddUser(session, addUserEncode);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}