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

import { FormButtonToolbar, FormField, ModelHeaderComponent } 
    from "@pet-management-webapp/shared/ui/ui-basic-components";
import { errorTypeDialog, successTypeDialog } from "@pet-management-webapp/shared/ui/ui-components";
import { checkIfJSONisEmpty } from "@pet-management-webapp/shared/util/util-common";
import { LOADING_DISPLAY_BLOCK, LOADING_DISPLAY_NONE, fieldValidate } 
    from "@pet-management-webapp/shared/util/util-front-end-util";
import { postDoctor } from "apps/business-admin-app/APICalls/CreateDoctor/post-doc";
import { Doctor, DoctorInfo } from "apps/business-admin-app/types/doctor";
import { AxiosResponse } from "axios";
import { Session } from "next-auth";
import { useState } from "react";
import { Form } from "react-final-form";
import { Divider, Loader, Modal, SelectPicker, useToaster } from "rsuite";
import FormSuite from "rsuite/Form";
import styles from "../../../../styles/Settings.module.css";


interface AddDoctorComponentProps {
    session: Session
    open: boolean
    onClose: () => void
}

/**
 * 
 * @param prop - session, open (whether modal open or close), onClose (on modal close)
 * 
 * @returns Modal to add a doctor.
 */
export default function AddDoctorComponent(props: AddDoctorComponentProps) {

    const { session, open, onClose } = props;
    const [ loadingDisplay, setLoadingDisplay ] = useState(LOADING_DISPLAY_NONE);
    const toaster = useToaster();
    const validate = (values: Record<string, unknown>): Record<string, string> => {
        let errors: Record<string, string> = {};

        errors = fieldValidate("Name", values.Name, errors);
        errors = fieldValidate("RegistrationNumber", values.RegistrationNumber, errors);
        errors = fieldValidate("email", values.email, errors);
        errors = fieldValidate("DateOfBirth", values.DateOfBirth, errors);
        errors = fieldValidate("Gender", values.Gender, errors);
        errors = fieldValidate("Specialty", values.Specialty, errors);
        errors = fieldValidate("Address", values.Address, errors);

        return errors;
    };


    const onDataSubmit = (response: AxiosResponse<Doctor>, form): void => {
        if (response) {
            successTypeDialog(toaster, "Changes Saved Successfully", "Doctor add to the organization successfully.");
            form.restart();
            onClose();
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while adding the doctor. Try again.");
        }
    };

    const onSubmit = async (values: Record<string, string>, form): Promise<void> => {
        setLoadingDisplay(LOADING_DISPLAY_BLOCK);
        const payload: DoctorInfo = {
            address: values.Address,
            availability: [],
            dateOfBirth: values.DateOfBirth,
            emailAddress: values.email,
            gender: values.Gender,
            name: values.Name,
            registrationNumber: values.RegistrationNumber,
            specialty: values.Specialty
        };

        postDoctor(session.accessToken, payload)
            .then((response) => onDataSubmit(response, form))
            .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));
    };

    const options = [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" }
    ];

    return (
        <Modal backdrop="static" role="alertdialog" open={ open } onClose={ onClose } size="sm">

            <Modal.Header>
                <ModelHeaderComponent title="Add Doctor" subTitle="Add a New Doctor to the Organization" />
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
                                    name="Name"
                                    label="Name"
                                    helperText="Name of the doctor."
                                    needErrorMessage={ true }
                                >
                                    <FormSuite.Control name="input" />
                                </FormField>

                                <FormField
                                    name="RegistrationNumber"
                                    label="Registration Number"
                                    helperText="Registration Number of the doctor."
                                    needErrorMessage={ true }
                                >
                                    <FormSuite.Control name="input" />
                                </FormField>

                                <Divider />

                                <FormField
                                    name="email"
                                    label="Email (Username)"
                                    helperText="Email of the doctor."
                                    needErrorMessage={ true }
                                >
                                    <FormSuite.Control name="input" type="email" />
                                </FormField>

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


                                <br/>

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
                <Loader size="lg" backdrop content="Doctor is adding" vertical />
            </div>
        </Modal>

    );
}

