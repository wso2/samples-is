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

import { Application } from "@pet-management-webapp/business-admin-app/data-access/data-access-common-models-util";
import { commonControllerDecode } from "@pet-management-webapp/shared/data-access/data-access-common-api-util";
import { Session } from "next-auth";
import { controllerCallGetApplication } from "./controllerCallGetApplication";

/**
 * 
 * @param session - session object
 * @param id - application id
 *
 * @returns get application given the id. If failed `null`
 */
export async function controllerDecodeGetApplication(session: Session, id: string): Promise<Application | null> {

    const res = (
        await commonControllerDecode(() => controllerCallGetApplication(session, id), null) as Application | null);

    return res;

}

export default controllerDecodeGetApplication;
