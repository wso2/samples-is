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

import { requestOptionsWithBody } 
    from "@pet-management-webapp/business-admin-app/data-access/data-access-common-api-util";
import { RequestMethod, dataNotRecievedError, notPostError } from
    "@pet-management-webapp/shared/data-access/data-access-common-api-util";
import { getOrgUrl } from "@pet-management-webapp/shared/util/util-application-config-util";
import { NextApiRequest, NextApiResponse } from "next";

export default async function patchGroupMembers(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        notPostError(res);
    }

    const body = JSON.parse(req.body);
    const session = body.session;
    const orgId = body.orgId;
    const patchBody = body.param;
    const groupId = req.query.groupId;

    try {
        const fetchData = await fetch(
            `${getOrgUrl(orgId)}/scim2/Groups/${groupId}`,
            requestOptionsWithBody(session, RequestMethod.PATCH, patchBody)
        );

        const data = await fetchData.json();

        res.status(200).json(data);
    } catch (err) {

        return dataNotRecievedError(res);
    }
}
