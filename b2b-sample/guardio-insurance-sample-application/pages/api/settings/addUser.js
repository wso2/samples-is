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

import config from '../../../config.json';
import { RequestMethod } from '../../../util/util/apiUtil/requestMethod';
import { getSentDataRequestOptions } from '../../../util/util/apiUtil/getSentDataRequestOptions'

export default async function addUser(req, res) {
    if (req.method !== 'POST') {
        res.status(404).json('meData');
    }

    const body = JSON.parse(req.body);
    const session = body.session;
    const subOrgId = body.subOrgId;
    const user = body.param;

    try {
        const fetchData = await fetch(
            `${config.WSO2IS_HOST}/o/${subOrgId}/scim2/Users`,
            getSentDataRequestOptions(session, RequestMethod.POST, user)
        );
        const data = await fetchData.json();
        res.status(200).json(data);    
    } catch (err) {
        res.status(404).json('meData');
    }
}
