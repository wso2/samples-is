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

import { controllerDecodeViewUsers } 
    from "@pet-management-webapp/business-admin-app/data-access/data-access-controller";
import { InternalUser } from "@pet-management-webapp/shared/data-access/data-access-common-models-util";
import { SettingsTitleComponent } from "@pet-management-webapp/shared/ui/ui-components";
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";
import { Session } from "next-auth";
import React, { useCallback, useEffect, useState } from "react";
import { Table } from "rsuite";
import AddUserButton from "./otherComponents/addUserButton";
import AddUserComponent from "./otherComponents/addUserComponent";
import EditUserComponent from "./otherComponents/editUserComponent";
import styles from "../../../../../styles/Settings.module.css";
import DeleteUserComponent from "./otherComponents/deleteUserComponent";

interface ManageUserSectionComponentProps {
    session: Session
}

/**
 * 
 * @param prop - orgName, orgId, session
 * 
 * @returns A component that will show the users in a table view
 */
export default function ManageUserSectionComponent(props: ManageUserSectionComponentProps) {

    const { session } = props;

    const [ users, setUsers ] = useState<InternalUser[]>([]);
    const [ editUserOpen, setEditUserOpen ] = useState<boolean>(false);
    const [ addUserOpen, setAddUserOpen ] = useState<boolean>(false);
    const [ openUser, setOpenUser ] = useState<InternalUser>(null);
    const [ deleteUserOpen, setDeleteUserOpen ] = useState<boolean>(false);

    const fetchData = useCallback(async () => {
        const res = await controllerDecodeViewUsers(session);

        await setUsers(res);
    }, [ session ]);

    useEffect(() => {
        if (!editUserOpen || !addUserOpen) {
            fetchData();
        }
    }, [ editUserOpen, addUserOpen, fetchData ]);

    useEffect(() => {
        fetchData();
    }, [ fetchData ]);

    const { Column, HeaderCell, Cell } = Table;

    const closeEditDialog = (): void => {
        setOpenUser(null);
        setEditUserOpen(false);
    };

    const onEditClick = (user: InternalUser): void => {
        setOpenUser(user);
        setEditUserOpen(true);
    };

    const closeAddUserDialog = (): void => {
        setAddUserOpen(false);
    };

    const onAddUserClick = (): void => {
        setAddUserOpen(true);
    };

    const onDeleteClick = (user: InternalUser): void => {
        setOpenUser(user);
        setDeleteUserOpen(true);
    };

    const closeDeleteDialog = (): void => {
        setOpenUser(null);
        setDeleteUserOpen(false);
    };

    return (
        <div
            className={ styles.tableMainPanelDiv }
        >
            {
                openUser
                    ? (<EditUserComponent
                        session={ session }
                        open={ editUserOpen }
                        onClose={ closeEditDialog }
                        user={ openUser } />)
                    : null
            }

            {
                deleteUserOpen
                    ? (<DeleteUserComponent
                        session={ session }
                        open={ deleteUserOpen }
                        onClose={ closeDeleteDialog }
                        user={ openUser }
                        getUsers={ fetchData } />)
                    : null
            }

            <AddUserComponent
                session={ session }
                open={ addUserOpen }
                onClose={ closeAddUserDialog } 
                isDoctor={ false } />

            <SettingsTitleComponent
                title="Manage Users"
                subtitle="Manage users in the organization">
                <AddUserButton onClick={ onAddUserClick } />
            </SettingsTitleComponent>

            {
                users ?
                    (<Table
                        height={ 900 }
                        data={ users }
                    >
                        <Column width={ 200 } align="center">
                            <HeaderCell><h6>First Name</h6></HeaderCell>
                            <Cell dataKey="firstName" />
                        </Column>

                        <Column width={ 200 } align="center">
                            <HeaderCell><h6>Last Name</h6></HeaderCell>
                            <Cell dataKey="familyName" />
                        </Column>

                        <Column flexGrow={ 2 } align="center">
                            <HeaderCell><h6>Email (Username)</h6></HeaderCell>
                            <Cell dataKey="username" />
                        </Column>

                        <Column flexGrow={ 1 } align="center" fixed="right">
                            <HeaderCell><h6>Edit User</h6></HeaderCell>

                            <Cell>
                                { rowData => (
                                    <span>
                                        <a
                                            onClick={ () => onEditClick(rowData as InternalUser) }
                                            style={ { cursor: "pointer" } }>
                                            <EditIcon/>
                                        </a>
                                    </span>
                                ) }
                            </Cell>
                        </Column>

                        <Column flexGrow={ 1 } align="center" fixed="right">
                            <HeaderCell><h6>Delete User</h6></HeaderCell>

                            <Cell>
                                { rowData => (
                                    <span>
                                        <a
                                            onClick={ () => onDeleteClick(rowData as InternalUser) }
                                            style={ { cursor: "pointer" } }>
                                            <TrashIcon/>
                                        </a>
                                    </span>
                                ) }
                            </Cell>
                        </Column>

                    </Table>)
                    : null
            }
        </div>
    );
}
