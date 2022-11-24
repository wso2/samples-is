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

import { controllerDecodePatchGeneralSettingsIdp } from
    "@b2bsample/business-admin-app/data-access/data-access-controller";
import { HelperTextComponent, errorTypeDialog, successTypeDialog } from "@b2bsample/shared/ui/ui-components";
import { checkIfJSONisEmpty } from "@b2bsample/shared/util/util-common";
import { LOADING_DISPLAY_BLOCK, LOADING_DISPLAY_NONE } from "@b2bsample/shared/util/util-front-end-util";
import React, { useState } from "react";
import { Field, Form } from "react-final-form";
import { Button, ButtonToolbar, Loader, useToaster } from "rsuite";
import FormSuite from "rsuite/Form";
import styles from "../../../../../../../styles/Settings.module.css";

/**
 * 
 * @param prop - fetchData (function to fetch data after form is submitted), session, idpDetails
 * 
 * @returns The general section of an idp
 */
export default function General(prop) {

    const { fetchData, session, idpDetails } = prop;

    const [loadingDisplay, setLoadingDisplay] = useState(LOADING_DISPLAY_NONE);

    const toaster = useToaster();

    const nameValidate = (name, errors) => {
        if (!name) {
            errors.name = "This field cannot be empty";
        }

        return errors;
    };

    const descriptionValidate = (description, errors) => {
        if (!description) {
            errors.description = "This field cannot be empty";
        }

        return errors;
    };

    const validate = values => {
        let errors = {};

        errors = nameValidate(values.name, errors);
        errors = descriptionValidate(values.description, errors);

        return errors;
    };

    const onDataSubmit = (response, form) => {
        if (response) {
            successTypeDialog(toaster, "Changes Saved Successfully", "Idp updated successfully.");
            fetchData();
            form.restart();
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while updating the Idp. Try again.");
        }
    };

    const onUpdate = async (values, form) => {
        setLoadingDisplay(LOADING_DISPLAY_BLOCK);
        controllerDecodePatchGeneralSettingsIdp(session, values.name, values.description, idpDetails.id)
            .then((response) => onDataSubmit(response, form))
            .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));
    };

    return (
        <div className={styles.addUserMainDiv}>

            <div>

                <Form
                    onSubmit={onUpdate}
                    validate={validate}
                    initialValues={{
                        description: idpDetails.description,
                        name: idpDetails.name
                    }}
                    render={({ handleSubmit, form, submitting, pristine, errors }) => (
                        <FormSuite
                            layout="vertical"
                            className={styles.addUserForm}
                            onSubmit={() => { handleSubmit().then(form.restart); }}
                            fluid>
                            <Field
                                name="name"
                                render={({ input, meta }) => (
                                    <FormSuite.Group controlId="name">
                                        <FormSuite.ControlLabel>Name</FormSuite.ControlLabel>

                                        <FormSuite.Control
                                            {...input}
                                        />

                                        <HelperTextComponent text="A text description of the identity provider." />

                                        {meta.error && meta.touched && (<FormSuite.ErrorMessage show={true}  >
                                            {meta.error}
                                        </FormSuite.ErrorMessage>)}
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

                                        <HelperTextComponent text="A text description of the identity provider." />

                                        {meta.error && meta.touched && (<FormSuite.ErrorMessage show={true}  >
                                            {meta.error}
                                        </FormSuite.ErrorMessage>)}

                                    </FormSuite.Group>
                                )}
                            />

                            <div className="buttons">
                                <FormSuite.Group>
                                    <ButtonToolbar>
                                        <Button
                                            className={styles.addUserButton}
                                            size="lg"
                                            appearance="primary"
                                            type="submit"
                                            disabled={submitting || pristine || !checkIfJSONisEmpty(errors)}>
                                            Update
                                        </Button>
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
    );
}
