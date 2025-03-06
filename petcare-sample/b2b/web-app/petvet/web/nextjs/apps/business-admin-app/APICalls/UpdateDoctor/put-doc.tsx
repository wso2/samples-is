/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { DoctorInfo } from "../../types/doctor";
import createHeaders from "../createHeaders";
import { getDoctorInstance } from "../getDoctors/doctorInstance";

export async function putDoctor(accessToken: string, doctorId: string, payload?: DoctorInfo) {
    const headers = createHeaders(accessToken);
    const response = await getDoctorInstance().put(`doctors/${encodeURIComponent(doctorId)}`, payload, {
        headers: headers
    });

    return response;
}
