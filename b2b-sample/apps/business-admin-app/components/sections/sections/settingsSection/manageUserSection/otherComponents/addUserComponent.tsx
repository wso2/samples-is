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

import { InviteConst, controllerDecodeAddUser } from "@b2bsample/business-admin-app/data-access/data-access-controller";
import { User } from "@b2bsample/shared/data-access/data-access-common-models-util";
import { FormButtonToolbar, FormField, ModelHeaderComponent } from "@b2bsample/shared/ui/ui-basic-components";
import { errorTypeDialog, successTypeDialog } from "@b2bsample/shared/ui/ui-components";
import { checkIfJSONisEmpty } from "@b2bsample/shared/util/util-common";
import { LOADING_DISPLAY_BLOCK, LOADING_DISPLAY_NONE, fieldValidate } from "@b2bsample/shared/util/util-front-end-util";
import EmailFillIcon from "@rsuite/icons/EmailFill";
import { Session } from "next-auth";
import { useState } from "react";
import { Form } from "react-final-form";
import { Divider, Loader, Modal, Panel, Radio, RadioGroup, Stack, useToaster } from "rsuite";
import FormSuite from "rsuite/Form";
import styles from "../../../../../../styles/Settings.module.css";


interface AddUserComponentProps {
    session: Session
    open: boolean
    onClose: () => void
}

/**
 * 
 * @param prop - session, open (whether modal open or close), onClose (on modal close)
 * 
 * @returns Modal to add a user.
 */
export default function AddUserComponent(props: AddUserComponentProps) {

    const { session, open, onClose } = props;

    const [ loadingDisplay, setLoadingDisplay ] = useState(LOADING_DISPLAY_NONE);
    const [ inviteSelect, serInviteSelect ] = useState<InviteConst>(InviteConst.INVITE);
    const [ inviteShow, setInviteShow ] = useState(LOADING_DISPLAY_BLOCK);
    const [ passwordShow, setPasswordShow ] = useState(LOADING_DISPLAY_NONE);

    const toaster = useToaster();

    const validate = (values: Record<string, unknown>): Record<string, string> => {
        let errors: Record<string, string> = {};

        errors = fieldValidate("firstName", values.firstName, errors);
        errors = fieldValidate("familyName", values.familyName, errors);
        errors = fieldValidate("email", values.email, errors);
        errors = fieldValidate("password", values.password, errors);
        errors = fieldValidate("repassword", values.repassword, errors);

        return errors;
    };

    const inviteSelectOnChange = (value: InviteConst): void => {
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

    const onDataSubmit = (response: boolean | User, form): void => {
        if (response) {
            successTypeDialog(toaster, "Changes Saved Successfully", "User add to the organization successfully.");
            form.restart();
            onClose();
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while adding the user. Try again.");
        }
    };

    const onSubmit = async (values: Record<string, string>, form): Promise<void> => {
        setLoadingDisplay(LOADING_DISPLAY_BLOCK);
        controllerDecodeAddUser(session, inviteSelect, values.firstName, values.familyName, values.email,
            values.password)
            .then((response) => onDataSubmit(response, form))
            .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));
    };

    return (
        <Modal backdrop="static" role="alertdialog" open={ open } onClose={ onClose } size="sm">

            <Modal.Header>
                <ModelHeaderComponent title="Add User" subTitle="Add a New User to the Organization" />
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

                                <FormField
                                    name="firstName"
                                    label="First Name"
                                    helperText="First name of the user."
                                    needErrorMessage={ true }
                                >
                                    <FormSuite.Control name="input" />
                                </FormField>

                                <FormField
                                    name="familyName"
                                    label="Family Name"
                                    helperText="Family name of the user."
                                    needErrorMessage={ true }
                                >
                                    <FormSuite.Control name="input" />
                                </FormField>

                                <Divider />

                                <FormField
                                    name="email"
                                    label="Email (Username)"
                                    helperText="Email of the user."
                                    needErrorMessage={ true }
                                >
                                    <FormSuite.Control name="input" type="email" />
                                </FormField>


                                <RadioGroup
                                    name="radioList"
                                    value={ inviteSelect }
                                    defaultValue={ InviteConst.INVITE }
                                    onChange={ inviteSelectOnChange }>
                                    <b>Select the method to set the user password</b>
                                    <Radio value={ InviteConst.INVITE }>
                                        Invite the user to set their own password
                                    </Radio>

                                    <div style={ inviteShow }>
                                        <EmailInvitePanel />
                                        <br />

                                    </div>

                                    <Radio value={ InviteConst.PWD }>Set a password for the user</Radio>

                                    <div style={ passwordShow }>
                                        <br />

                                        <FormField
                                            name="password"
                                            label="Password"
                                            helperText="Password of the user."
                                            needErrorMessage={ true }
                                        >
                                            <FormSuite.Control name="input" type="password" autoComplete="off" />
                                        </FormField>

                                        <FormField
                                            name="repassword"
                                            label="Re enter password"
                                            helperText="Re enter the password of the user."
                                            needErrorMessage={ true }
                                        >
                                            <FormSuite.Control name="input" type="password" autoComplete="off" />
                                        </FormField>

                                    </div>

                                </RadioGroup>
                                <br />

                                <FormButtonToolbar
                                    submitButtonText="Submit"
                                    submitButtonDisabled={ submitting || pristine || !checkIfJSONisEmpty(errors) }
                                    onCancel={ onClose }
                                />

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
