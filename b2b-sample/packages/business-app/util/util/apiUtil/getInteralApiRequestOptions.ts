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

function getInternalApibBody(session) {
    const body = {
        session: session,
        orgId: session ? session.orgId : null
    }

    return body;
}

function getInternalApibBodyWithParam(session, param) {
    var body = getInternalApibBody(session);
    body.param = param;

    return body;
}

function getInternalApiRequestOptions(session) {
    const request = {
        method: RequestMethod.POST,
        body: JSON.stringify(getInternalApibBody(session))
    }

    return request;
}

function getInternalApiRequestOptionsWithParam(session, param) {
    const request = {
        method: RequestMethod.POST,
        body: JSON.stringify(getInternalApibBodyWithParam(session, param))
    }

    return request;
}

function getInternalApibBodyForSwitchCall(subOrgId, param) {
    const body = {
        subOrgId: subOrgId,
        param: param
    }

    return body;
}

function geetInternalApiRequestOptionsForSwitchCallWithParam(subOrgId, param) {
    const request = {
        method: RequestMethod.POST,
        body: JSON.stringify(getInternalApibBodyForSwitchCall(subOrgId, param))
    }

    return request;
}

export{
    getInternalApiRequestOptions, getInternalApiRequestOptionsWithParam,
    geetInternalApiRequestOptionsForSwitchCallWithParam
}
