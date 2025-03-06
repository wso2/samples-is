/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import styles from "../../../../../styles/Settings.module.css";

interface GeneralProps {
    session: Session
}

/**
 * 
 * @param prop - fetchData (function to fetch data after form is submitted), session, idpDetails
 * 
 * @returns The general section of an idp
 */
export default function PersonalizationDesignSection(props: GeneralProps) {

    const { session } = props;

    const [ loadingDisplay, setLoadingDisplay ] = useState(LOADING_DISPLAY_NONE);

    const toaster: Toaster = useToaster();

    const validate = (values: Record<string, unknown>): Record<string, string> => {
        let errors: Record<string, string> = {};

        errors = fieldValidate("display_name", values.display_name, errors);
        errors = fieldValidate("contact_email", values.contact_email, errors);

        return errors;
    };

    const onDataSubmit = (response: IdentityProvider, form): void => {
        if (response) {
            successTypeDialog(toaster, "Changes Saved Successfully");
            form.restart();
        } else {
            errorTypeDialog(toaster, "Error occured while updating the Idp. Try again.");
        }
    };

    const onUpdate = async (values: Record<string, string>, form): Promise<void> => {
        setLoadingDisplay(LOADING_DISPLAY_BLOCK);
        setLoadingDisplay(LOADING_DISPLAY_NONE);
    };

    return (
        <div className={ styles.addUserMainDiv }>

            <div>

                <Form
                    onSubmit={ onUpdate }
                    validate={ validate }
                    render={ ({ handleSubmit, form, submitting, pristine, errors }) => (
                        <FormSuite
                            layout="vertical"
                            className={ styles.addUserForm }
                            onSubmit={ () => { handleSubmit().then(form.restart); } }
                            fluid>

                            <FormField
                                name="logo_url"
                                label="Logo URL"
                                helperText={ 
                                    "Use an image that’s at least 600x600 pixels and " + 
                                    "less than 1mb in size for better performance." 
                                }
                                needErrorMessage={ true }
                            >
                                <FormSuite.Control name="input" type="url"/>
                            </FormField>

                            <FormField
                                name="logo_alt_text"
                                label="Logo Alt Text"
                                helperText={ 
                                    "Add a short description of the logo image to display when " + 
                                    "the image does not load and also for SEO and accessibility." 
                                }
                                needErrorMessage={ true }
                            >
                                <FormSuite.Control name="input" />
                            </FormField>

                            <FormField
                                name="favicon_url"
                                label="Favicon URL"
                                helperText={ 
                                    "Use an image with a square aspect ratio that’s " + 
                                    "at least 16x16 pixels in size for better results." 
                                }
                                needErrorMessage={ true }
                            >
                                <FormSuite.Control name="input" type="url" />
                            </FormField>

                            <FormField
                                name="primary_color"
                                label="Primary Colour"
                                helperText={ 
                                    "The main color that is shown in primary action buttons, hyperlinks, etc." 
                                }
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
