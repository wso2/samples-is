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

import { errorTypeDialog, successTypeDialog } from "@b2bsample/shared/ui/ui-components";
import { checkIfJSONisEmpty } from "@b2bsample/shared/util/util-common";
import { LOADING_DISPLAY_BLOCK, LOADING_DISPLAY_NONE } from "@b2bsample/shared/util/util-front-end-util";
import EmailFillIcon from "@rsuite/icons/EmailFill";
import React, { useState } from "react";
import { Field, Form } from "react-final-form";
import { Button, ButtonToolbar, Divider, Loader, Modal, Panel, Radio, RadioGroup, Stack, useToaster } from "rsuite";
import FormSuite from "rsuite/Form";
import styles from "../../../../../../styles/Settings.module.css";
import { InviteConst, decodeAddUser } from "../../../../../../util/apiDecode/settings/decodeAddUser";

/**
 * 
 * @param prop - session, open (whether modal open or close), onClose (on modal close)
 * 
 * @returns Modal to add a user.
 */
export default function AddUserComponent(prop) {

    const { session, open, onClose } = prop;

    const [ loadingDisplay, setLoadingDisplay ] = useState(LOADING_DISPLAY_NONE);
    const [ inviteSelect, serInviteSelect ] = useState(InviteConst.INVITE);
    const [ inviteShow, setInviteShow ] = useState(LOADING_DISPLAY_BLOCK);
    const [ passwordShow, setPasswordShow ] = useState(LOADING_DISPLAY_NONE);

    const toaster = useToaster();

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

    const passwordValidate = (password, errors) => {
        if (inviteSelect == InviteConst.PWD) {
            if (!password) {
                errors.password = "This field cannot be empty";
            }
        }

        return errors;
    };

    const repasswordValidate = (repassword, errors) => {
        if (inviteSelect == InviteConst.PWD) {
            if (!repassword) {
                errors.repassword = "This field cannot be empty";
            }
        }

        return errors;
    };

    const validate = values => {
        let errors = {};

        errors = firstNameValidate(values.firstName, errors);
        errors = familyNameValidate(values.familyName, errors);
        errors = emailValidate(values.email, errors);
        errors = usernameValidate(values.username, errors);
        errors = passwordValidate(values.password, errors);
        errors = repasswordValidate(values.repassword, errors);

        return errors;
    };

    const inviteSelectOnChange = (value) => {
        serInviteSelect(value);

        switch (value) {
            case InviteConst.INVITE:
                setInviteShow(LOADING_DISPLAY_BLOCK);
                setPasswordShow(LOADING_DISPLAY_NONE);

                break;

            case InviteConst.PWD:
                setInviteShow(LOADING_DISPLAY_NONE);
                setPasswordShow(LOADING_DISPLAY_BLOCK);

                break;
        }
    };

    const onDataSubmit = (response, form) => {
        if (response) {
            successTypeDialog(toaster, "Changes Saved Successfully", "User add to the organization successfully.");
            form.restart();
            onClose();
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while adding the user. Try again.");
        }
    };

    const onSubmit = async (values, form) => {
        setLoadingDisplay(LOADING_DISPLAY_BLOCK);
        decodeAddUser(session, inviteSelect, values.firstName, values.familyName, values.email,
            values.username, values.password)
            .then((response) => onDataSubmit(response, form))
            .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));
    };

    return (
        <Modal backdrop="static" role="alertdialog" open={ open } onClose={ onClose } size="sm">

            <Modal.Header>
                <Modal.Title>
                    <b>Add User</b>
                    <p>Add a New User to the Organization</p>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className={ styles.addUserMainDiv }>

                    <Form
                        onSubmit={ onSubmit }
                        validate={ validate }
                        render={ ({ handleSubmit, form, submitting, pristine, errors }) => (
                            <FormSuite
                                layout="vertical"
                                onSubmit={ () => { handleSubmit().then(form.restart); } }
                                fluid>
                                <Field
                                    name="firstName"
                                    render={ ({ input, meta }) => (
                                        <FormSuite.Group controlId="firstName">
                                            <FormSuite.ControlLabel>First Name</FormSuite.ControlLabel>
                                            <FormSuite.Control
                                                { ...input }
                                            />
                                            { meta.error && meta.touched && (<FormSuite.ErrorMessage show={ true } >
                                                { meta.error }
                                            </FormSuite.ErrorMessage>) }
                                        </FormSuite.Group>
                                    ) }
                                />

                                <Field
                                    name="familyName"
                                    render={ ({ input, meta }) => (
                                        <FormSuite.Group controlId="familyName">
                                            <FormSuite.ControlLabel>Last Name</FormSuite.ControlLabel>
                                            <FormSuite.Control
                                                { ...input }
                                            />
                                            { meta.error && meta.touched && (<FormSuite.ErrorMessage show={ true } >
                                                { meta.error }
                                            </FormSuite.ErrorMessage>) }
                                        </FormSuite.Group>
                                    ) }
                                />

                                <Field
                                    name="email"
                                    render={ ({ input, meta }) => (
                                        <FormSuite.Group controlId="email">
                                            <FormSuite.ControlLabel>Email</FormSuite.ControlLabel>
                                            <FormSuite.Control
                                                { ...input }
                                                type="email"
                                            />
                                            { meta.error && meta.touched && (<FormSuite.ErrorMessage show={ true } >
                                                { meta.error }
                                            </FormSuite.ErrorMessage>) }
                                        </FormSuite.Group>
                                    ) }
                                />

                                <Divider />

                                <Field
                                    name="username"
                                    render={ ({ input, meta }) => (
                                        <FormSuite.Group controlId="username">
                                            <FormSuite.ControlLabel>Username</FormSuite.ControlLabel>
                                            <FormSuite.Control
                                                { ...input }
                                            />
                                            { meta.error && meta.touched && (<FormSuite.ErrorMessage show={ true } >
                                                { meta.error }
                                            </FormSuite.ErrorMessage>) }
                                        </FormSuite.Group>
                                    ) }
                                />

                                <RadioGroup
                                    name="radioList"
                                    value={ inviteSelect }
                                    defaultValue={ InviteConst.INVITE }
                                    onChange={ inviteSelectOnChange }>
                                    <p>Select the method to set the user password</p>
                                    <Radio value={ InviteConst.INVITE }>
                                        Invite the user to set their own password
                                    </Radio>

                                    <div style={ inviteShow }>
                                        <br />
                                        <EmailInvitePanel />
                                        <br />

                                    </div>

                                    <Radio value={ InviteConst.PWD }>Set a password for the user</Radio>

                                    <div style={ passwordShow }>
                                        <br />
                                        <Field
                                            name="password"
                                            render={ ({ input, meta }) => (
                                                <FormSuite.Group controlId="password">
                                                    <FormSuite.ControlLabel>Password</FormSuite.ControlLabel>
                                                    <FormSuite.Control
                                                        { ...input }
                                                        type="password"
                                                        autoComplete="off"
                                                    />
                                                    { meta.error && meta.touched &&
                                                        (<FormSuite.ErrorMessage show={ true }>
                                                            { meta.error }
                                                        </FormSuite.ErrorMessage>) }
                                                </FormSuite.Group>
                                            ) }
                                        />

                                        <Field
                                            name="repassword"
                                            render={ ({ input, meta }) => (
                                                <FormSuite.Group controlId="repassword">
                                                    <FormSuite.ControlLabel>Re enter password</FormSuite.ControlLabel>
                                                    <FormSuite.Control
                                                        { ...input }
                                                        type="password"
                                                        autoComplete="off"
                                                    />
                                                    { meta.error && meta.touched &&
                                                        (<FormSuite.ErrorMessage show={ true }>
                                                            { meta.error }
                                                        </FormSuite.ErrorMessage>) }
                                                </FormSuite.Group>
                                            ) }
                                        />

                                    </div>

                                </RadioGroup>
                                <br />
                                <br />

                                <div className="buttons">
                                    <FormSuite.Group>
                                        <ButtonToolbar>
                                            <Button
                                                className={ styles.addUserButton }
                                                size="lg"
                                                appearance="primary"
                                                type="submit"
                                                disabled={ submitting || pristine || !checkIfJSONisEmpty(errors) }>
                                                Submit
                                            </Button>

                                            <Button
                                                className={ styles.addUserButton }
                                                size="lg"
                                                appearance="ghost"
                                                type="button"
                                                onClick={ onClose }>Cancel</Button>
                                        </ButtonToolbar>
                                    </FormSuite.Group>

                                </div>
                            </FormSuite>
                        ) }
                    />

                </div>
            </Modal.Body>

            <div style={ loadingDisplay }>
                <Loader size="lg" backdrop content="User is adding" vertical />
            </div>
        </Modal>

    );
}

function EmailInvitePanel() {
    return (
        <Panel bordered>
            <Stack spacing={ 30 }>
                <EmailFillIcon style={ { fontSize: "3em" } } />
                An email with a confirmation link will be sent to the provided
                email address for the user to set their own password.
            </Stack>

        </Panel>
    );
}
