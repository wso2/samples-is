import config from "../../../config.json";

export const createIdentityProvider = async ({model, session}) => {

    try {
        const res = await fetch(
            `${config.WSO2IS_HOST}/t/${config.WSO2IS_TENANT_NAME}/api/server/v1/identity-providers`,
            {
                method: "POST",
                body: JSON.stringify(model),
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + session.accessToken,
                    "Access-Control-Allow-Origin": config.WSO2IS_CLIENT_URL
                }
            },
        );
        return await res.json();
    } catch (err) {
        console.error(err);
        return null;
    }

}

export const listAllIdentityProviders = async ({limit, offset, session}) => {

    const q = encodeURIComponent(`limit=${limit}&offset=${offset}`)

    try {
        const res = await fetch(
            `${config.WSO2IS_HOST}/t/${config.WSO2IS_TENANT_NAME}/api/server/v1/identity-providers?${q}`,
            {
                headers: {
                    "Authorization": "Bearer " + session.accessToken,
                    "Access-Control-Allow-Origin": config.WSO2IS_CLIENT_URL
                }
            },
        );
        return await res.json();
    } catch (err) {
        console.error(err);
        return null;
    }

}

export const deleteIdentityProvider = async ({id, session}) => {

    try {
        const res = await fetch(
            `${config.WSO2IS_HOST}/t/${config.WSO2IS_TENANT_NAME}/api/server/v1/identity-providers/${id}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + session.accessToken,
                    "Access-Control-Allow-Origin": config.WSO2IS_CLIENT_URL
                }
            },
        );
        return await res.json();
    } catch (err) {
        console.error(err);
        return null;
    }

}

export const getDetailedIdentityProvider = async ({id, session}) => {

    try {
        const res = await fetch(
            `${config.WSO2IS_HOST}/t/${config.WSO2IS_TENANT_NAME}/api/server/v1/identity-providers/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + session.accessToken,
                    "Access-Control-Allow-Origin": config.WSO2IS_CLIENT_URL
                }
            },
        );
        return await res.json();
    } catch (err) {
        console.error(err);
        return null;
    }

};
