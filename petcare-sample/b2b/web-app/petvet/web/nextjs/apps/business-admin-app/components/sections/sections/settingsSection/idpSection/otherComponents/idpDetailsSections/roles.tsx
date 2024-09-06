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
    IdentityProvider, 
    IdentityProviderGroupMappings, 
    Role
} from "@pet-management-webapp/business-admin-app/data-access/data-access-common-models-util";
import { 
    controllerDecodeGetIdentityProviderGroupMappings, 
    controllerDecodeGetRole, 
    controllerDecodeListAllRoles, 
    controllerDecodePatchRole
} from
    "@pet-management-webapp/business-admin-app/data-access/data-access-controller";
import { getConfig } from "@pet-management-webapp/business-admin-app/util/util-application-config-util";
import { FormButtonToolbar, FormField } from "@pet-management-webapp/shared/ui/ui-basic-components";
import { PatchMethod, checkIfJSONisEmpty } from "@pet-management-webapp/shared/util/util-common";
import { LOADING_DISPLAY_NONE } 
    from "@pet-management-webapp/shared/util/util-front-end-util";
import { id } from "date-fns/locale";
import { Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";
import { Form } from "react-final-form";
import { Loader, TagPicker } from "rsuite";
import FormSuite from "rsuite/Form";
import styles from "../../../../../../../styles/Settings.module.css";

interface GeneralProps {
    fetchData: () => Promise<void>
    session: Session,
    idpDetails: IdentityProvider
}

/**
 * 
 * @param prop - fetchData (function to fetch data after form is submitted), session, idpDetails
 * 
 * @returns The general section of an idp
 */
export default function Roles(props: GeneralProps) {

    const { fetchData, session, idpDetails } = props;

    const [ loadingDisplay, setLoadingDisplay ] = useState(LOADING_DISPLAY_NONE);

    const [ idpGroupMappings, setIdpGroupMappings ] = useState<IdentityProviderGroupMappings>(null);
    const [ rolesList, setRolesList ] = useState<Role[]>([]);
    const [ initialValues, setInitialValues ] = useState<any>({});

    const fetchGroupMappingData = useCallback(async () => {
        const res: IdentityProviderGroupMappings = 
            await controllerDecodeGetIdentityProviderGroupMappings(session, idpDetails.id);

        setIdpGroupMappings(res);
    }, [ session, id ]);

    useEffect(() => {
        fetchGroupMappingData();
    }, [ fetchGroupMappingData ]);

    const onUpdate = async (values: Record<string, string>, form): Promise<void> => {

        // setLoadingDisplay(LOADING_DISPLAY_BLOCK);
        Object.entries(values).map(async ([ key, value ]) => {
            if (value.length !== 0) {
                await controllerDecodePatchRole(session, key, PatchMethod.REPLACE, "groups", value);
            }
        });
        fetchGroupMappingData();
        fetchAllRoles();
        // setLoadingDisplay(LOADING_DISPLAY_BLOCK);
        
    };

    const fetchAllRoles = useCallback(async () => {

        const res = await controllerDecodeListAllRoles(session);

        if (res) {
            setRolesList(res.filter((role) => 
                role?.audience.type == "application" && 
                role?.audience.display === getConfig().BusinessAdminAppConfig.ManagementAPIConfig.SharedApplicationName
            ));
        } else {
            setRolesList([]);
        }

    }, [ session ]);

    useEffect(() => {
        fetchAllRoles();
    }, [ fetchAllRoles ]);

    useEffect(() => {
        const fetchDataForRole = async (roleId) => {
            const response = await controllerDecodeGetRole(session, roleId);
            const roleGroups = response.groups ? response.groups.map((group) => group.value) : [];
            const filteredGroups = roleGroups.filter((group) => 
                idpDetails.groups.some((idpGroup) => idpGroup.id === group));
            
            setInitialValues((prevData) => ({
                ...prevData,
                [roleId]: filteredGroups
            }));
        };

        const roleIDs = rolesList.map((role) => role.id);
        
        roleIDs.forEach((roleId) => {
            fetchDataForRole(roleId);
        });
    }, [ rolesList, idpDetails ]);

    return (
        <div className={ styles.addUserMainDiv }>

            <div>

                <Form
                    onSubmit={ onUpdate }
                    initialValues={ initialValues }
                    render={ ({ handleSubmit, form, submitting, pristine, errors }) => (
                        <FormSuite
                            layout="vertical"
                            className={ styles.addUserForm }
                            onSubmit={ () => { handleSubmit().then(form.restart); } }
                            fluid>

                            { rolesList.map((role, index) => {
                                const fieldName = `${role.id}`;
                                
                                return (
                                    <FormField key={ index } name={ fieldName } label={ role.displayName }>
                                        <FormSuite.Control
                                            name="input"
                                            accepter={ TagPicker }
                                            data={ idpDetails.groups.map((group) => {
                                                return {
                                                    label: group.name,
                                                    value: group.id
                                                };
                                            }) }
                                            block
                                        />
                                    </FormField>
                                );
                            }) }
                            
                            <FormButtonToolbar
                                submitButtonText="Update"
                                submitButtonDisabled={ submitting || pristine || !checkIfJSONisEmpty(errors)}
                                needCancel={ false }
                            />

                        </FormSuite>
                    ) }
                />

            </div>

            <div style={ loadingDisplay }>
                <Loader size="lg" backdrop content="User is adding" vertical />
            </div>
        </div>
    );
}

