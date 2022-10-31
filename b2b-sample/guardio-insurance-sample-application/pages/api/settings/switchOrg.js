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

const getBasicAuth = () => Buffer.from(`${config.WSO2IS_CLIENT_ID}:${config.WSO2IS_CLIENT_SECRET}`).toString("base64");

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

const getSwitchBody = (subOrgId, accessToken) => {
    const body = {
        "grant_type": "organization_switch",
        "scope": config.WSO2IS_SCOPES.join(" "),
        "switching_organization": subOrgId,
        "token": accessToken
    };

    return body;
};

const getSwitchResponse = (subOrgId, accessToken) => {
    const request = {
        body: new URLSearchParams(getSwitchBody(subOrgId, accessToken)).toString(),
        headers: getSwitchHeader(),
        method: "POST"
    };

    return request;
};

const getSwitchEndpoint = () => {
    if (config.WSO2IS_TENANT_NAME === "carbon.super") {
        return `${config.WSO2IS_HOST}/oauth2/token`;
    }

    if(config.APP_IN_ASGARDEO_FIRST_LEVEL) {
        return `${config.WSO2IS_HOST}/t/${config.WSO2IS_TENANT_NAME}/oauth2/token`;
    } else {
        return `${config.WSO2IS_HOST}/o/${config.WSO2IS_TENANT_NAME}/oauth2/token`;
    }

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
            getSwitchResponse(subOrgId, accessToken)
        );

        const data = await fetchData.json();

        res.status(200).json(data);
    } catch (err) {

        return dataNotRecievedError(res);
    }
}
