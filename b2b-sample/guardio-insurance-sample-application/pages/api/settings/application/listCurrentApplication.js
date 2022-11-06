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

import config from "../../../../config.json";
import getDataHeader from "../../../../util/util/apiUtil/getDataHeader";
import { dataNotRecievedError, notPostError } from "../../../../util/util/apiUtil/localResErrors";
import { getOrgUrl } from "../../../../util/util/orgUtil/orgUtil";

/**
 * API call to get the initial details of the current application. Use the application name to filter out the 
 * application (`config.ManagementAPIConfig.SharedApplicationName`).
 * 
 * @param req - request
 * @param res - response
 * 
 * @returns initial details of the current application
 */
export default async function listCurrentApplication(req, res) {
    if (req.method !== "POST") {
        notPostError(res);
    }

    const body = JSON.parse(req.body);
    const session = body.session;
    const orgId = body.orgId;

    const appName = config.ManagementAPIConfig.SharedApplicationName;

    try {
        const fetchData = await fetch(
            `${getOrgUrl(orgId)}/api/server/v1/applications?filter=name+eq+${appName}`,
            getDataHeader(session)
        );
        const data = await fetchData.json();

        res.status(200).json(data);
    } catch (err) {

        return dataNotRecievedError(res);
    }
}
