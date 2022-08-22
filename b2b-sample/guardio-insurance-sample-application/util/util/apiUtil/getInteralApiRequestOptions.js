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
import { RequestMethod } from './requestMethod';

function getInternalApibBody(session, subOrgId) {
    const body = {
        session: session,
        subOrgId: subOrgId
    }
    return body;
}

function getInternalApibBodyWithParam(session, subOrgId, param){
    var body = getInternalApibBody(session,subOrgId);
    body.param = param;

    return body;
}

function getInternalApiRequestOptions(session, subOrgId) {
    const request = {
        method: RequestMethod.POST,
        body: JSON.stringify(getInternalApibBody(session, subOrgId))
    }
    return request;
}

function getInternalApiRequestOptionsWithParam(session, subOrgId, param) {
    const request = {
        method: RequestMethod.POST,
        body: JSON.stringify(getInternalApibBodyWithParam(session, subOrgId, param))
    }
    return request;
}

module.exports = { getInternalApiRequestOptions,getInternalApiRequestOptionsWithParam }