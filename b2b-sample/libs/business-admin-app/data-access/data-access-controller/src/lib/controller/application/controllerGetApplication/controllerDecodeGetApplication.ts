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

import { commonControllerDecode } from "@b2bsample/shared/data-access/data-access-common-api-util";
import { controllerCallGetApplication } from "./controllerCallGetApplication";

/**
 * 
 * @param session - session object
 * @param id - application id
 *
 * @returns get application given the id. If failed `null`
 */
export async function controllerDecodeGetApplication(session: any, id: string) {

    const res = await commonControllerDecode(() => controllerCallGetApplication(session, id), null);

    return res;

}

export default controllerDecodeGetApplication;
