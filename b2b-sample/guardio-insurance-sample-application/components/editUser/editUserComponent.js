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

import React, { useState } from 'react';
import { Field, Form } from 'react-final-form';
import { Button, ButtonToolbar, Loader, Modal, useToaster } from 'rsuite';
import FormSuite from 'rsuite/Form';
import { LOADING_DISPLAY_BLOCK, LOADING_DISPLAY_NONE } from '../../util/util/frontendUtil/frontendUtil';
import { errorTypeDialog, successTypeDialog } from '../util/dialog';

import stylesSettings from '../../styles/Settings.module.css';
import styles from '../../styles/util.module.css';
import decodeEditUser from '../../util/apiDecode/settings/decodeEditUser';

export default function EditUserComponent(props) {

    const toaster = useToaster();

    const [loadingDisplay, setLoadingDisplay] = useState(LOADING_DISPLAY_NONE);

    const nameValidate = (name, errors) => {
        if (!name) {
            errors.name = 'This field cannot be empty'
        }
        return errors;
    }

    const emailValidate = (email, errors) => {
        if (!email) {
            errors.email = 'This field cannot be empty'
        }
        return errors;
    }

    const usernameValidate = (username, errors) => {
        if (!username) {
            errors.username = 'This field cannot be empty'
        }
        return errors;
    }

    const validate = values => {
        const errors = {}
        errors = nameValidate(values.name, errors);
        errors = emailValidate(values.email, errors);
        errors = usernameValidate(values.username, errors)

        return errors
    }

    const onDataSubmit = (response, form) => {
        if (response) {
            successTypeDialog(toaster, "Changes Saved Successfully", "User details edited successfully.");
            props.onClose();
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while editing the user. Try again.");
        }
    }

    const onSubmit = async (values, form) => {
        setLoadingDisplay(LOADING_DISPLAY_BLOCK);
        decodeEditUser(props.session, props.user.id, values.name, values.email,
            values.username)
            .then((response) => onDataSubmit(response, form))
            .finally((response) => setLoadingDisplay(LOADING_DISPLAY_NONE))
    }

    return (
        <Modal backdrop="static" role="alertdialog" open={props.open} onClose={props.onClose} size="xs">

            <Modal.Header>
                <Modal.Title>
                    <b>Edit User</b>
                    <p>Edit user {props.user.username}</p>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className={stylesSettings.addUserMainDiv}>
                    <Form
                        onSubmit={onSubmit}
                        validate={validate}
                        initialValues={{
                            name: props.user.name, email: props.user.email,
                            username: props.user.username
                        }}
                        render={({ handleSubmit, form, submitting, pristine, values }) => (
                            <FormSuite ayout="vertical" className={styles.addUserForm}
                                onSubmit={event => { handleSubmit(event).then(form.restart); }} fluid>
                                <Field
                                    name="name"
                                    render={({ input, meta }) => (
                                        <FormSuite.Group controlId="name-6">
                                            <FormSuite.ControlLabel>Name</FormSuite.ControlLabel>
                                            <FormSuite.Control
                                                {...input}
                                            />
                                            {meta.error && meta.touched && <FormSuite.ErrorMessage show={true}  >
                                                {meta.error}
                                            </FormSuite.ErrorMessage>}
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
                                                type='email'
                                            />
                                            {meta.error && meta.touched && <FormSuite.ErrorMessage show={true}  >
                                                {meta.error}
                                            </FormSuite.ErrorMessage>}
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
                                            {meta.error && meta.touched && <FormSuite.ErrorMessage show={true} >
                                                {meta.error}
                                            </FormSuite.ErrorMessage>}
                                        </FormSuite.Group>
                                    )}
                                />
                                <div className="buttons">
                                    <FormSuite.Group>
                                        <ButtonToolbar>
                                            <Button className={styles.addUserButton} size="lg" appearance="primary"
                                                type='submit' disabled={submitting || pristine}>Submit</Button>

                                            <Button className={styles.addUserButton} size="lg" appearance="ghost"
                                                type='button' onClick={props.onClose}>Cancel</Button>
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
    )
}
