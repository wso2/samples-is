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

import { getHostedUrl } from "@pet-management-webapp/business-admin-app/util/util-application-config-util";
import { RequestMethod, apiRequestOptions, apiRequestOptionsWithBody } from
    "@pet-management-webapp/shared/data-access/data-access-common-api-util";
import { Session } from "next-auth";

/**
 * 
 * @param session - session object
 * 
 * @returns header object that can used for IS API calls
 */
export function requestOptions(session: Session): RequestInit {
    return apiRequestOptions(session, getHostedUrl());
}

export function requestOptionsWithBody(session: Session, method: RequestMethod, body: BodyInit): RequestInit {
    return apiRequestOptionsWithBody(session, method, body, getHostedUrl());
}

export default { requestOptions, requestOptionsWithBody };
