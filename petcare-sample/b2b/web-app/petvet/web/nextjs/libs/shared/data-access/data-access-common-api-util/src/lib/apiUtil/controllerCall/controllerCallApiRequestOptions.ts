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

import { ControllerCallParam } from "@pet-management-webapp/shared/data-access/data-access-common-models-util";
import { Session } from "next-auth";
import RequestMethod from "../api/requestMethod";

function getControllerCallApiBody(session: Session | null, param?: ControllerCallParam) {
    const body = {
        orgId: session ? session.orgId : null,
        param: param ? param : null,
        session: session
    };

    return body;
}

function getControllerCallApiRequestOptions(session: Session | null, param?: ControllerCallParam): RequestInit {
    const request = {
        body: JSON.stringify(getControllerCallApiBody(session, param)),
        method: RequestMethod.POST
    };

    return request;
}

function getControllerCallApiRequestBodyForSwitchCall(subOrgId: string, param: string) {
    const body = {
        param: param,
        subOrgId: subOrgId
    };

    return body;
}

function getControllerCallApiRequestOptionsForSwitchCallWithParam(subOrgId: string, param: string): RequestInit {
    const request = {
        body: JSON.stringify(getControllerCallApiRequestBodyForSwitchCall(subOrgId, param)),
        method: RequestMethod.POST
    };

    return request;
}

export {
    getControllerCallApiRequestOptions, getControllerCallApiRequestOptionsForSwitchCallWithParam
};
