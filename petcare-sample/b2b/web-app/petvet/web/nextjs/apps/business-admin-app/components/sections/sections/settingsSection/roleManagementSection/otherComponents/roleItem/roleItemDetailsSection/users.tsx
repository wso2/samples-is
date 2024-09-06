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

import { Role, RoleUsers } from "@pet-management-webapp/business-admin-app/data-access/data-access-common-models-util";
import { controllerDecodePatchRole, controllerDecodeViewUsers } from
    "@pet-management-webapp/business-admin-app/data-access/data-access-controller";
import { InternalUser } from "@pet-management-webapp/shared/data-access/data-access-common-models-util";
import { FormButtonToolbar, FormField } from "@pet-management-webapp/shared/ui/ui-basic-components";
import { errorTypeDialog, successTypeDialog } from "@pet-management-webapp/shared/ui/ui-components";
import { PatchMethod } from "@pet-management-webapp/shared/util/util-common";
import { LOADING_DISPLAY_BLOCK, LOADING_DISPLAY_NONE } from "@pet-management-webapp/shared/util/util-front-end-util";
import { Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";
import { Form } from "react-final-form";
import { Checkbox, CheckboxGroup, Loader, useToaster } from "rsuite";
import FormSuite from "rsuite/Form";
import styles from "../../../../../../../../styles/Settings.module.css";

interface UsersProps {
    fetchData: () => Promise<void>,
    session: Session,
    roleDetails: Role
}

/**
 * 
 * @param prop - `fetchData` - function , `session`, `roleDetails` - Object
 * 
 * @returns The users section of role details
 */
export default function Users(props: UsersProps) {

    const { fetchData, session, roleDetails } = props;

    /**
     * 
     * @param users - users list
     * 
     * @returns get initial assigned user id's.
     */
    const getInitialAssignedUserIds = (users: RoleUsers[]): string[] => {
        if (users) {
            return users.map(user => user.value);
        }

        return [];
    };

    const [ loadingDisplay, setLoadingDisplay ] = useState(LOADING_DISPLAY_NONE);
    const [ users, setUsers ] = useState<InternalUser[]>(null);
    const [ initialAssignedUsers, setInitialAssignedUsers ] = useState<string[]>([]);

    const toaster = useToaster();

    const fetchAllUsers = useCallback(async () => {
        const res = await controllerDecodeViewUsers(session);

        await setUsers(res);
    }, [ session ]);

    const setInitialAssignedUserIds = useCallback(async () => {

        await setInitialAssignedUsers(getInitialAssignedUserIds(roleDetails.users));
    }, [ roleDetails ]);

    useEffect(() => {
        fetchAllUsers();
    }, [ fetchAllUsers ]);

    useEffect(() => {
        setInitialAssignedUserIds();
    }, [ setInitialAssignedUserIds ]);

    const onDataSubmit = (response: Role, form) => {
        if (response) {
            successTypeDialog(toaster, "Changes Saved Successfully", "Role updated successfully.");
            fetchData();
            form.restart();
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while updating the role. Try again.");
        }
    };

    const onUpdate = async (values: Record<string, string | string[]>, form) => {
        setLoadingDisplay(LOADING_DISPLAY_BLOCK);
        controllerDecodePatchRole(session, roleDetails.id, PatchMethod.REPLACE, "users", values.users)
            .then((response) => onDataSubmit(response, form))
            .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));
    };

    return (
        <div className={ styles.addUserMainDiv }>

            <div>
                {
                    users
                        ? (<Form
                            onSubmit={ onUpdate }
                            initialValues={ {
                                users: initialAssignedUsers
                            } }
                            render={ ({ handleSubmit, form, submitting, pristine }) => (
                                <FormSuite
                                    layout="vertical"
                                    className={ styles.addUserForm }
                                    onSubmit={ () => { handleSubmit().then(form.restart); } }
                                    fluid>

                                    <FormField
                                        name="users"
                                        label=""
                                        helperText="Assign users for the role"
                                        needErrorMessage={ false }
                                    >
                                        <FormSuite.Control
                                            name="checkbox"
                                            accepter={ CheckboxGroup }
                                        >
                                            { users.map(user => (
                                                <Checkbox key={ user.id } value={ user.id }>
                                                    { user.username }
                                                </Checkbox>
                                            )) }
                                        </FormSuite.Control>
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
