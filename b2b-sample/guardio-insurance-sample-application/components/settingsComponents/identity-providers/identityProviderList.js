import Edit from '@rsuite/icons/Edit';
import Trash from '@rsuite/icons/Trash';
import React from "react";
import { IconButton, List, PanelGroup, useToaster } from "rsuite";

import { useSession } from "next-auth/react";
import styles from "../../../styles/idp.module.css";
import decodeDeleteIdentityProvider from '../../../util/apiDecode/settings/identityProvider/decodeDeleteIdentityProvider';
import { errorTypeDialog, successTypeDialog } from "../../util/dialog";
import IdentityProviderDetails from './identityProviderDetails';

export default function IdentityProviderList({ idpList, fetchAllIdPs }) {
    const { data: session } = useSession();
    const toaster = useToaster();

    const onIdPEditClick = (ignoredId) => {
        alert("NOT IMPLEMENTED");
    };

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
                fetchAllIdPs().finally();
            })
    };

    return (
        <div className={styles.idp__list}>
            <PanelGroup accordion defaultActiveKey={idpList[0].id} bordered>
                {idpList.map(({ id, name }) => (
                    <IdentityProviderDetails session={session} id={id} />
                ))}
            </PanelGroup>
        </div>

    );
}
