/*
 * Copyright (c) 2022 WSO2 LLC. (http://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *http://www.apache.org/licenses/LICENSE-2.
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
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
