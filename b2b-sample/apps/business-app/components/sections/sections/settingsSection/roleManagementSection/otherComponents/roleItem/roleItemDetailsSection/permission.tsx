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

import { errorTypeDialog, successTypeDialog } from "@b2bsample/shared/ui-components";
import { PatchMethod } from "@b2bsample/shared/util-common";
import React, { useCallback, useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import { Button, ButtonToolbar, CheckTree, Loader, useToaster } from "rsuite";
import FormSuite from "rsuite/Form";
import styles from "../../../../../../../../styles/Settings.module.css";
import decodePatchRole from "../../../../../../../../util/apiDecode/settings/role/decodePatchRole";
import { LOADING_DISPLAY_BLOCK, LOADING_DISPLAY_NONE }
    from "../../../../../../../../util/util/frontendUtil/frontendUtil";
import orgRolesData from "../../../data/orgRolesData.json";

/**
 * 
 * @param prop - `fetchData` - function , `session`, `roleDetails` - Object
 * 
 * @returns The permission section of role details
 */
export default function Permission(prop) {

    const { fetchData, session, roleDetails } = prop;

    const [ loadingDisplay, setLoadingDisplay ] = useState(LOADING_DISPLAY_NONE);
    const [ selectedPermissions, setSelectedPermissions ] = useState([]);

    const toaster = useToaster();

    const setInitialPermissions = useCallback(async () => {
        setSelectedPermissions(roleDetails.permissions);
    }, [ roleDetails ]);

    useEffect(() => {
        setInitialPermissions();
    }, [ setInitialPermissions ]);

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
        decodePatchRole(session, roleDetails.meta.location, PatchMethod.REPLACE, "permissions", values.permissions)
            .then((response) => onDataSubmit(response, form))
            .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));
    };

    return (
        <div className={ styles.addUserMainDiv }>

            <div>
                {
                    selectedPermissions
                        ? (<Form
                            onSubmit={ onUpdate }
                            initialValues={ {
                                permissions: selectedPermissions
                            } }
                            render={ ({ handleSubmit, form, submitting, pristine }) => (
                                <FormSuite
                                    layout="vertical"
                                    className={ styles.addUserForm }
                                    onSubmit={ () => { handleSubmit().then(form.restart); } }
                                    fluid>

                                    <Field
                                        name="permissions"
                                        render={ ({ input }) => (
                                            <FormSuite.Group controlId="checkbox">
                                                <FormSuite.Control
                                                    { ...input }
                                                    name="checkbox"
                                                    accepter={ CheckTree }
                                                    data={ orgRolesData }
                                                    defaultExpandItemValues={ [ "/permission" ] }
                                                    cascade
                                                />
                                                <FormSuite.HelpText>Assign permission for the role</FormSuite.HelpText>
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
                                                    disabled={ submitting || pristine }>
                                                    Update
                                                </Button>
                                            </ButtonToolbar>
                                        </FormSuite.Group>

                                    </div>
                                </FormSuite>
                            ) }
                        />)
                        : null
                }

            </div>

            <div style={ loadingDisplay }>
                <Loader size="lg" backdrop content="role is updating" vertical />
            </div>
        </div>
    );
}
