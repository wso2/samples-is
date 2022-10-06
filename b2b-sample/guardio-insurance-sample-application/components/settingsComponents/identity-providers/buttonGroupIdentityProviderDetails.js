/*
 * Copyright (c) 2022 WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *http://www.apache.org/licenses/LICENSE-2.
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import Trash from '@rsuite/icons/Trash';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, IconButton, Stack, useToaster } from 'rsuite';
import decodeGetApplication from '../../../util/apiDecode/settings/application/decodeGetApplication';
import decodeListCurrentApplication from '../../../util/apiDecode/settings/application/decodeListCurrentApplication';
import decodeDeleteIdentityProvider from '../../../util/apiDecode/settings/identityProvider/decodeDeleteIdentityProvider.JS';
import { checkIfIdpIsinAuthSequence } from '../../../util/util/applicationUtil/applicationUtil';
import { checkIfJSONisEmpty } from '../../../util/util/common/common';
import { errorTypeDialog, successTypeDialog } from '../../util/dialog';
import ConfirmAddLoginFlowModal from '../application/confirmAddLoginFlowModal';

export default function fetchAllIdPs(props) {

    const { data: session } = useSession();
    const toaster = useToaster();

    const [allApplications, setAllApplications] = useState({});
    const [applicationDetail, setApplicationDetail] = useState({});
    const [idpIsinAuthSequence, setIdpIsinAuthSequence] = useState(null);
    const [openListAppicationModal, setOpenListAppicationModal] = useState(false);

    const fetchData = useCallback(async () => {
        const res = await decodeListCurrentApplication(props.session);
        await setAllApplications(res);
    }, [props]);

    const fetchApplicatioDetails = useCallback(async () => {
        if (!checkIfJSONisEmpty(allApplications) && allApplications.totalResults !== 0) {
            const res = await decodeGetApplication(props.session, allApplications.applications[0].id);
            await setApplicationDetail(res);
        }
        console.log(allApplications);
        console.log(applicationDetail);
    }, [props, allApplications])

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        fetchApplicatioDetails();
    }, [fetchApplicatioDetails]);

    useEffect(() => {
        if (!checkIfJSONisEmpty(applicationDetail)) {
            setIdpIsinAuthSequence(checkIfIdpIsinAuthSequence(applicationDetail, props.idpDetails));
        }
    }, [props, applicationDetail]);

    const onIdpDelete = (response) => {
        if (response) {
            successTypeDialog(toaster, "Success", "Identity Provider Deleted Successfully");
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while deleting the identity provider. Try again.");
        }
    }

    const onIdpAddToLoginFlow = (response) => {
        if (response) {
            successTypeDialog(toaster, "Success", "Identity Provider Add to the Login Flow Successfully.");
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while adding the the identity provider.");
        }
    }

    const onIdpRemovefromLoginFlow = (response) => {
        if (response) {
            successTypeDialog(toaster, "Success", "IIdentity Provider Remove from the Login Flow Successfully.");
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while removing the identity provider. Try again.");
        }
    }

    const onIdPDeleteClick = (id) => {
        decodeDeleteIdentityProvider(props.session, id)
            .then((response) => onIdpDelete(response))
            .finally(() => {
                props.fetchAllIdPs().finally();
            })
    };

    const onAddToLoginFlowClick = () => {
        setOpenListAppicationModal(true);
    }

    const onCloseListAllApplicaitonModal = () => {
        setOpenListAppicationModal(false);
    }

    return (

        <Stack justifyContent='flex-end' alignItems='stretch'>
            {
                idpIsinAuthSequence === null
                    ? <></>
                    : idpIsinAuthSequence
                        ? <Button onClick={onAddToLoginFlowClick}>Remove from Login Flow</Button>
                        : <Button onClick={onAddToLoginFlowClick}>Add to the Login Flow</Button> 
            }
            
            <ConfirmAddLoginFlowModal session={props.session} id={props.id} openModal={openListAppicationModal}
                onModalClose={onCloseListAllApplicaitonModal} fetchAllIdPs={props.fetchAllIdPs}
                idpDetails={props.idpDetails} applicationDetail={applicationDetail} />

            <IconButton icon={<Trash />}
                style={{ marginLeft: "10px" }}
                onClick={() => onIdPDeleteClick(props.id)}
                appearance="subtle" />
        </Stack>
    );
}
