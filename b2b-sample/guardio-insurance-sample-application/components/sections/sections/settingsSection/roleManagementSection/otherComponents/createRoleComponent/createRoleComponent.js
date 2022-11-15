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

import React, { useEffect, useState } from "react";
import { Loader, Modal, Panel, Steps } from "rsuite";
import styles from "../../../../../../../styles/Settings.module.css";
import General from "./createRoleComponentInner/general";
import Permission from "./createRoleComponentInner/permission";
import Users from "./createRoleComponentInner/users";
import { LOADING_DISPLAY_BLOCK, LOADING_DISPLAY_NONE } from "../../../../../../../util/util/frontendUtil/frontendUtil";
import { errorTypeDialog, successTypeDialog } from "../../../../../../common/dialog";

export default function CreateRoleComponent(prop) {

    const { open, setOpenCreateRoleModal, session } = prop;

    const [ loadingDisplay, setLoadingDisplay ] = useState(LOADING_DISPLAY_NONE);
    const [step, setStep] = useState(0);
    const [displayName, setDisplayName] = useState("");
    const [permissions, setPermissions] = useState([]);
    const [users, setUsers] = useState([]);

    /**
     * change the screens to previous and next
     * 
     * @param nextStep - next step
     */
    const onChange = (nextStep) => {
        setStep(nextStep < 0 ? 0 : nextStep > 3 ? 3 : nextStep);
    };
    const onPrevious = () => onChange(step - 1);
    const onNext = () => {
        if(step==2) {

            onSubmit(displayName, permissions, users);
        } else {
            
            onChange(step + 1);
        }
    }

    const onDataSubmit = (response) => {
        if (response) {
            successTypeDialog(toaster, "Changes Saved Successfully", "Role created successfully.");
            onCreateRoleModalClose();
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while creating the role. Try again.");
        }
    };

    const onSubmit = async (displayName, permissions, users) => {
        setLoadingDisplay(LOADING_DISPLAY_BLOCK);

        // await decodeEditUser(session, user.id, values.firstName, values.familyName, values.email,
        //     values.username)
        //     .then((response) => {
        //         if(initUserRolesForForm) {
        //             if (response) {
        //                 decodEditRolesToAddOrRemoveUser(session, user.id, initUserRolesForForm, values.roles)
        //                     .then((res) => {
        //                         onRolesSubmite(res, form);
        //                     });
        //             } else {
        //                 onDataSubmit(response, form);
        //             }
        //         } else {
        //             onDataSubmit(response, form);
        //         }
        //     })
        //     .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));
    };
        

    /**
     *  callback function on create role modal close
     */
    const onCreateRoleModalClose = () => {
        setOpenCreateRoleModal(false);
        setStep(0);
        setDisplayName("");
        setPermissions([]);
        setUsers([]);
    }

    const craeteRoleItemDetailsComponent = (currentStep) => {

        switch (currentStep) {
            case 0:

                return <General
                    displayName={displayName}
                    setDisplayName={setDisplayName}
                    onNext={onNext} />;

            case 1:

                return <Permission
                    permissions={permissions}
                    setPermissions={setPermissions}
                    onNext={onNext}
                    onPrevious={onPrevious} />;

            case 2:

                return <Users
                    assignedUsers={users}
                    setAssignedUsers={setUsers}
                    session={session}
                    onNext={onNext}
                    onPrevious={onPrevious} />;
        }
    };

    return (
        <Modal backdrop="static" role="alertdialog" open={open} onClose={onCreateRoleModalClose} size="md">
            <Modal.Header>
                <Modal.Title>
                    <b>Create Role</b>
                    <p>Create a new role in the system.</p>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Steps current={step} small>
                    <Steps.Item title="Basic Details" />
                    <Steps.Item title="Permission Selection" />
                    <Steps.Item title="Users Selection" />
                </Steps>
                <div className={styles.addUserMainDiv}>
                    <Panel bordered>

                        {craeteRoleItemDetailsComponent(step)}

                    </Panel>
                </div>
            </Modal.Body>

            <div style={loadingDisplay}>
                <Loader size="lg" backdrop content="Role is creating" vertical />
            </div>
        </Modal>
    )
}
