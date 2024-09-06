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

import { controllerDecodeAddGroup } 
    from "@pet-management-webapp/business-admin-app/data-access/data-access-controller";
import { AddedGroup, InternalUser, Member, SendGroup } 
    from "@pet-management-webapp/shared/data-access/data-access-common-models-util";
import { FormButtonToolbar, FormField, ModelHeaderComponent } 
    from "@pet-management-webapp/shared/ui/ui-basic-components";
import { errorTypeDialog, successTypeDialog } from "@pet-management-webapp/shared/ui/ui-components";
import { checkIfJSONisEmpty } from "@pet-management-webapp/shared/util/util-common";
import { LOADING_DISPLAY_BLOCK, LOADING_DISPLAY_NONE, fieldValidate } 
    from "@pet-management-webapp/shared/util/util-front-end-util";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { Form } from "react-final-form";
import { Checkbox, Loader, Modal, Table, useToaster } from "rsuite";
import FormSuite from "rsuite/Form";
import styles from "../../../../../../styles/Settings.module.css";


interface AddGroupComponentProps {
    session: Session
    users: InternalUser[] | [],
    open: boolean
    onClose: () => void
}

/**
 * 
 * @param prop - session, open (whether modal open or close), onClose (on modal close)
 * 
 * @returns Modal to add a group.
 */
export default function AddGroupComponent(props: AddGroupComponentProps) {

    const { session, users, open, onClose } = props;

    const [ loadingDisplay, setLoadingDisplay ] = useState(LOADING_DISPLAY_NONE);
    const [ checkedUsers, setCheckedUsers ] = useState<InternalUser[]>([]);

    const { Column, HeaderCell, Cell } = Table;

    const toaster = useToaster();

    const validate = (values: Record<string, unknown>): Record<string, string> => {
        let errors: Record<string, string> = {};

        errors = fieldValidate("groupName", values.groupName, errors);

        return errors;
    };

    const onDataSubmit = (response: boolean | AddedGroup, form): void => {
        if (response) {
            successTypeDialog(toaster, "Changes Saved Successfully", "Group added to the organization successfully.");
            form.restart();
            onClose();
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while adding the group. Try again.");
        }
        setCheckedUsers([]);
    };

    useEffect(() => {
        setCheckedUsers([]);
    }, [  ]);

    const onSubmit = async (values: Record<string, string>, form): Promise<void> => {
        setLoadingDisplay(LOADING_DISPLAY_BLOCK);
        controllerDecodeAddGroup(session, getSendGroupData(checkedUsers,values.groupName) )
            .then((response) => onDataSubmit(response, form))
            .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));
    };

    return (
        <Modal backdrop="static" role="alertdialog" open={ open } onClose={ onClose } size="sm">

            <Modal.Header>
                <ModelHeaderComponent title="Add Group" subTitle="Create new group and add users to the group" />
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
                                    name="groupName"
                                    label="Group Name"
                                    helperText="A name for the group. Can contain between 3 to 30 
                                    alphanumeric characters, dashes (-), and underscores (_)."
                                    needErrorMessage={ true }
                                >
                                    <FormSuite.Control name="input" />
                                </FormField>

                                <FormField
                                    name="addUsers"
                                    label="Add Users"
                                    helperText="Select users to add them to the user group."
                                    needErrorMessage={ true }
                                >
                                    <></>
                                </FormField>
                                <div>
                                    <Table autoHeight autoWidth data={ users }>
                                        <Column width={ 500 } align="left">
                                            <HeaderCell>
                                                <h6>Users</h6>
                                            </HeaderCell>
                                            <Cell dataKey="email">
                                                { (rowData: InternalUser) => (
                                                    <Checkbox
                                                        checked={ checkedUsers.includes(rowData) }
                                                        onChange={ (value: any, checked: boolean, 
                                                            event: React.SyntheticEvent<HTMLInputElement>) => {
                                                            if (checked) {
                                                                setCheckedUsers((prevUsers) => 
                                                                    [ ...prevUsers, rowData ]);
                                                            } else {
                                                                setCheckedUsers((prevUsers) =>
                                                                    prevUsers.filter((user) => user !== rowData)
                                                                );
                                                            }
                                                        } }
                                                    >
                                                        { rowData.email }
                                                    </Checkbox>
                                                ) }
                                            </Cell>
                                        </Column>
                                    </Table>
                                </div>
                                <br />
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
                <Loader size="lg" backdrop content="Group is adding" vertical />
            </div>
        </Modal>

    );
}

function getSendGroupData(users: InternalUser[], groupName: string) {
    const members: Member[] = users.map((user) => ({
        display: "PRIMARY/" + user.email,
        value: user.id
    }));

    const sendData: SendGroup = {
        displayName: "PRIMARY/" + groupName,
        members: members,
        schemas: [ "urn:ietf:params:scim:schemas:core:2.0:Group" ]
    };

    return sendData;
}

