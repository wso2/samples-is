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

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "rsuite";
import decodeGetApplication from "../../../../../util/apiDecode/settings/application/decodeGetApplication";
import decodeListCurrentApplication
    from "../../../../../util/apiDecode/settings/application/decodeListCurrentApplication";
import { checkIfJSONisEmpty } from "../../../../../util/util/common/common";
import { checkIfBasicAvailableinAuthSequence } from "../../../../../util/util/applicationUtil/applicationUtil";

export default function AddUserButton(prop) {

    const { session, onClick } = prop;

    const [allApplications, setAllApplications] = useState({});
    const [applicationDetail, setApplicationDetail] = useState({});
    const [basicAuthAvailable, setBasicAuthAvailable] = useState(false);

    const fetchData = useCallback(async () => {

        const res = await decodeListCurrentApplication(session);

        await setAllApplications(res);
    }, [session]);

    const fetchApplicatioDetails = useCallback(async () => {
        if (!checkIfJSONisEmpty(allApplications) && allApplications.totalResults !== 0) {
            const res = await decodeGetApplication(session, allApplications.applications[0].id);
            await setApplicationDetail(res);
        }

    }, [session, allApplications]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        fetchApplicatioDetails();
    }, [fetchApplicatioDetails]);

    useEffect(() => {
        if (!checkIfJSONisEmpty(applicationDetail)) {
            let check = checkIfBasicAvailableinAuthSequence(applicationDetail);

            setBasicAuthAvailable(check);
        }
    }, [applicationDetail])

    return (
        basicAuthAvailable
            ? <Button
                appearance="primary"
                size="lg"
                onClick={onClick}>
                Add User
            </Button>
            : null
    )
}
