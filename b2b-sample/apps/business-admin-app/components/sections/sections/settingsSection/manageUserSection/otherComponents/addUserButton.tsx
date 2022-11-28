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

import { AllApplications, Application, checkIfBasicAvailableinAuthSequence } from
    "@b2bsample/business-admin-app/data-access/data-access-common-models-util";
import { controllerDecodeGetApplication, controllerDecodeListCurrentApplication } from
    "@b2bsample/business-admin-app/data-access/data-access-controller";
import { checkIfJSONisEmpty } from "@b2bsample/shared/util/util-common";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "rsuite";


export default function AddUserButton(prop) {

    const { onClick } = prop;

    return (
        <Button
            appearance="primary"
            size="lg"
            onClick={onClick}>
            Add User
        </Button>
    );
}