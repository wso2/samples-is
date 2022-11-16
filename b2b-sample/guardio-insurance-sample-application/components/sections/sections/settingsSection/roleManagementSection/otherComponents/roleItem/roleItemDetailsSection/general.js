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

import React, { useState } from "react";
import { Field, Form } from "react-final-form";
import { Button, ButtonToolbar, Loader, useToaster } from "rsuite";
import FormSuite from "rsuite/Form";
import styles from "../../../../../../../../styles/Settings.module.css";
import decodePatchRole from "../../../../../../../../util/apiDecode/settings/role/decodePatchRole";
import { PatchMethod, checkIfJSONisEmpty } from "../../../../../../../../util/util/common/common";
import { LOADING_DISPLAY_BLOCK, LOADING_DISPLAY_NONE }
    from "../../../../../../../../util/util/frontendUtil/frontendUtil";
import { errorTypeDialog, successTypeDialog } from "../../../../../../../common/dialog";
import HelperText from "../../../../../../../common/helperText";

/**
 * 
 * @param prop - `fetchData` - function , `session`, `roleDetails` - Object
 * 
 * @returns The general section of role details
 */
export default function General(prop) {

    const { fetchData, session, roleDetails } = prop;

    const [ loadingDisplay, setLoadingDisplay ] = useState(LOADING_DISPLAY_NONE);

    const toaster = useToaster();

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

    const onDataSubmit = (response, form) => {
        if (response) {
            successTypeDialog(toaster, "Changes Saved Successfully", "Role updated successfully.");
            fetchData();
            form.restart();
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while updating the role. Try again.");
        }
    };

    const onUpdate = async (values, form) => {

        setLoadingDisplay(LOADING_DISPLAY_BLOCK);
        decodePatchRole(session, roleDetails.meta.location, PatchMethod.REPLACE, "displayName", [ values.name ])
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
                        name: roleDetails.displayName
                    } }
                    render={ ({ handleSubmit, form, submitting, pristine, errors }) => (
                        <FormSuite
                            layout="vertical"
                            className={ styles.addUserForm }
                            onSubmit={ event => { handleSubmit(event).then(form.restart); } }
                            fluid>

                            <Field
                                name="name"
                                render={ ({ input, meta }) => (
                                    <FormSuite.Group controlId="name">
                                        <FormSuite.ControlLabel>Name</FormSuite.ControlLabel>

                                        <FormSuite.Control
                                            { ...input }
                                        />

                                        <HelperText text="The name of the role." />

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
                                            size="lg"
                                            appearance="primary"
                                            type="submit"
                                            disabled={ submitting || pristine || !checkIfJSONisEmpty(errors) }>
                                            Update
                                        </Button>
                                    </ButtonToolbar>
                                </FormSuite.Group>

                            </div>
                        </FormSuite>
                    ) }
                />

            </div>

            <div style={ loadingDisplay }>
                <Loader size="lg" backdrop content="role is updating" vertical />
            </div>
        </div>
    );
}
