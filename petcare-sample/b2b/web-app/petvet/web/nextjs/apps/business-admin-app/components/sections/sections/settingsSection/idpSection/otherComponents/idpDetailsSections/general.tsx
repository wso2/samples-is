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

import { IdentityProvider } from "@pet-management-webapp/business-admin-app/data-access/data-access-common-models-util";
import { controllerDecodePatchGeneralSettingsIdp } from
    "@pet-management-webapp/business-admin-app/data-access/data-access-controller";
import { FormButtonToolbar, FormField } from "@pet-management-webapp/shared/ui/ui-basic-components";
import { errorTypeDialog, successTypeDialog } from "@pet-management-webapp/shared/ui/ui-components";
import { checkIfJSONisEmpty } from "@pet-management-webapp/shared/util/util-common";
import { LOADING_DISPLAY_BLOCK, LOADING_DISPLAY_NONE, fieldValidate } 
    from "@pet-management-webapp/shared/util/util-front-end-util";
import { Session } from "next-auth";
import { useState } from "react";
import { Form } from "react-final-form";
import { Loader, Toaster, useToaster } from "rsuite";
import FormSuite from "rsuite/Form";
import styles from "../../../../../../../styles/Settings.module.css";

interface GeneralProps {
    fetchData: () => Promise<void>
    session: Session,
    idpDetails: IdentityProvider
}

/**
 * 
 * @param prop - fetchData (function to fetch data after form is submitted), session, idpDetails
 * 
 * @returns The general section of an idp
 */
export default function General(props: GeneralProps) {

    const { fetchData, session, idpDetails } = props;

    const [ loadingDisplay, setLoadingDisplay ] = useState(LOADING_DISPLAY_NONE);

    const toaster: Toaster = useToaster();

    const validate = (values: Record<string, unknown>): Record<string, string> => {
        let errors: Record<string, string> = {};

        errors = fieldValidate("name", values.name, errors);
        errors = fieldValidate("description", values.description, errors);

        return errors;
    };

    const onDataSubmit = (response: IdentityProvider, form): void => {
        if (response) {
            successTypeDialog(toaster, "Changes Saved Successfully", "Idp updated successfully.");
            fetchData();
            form.restart();
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while updating the Idp. Try again.");
        }
    };

    const onUpdate = async (values: Record<string, string>, form): Promise<void> => {
        setLoadingDisplay(LOADING_DISPLAY_BLOCK);
        controllerDecodePatchGeneralSettingsIdp(session, values.name, values.description, idpDetails.id)
            .then((response) => onDataSubmit(response, form))
            .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));
    };

    return (
        <div className={ styles.addUserMainDiv }>

            <div>

                <Form
                    onSubmit={ onUpdate }
                    validate={ validate }
                    initialValues={ {
                        description: idpDetails.description,
                        name: idpDetails.name
                    } }
                    render={ ({ handleSubmit, form, submitting, pristine, errors }) => (
                        <FormSuite
                            layout="vertical"
                            className={ styles.addUserForm }
                            onSubmit={ () => { handleSubmit().then(form.restart); } }
                            fluid>

                            <FormField
                                name="name"
                                label="Name"
                                helperText="Name of the identity provider."
                                needErrorMessage={ true }
                            >
                                <FormSuite.Control name="input" />
                            </FormField>

                            <FormField
                                name="description"
                                label="Description"
                                helperText="A text description of the identity provider."
                                needErrorMessage={ true }
                            >
                                <FormSuite.Control name="input" />
                            </FormField>

                            <FormButtonToolbar
                                submitButtonText="Update"
                                submitButtonDisabled={ submitting || pristine || !checkIfJSONisEmpty(errors) }
                                needCancel={ false }
                            />

                        </FormSuite>
                    ) }
                />

            </div>

            <div style={ loadingDisplay }>
                <Loader size="lg" backdrop content="User is adding" vertical />
            </div>
        </div>
    );
}
