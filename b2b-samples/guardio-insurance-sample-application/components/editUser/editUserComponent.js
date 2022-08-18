import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Modal, ButtonToolbar, Button, Loader, useToaster } from 'rsuite';
import { Form, Field } from 'react-final-form';
import FormSuite from 'rsuite/Form';
import { editUserEncode } from '../../util/apiDecode';
import { successTypeDialog, errorTypeDialog } from '../util/dialog';

import styles from '../../styles/util.module.css';
import stylesSettings from '../../styles/Settings.module.css';

export default function EditUserComponent(props) {

    const toaster = useToaster();

    const LOADING_DISPLAY_NONE = {
        display: "none"
    };
    const LOADING_DISPLAY_BLOCK = {
        display: "block"
    };

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

    const onDataSubmit = (response,form) => {
        if (response) {
            successTypeDialog(toaster, "Changes Saved Successfully", "User details edited successfully.");
            props.onClose();
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while editing the user. Try again.");
        }
    }

    const onSubmit = async (values ,form)=> {
        setLoadingDisplay(LOADING_DISPLAY_BLOCK);
        editUserEncode(props.session, props.user.id, values.name, values.email,
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
                        initialValues={{ name: props.user.name, email: props.user.email, username: props.user.username }}
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
                                {/* <pre>{JSON.stringify(values, 0, 2)}</pre> */}
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
