import React, { useEffect, useState } from 'react';
import { Table } from 'rsuite';

import styles from '../../styles/Settings.module.css';
import decodeViewUsers from '../../util/apiDecode/settings/decodeViewUsers';
import EditUserComponent from '../editUser/editUserComponent';
import SettingsTitle from '../util/settingsTitle';

export default function ViewUserComponent(props) {
    const [users, setUsers] = useState([]);
    const [editUserOpen, setEditUserOpen] = useState(false);

    const [openUser, setOpenUser] = useState({});

    const fetchData = async () => {
        //const res = await usersDetails(props.session);
        const res = await decodeViewUsers(props.session);
        setUsers(res);
    }

    useEffect(() => {
        if (!editUserOpen) {
            fetchData()
        }
    }, [editUserOpen]);

    useEffect(() => {
        fetchData();
    }, [props.session]);

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
