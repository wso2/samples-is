/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import config from "../../../config.json";

export const listApplications = async ({ limit, offset, filter = null, session }) => {

    const DEFAULT_FILTER = filter || "name co *";
    const q = `limit=${limit}&offset=${offset}&filter=${DEFAULT_FILTER}`;

    try {
        const res = await fetch(
            `${config.WSO2IS_HOST}/t/${config.WSO2IS_TENANT_NAME}/api/server/v1/applications?${q}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + session.accessToken,
                    "Access-Control-Allow-Origin": config.WSO2IS_CLIENT_URL
                }
            }
        );

        // FIXME: once API changes are done.
        // For now, we will receive the clientId as `inboundKey` in a list item.
        // However, it will change to `clientId` (for OIDC) and `issuer` (for SAML)
        // applications with a planed API update.
        return await res.json();
    } catch (err) {
        console.error(err);

        return null;
    }
};

export const getApplicationDetails = async ({ id, session }) => {

    try {
        const res = await fetch(
            `${config.WSO2IS_HOST}/t/${config.WSO2IS_TENANT_NAME}/api/server/v1/applications/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + session.accessToken,
                    "Access-Control-Allow-Origin": config.WSO2IS_CLIENT_URL
                }
            }
        );

        return await res.json();
    } catch (err) {
        console.error(err);

        return null;
    }
};

export const patchApplication = async ({ id, partial, session }) => {

    try {
        const res = await fetch(
            `${config.WSO2IS_HOST}/t/${config.WSO2IS_TENANT_NAME}/api/server/v1/applications/${id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + session.accessToken,
                    "Access-Control-Allow-Origin": config.WSO2IS_CLIENT_URL
                },
                body: JSON.stringify(partial)
            }
        );

        return await res.json();
    } catch (err) {
        return null;
    }
};
