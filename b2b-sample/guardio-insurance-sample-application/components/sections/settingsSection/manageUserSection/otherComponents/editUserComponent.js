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
import { Button, ButtonToolbar, Loader, Modal, TagPicker, useToaster } from "rsuite";
import FormSuite from "rsuite/Form";
import stylesSettings from "../../../../../styles/Settings.module.css";
import styles from "../../../../../styles/util.module.css";
import decodeEditUser from "../../../../../util/apiDecode/settings/decodeEditUser";
import decodeListAllRoles from "../../../../../util/apiDecode/settings/role/decodeListAllRoles";
import decodeUserRole from "../../../../../util/apiDecode/settings/role/decodeUserRole";
import { checkIfJSONisEmpty } from "../../../../../util/util/common/common";
import { LOADING_DISPLAY_BLOCK, LOADING_DISPLAY_NONE } from "../../../../../util/util/frontendUtil/frontendUtil";
import { errorTypeDialog, successTypeDialog } from "../../../../common/dialog";

/**
 * 
 * @param prop - session, user (user details), open (whether the modal open or close), onClose (on modal close)
 * @returns Modal form to edit the user
 */
export default function EditUserComponent(prop) {

    const { session, user, open, onClose } = prop;

    const toaster = useToaster();

    const [loadingDisplay, setLoadingDisplay] = useState(LOADING_DISPLAY_NONE);
    const [allRoles, setAllRoles] = useState(null);
    const [userRoles, setUserRoles] = useState(null);
    const [userRolesForForm, setUserRolesForForm] = useState(null);
    const [initUserRolesForForm, setInitUserRolesForForm] = useState(null);

    const fetchAllRoles = useCallback(async () => {
        const res = await decodeListAllRoles(session);

        await setAllRoles(res);
    }, [session]);

    const fetchUserRoles = useCallback(async () => {
        const res = await decodeUserRole(session, user.id);

        await setUserRoles(res);
    }, [session, user]);

    useEffect(() => {
        fetchUserRoles();
    }, [fetchUserRoles]);


    useEffect(() => {
        fetchAllRoles();
    }, [fetchAllRoles]);

    useEffect(() => {
        if (allRoles && userRoles) {
            try {
                setUserRolesForForm(allRoles.map(role => ({
                    label: role.displayName,
                    value: role.meta.location
                })));

                setInitUserRolesForForm(userRoles.map(role => (role.meta.location)));
            } catch (err) {

            }
        }
    }, [allRoles, userRoles])

    const firstNameValidate = (firstName, errors) => {
        if (!firstName) {
            errors.firstName = "This field cannot be empty";
        }

        return errors;
    };

    const familyNameValidate = (familyName, errors) => {
        if (!familyName) {
            errors.familyName = "This field cannot be empty";
        }

        return errors;
    };

    const emailValidate = (email, errors) => {
        if (!email) {
            errors.email = "This field cannot be empty";
        }

        return errors;
    };

    const usernameValidate = (username, errors) => {
        if (!username) {
            errors.username = "This field cannot be empty";
        }

        return errors;
    };

    const rolesValidate = (roles, errors) => {
        if (roles) {
            if (roles.length == 0) {
                errors.roles = "This field cannot be empty";
            }
        } else {
            errors.roles = "This field cannot be empty";
        }
        
        return errors;
    };

    const validate = values => {
        let errors = {};

        errors = firstNameValidate(values.firstName, errors);
        errors = familyNameValidate(values.familyName, errors);
        errors = emailValidate(values.email, errors);
        errors = usernameValidate(values.username, errors);
        errors = rolesValidate(values.roles, errors);

        return errors;
    };

    const onDataSubmit = (response) => {
        if (response) {
            successTypeDialog(toaster, "Changes Saved Successfully", "User details edited successfully.");
            onClose();
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while editing the user. Try again.");
        }
    };

    const onSubmit = async (values, form) => {
        setLoadingDisplay(LOADING_DISPLAY_BLOCK);
        decodeEditUser(session, user.id, values.firstName, values.familyName, values.email,
            values.username)
            .then((response) => onDataSubmit(response, form))
            .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));
    };

    return (
        <Modal backdrop="static" role="alertdialog" open={open} onClose={onClose} size="xs">

            <Modal.Header>
                <Modal.Title>
                    <b>Edit User</b>
                    <p>Edit user {user.username}</p>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className={stylesSettings.addUserMainDiv}>
                    <Form
                        onSubmit={onSubmit}
                        validate={validate}
                        initialValues={{
                            email: user.email,
                            familyName: user.familyName,
                            firstName: user.firstName,
                            username: user.username,
                            roles:  initUserRolesForForm ? initUserRolesForForm : []  
                        }}
                        render={({ handleSubmit, form, submitting, pristine, errors }) => (
                            <FormSuite
                                layout="vertical"
                                className={styles.addUserForm}
                                onSubmit={event => { handleSubmit(event).then(form.restart); }}
                                fluid>
                                <Field
                                    name="firstName"
                                    render={({ input, meta }) => (
                                        <FormSuite.Group controlId="name-6">
                                            <FormSuite.ControlLabel>First Name</FormSuite.ControlLabel>
                                            <FormSuite.Control
                                                {...input}
                                            />
                                            {meta.error && meta.touched && (<FormSuite.ErrorMessage show={true}  >
                                                {meta.error}
                                            </FormSuite.ErrorMessage>)}
                                        </FormSuite.Group>
                                    )}
                                />

                                <Field
                                    name="familyName"
                                    render={({ input, meta }) => (
                                        <FormSuite.Group controlId="name-6">
                                            <FormSuite.ControlLabel>Last Name</FormSuite.ControlLabel>
                                            <FormSuite.Control
                                                {...input}
                                            />
                                            {meta.error && meta.touched && (<FormSuite.ErrorMessage show={true}  >
                                                {meta.error}
                                            </FormSuite.ErrorMessage>)}
                                        </FormSuite.Group>
                                    )}
                                />

                                <Field
                                    name="email"
                                    render={({ input, meta }) => (
                                        <FormSuite.Group controlId="name-6">
                                            <FormSuite.ControlLabel>Email</FormSuite.ControlLabel>
                                            <FormSuite.Control
                                                {...input}
                                                type="email"
                                            />
                                            {meta.error && meta.touched && (<FormSuite.ErrorMessage show={true}  >
                                                {meta.error}
                                            </FormSuite.ErrorMessage>)}
                                        </FormSuite.Group>
                                    )}
                                />

                                <Field
                                    name="username"
                                    render={({ input, meta }) => (
                                        <FormSuite.Group controlId="name-6">
                                            <FormSuite.ControlLabel>Username</FormSuite.ControlLabel>
                                            <FormSuite.Control
                                                {...input}
                                            />
                                            {meta.error && meta.touched && (<FormSuite.ErrorMessage show={true} >
                                                {meta.error}
                                            </FormSuite.ErrorMessage>)}
                                        </FormSuite.Group>
                                    )}
                                />

                                {
                                    userRolesForForm
                                        ? <Field
                                            name="roles"
                                            render={({ input, meta }) => (
                                                <FormSuite.Group controlId="name-6">
                                                    <FormSuite.ControlLabel>Role Management</FormSuite.ControlLabel>
                                                    <FormSuite.Control
                                                        {...input}
                                                        accepter={TagPicker}
                                                        data={userRolesForForm ? userRolesForForm : []}
                                                        cleanable={false}
                                                        block
                                                    />
                                                    {meta.error && meta.touched && (<FormSuite.ErrorMessage show={true} >
                                                        {meta.error}
                                                    </FormSuite.ErrorMessage>)}
                                                </FormSuite.Group>
                                            )}
                                        />
                                        : null
                                }



                                <div className="buttons">
                                    <FormSuite.Group>
                                        <ButtonToolbar>
                                            <Button
                                                className={styles.addUserButton}
                                                size="lg"
                                                appearance="primary"
                                                type="submit"
                                                disabled={submitting || pristine || !checkIfJSONisEmpty(errors)}>
                                                Submit
                                            </Button>

                                            <Button
                                                className={styles.addUserButton}
                                                size="lg"
                                                appearance="ghost"
                                                type="button"
                                                onClick={onClose}>Cancel</Button>
                                        </ButtonToolbar>
                                    </FormSuite.Group>
                                </div>
                            </FormSuite>
                        )}
                    />
                </div>
            </Modal.Body>

            <div style={loadingDisplay}>
                <Loader size="lg" backdrop content="User is adding" vertical />
            </div>
        </Modal>
    );
}
