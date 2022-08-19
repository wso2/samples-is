import config from '../../../config.json';

export default function getDataHeader(session) {
    const headers = {
        "accept": "application/scim+json",
        "authorization": "Bearer " + session.accessToken,
        "access-control-allow-origin": config.WSO2IS_CLIENT_URL
    }

    return { headers }
}
