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
import { Button, ButtonToolbar, Loader, Stack, useToaster } from 'rsuite';
import InfoRoundIcon from '@rsuite/icons/InfoRound';
import FormSuite from 'rsuite/Form';
import { LOADING_DISPLAY_BLOCK, LOADING_DISPLAY_NONE } from '../../../../util/util/frontendUtil/frontendUtil';
import { errorTypeDialog, successTypeDialog } from '../../../util/dialog';

import styles from '../../../../styles/Settings.module.css';

export default function General(props) {


    const [successDialogOpen, setSuccessDialogOpen] = useState(false);

    const [loadingDisplay, setLoadingDisplay] = useState(LOADING_DISPLAY_NONE);

    const toaster = useToaster();

    const firstNameValidate = (name, errors) => {
        if (!name) {
            errors.name = 'This field cannot be empty'
        }
        return errors;
    }

    const familyNameValidate = (description, errors) => {
        if (!description) {
            errors.description = 'This field cannot be empty'
        }
        return errors;
    }

    const validate = values => {
        const errors = {}
        errors = firstNameValidate(values.name, errors);
        errors = familyNameValidate(values.description, errors);
        return errors
    }

    const onDataSubmit = (response, form) => {
        if (response) {
            successTypeDialog(toaster, "Changes Saved Successfully", "User add to the organization successfully.");
            form.restart();
            props.onClose();
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while adding the user. Try again.");
        }
    }

    const onSubmit = async (values, form) => {
        setLoadingDisplay(LOADING_DISPLAY_BLOCK);
        onDataSubmit(true, form);
        // decodeAddUser(props.session, values.firstName, values.familyName, values.email,
        //     values.username, values.password)
        //     .then((response) => onDataSubmit(response, form))
        //     .finally((response) => setLoadingDisplay(LOADING_DISPLAY_NONE))
    }

    const closeSuccessDialog = () => {
        setSuccessDialogOpen(false);
    }

    return (
        <div className={styles.addUserMainDiv}>

            <div>

                <Form
                    onSubmit={onSubmit}
                    validate={validate}
                    initialValues={{
                        name: props.idpDetails.name,
                        description: props.idpDetails.description
                    }}
                    render={({ handleSubmit, form, submitting, pristine, values }) => (
                        <FormSuite layout="vertical" className={styles.addUserForm}
                            onSubmit={event => { handleSubmit(event).then(form.restart); }} fluid>
                            <Field
                                name="name"
                                render={({ input, meta }) => (
                                    <FormSuite.Group controlId="name">
                                        <FormSuite.ControlLabel>Name</FormSuite.ControlLabel>

                                        <FormSuite.Control
                                            {...input}
                                        />

                                        <HelperText text="A text description of the identity provider." />

                                        {meta.error && meta.touched && <FormSuite.ErrorMessage show={true}  >
                                            {meta.error}
                                        </FormSuite.ErrorMessage>}
                                    </FormSuite.Group>
                                )}
                            />

                            <Field
                                name="description"
                                render={({ input, meta }) => (
                                    <FormSuite.Group controlId="description">
                                        <FormSuite.ControlLabel>Description</FormSuite.ControlLabel>
                                        <FormSuite.Control
                                            {...input}
                                        />

                                        <HelperText text="A text description of the identity provider." />
                                        
                                        {meta.error && meta.touched && <FormSuite.ErrorMessage show={true}  >
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
                                    </ButtonToolbar>
                                </FormSuite.Group>

                            </div>
                        </FormSuite>
                    )}
                />

            </div>

            <div style={loadingDisplay}>
                <Loader size="lg" backdrop content="User is adding" vertical />
            </div>
        </div>

    )
}

function HelperText(props) {
    return (
        <Stack style={{ marginTop: "5px" }}>
            <InfoRoundIcon style={{ marginRight: "10px", marginLeft: "2px" }} />
            <FormSuite.HelpText>{props.text}</FormSuite.HelpText>
        </Stack>
    )
}
