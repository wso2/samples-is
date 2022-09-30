import Trash from '@rsuite/icons/Trash';
import { useSession } from 'next-auth/react';
import React from 'react';
import { Button, IconButton, Stack, useToaster } from 'rsuite';
import decodeDeleteIdentityProvider 
from '../../../util/apiDecode/settings/identityProvider/decodeDeleteIdentityProvider.JS';
import {successTypeDialog, errorTypeDialog} from '../../util/dialog'

export default function ButtonGroupIdentityProviderDetails(props) {

    const { data: session } = useSession();
    const toaster = useToaster();

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

    return (

        <Stack justifyContent='flex-end' alignItems='stretch'>
            {/* <Button>Add to Login Flow</Button> */}
            <IconButton icon={<Trash />}
                style={{ marginLeft: "10px" }}
                onClick={() => onIdPDeleteClick(props.id)}
                appearance="subtle" />
        </Stack>
    );
}
