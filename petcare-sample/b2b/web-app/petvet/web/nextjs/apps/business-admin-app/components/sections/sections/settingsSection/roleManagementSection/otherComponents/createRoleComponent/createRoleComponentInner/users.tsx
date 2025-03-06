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
import React, { useCallback, useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import { Button, ButtonToolbar, Checkbox, CheckboxGroup } from "rsuite";
import FormSuite from "rsuite/Form";
import styles from "../../../../../../../../styles/Settings.module.css";

/**
 * 
 * @param prop - `setAssignedUsers` - function , `assignedUsers`, `session`, `onNext`, `onPrevious`
 * 
 * @returns The users section of create role modal
 */
export default function Users(prop) {

    const { assignedUsers, setAssignedUsers, session, onNext, onPrevious } = prop;

    const [ users, setUsers ] = useState<InternalUser[]>(null);

    const fetchAllUsers = useCallback(async () => {
        const res = await controllerDecodeViewUsers(session);

        await setUsers(res);
    }, [ session ]);

    useEffect(() => {
        fetchAllUsers();
    }, [ fetchAllUsers ]);

    const onUpdate = async (values) => {

        setAssignedUsers(values.users);
        onNext();
    };

    return (
        <div className={ styles.addUserMainDiv }>

            <div>
                {
                    users
                        ? (<Form
                            onSubmit={ onUpdate }
                            initialValues={ {
                                users: assignedUsers
                            } }
                            render={ ({ handleSubmit, form }) => (
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
                                                    appearance="ghost"
                                                    type="submit"
                                                    onClick={ onPrevious }>
                                                    Back
                                                </Button>
                                                <Button
                                                    className={ styles.addUserButton }
                                                    size="lg"
                                                    appearance="primary"
                                                    type="submit">
                                                    Create
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
        </div>
    );
}
