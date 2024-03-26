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

import { NextApiResponse } from "next";

interface Error404Interface {
    error: boolean,
    msg: string
}

function error404(res: NextApiResponse, msg: Error404Interface | string) {

    return res.status(404).json(msg);
}

export function notPostError(res: NextApiResponse) {

    return error404(res, "Cannot request data directyly.");
}

export function dataNotRecievedError(res: NextApiResponse) {

    return error404(res, {
        error: true,
        msg: "Error occured when requesting data."
    });
}

export default { dataNotRecievedError, notPostError };
