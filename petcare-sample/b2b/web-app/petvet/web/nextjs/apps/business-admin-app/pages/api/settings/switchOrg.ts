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

import { getConfig, getHostedUrl } from "@pet-management-webapp/business-admin-app/util/util-application-config-util";
import { dataNotRecievedError, notPostError } 
    from "@pet-management-webapp/shared/data-access/data-access-common-api-util";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * 
 * @returns get the basic auth for authorize the switch call
 */
const getBasicAuth = (): string => Buffer
    // eslint-disable-next-line
    .from(`${process.env.MANAGEMENT_APP_CLIENT_ID}:${process.env.MANAGEMENT_APP_CLIENT_SECRET}`).toString("base64");

/**
 * 
 * @returns get the header for the switch call
 */
const getSwitchHeader = (): HeadersInit => {

    const headers = {
        "Access-Control-Allow-Credentials": true.toString(),
        "Access-Control-Allow-Origin": getHostedUrl(),
        Authorization: `Basic ${getBasicAuth()}`,
        accept: "application/json",
        "content-type": "application/x-www-form-urlencoded"
    };

    return headers;
};

/**
 * 
 * @param subOrgId - sub organization id
 * @param accessToken - access token return from the IS
 * 
 * @returns get the body for the switch call
 */
const getSwitchBody = (subOrgId: string, accessToken: string): Record<string, string> => {
    const body = {
        "grant_type": "organization_switch",
        "scope": getConfig().BusinessAdminAppConfig.ApplicationConfig.APIScopes.join(" "),
        "switching_organization": subOrgId,
        "token": accessToken
    };

    return body;
};

/**
 * 
 * @param subOrgId - sub organization id
 * @param accessToken - access token return from the IS
 * 
 * @returns get the request body for the switch call
 */
const getSwitchRequest = (subOrgId: string, accessToken: string): RequestInit => {
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
const getSwitchEndpoint = (): string => 
    `${getConfig().CommonConfig.AuthorizationConfig.BaseOrganizationUrl}/oauth2/token`;

/**
 * 
 * @param req - request object
 * @param res - response object
 * 
 * @returns whether the switch call was successful
 */
export default async function switchOrg(req: NextApiRequest, res: NextApiResponse) {

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
