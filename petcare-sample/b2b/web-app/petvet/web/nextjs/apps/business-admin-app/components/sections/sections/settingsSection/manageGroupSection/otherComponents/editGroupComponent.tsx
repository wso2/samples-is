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

import {
    controllerDecodePatchGroupMembers,
    controllerDecodePatchGroupName,
    controllerDecodeViewUsersInGroup
} from "@pet-management-webapp/business-admin-app/data-access/data-access-controller";
import { Group, InternalGroup, InternalUser, Member, sendMemberList } 
    from "@pet-management-webapp/shared/data-access/data-access-common-models-util";
import { FormButtonToolbar, FormField, ModelHeaderComponent } 
    from "@pet-management-webapp/shared/ui/ui-basic-components";
import { errorTypeDialog, successTypeDialog, warningTypeDialog } from "@pet-management-webapp/shared/ui/ui-components";
import { PatchMethod, checkIfJSONisEmpty } from "@pet-management-webapp/shared/util/util-common";
import { LOADING_DISPLAY_BLOCK, LOADING_DISPLAY_NONE, fieldValidate } 
    from "@pet-management-webapp/shared/util/util-front-end-util";
import { Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";
import { Form } from "react-final-form";
import { Checkbox, CheckboxGroup, Loader, Modal, useToaster } from "rsuite";
import FormSuite from "rsuite/Form";
import stylesSettings from "../../../../../../styles/Settings.module.css";

interface EditGroupComponentProps {
    session: Session
    group: InternalGroup
    open: boolean
    onClose: () => void
    userList: InternalUser[]
}

/**
 * 
 * @param prop - session, user (user details), open (whether the modal open or close), onClose (on modal close)
 * 
 * @returns Modal form to edit the group
 */
export default function EditGroupComponent(prop: EditGroupComponentProps) {

    const { session, group, open, onClose, userList } = prop;

    const toaster = useToaster();

    const [ loadingDisplay, setLoadingDisplay ] = useState(LOADING_DISPLAY_NONE);
    const [ users, setUsers ] = useState<InternalUser[]>([]);
    const [ initialAssignedUsers, setInitialAssignedUsers ] = useState<string[]>([]);

    const fetchData = useCallback(async () => {
        const res = await controllerDecodeViewUsersInGroup(session, group?.displayName);

        await setUsers(res);
        setInitialAssignedUsers(getInitialAssignedUserEmails(res));
    }, [ open === true ]);

    const getInitialAssignedUserEmails = (users: InternalUser[]): string[] => {
        if (users) {
            return users.map(user => user.email);
        }

        return [];
    };

    useEffect(() => {
        fetchData();
    }, [ fetchData ]);

    const validate = (values: Record<string, unknown>): Record<string, string> => {
        let errors: Record<string, string> = {};

        errors = fieldValidate("groupName", values.groupName, errors);

        return errors;
    };

    const onDataSubmit = (response: boolean | Group, form): void => {
        if (response) {
            successTypeDialog(toaster, "Changes Saved Successfully", "Group added to the organization successfully.");
            form.restart();
            onClose();
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while adding the group. Try again.");
        }
    };

    const onRolesSubmit = (response: boolean): void => {
        if (response) {
            successTypeDialog(toaster, "Changes Saved Successfully", "Group details edited successfully.");
            onClose();
        } else {
            warningTypeDialog(toaster, "Groups not Properly Updated",
                "Error occured while updating the groups. Try again.");
        }
    };

    const onSubmit = async (values: Record<string, string>, form): Promise<void> => {
        const name = "PRIMARY/"+ values.groupName;

        setLoadingDisplay(LOADING_DISPLAY_BLOCK);
        controllerDecodePatchGroupName(session, group.id, PatchMethod.REPLACE, "displayName", name)
            .then((response) => onDataSubmit(response, form))
            .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));

        controllerDecodePatchGroupMembers(session, group.id, PatchMethod.REPLACE, getMembers(userList, values.users))
            .then((response) => onDataSubmit(response, form))
            .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));    
            
            
    };

    return (
        <Modal backdrop="static" role="alertdialog" open={ open } onClose={ onClose } size="sm">

            <Modal.Header>
                <ModelHeaderComponent
                    title="Edit Group"
                    subTitle={ "Edit group details" } />
            </Modal.Header>
            <Modal.Body>
                <div className={ stylesSettings.addUserMainDiv }>
                    <Form
                        onSubmit={ onSubmit }
                        validate={ validate }
                        initialValues={ {
                            groupName: group?.displayName,
                            users: initialAssignedUsers
                        } }
                        render={ ({ handleSubmit, form, submitting, pristine, errors }) => (
                            <FormSuite
                                layout="vertical"
                                onSubmit={ () => { handleSubmit().then(form.restart); } }
                                fluid>

                                <FormField
                                    name="groupName"
                                    label="Group Name"
                                    helperText="Name of the group."
                                    needErrorMessage={ true }
                                >
                                    <FormSuite.Control name="input"/>
                                </FormField>

                                <FormField
                                    name="editUsers"
                                    label="Edit Users"
                                    helperText="Update users in the group."
                                    needErrorMessage={ true }
                                >
                                    <></>
                                </FormField>

                                <FormField
                                    name="users"
                                    label=""
                                    needErrorMessage={ false }
                                >
                                    <FormSuite.Control
                                        name="checkbox"
                                        accepter={ CheckboxGroup }
                                    >
                                        { userList.map(user => (
                                            <Checkbox key={ user.email } value={ user.email }>
                                                { user.email }
                                            </Checkbox>
                                        )) }
                                    </FormSuite.Control>
                                </FormField>

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
                <Loader size="lg" backdrop content="Group details are updating" vertical />
            </div>
        </Modal>
    );
}

function getMembers(fullUserList: InternalUser[], checkedUsers: string): sendMemberList {
    const usernames = checkedUsers.toString().split(",").map(username => username.trim());
    const members: Member[] = [];
  
    for (const user of fullUserList) {
        if (usernames.includes(user.email)) {
            members.push({
                display: "PRIMARY/" + user.email,
                value: user.id
            });
        }
    }

    const result: sendMemberList = {
        members: members
    };
    
    return result;
}
