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
import { postPet } from "apps/business-admin-app/APICalls/CreatePet/post-pet";
import { Pet, updatePetInfo } from "apps/business-admin-app/types/pets";
import { AxiosResponse } from "axios";
import { Session } from "next-auth";
import { useState } from "react";
import { Form } from "react-final-form";
import { Loader, Modal, useToaster } from "rsuite";
import FormSuite from "rsuite/Form";
import styles from "../../../../styles/Settings.module.css";


interface AddPetComponentProps {
    session: Session
    open: boolean
    onClose: () => void
}

/**
 * 
 * @param prop - session, open (whether modal open or close), onClose (on modal close)
 * 
 * @returns Modal to add a pet.
 */
export default function AddPetComponent(props: AddPetComponentProps) {

    const { session, open, onClose } = props;
    const [ loadingDisplay, setLoadingDisplay ] = useState(LOADING_DISPLAY_NONE);

    const toaster = useToaster();

    const validate = (values: Record<string, unknown>): Record<string, string> => {
        let errors: Record<string, string> = {};

        errors = fieldValidate("Name", values.Name, errors);
        errors = fieldValidate("Type", values.Type, errors);
        errors = fieldValidate("DateOfBirth", values.DateOfBirth, errors);

        return errors;
    };


    const onDataSubmit = (response: AxiosResponse<Pet>, form): void => {
        if (response) {
            successTypeDialog(toaster, "Changes Saved Successfully", "Pet added to the organization successfully.");
            form.restart();
            onClose();
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while adding the pet. Try again.");
        }
    };

    const onSubmit = async (values: Record<string, string>, form): Promise<void> => {
        setLoadingDisplay(LOADING_DISPLAY_BLOCK);
        const payload: updatePetInfo = {
            breed: values.Type,
            dateOfBirth: values.DateOfBirth,
            name: values.Name,
            vaccinations: []
        };

        postPet(session.accessToken, payload)
            .then((response) => onDataSubmit(response, form))
            .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));
    };

    return (
        <Modal backdrop="static" role="alertdialog" open={ open } onClose={ onClose } size="sm">

            <Modal.Header>
                <ModelHeaderComponent title="Add Pet" subTitle="Add a New Pet to the Organization" />
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
                                    helperText="Name of the pet."
                                    needErrorMessage={ true }
                                >
                                    <FormSuite.Control name="input" />
                                </FormField>

                                <FormField
                                    name="Type"
                                    label="Type"
                                    helperText="Type of the pet."
                                    needErrorMessage={ true }
                                >
                                    <FormSuite.Control name="input" />
                                </FormField>

                                <FormField
                                    name="DateOfBirth"
                                    label="Date Of Birth"
                                    helperText="Date Of Birth of the pet."
                                    needErrorMessage={ true }
                                >
                                    <FormSuite.Control name="input" type="date"/>
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
                <Loader size="lg" backdrop content="Pet is adding" vertical />
            </div>
        </Modal>

    );
}

