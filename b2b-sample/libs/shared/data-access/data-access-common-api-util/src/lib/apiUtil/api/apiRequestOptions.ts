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

import { getHostedUrl } from "@b2bsample/shared/util/util-application-config-util";

/**
 * 
 * @param session - session object
 * 
 * @returns header object that can used for IS API calls
 */
export function apiRequestOptions(session: any) {
    const headers = {
        "accept": "application/json",
        "access-control-allow-origin": getHostedUrl(),
        "authorization": "Bearer " + session.accessToken
    };

    return { headers };
}

function apiRequestOptionsWithDataHeader(session: any) {
    const headers = {
        ...apiRequestOptions(session).headers,
        "content-type": "application/json"
    };

    return headers;
}

export function apiRequestOptionsWithBody(session: any, method : string, body : any) {
    const request = {
        body: JSON.stringify(body),
        headers: apiRequestOptionsWithDataHeader(session),
        method: method
    };

    return request;
}

export default { apiRequestOptions, apiRequestOptionsWithBody };
