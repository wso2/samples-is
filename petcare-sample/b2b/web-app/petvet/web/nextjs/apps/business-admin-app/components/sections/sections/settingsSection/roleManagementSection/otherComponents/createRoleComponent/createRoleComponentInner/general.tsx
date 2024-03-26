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

import { HelperTextComponent } from "@pet-management-webapp/shared/ui/ui-components";
import { checkIfJSONisEmpty } from "@pet-management-webapp/shared/util/util-common";
import React from "react";
import { Field, Form } from "react-final-form";
import { Button, ButtonToolbar } from "rsuite";
import FormSuite from "rsuite/Form";
import styles from "../../../../../../../../styles/Settings.module.css";

/**
 * 
 * @param prop - `displayName` , `setDisplayName`, `onNext`
 * 
 * @returns The general section of create role modal
 */
export default function General(prop) {

    const { displayName, setDisplayName, onNext } = prop;

    const nameValidate = (name, errors) => {
        if (!name) {
            errors.name = "This field cannot be empty";
        }

        return errors;
    };

    const validate = values => {
        let errors = {};

        errors = nameValidate(values.name, errors);

        return errors;
    };

    const onUpdate = async (values) => {

        setDisplayName(values.name);
        onNext();
    };

    return (
        <div className={ styles.addUserMainDiv }>

            <div>
                <Form
                    onSubmit={ onUpdate }
                    validate={ validate }
                    initialValues={ {
                        name: displayName
                    } }
                    render={ ({ handleSubmit, form, errors }) => (
                        <FormSuite
                            layout="vertical"
                            className={ styles.addUserForm }
                            onSubmit={ () => { handleSubmit().then(form.restart); } }
                            fluid>

                            <Field
                                name="name"
                                render={ ({ input, meta }) => (
                                    <FormSuite.Group controlId="name">
                                        <FormSuite.ControlLabel>Name</FormSuite.ControlLabel>

                                        <FormSuite.Control
                                            { ...input }
                                        />

                                        <HelperTextComponent text="The name of the role." />

                                        { meta.error && meta.touched && (<FormSuite.ErrorMessage show={ true }  >
                                            { meta.error }
                                        </FormSuite.ErrorMessage>) }
                                    </FormSuite.Group>
                                ) }
                            />

                            <div className="buttons">
                                <FormSuite.Group>
                                    <ButtonToolbar>
                                        <Button
                                            className={ styles.addUserButton }
                                            size="md"
                                            appearance="primary"
                                            type="submit"
                                            disabled={ !checkIfJSONisEmpty(errors) }>
                                            Next
                                        </Button>
                                    </ButtonToolbar>
                                </FormSuite.Group>

                            </div>
                        </FormSuite>
                    ) }
                />
            </div>
        </div>
    );
}
