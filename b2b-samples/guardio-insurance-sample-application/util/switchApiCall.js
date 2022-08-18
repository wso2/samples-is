import config from '../config.json';
import { consoleLogDebug, consoleLogError, parseCookies } from "./util";

const SWITCH_API_CALL = "Switch API Call";

function setOrgId(request) {
    const cookies = parseCookies(request);
    const subOrgId = cookies.orgId;

    return subOrgId;
}

function getBasicAuth() {
    return Buffer.from(`${config.WSO2IS_CLIENT_ID}:${config.WSO2IS_CLIENT_SECRET}`).toString('base64');
}

function getSwitchHeader() {

    const headers = {
        "Authorization": `Basic ${getBasicAuth()}`,
        "accept": "application/json",
        "content-type": "application/x-www-form-urlencoded",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": config.WSO2IS_CLIENT_URL
    }
    return headers;
}

function getSwitchBody(oId, accessToken) {
    const body = {
        'grant_type': 'organization_switch',
        'scope': config.WSO2IS_SCOPES.join(" "),
        'switching_organization': oId,
        'token': accessToken
    }
    consoleLogDebug(SWITCH_API_CALL, new URLSearchParams(body));
    return body;
}

function getSwitchResponse(oId, accessToken) {
    const request = {
        method: 'POST',
        headers: getSwitchHeader(),
        body: new URLSearchParams(getSwitchBody(oId, accessToken)).toString()
    }
    consoleLogDebug(SWITCH_API_CALL, request)
    return request;
}

function getSwitchEndpoint() {
    if (config.WSO2IS_TENANT_NAME == 'carbon.super') {
        return `${config.WSO2IS_HOST}/oauth2/token`
    }
    return `${config.WSO2IS_HOST}/o/${config.WSO2IS_TENANT_NAME}/oauth2/token`
}

async function switchOrg(request, accessToken) {

    try {
        const res = await fetch(
            getSwitchEndpoint(),
            getSwitchResponse(setOrgId(request), accessToken)
        );
        const data = await res.json();
        consoleLogDebug(SWITCH_API_CALL, data);

        return data;
    } catch (err) {
        consoleLogError(SWITCH_API_CALL, err);
        return null;
    }
}

module.exports = { switchOrg };
