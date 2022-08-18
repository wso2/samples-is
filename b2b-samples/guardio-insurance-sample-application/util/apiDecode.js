import { fetchMe, fetchUsers, addUser, editUser } from "./apiCall";
import { consoleLogDebug, consoleLogError, consoleLogInfo } from "./util";

const API_DECODE = "API DECODE";

function decodeUser(user) {
    consoleLogDebug('user',user);
    return {
        "id": user.id,
        "username": user.userName,
        "name": user.name != undefined ? user.name.givenName : "Not Defined",
        "email": user.emails != undefined ? user.emails[0] : "Not Defined"
    };
}

async function meDetails(session) {

    try {
        const meData = await fetchMe(session);

        const meReturn = decodeUser(meData);

        consoleLogInfo(`${API_DECODE} meDetails`, meReturn)

        return meReturn;
    } catch (err) {
        consoleLogError(API_DECODE, err);
        return null
    }

}

async function usersDetails(session) {

    try {

        const usersData = await fetchUsers(session);

        const usersReturn = [];

        usersData["Resources"].map((user) => {
            usersReturn.push(decodeUser(user));
        })

        consoleLogInfo(`${API_DECODE} usersDetails`, usersReturn)

        return usersReturn;
    } catch (err) {
        consoleLogError(`${API_DECODE} usersDetails`, err);
        return null
    }

}

async function addUserEncode(session, name, email, username, password) {
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
        await addUser(session, addUserEncode);

        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function editUserEncode(session, id, name, email, username) {
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
        await editUser(session, id, editUserEncode);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}


module.exports = { meDetails, usersDetails, addUserEncode, editUserEncode }