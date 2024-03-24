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

import { InviteConst, controllerDecodeAddUser, controllerDecodeListAllRoles, controllerDecodePatchRole } 
    from "@pet-management-webapp/business-admin-app/data-access/data-access-controller";
import { User } from "@pet-management-webapp/shared/data-access/data-access-common-models-util";
import { FormButtonToolbar, FormField, ModelHeaderComponent } 
    from "@pet-management-webapp/shared/ui/ui-basic-components";
import { errorTypeDialog, successTypeDialog } from "@pet-management-webapp/shared/ui/ui-components";
import { PatchMethod, checkIfJSONisEmpty } from "@pet-management-webapp/shared/util/util-common";
import { LOADING_DISPLAY_BLOCK, LOADING_DISPLAY_NONE, fieldValidate } 
    from "@pet-management-webapp/shared/util/util-front-end-util";
import EmailFillIcon from "@rsuite/icons/EmailFill";
import { postDoctor } from "apps/business-admin-app/APICalls/CreateDoctor/post-doc";
import { Doctor, DoctorInfo } from "apps/business-admin-app/types/doctor";
import { AxiosResponse } from "axios";
import { Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";
import { Form } from "react-final-form";
import { Divider, Loader, Modal, Panel, Radio, RadioGroup, SelectPicker, Stack, useToaster } from "rsuite";
import FormSuite from "rsuite/Form";
import styles from "../../../../../../styles/Settings.module.css";
import { Role } from "@pet-management-webapp/business-admin-app/data-access/data-access-common-models-util";


interface AddUserComponentProps {
    session: Session
    open: boolean
    onClose: () => void
    isDoctor: boolean
}

/**
 * 
 * @param prop - session, open (whether modal open or close), onClose (on modal close)
 * 
 * @returns Modal to add a user.
 */
export default function AddUserComponent(props: AddUserComponentProps) {

    const { session, open, onClose, isDoctor } = props;

    const [ loadingDisplay, setLoadingDisplay ] = useState(LOADING_DISPLAY_NONE);
    const [ inviteSelect, serInviteSelect ] = useState<InviteConst>(InviteConst.INVITE);
    const [ userTypeSelect, setUserTypeSelect ] = useState<string>(isDoctor? "DOCTOR" : "PET_OWNER");
    const [ inviteShow, setInviteShow ] = useState(LOADING_DISPLAY_BLOCK);
    const [ passwordShow, setPasswordShow ] = useState(LOADING_DISPLAY_NONE);
    const [ rolesList, setRolesList ] = useState<Role[]>([]);

    const toaster = useToaster();

    const validate = (values: Record<string, unknown>): Record<string, string> => {
        let errors: Record<string, string> = {};

        errors = fieldValidate("firstName", values.firstName, errors);
        errors = fieldValidate("familyName", values.familyName, errors);
        errors = fieldValidate("email", values.email, errors);
        if (inviteSelect === InviteConst.PWD) {
            errors = fieldValidate("password", values.password, errors);
        }

        // if (userTypeSelect === "DOCTOR") {
        //     errors = fieldValidate("DateOfBirth", values.DateOfBirth, errors);
        //     errors = fieldValidate("Gender", values.Gender, errors);
        //     errors = fieldValidate("Specialty", values.Specialty, errors);
        //     errors = fieldValidate("Address", values.Address, errors);
        // }

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

    const userTypeList: {[key: string]: string}[] = [
        {
            label: "Pet Owner",
            value: "PET_OWNER"
        },
        {
            label: "Doctor",
            value: "DOCTOR"
        },
        {
            label: "Admin",
            value: "ADMIN"
        }
    ];

    const fetchAllRoles = useCallback(async () => {

        const res = await controllerDecodeListAllRoles(session);

        if (res) {
            setRolesList(res);
        } else {
            setRolesList([]);
        }

    }, [ session ]);

    useEffect(() => {
        fetchAllRoles();
    }, [ fetchAllRoles ]);

    const userTypeSelectOnChange = (eventKey: any): void => {
        setUserTypeSelect(eventKey);
    };

    const onUserSubmit = (response: boolean | User, form): void => {
        if (response) {
            // successTypeDialog(toaster, "Changes Saved Successfully", "User added to the organization successfully.");
            form.restart();
            onClose();
        } else {
            // errorTypeDialog(toaster, "Error Occured", "Error occured while adding the user. Try again.");
        }
    };

    const onDoctorSubmit = (response: AxiosResponse<Doctor>, form): void => {
        if (response) {
            // successTypeDialog(toaster, "Changes Saved Successfully", "Doctor add to the organization successfully.");
            form.restart();
            onClose();
        } else {
            // errorTypeDialog(toaster, "Error Occured", "Error occured while adding the doctor. Try again.");
        }
    };

    const onRoleSubmit = (response) => {
        if (response) {
            successTypeDialog(toaster, "Changes Saved Successfully", "User added to the organization successfully.");
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while adding the user. Try again.");
        }
    };

    const onSubmit = async (values: Record<string, string>, form): Promise<void> => {
        setLoadingDisplay(LOADING_DISPLAY_BLOCK);
        controllerDecodeAddUser(session, inviteSelect, values.firstName, values.familyName, values.email,
            values.password)
            .then((response1) => {
                onUserSubmit(response1, form);
                let roleDetails: Role;
                
                if (userTypeSelect === "DOCTOR") {
                    const payload: DoctorInfo = {
                        address: values.Address ? values.Address : "",
                        availability: [],
                        dateOfBirth: values.DateOfBirth ? values.DateOfBirth : "",
                        emailAddress: values.email,
                        gender: values.Gender ? values.Gender : "",
                        name: values.firstName + " " + values.familyName,
                        registrationNumber: values.RegistrationNumber,
                        specialty: values.Specialty ? values.Specialty : "N/A"
                    };
                    
                    postDoctor(session.accessToken, payload)
                        .then((response) => onDoctorSubmit(response, form));
        
                    roleDetails = rolesList.find((role) => role.displayName === "pet-care-doctor");

                    controllerDecodePatchRole(session, roleDetails.id, PatchMethod.ADD, "users", response1.id)
                        .then((response) => onRoleSubmit(response))
                        .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));
                }

                if (userTypeSelect === "ADMIN") {
                    roleDetails = rolesList.find((role) => role.displayName === "pet-care-admin");
                    controllerDecodePatchRole(session, roleDetails.id, PatchMethod.ADD, "users", response1.id)
                        .then((response) => onRoleSubmit(response))
                        .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));
                }

                if (userTypeSelect === "PET_OWNER") {
                    roleDetails = rolesList.find((role) => role.displayName === "pet-care-pet-owner");

                    controllerDecodePatchRole(session, roleDetails.id, PatchMethod.ADD, "users", response1.id)
                        .then((response) => onRoleSubmit(response))
                        .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));
                }
            })
            .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));

        

    };

    const options = [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" }
    ];

    return (
        <Modal backdrop="static" role="alertdialog" open={ open } onClose={ onClose } size="sm">

            {
                isDoctor 
                    ? (<Modal.Header>
                        <ModelHeaderComponent title="Add Doctor" subTitle="Add a New Doctor to the Organization" />
                    </Modal.Header>) 
                    : (<Modal.Header>
                        <ModelHeaderComponent title="Add User" subTitle="Add a New User to the Organization" />
                    </Modal.Header>)
            }

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
                                {
                                    !isDoctor && (
                                        <FormField
                                            name="userType"
                                            label="Type of User"
                                            needErrorMessage={ true }
                                        >
                                            <SelectPicker 
                                                data={ userTypeList }
                                                value= { userTypeSelect }
                                                searchable={ false }
                                                defaultValue={ "PET_OWNER" } 
                                                onSelect={ userTypeSelectOnChange }
                                                block
                                            />
                                        </FormField>
                                    )
                                }
                                {
                                    userTypeSelect === "DOCTOR" 
                                        ? (<FormField
                                            name="RegistrationNumber"
                                            label="Registration Number"
                                            helperText="Registration Number of the doctor."
                                            needErrorMessage={ true }
                                        >
                                            <FormSuite.Control name="input" />
                                        </FormField>) 
                                        : null
                                }

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

                                {
                                    userTypeSelect === "DOCTOR" 
                                        ? (
                                            <>
                                                <FormField
                                                    name="DateOfBirth"
                                                    label="Date Of Birth"
                                                    helperText="Date Of Birth of the doctor."
                                                    needErrorMessage={ true }
                                                >
                                                    <FormSuite.Control name="input" type="date"/>
                                                </FormField>

                                                <FormField
                                                    name="Gender"
                                                    label="Gender"
                                                    helperText="Gender of the doctor."
                                                    needErrorMessage={ true }
                                                >
                                                    { /* <FormSuite.Control name="input" type="SelectPicker" /> */ }
                                                    <SelectPicker
                                                        name="mySelectField"
                                                        data={ options }
                                                        searchable={ false }
                                                        style={ { width: "100%" } }
                                                    />
                                                </FormField>

                                                <FormField
                                                    name="Specialty"
                                                    label="Specialty"
                                                    helperText="Specialty of the doctor."
                                                    needErrorMessage={ true }
                                                >
                                                    <FormSuite.Control name="input" />
                                                </FormField>

                                                <FormField
                                                    name="Address"
                                                    label="Address"
                                                    helperText="Address of the doctor."
                                                    needErrorMessage={ true }
                                                >
                                                    <FormSuite.Control name="input" />
                                                </FormField>
                                            </>
                                        )
                                        : null
                                }

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

                                        {/* <FormField
                                            name="repassword"
                                            label="Re enter password"
                                            helperText="Re enter the password of the user."
                                            needErrorMessage={ true }
                                        >
                                            <FormSuite.Control name="input" type="password" autoComplete="off" />
                                        </FormField> */}

                                    </div>

                                </RadioGroup>
                                <br />

                                <FormButtonToolbar
                                    submitButtonText="Submit"
                                    submitButtonDisabled={ submitting || !checkIfJSONisEmpty(errors) }
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
