import callMe from "../../apiCall/dashboard/callMe";
import decodeUser from "../../util/apiUtil/decodeUser";

export default async function decodeMe(session) {
    try {
        const meData = await callMe(session);
        const meReturn = decodeUser(meData);

        return meReturn;
    } catch (err) {
        return null
    }
}