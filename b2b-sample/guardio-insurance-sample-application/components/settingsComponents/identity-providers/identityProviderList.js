import React from "react";
import { PanelGroup } from "rsuite";

import { useSession } from "next-auth/react";
import styles from "../../../styles/idp.module.css";
import IdentityProviderDetails from './identityProviderDetails';

export default function IdentityProviderList({ idpList, fetchAllIdPs }) {
    const { data: session } = useSession();

    return (
        <div className={styles.idp__list}>
            <PanelGroup accordion defaultActiveKey={idpList[0].id} bordered>
                {idpList.map(({ id, name }) => (
                    <IdentityProviderDetails session={session} id={id} fetchAllIdPs={fetchAllIdPs} />
                ))}
            </PanelGroup>
        </div>

    );
}
