import config from '../../../config.json';

function sentDataHeader(session) {
    const headers = {
        "accept": "application/scim+json",
        "content-type": "application/scim+json",
        "authorization": "Bearer " + session.accessToken,
        "access-control-allow-origin": config.WSO2IS_CLIENT_URL
    }
    return headers;
}

function getSentDataRequestOptions(session, method, body) {
    const request = {
        method: method,
        headers: sentDataHeader(session),
        body: JSON.stringify(body)
    }
    return request;
}

module.exports = { getSentDataRequestOptions }