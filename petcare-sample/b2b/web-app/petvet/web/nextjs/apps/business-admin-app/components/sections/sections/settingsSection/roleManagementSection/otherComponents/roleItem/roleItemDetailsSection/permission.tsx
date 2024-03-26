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

import { Role } from "@pet-management-webapp/business-admin-app/data-access/data-access-common-models-util";
import { controllerDecodePatchRole } 
    from "@pet-management-webapp/business-admin-app/data-access/data-access-controller";
import { FormButtonToolbar, FormField } from "@pet-management-webapp/shared/ui/ui-basic-components";
import { errorTypeDialog, successTypeDialog } from "@pet-management-webapp/shared/ui/ui-components";
import { PatchMethod } from "@pet-management-webapp/shared/util/util-common";
import { LOADING_DISPLAY_BLOCK, LOADING_DISPLAY_NONE } from "@pet-management-webapp/shared/util/util-front-end-util";
import { Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";
import { Form } from "react-final-form";
import { CheckTree, List, Loader, Panel, Toaster, useToaster } from "rsuite";
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
    const [ selectedPermissions, setSelectedPermissions ] = useState<any[]>([]);

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

    return (
        <div className={ styles.addUserMainDiv }>

            <div>
                {
                    selectedPermissions
                        ? (
                            <List size="sm" bordered={ true }>
                                {
                                    selectedPermissions.map((permission) => { 
                                        return (
                                            <List.Item key={ permission.value }>
                                                { permission.value }
                                            </List.Item>
                                        );
                                    })
                                }
                            </List>
                        )
                        : null
                }

            </div>

            <div style={ loadingDisplay }>
                <Loader size="lg" backdrop content="role is updating" vertical />
            </div>
        </div>
    );
}
