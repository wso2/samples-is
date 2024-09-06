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
    controllerDecodeDeleteGroup
} from "@pet-management-webapp/business-admin-app/data-access/data-access-controller";
import { InternalGroup } from "@pet-management-webapp/shared/data-access/data-access-common-models-util";
import { FormButtonToolbar, ModelHeaderComponent } from "@pet-management-webapp/shared/ui/ui-basic-components";
import { errorTypeDialog, successTypeDialog } from "@pet-management-webapp/shared/ui/ui-components";
import { LOADING_DISPLAY_NONE } from "@pet-management-webapp/shared/util/util-front-end-util";
import { Session } from "next-auth";
import { useState } from "react";
import { Form } from "react-final-form";
import { Loader, Modal, useToaster } from "rsuite";
import FormSuite from "rsuite/Form";

interface DeleteGroupComponentProps {
    session: Session
    open: boolean
    onClose: () => void
    group: InternalGroup
    getGroups: () => Promise<void>
}

/**
 * 
 * @param prop - session, user (user details), open (whether the modal open or close), onClose (on modal close)
 * 
 * @returns Modal form to delete the group
 */
export default function DeleteGroupComponent(prop: DeleteGroupComponentProps) {

    const { session, open, onClose, group, getGroups } = prop;
    const [ loadingDisplay, setLoadingDisplay ] = useState(LOADING_DISPLAY_NONE);
    const toaster = useToaster();

    const onGroupDelete = (response: boolean): void => {
        if (response) {
            successTypeDialog(toaster, "Success", "Group Deleted Successfully");
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while deleting the Group. Try again.");
        }
    };

    const onSubmit = (): void => {
        controllerDecodeDeleteGroup(session, group?.id)
            .then((response) => onGroupDelete(response))
            .finally(() => {
                getGroups().finally();
            });

        onClose();
    };

    return (
        <Modal backdrop="static" role="alertdialog" open={ open } onClose={ onClose } size="sm">

            <Modal.Header>
                <ModelHeaderComponent
                    title="Are you sure you want to delete the group?"
                />
            </Modal.Header>
            <Modal.Body>
                <Form
                    onSubmit={ onSubmit }
                    render={ ({ handleSubmit, form, submitting, pristine, errors }) => (
                        <FormSuite
                            layout="vertical"
                            onSubmit={ onSubmit }
                            fluid>

                            <FormButtonToolbar
                                submitButtonText="Delete"
                                submitButtonDisabled={ false }
                                onCancel={ onClose }
                            />
                        </FormSuite>
                    ) }
                />
            </Modal.Body>
            <div style={ loadingDisplay }>
                <Loader size="lg" backdrop content="Group is deleteing" vertical />
            </div>
        </Modal>
    );
}
