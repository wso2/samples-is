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
import { dataNotRecievedError, notPostError } from "../../../util/util/apiUtil/localResErrors";

/**
 * 
 * @returns get the basic auth for authorize the switch call
 */
const getBasicAuth = () => Buffer
    .from(`${config.AuthorizationConfig.ClientId}:${config.AuthorizationConfig.ClientSecret}`).toString("base64");

/**
 * 
 * @returns get the header for the switch call
 */
const getSwitchHeader = () => {

    const headers = {
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": config.WSO2IS_CLIENT_URL,
        "Authorization": `Basic ${getBasicAuth()}`,
        "accept": "application/json",
        "content-type": "application/x-www-form-urlencoded"
    };

    return headers;
};

/**
 * 
 * @param subOrgId 
 * @param accessToken 
 * 
 * @returns get the body for the switch call
 */
const getSwitchBody = (subOrgId, accessToken) => {
    const body = {
        "grant_type": "organization_switch",
        "scope": config.ApplicationConfig.APIScopes.join(" "),
        "switching_organization": subOrgId,
        "token": accessToken
    };

    return body;
};

/**
 * 
 * @param subOrgId 
 * @param accessToken 
 * 
 * @returns get the request body for the switch call
 */
const getSwitchRequest = (subOrgId, accessToken) => {
    const request = {
        body: new URLSearchParams(getSwitchBody(subOrgId, accessToken)).toString(),
        headers: getSwitchHeader(),
        method: "POST"
    };

    return request;
};

/**
 * 
 * @returns get the endpoint for the switch API call
 */
const getSwitchEndpoint = () => {

    return `${config.AuthorizationConfig.BaseOrganizationUrl}/oauth2/token`;
};

/**
 * 
 * @param req - request object
 * @param res - response object
 * 
 * @returns whether the switch call was successful
 */
export default async function switchOrg(req, res) {

    if (req.method !== "POST") {
        notPostError(res);
    }

    const body = JSON.parse(req.body);
    const subOrgId = body.subOrgId;
    const accessToken = body.param;

    try {

        const fetchData = await fetch(
            getSwitchEndpoint(),
            getSwitchRequest(subOrgId, accessToken)
        );

        const data = await fetchData.json();

        res.status(200).json(data);
    } catch (err) {

        return dataNotRecievedError(res);
    }
}
