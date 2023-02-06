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

import { Role } from "@b2bsample/business-admin-app/data-access/data-access-common-models-util";
import { controllerDecodePatchRole } from "@b2bsample/business-admin-app/data-access/data-access-controller";
import { FormButtonToolbar, FormField } from "@b2bsample/shared/ui/ui-basic-components";
import { errorTypeDialog, successTypeDialog } from "@b2bsample/shared/ui/ui-components";
import { PatchMethod } from "@b2bsample/shared/util/util-common";
import { LOADING_DISPLAY_BLOCK, LOADING_DISPLAY_NONE } from "@b2bsample/shared/util/util-front-end-util";
import { Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";
import { Form } from "react-final-form";
import { CheckTree, Loader, Toaster, useToaster } from "rsuite";
import FormSuite from "rsuite/Form";
import styles from "../../../../../../../../styles/Settings.module.css";
import orgRolesData from "../../../data/orgRolesData.json";

interface PermissionProps {
    fetchData: () => Promise<void>,
    session: Session,
    roleDetails: Role
}

/**
 * 
 * @param prop - `fetchData` - function , `session`, `roleDetails` - Object
 * 
 * @returns The permission section of role details
 */
export default function Permission(props: PermissionProps) {

    const { fetchData, session, roleDetails } = props;

    const [ loadingDisplay, setLoadingDisplay ] = useState(LOADING_DISPLAY_NONE);
    const [ selectedPermissions, setSelectedPermissions ] = useState<string[]>([]);

    const toaster: Toaster = useToaster();

    const setInitialPermissions = useCallback(async () => {
        if (roleDetails.permissions) {
            setSelectedPermissions(roleDetails.permissions);
        }
    }, [ roleDetails ]);

    useEffect(() => {
        setInitialPermissions();
    }, [ setInitialPermissions ]);

    const onDataSubmit = (response: Role, form) => {
        if (response) {
            successTypeDialog(toaster, "Changes Saved Successfully", "Role updated successfully.");
            fetchData();
            form.restart();
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while updating the role. Try again.");
        }
    };

    const onUpdate = async (values: Record<string, string[]>, form) => {

        setLoadingDisplay(LOADING_DISPLAY_BLOCK);
        controllerDecodePatchRole(
            session, roleDetails.meta.location, PatchMethod.REPLACE, "permissions", values.permissions)
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

                                    <FormField
                                        name="permissions"
                                        label=""
                                        helperText="Assign permission for the role"
                                        needErrorMessage={ false }
                                    >
                                        <FormSuite.Control
                                            name="checkbox"
                                            accepter={ CheckTree }
                                            data={ orgRolesData }
                                            defaultExpandItemValues={ [ "/permission" ] }
                                            cascade
                                        />
                                    </FormField>

                                    <FormButtonToolbar
                                        submitButtonText="Update"
                                        submitButtonDisabled={ submitting || pristine }
                                        needCancel={ false }
                                    />

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
