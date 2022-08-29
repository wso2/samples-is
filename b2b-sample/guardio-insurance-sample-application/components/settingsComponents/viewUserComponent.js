/*
 * Copyright (c) 2022 WSO2 LLC. (http://www.wso2.com).
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
import { Table } from 'rsuite';

import styles from '../../styles/Settings.module.css';
import decodeViewUsers from '../../util/apiDecode/settings/decodeViewUsers';
import EditUserComponent from '../editUser/editUserComponent';
import SettingsTitle from '../util/settingsTitle';

export default function ViewUserComponent(props) {
    const [users, setUsers] = useState([]);
    const [editUserOpen, setEditUserOpen] = useState(false);

    const [openUser, setOpenUser] = useState({});

    const fetchData = useCallback(async () => {
        const res = await decodeViewUsers(props.session);
        setUsers(res);
    },[props.session])

    useEffect(() => {
        if (!editUserOpen) {
            fetchData()
        }
    }, [editUserOpen,fetchData]);

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

    return (
        <div className={styles.tableMainPanelDiv}>
            <EditUserComponent session={props.session} open={editUserOpen}
                onClose={closeEditDialog} user={openUser} />

            <SettingsTitle title="Manage Users" subtitle="Manage users in the organisation" />

            <Table
                height={900}
                width={1150}
                data={users}
            >
                <Column width={200} align="center">
                    <HeaderCell><h6>First Name</h6></HeaderCell>
                    <Cell dataKey="name" />
                </Column>

                <Column width={300} align="center" fixed>
                    <HeaderCell><h6>Id</h6></HeaderCell>
                    <Cell dataKey="id" />
                </Column>

                <Column width={200} align="center">
                    <HeaderCell><h6>User Name</h6></HeaderCell>
                    <Cell dataKey="username" />
                </Column>

                <Column width={300} align="center">
                    <HeaderCell><h6>Email</h6></HeaderCell>
                    <Cell dataKey="email" />
                </Column>
                <Column width={150} align="center" fixed="right">
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
        </div>

    )
}
