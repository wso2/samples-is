import { consoleLogDebug, consoleLogError, consoleLogInfo } from "./util";
import config from '../config.json';
import Cookie from 'js-cookie';

const API_CALL = "API CALL";

const POST_METHOD = "POST";
const PATCH_METHOD = "PATCH";

const subOrgId = Cookie.get("orgId");

function sentDataHeader(session) {
    const headers = {
        "accept": "application/scim+json",
        "content-type": "application/scim+json",
        "authorization": "Bearer " + session.accessToken,
        "access-control-allow-origin": config.WSO2IS_CLIENT_URL
    }
    return headers;
}

function getDataHeader(session) {
    const headers = {
        "accept": "application/scim+json",
        "authorization": "Bearer " + session.accessToken,
        "access-control-allow-origin": config.WSO2IS_CLIENT_URL
    }

    return { headers }
}

function getSentDataRequestOptions(session, method, body) {
    const request = {
        method: method,
        headers: sentDataHeader(session),
        body: JSON.stringify(body)
    }
    return request;
}

async function fetchMe(session) {
    try {
        var data = "";
        if (session.user == null) {
            const res = await fetch(
                // `${config.WSO2IS_HOST}/t/${config.WSO2IS_TENANT_NAME}/scim2/Me`,
                `${config.WSO2IS_HOST}/o/${subOrgId}/scim2/Users/${session.userId}`,
                getDataHeader(session)
            );
            data = await res.json();
        } else {
            data = session.user;
        }
        return data;
    } catch (err) {
        return null;
    }
}

async function fetchUsers(session) {
    consoleLogInfo(`session ${API_CALL}`, session);

    try {
        const res = await fetch(
            //`${config.WSO2IS_HOST}/t/${config.WSO2IS_TENANT_NAME}/scim2/Users`,
            `${config.WSO2IS_HOST}/o/${subOrgId}/scim2/Users`,
            getDataHeader(session)
        );
        const data = await res.json();
        consoleLogDebug(`${API_CALL} users`, data);

        return data;
    } catch (err) {
        consoleLogError(`${API_CALL} users`, err);

        return null;
    }
}

async function addUser(session, user) {
    const res = await fetch(
        // `${config.WSO2IS_HOST}/t/${config.WSO2IS_TENANT_NAME}/scim2/Users`,
        `${config.WSO2IS_HOST}/o/${subOrgId}/scim2/Users`,
        getSentDataRequestOptions(session, POST_METHOD, user)
    );
    const data = await res.json();
    consoleLogDebug(`${API_CALL} users`, data);

    return data;
}

async function editUser(session, id, user) {
    const res = await fetch(
        // `${config.WSO2IS_HOST}/t/${config.WSO2IS_TENANT_NAME}/scim2/Users/${id}`,
        `${config.WSO2IS_HOST}/o/${subOrgId}/scim2/Users/${id}`,
        getSentDataRequestOptions(session, PATCH_METHOD, user)
    );
    const data = await res.json();
    consoleLogDebug(`${API_CALL} edit users`, data);

    return data;
}

module.exports = { fetchMe, fetchUsers, addUser, editUser }