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

import Trash from "@rsuite/icons/Trash";
import React, { useCallback, useEffect, useState } from "react";
import { Button, IconButton, Stack, useToaster } from "rsuite";
import ConfirmAddRemoveLoginFlowModal from "./confirmAddRemoveLoginFlowModal";
import decodeGetApplication from "../../../../../util/apiDecode/settings/application/decodeGetApplication";
import decodeListCurrentApplication from
    "../../../../../util/apiDecode/settings/application/decodeListCurrentApplication";
import decodeDeleteIdentityProvider from
    "../../../../../util/apiDecode/settings/identityProvider/decodeDeleteIdentityProvider";
import { checkIfIdpIsinAuthSequence } from "../../../../../util/util/applicationUtil/applicationUtil";
import { checkIfJSONisEmpty } from "../../../../../util/util/common/common";
import { errorTypeDialog, successTypeDialog } from "../../../../common/dialog";

/**
 * 
 * @param prop - session, idpDetails, fetchAllIdPs, id (idp id)
 * @returns Add/Remove button and delete button group in an Idp
 */
export default function ButtonGroupIdentityProviderDetails(prop) {

    const { session, idpDetails, fetchAllIdPs, id } = prop;

    const toaster = useToaster();

    const [ allApplications, setAllApplications ] = useState({});
    const [ applicationDetail, setApplicationDetail ] = useState({});
    const [ idpIsinAuthSequence, setIdpIsinAuthSequence ] = useState(null);
    const [ openListAppicationModal, setOpenListAppicationModal ] = useState(false);

    const fetchData = useCallback(async () => {
        const res = await decodeListCurrentApplication(session);

        await setAllApplications(res);
    }, [ session, openListAppicationModal ]);

    const fetchApplicatioDetails = useCallback(async () => {
        if (!checkIfJSONisEmpty(allApplications) && allApplications.totalResults !== 0) {
            const res = await decodeGetApplication(session, allApplications.applications[0].id);

            await setApplicationDetail(res);
        }
    }, [ session, allApplications ]);

    useEffect(() => {
        fetchData();
    }, [ fetchData ]);

    useEffect(() => {
        fetchApplicatioDetails();
    }, [ fetchApplicatioDetails ]);

    useEffect(() => {
        if (!checkIfJSONisEmpty(applicationDetail)) {
            let check = checkIfIdpIsinAuthSequence(applicationDetail, idpDetails);

            setIdpIsinAuthSequence(check[0]);
        }
    }, [ idpDetails, applicationDetail ]);

    const onIdpDelete = (response) => {
        if (response) {
            successTypeDialog(toaster, "Success", "Identity Provider Deleted Successfully");
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while deleting the identity provider. Try again.");
        }
    };

    const onIdPDeleteClick = (id) => {
        decodeDeleteIdentityProvider(session, id)
            .then((response) => onIdpDelete(response))
            .finally(() => {
                fetchAllIdPs().finally();
            });
    };

    const onAddToLoginFlowClick = () => {
        setOpenListAppicationModal(true);
    };

    const onCloseListAllApplicaitonModal = () => {
        setOpenListAppicationModal(false);
    };

    return (
        <Stack justifyContent="flex-end" alignItems="stretch">
            {
                idpIsinAuthSequence === null
                    ? null
                    : idpIsinAuthSequence
                        ? <Button onClick={ onAddToLoginFlowClick }>Remove from Login Flow</Button>
                        : <Button onClick={ onAddToLoginFlowClick }>Add to the Login Flow</Button>
            }

            <ConfirmAddRemoveLoginFlowModal
                session={ session }
                id={ id }
                openModal={ openListAppicationModal }
                onModalClose={ onCloseListAllApplicaitonModal }
                fetchAllIdPs={ fetchAllIdPs }
                idpDetails={ idpDetails }
                applicationDetail={ applicationDetail }
                idpIsinAuthSequence={ idpIsinAuthSequence } />

            {
                idpIsinAuthSequence
                    ? null
                    : (<IconButton
                        icon={ <Trash /> }
                        style={ { marginLeft: "10px" } }
                        onClick={ () => onIdPDeleteClick(id) }
                        appearance="subtle" />)
            }

        </Stack>
    );
}
