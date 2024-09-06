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

import { Application, ApplicationList, IdentityProvider, checkIfIdpIsinAuthSequence } from
    "@pet-management-webapp/business-admin-app/data-access/data-access-common-models-util";
import {
    controllerDecodeDeleteIdentityProvider, controllerDecodeGetApplication,
    controllerDecodeListCurrentApplication
} from "@pet-management-webapp/business-admin-app/data-access/data-access-controller";
import { errorTypeDialog, successTypeDialog } from "@pet-management-webapp/shared/ui/ui-components";
import { checkIfJSONisEmpty } from "@pet-management-webapp/shared/util/util-common";
import Trash from "@rsuite/icons/Trash";
import { Session } from "next-auth";
import React, { useCallback, useEffect, useState } from "react";
import { Button, IconButton, Stack, useToaster } from "rsuite";
import ConfirmAddRemoveLoginFlowModal from "./confirmAddRemoveLoginFlowModal";

interface ButtonGroupIdentityProviderDetailsProps {
    session : Session
    idpDetails : IdentityProvider,
    fetchAllIdPs : () => Promise<void>,
    id : string
}

/**
 * 
 * @param prop - session, idpDetails, fetchAllIdPs, id (idp id)
 * 
 * @returns Add/Remove button and delete button group in an Idp
 */
export default function ButtonGroupIdentityProviderDetails(props : ButtonGroupIdentityProviderDetailsProps) {

    const { session, idpDetails, fetchAllIdPs, id } = props;

    const toaster = useToaster();

    const [ allApplications, setAllApplications ] = useState<ApplicationList>(null);
    const [ applicationDetail, setApplicationDetail ] = useState<Application>(null);
    const [ idpIsinAuthSequence, setIdpIsinAuthSequence ] = useState<boolean>(null);
    const [ openListAppicationModal, setOpenListAppicationModal ] = useState<boolean>(false);

    const fetchData = useCallback(async () => {
        const res : ApplicationList = ( await controllerDecodeListCurrentApplication(session) as ApplicationList );
        
        await setAllApplications(res);
    }, [ session, openListAppicationModal ]);

    const fetchApplicatioDetails = useCallback(async () => {
        if (!checkIfJSONisEmpty(allApplications) && allApplications.totalResults !== 0) {
            const res : Application = ( 
                await controllerDecodeGetApplication(session, allApplications.applications[0].id) as Application );
                      
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
            const check = checkIfIdpIsinAuthSequence(applicationDetail, idpDetails);

            setIdpIsinAuthSequence(check[0]);
        }
    }, [ idpDetails, applicationDetail ]);

    const onIdpDelete = (response: boolean): void => {
        if (response) {
            successTypeDialog(toaster, "Success", "Identity Provider Deleted Successfully");
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while deleting the identity provider. Try again.");
        }
    };

    const onIdPDeleteClick = (id: string): void => {
        controllerDecodeDeleteIdentityProvider(session, id)
            .then((response) => onIdpDelete(response))
            .finally(() => {
                fetchAllIdPs().finally();
            });
    };

    const onAddToLoginFlowClick = (): void => {
        setOpenListAppicationModal(true);
    };

    const onCloseListAllApplicaitonModal = (): void => {
        setOpenListAppicationModal(false);
    };

    return (
        <Stack justifyContent="flex-end" alignItems="stretch">
            {
                idpIsinAuthSequence === null
                    ? null
                    : idpIsinAuthSequence
                        ? <Button appearance="ghost" onClick={ onAddToLoginFlowClick }>Remove from Login Flow</Button>
                        : <Button appearance="primary" onClick={ onAddToLoginFlowClick }>Add to the Login Flow</Button>
            }

            <ConfirmAddRemoveLoginFlowModal
                session={ session }
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
