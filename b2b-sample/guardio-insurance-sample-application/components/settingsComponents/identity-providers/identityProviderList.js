import Edit from '@rsuite/icons/Edit';
import Trash from '@rsuite/icons/Trash';
import React from "react";
import { IconButton, List, useToaster } from "rsuite";

import { useSession } from "next-auth/react";
import styles from "../../../styles/idp.module.css";
import { errorTypeDialog, successTypeDialog } from "../../util/dialog";
import { deleteIdentityProvider } from "./api";

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
        deleteIdentityProvider({ id, session })
            .then((response) => onIdpDelete(response))
            .finally(() => {
                fetchAllIdPs().finally();
            })
    };

    return (
        <List className={styles.idp__list}>
            {idpList.map(({ id, name }) => (
                <List.Item key={id} className={styles.idp__list__item}>
                    <div>
                        <p>{name}</p>
                        <small>{id}</small>
                    </div>
                    <div>
                        <IconButton icon={<Trash />}
                            onClick={() => onIdPDeleteClick(id)}
                            appearance="subtle" />
                        <IconButton icon={<Edit />}
                            onClick={() => onIdPEditClick(id)}
                            appearance="primary" />
                    </div>
                </List.Item>
            ))}
        </List>
    );
}
