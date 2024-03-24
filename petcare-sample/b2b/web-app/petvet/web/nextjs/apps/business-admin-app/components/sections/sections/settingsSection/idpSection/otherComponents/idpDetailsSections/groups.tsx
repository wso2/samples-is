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
    IdpGroup, 
    Role
} from "@pet-management-webapp/business-admin-app/data-access/data-access-common-models-util";
import { 
    controllerDecodeGetIdentityProviderGroupMappings, 
    controllerDecodeListAllRoles, 
    controllerDecodePatchIdpClaims, 
    controllerDecodePatchIdpGroups 
} from
    "@pet-management-webapp/business-admin-app/data-access/data-access-controller";
import { FormButtonToolbar, FormField } from "@pet-management-webapp/shared/ui/ui-basic-components";
import { errorTypeDialog, successTypeDialog } from "@pet-management-webapp/shared/ui/ui-components";
import { checkIfJSONisEmpty } from "@pet-management-webapp/shared/util/util-common";
import { LOADING_DISPLAY_BLOCK, LOADING_DISPLAY_NONE, fieldValidate } 
    from "@pet-management-webapp/shared/util/util-front-end-util";
import { id } from "date-fns/locale";
import { Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";
import { Field, Form, FormSpy } from "react-final-form";
import { Checkbox, CheckboxGroup, Loader, Panel, PanelGroup, TagInput, Toaster, useToaster } from "rsuite";
import FormSuite from "rsuite/Form";
import styles from "../../../../../../../styles/Settings.module.css";
import { getConfig } from "@pet-management-webapp/business-admin-app/util/util-application-config-util";

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
export default function Groups(props: GeneralProps) {

    const { fetchData, session, idpDetails } = props;

    const [ loadingDisplay, setLoadingDisplay ] = useState(LOADING_DISPLAY_NONE);

    const toaster: Toaster = useToaster();

    const [ idpGroupMappings, setIdpGroupMappings ] = useState<IdentityProviderGroupMappings>(null);
    const [ rolesList, setRolesList ] = useState<Role[]>([]);

    const fetchGroupMappingData = useCallback(async () => {
        const res: IdentityProviderGroupMappings = 
            await controllerDecodeGetIdentityProviderGroupMappings(session, idpDetails.id);

        setIdpGroupMappings(res);
    }, [ session, id ]);

    useEffect(() => {
        fetchGroupMappingData();
    }, [ fetchGroupMappingData ]);

    const validate = (values: Record<string, unknown>): Record<string, string> => {
        let errors: Record<string, string> = {};

        errors = fieldValidate("group_attribute", values.group_attribute, errors);

        return errors;
    };

    const onDataSubmit = (response: IdentityProvider, form): void => {
        if (response) {
            successTypeDialog(toaster, "Changes Saved Successfully", "Idp updated successfully.");
            fetchGroupMappingData();
            form.restart();
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while updating the Idp. Try again.");
        }
    };

    const onUpdate = async (values: Record<string, string>, form): Promise<void> => {

        setLoadingDisplay(LOADING_DISPLAY_BLOCK);
        let idpGroups: IdpGroup[] = [];
        const groupNames: string[] = values.groups as unknown as string[];
        
        idpDetails.groups.forEach((group) => {
            if (groupNames.includes(group.name)) {
                idpGroups.push(group);
            }
        });

        groupNames.forEach((groupName) => {
            if (!idpDetails.groups.some((group) => group.name === groupName)) {
                idpGroups.push({
                    name: groupName,
                    id: ""
                });
            } else {
                idpGroups.push(idpDetails.groups.find((group) => group.name === groupName)[0]);
            }
        });
        idpGroups = idpGroups.filter((element) => element !== undefined);

        const newIdpGroupMappings = {
            mappings: [
                {
                    idpClaim: values.group_attribute,
                    localClaim: {
                        uri: "http://wso2.org/claims/groups"
                    }
                }
            ],
            provisioningClaims: idpGroupMappings.provisioningClaims,
            roleClaim: idpGroupMappings.roleClaim,
            userIdClaim: idpGroupMappings.userIdClaim
        };

        controllerDecodePatchIdpClaims(session, idpDetails.id, newIdpGroupMappings)
            .then(() => {
                controllerDecodePatchIdpGroups(session, idpDetails.id, idpGroups)
                    .then(() => {
                        fetchData();
                        fetchGroupMappingData();
                    })
                    .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));
            });
        
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

    return (
        <div className={ styles.addUserMainDiv }>

            <div>

                <Form
                    onSubmit={ onUpdate }
                    validate={ validate }
                    initialValues={{
                        group_attribute: idpGroupMappings?.mappings[0]?.idpClaim,
                        groups: idpDetails.groups.map((group) => group.name)
                    }}
                    render={ ({ handleSubmit, form, submitting, pristine, errors }) => (
                        <FormSuite
                            layout="vertical"
                            className={ styles.addUserForm }
                            onSubmit={ () => { handleSubmit().then(form.restart); } }
                            fluid>

                            <FormField
                                name="group_attribute"
                                label="Group Attribute"
                                helperText={ "The attribute from the connection that will be mapped " + 
                                "to the organization's group attribute." 
                                }
                                needErrorMessage={ true }
                            >
                                <FormSuite.Control name="input" />
                            </FormField>

                            <FormField
                                name="groups"
                                label="External Groups"
                                helperText={ "This should correspond to the name of the groups" + 
                                    " that will be returned from your connection." 
                                }
                                needErrorMessage={ true }
                            >
                                <FormSuite.Control
                                    name="input"
                                    accepter={ TagInput }
                                    style={ { width: '100%', display: 'block' } }
                                />
                            </FormField>
                            
                            <FormButtonToolbar
                                submitButtonText="Update"
                                submitButtonDisabled={ submitting || pristine || !checkIfJSONisEmpty(errors) }
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

