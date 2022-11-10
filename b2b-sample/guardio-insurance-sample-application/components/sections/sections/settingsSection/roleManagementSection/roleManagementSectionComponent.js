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

import PeoplesIcon from '@rsuite/icons/Peoples';
import CopyIcon from "@rsuite/icons/Copy";
import InfoRoundIcon from "@rsuite/icons/InfoRound";
import React, { useCallback, useEffect, useState } from "react";
import { Avatar, Button, Container, FlexboxGrid, Form, Input, InputGroup, Modal, Panel, Stack, useToaster }
    from "rsuite";
import Enterprise from "../idpSection/data/templates/enterprise-identity-provider.json";
import Google from "../idpSection/data/templates/google.json";
import IdentityProviderList from "../idpSection/otherComponents/identityProviderList";
import styles from "../../../../../styles/idp.module.css";
import decodeCreateIdentityProvider
    from "../../../../../util/apiDecode/settings/identityProvider/decodeCreateIdentityProvider";
import decodeListAllIdentityProviders
    from "../../../../../util/apiDecode/settings/identityProvider/decodeListAllIdentityProviders";
import { EMPTY_STRING, ENTERPRISE_ID, GOOGLE_ID, checkIfJSONisEmpty, copyTheTextToClipboard, sizeOfJson }
    from "../../../../../util/util/common/common";
import { getCallbackUrl } from "../../../../../util/util/idpUtil/idpUtil";
import { errorTypeDialog, successTypeDialog } from "../../../../common/dialog";
import SettingsTitle from "../../../../common/settingsTitle";
import EmptySettings from "../../../../common/emptySettings";
import decodeListAllRoles from '../../../../../util/apiDecode/settings/role/decodeListAllRoles';

/**
 * 
 * @param prop - session
 * 
 * @returns The idp interface section.
 */
export default function RoleManagementSectionComponent(prop) {

    const { session } = prop;

    const toaster = useToaster();

    const [rolesList, setRolesList] = useState([]);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(undefined);

    useEffect(() => {
        fetchAllRoles();
    }, [fetchAllRoles]);

    const fetchAllRoles = useCallback(async () => {

        const res = await decodeListAllRoles(session);
        console.log(res);
        if (res) {
            if (res.identityProviders) {
                setRolesList(res.identityProviders);
            } else {
                setRolesList([]);
            }
        } else {
            setIdpList(null);
        }

    }, [session]);

    const onAddIdentityProviderClick = () => {
        setOpenAddModal(true);
    };


    return (
        <Container>

            <SettingsTitle
                title="Role Management"
                subtitle="Manage organization roles here." />

            <EmptySettings
                bodyString="There are no roles created for the organization."
                buttonString="Create role"
                icon={<PeoplesIcon style={{ opacity: .2 }} width="150px" height="150px" />}
                onAddButtonClick={onAddIdentityProviderClick}
            />

            {/* {
                idpList
                    ? (<FlexboxGrid
                        style={{ height: "60vh", marginTop: "24px", width: "100%" }}
                        justify={idpList.length === 0 ? "center" : "start"}
                        align={idpList.length === 0 ? "middle" : "top"}>
                        {idpList.length === 0
                            ? (<EmptySettings
                                bodyString="There are no roles created for the organization."
                                buttonString="Create role"
                                icon={<PeoplesIcon style={{ opacity: .2 }} width="150px" height="150px" />}
                                onAddButtonClick={onAddIdentityProviderClick}
                            />)
                            : (<IdentityProviderList
                                fetchAllIdPs={fetchAllIdPs}
                                idpList={idpList}
                                session={session}
                            />)
                        }
                    </FlexboxGrid>)
                    : null
            } */}
        </Container>
    );

}
