import callViewUsers from "../../apiCall/settings/callViewUsers";
import decodeUser from "../../util/apiUtil/decodeUser";

export default async function decodeViewUsers(session) {
    try {
        const usersData = await callViewUsers(session);

        const usersReturn = [];

        usersData["Resources"].map((user) => {
            usersReturn.push(decodeUser(user));
        })

        return usersReturn;
    } catch (err) {
        return null
    }
}