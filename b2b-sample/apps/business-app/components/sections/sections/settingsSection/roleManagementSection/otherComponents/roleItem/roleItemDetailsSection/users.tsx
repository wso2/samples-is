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

import React, { useCallback, useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import { Button, ButtonToolbar, Checkbox, CheckboxGroup, Loader, useToaster } from "rsuite";
import FormSuite from "rsuite/Form";
import styles from "../../../../../../../../styles/Settings.module.css";
import decodeViewUsers from "../../../../../../../../util/apiDecode/settings/decodeViewUsers";
import decodePatchRole from "../../../../../../../../util/apiDecode/settings/role/decodePatchRole";
import { PatchMethod } from "../../../../../../../../util/util/common/common";
import { LOADING_DISPLAY_BLOCK, LOADING_DISPLAY_NONE }
    from "../../../../../../../../util/util/frontendUtil/frontendUtil";
import { errorTypeDialog, successTypeDialog } from "../../../../../../../common/dialog";

/**
 * 
 * @param prop - `fetchData` - function , `session`, `roleDetails` - Object
 * 
 * @returns The users section of role details
 */
export default function Users(prop) {

    const { fetchData, session, roleDetails } = prop;

    /**
     * 
     * @param users - users list
     * 
     * @returns get initial assigned user id's.
     */
    const getInitialAssignedUserIds = (users) => {
        if (users) {
            return users.map(user => user.value);
        }

        return [];
    };

    const [ loadingDisplay, setLoadingDisplay ] = useState(LOADING_DISPLAY_NONE);
    const [ users, setUsers ] = useState(null);
    const [ initialAssignedUsers, setInitialAssignedUsers ] = useState([]);

    const toaster = useToaster();

    const fetchAllUsers = useCallback(async () => {
        const res = await decodeViewUsers(session);

        await setUsers(res);
    }, [ session ]);

    const setInitialAssignedUserIds = useCallback(async () => {

        await setInitialAssignedUsers(getInitialAssignedUserIds(roleDetails.users));
    }, [ roleDetails ]);

    useEffect(() => {
        fetchAllUsers();
    }, [ fetchAllUsers ]);

    useEffect(() => {
        setInitialAssignedUserIds();
    }, [ setInitialAssignedUserIds ]);

    const onDataSubmit = (response, form) => {
        if (response) {
            successTypeDialog(toaster, "Changes Saved Successfully", "Role updated successfully.");
            fetchData();
            form.restart();
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while updating the role. Try again.");
        }
    };

    const onUpdate = async (values, form) => {

        setLoadingDisplay(LOADING_DISPLAY_BLOCK);
        decodePatchRole(session, roleDetails.meta.location, PatchMethod.REPLACE, "users", values.users)
            .then((response) => onDataSubmit(response, form))
            .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));
    };

    return (
        <div className={ styles.addUserMainDiv }>

            <div>
                {
                    users
                        ? (<Form
                            onSubmit={ onUpdate }
                            initialValues={ {
                                users: initialAssignedUsers
                            } }
                            render={ ({ handleSubmit, form, submitting, pristine }) => (
                                <FormSuite
                                    layout="vertical"
                                    className={ styles.addUserForm }
                                    onSubmit={ () => { handleSubmit().then(form.restart); } }
                                    fluid>

                                    <Field
                                        name="users"
                                        render={ ({ input }) => (
                                            <FormSuite.Group controlId="checkbox">
                                                <FormSuite.Control
                                                    { ...input }
                                                    name="checkbox"
                                                    accepter={ CheckboxGroup }
                                                >
                                                    { users.map(user => (
                                                        <Checkbox key={ user.id } value={ user.id }>
                                                            { user.username }
                                                        </Checkbox>
                                                    )) }
                                                </FormSuite.Control>
                                                <FormSuite.HelpText>Assign users for the role</FormSuite.HelpText>
                                            </FormSuite.Group>
                                        ) }
                                    />

                                    <div className="buttons">
                                        <FormSuite.Group>
                                            <ButtonToolbar>
                                                <Button
                                                    className={ styles.addUserButton }
                                                    size="lg"
                                                    appearance="primary"
                                                    type="submit"
                                                    disabled={ submitting || pristine }>
                                                    Update
                                                </Button>
                                            </ButtonToolbar>
                                        </FormSuite.Group>

                                    </div>
                                </FormSuite>
                            ) }
                        />)
                        : null
                }

            </div>

            <div style={ loadingDisplay }>
                <Loader size="lg" backdrop content="role is updating" vertical />
            </div>
        </div>
    );
}
