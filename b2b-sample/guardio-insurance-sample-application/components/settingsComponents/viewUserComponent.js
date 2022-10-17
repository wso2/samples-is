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

import React, { useCallback, useEffect, useState } from 'react';
import { Button, Stack, Table } from 'rsuite';

import styles from '../../styles/Settings.module.css';
import decodeViewUsers from '../../util/apiDecode/settings/decodeViewUsers';
import EditUserComponent from '../editUser/editUserComponent';
import SettingsTitle from '../util/settingsTitle';
import AddUserComponent from './addUserComponent';

export default function ViewUserComponent(props) {
    const [users, setUsers] = useState([]);
    const [editUserOpen, setEditUserOpen] = useState(false);
    const [addUserOpen, setAddUserOpen] = useState(false);

    const [openUser, setOpenUser] = useState({});

    const fetchData = useCallback(async () => {
        const res = await decodeViewUsers(props.session);
        await setUsers(res);
    }, [props.session])

    useEffect(() => {
        if (!editUserOpen || !addUserOpen) {
            fetchData()
        }
    }, [editUserOpen, addUserOpen, fetchData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const { Column, HeaderCell, Cell } = Table;

    const closeEditDialog = () => {
        setOpenUser({});
        setEditUserOpen(false);
    }

    const onEditClick = (user) => {
        setOpenUser(user);
        setEditUserOpen(true);
    }

    const closeAddUserDialog = () => {
        setAddUserOpen(false);
    }

    const onAddUserClick = (user) => {
        setAddUserOpen(true);
    }

    return (
        <div className={styles.tableMainPanelDiv}>
            <EditUserComponent session={props.session} open={editUserOpen}
                onClose={closeEditDialog} user={openUser} />

            <AddUserComponent orgName={props.orgName} orgId={props.orgId} session={props.session}
                open={addUserOpen} onClose={closeAddUserDialog} />

            <Stack direction="row" justifyContent="space-between">
                <SettingsTitle title="Manage Users" subtitle="Manage users in the organisation" />
                <Button appearance="primary" size="lg" onClick={onAddUserClick}>
                    Add User
                </Button>
            </Stack>

            {
                users ?
                  <Table
                        height={900}
                        data={users}
                    >
                        <Column width={200} align="center">
                            <HeaderCell><h6>First Name</h6></HeaderCell>
                            <Cell dataKey="firstName" />
                        </Column>

                        <Column width={200} align="center">
                            <HeaderCell><h6>Last Name</h6></HeaderCell>
                            <Cell dataKey="familyName" />
                        </Column>

                        <Column width={300} align="center">
                            <HeaderCell><h6>Id</h6></HeaderCell>
                            <Cell dataKey="id" />
                        </Column>

                        <Column width={200} align="center">
                            <HeaderCell><h6>User Name</h6></HeaderCell>
                            <Cell dataKey="username" />
                        </Column>

                        <Column flexGrow={2} align="center">
                            <HeaderCell><h6>Email</h6></HeaderCell>
                            <Cell dataKey="email" />
                        </Column>
                        <Column flexGrow={1} align="center" fixed="right">
                            <HeaderCell><h6>Edit User</h6></HeaderCell>

                            <Cell>
                                {rowData => (
                                    <span>
                                        <a onClick={() => onEditClick(rowData)} style={{ cursor: 'pointer' }}> Edit </a>
                                    </span>
                                )}
                            </Cell>
                        </Column>

                    </Table>
                    : <></>
            }

        </div>

    )
}
