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
import React, { useState } from 'react';
import { Button, IconButton, Stack, useToaster } from 'rsuite';
import decodeDeleteIdentityProvider
    from '../../../util/apiDecode/settings/identityProvider/decodeDeleteIdentityProvider.JS';
import { successTypeDialog, errorTypeDialog } from '../../util/dialog'
import SelectApplicationModal from '../application/selectApplicationModal';

export default function ButtonGroupIdentityProviderDetails(props) {

    const { data: session } = useSession();
    const toaster = useToaster();

    const [openListAppicationModal, setOpenListAppicationModal] = useState(false);

    const onIdpDelete = (response) => {
        if (response) {
            successTypeDialog(toaster, "Success", "Identity Provider Deleted Successfully");
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while deleting the identity provider. Try again.");
        }
    }

    const onIdPDeleteClick = (id) => {
        decodeDeleteIdentityProvider(session, id)
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
            <SelectApplicationModal session={props.session} openModal={openListAppicationModal}
                onModalClose={onCloseListAllApplicaitonModal} />
            <Button onClick={onAddToLoginFlowClick}>Add to Login Flow</Button>
            <IconButton icon={<Trash />}
                style={{ marginLeft: "10px" }}
                onClick={() => onIdPDeleteClick(props.id)}
                appearance="subtle" />
        </Stack>
    );
}
