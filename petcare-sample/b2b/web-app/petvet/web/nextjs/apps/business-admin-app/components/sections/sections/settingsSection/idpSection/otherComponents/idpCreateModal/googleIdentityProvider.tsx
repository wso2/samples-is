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
    Application,
    ApplicationList,
    IdentityProvider, IdentityProviderConfigureType, IdentityProviderTemplate, PatchApplicationAuthMethod
} from "@pet-management-webapp/business-admin-app/data-access/data-access-common-models-util";
import {
    controllerDecodeCreateIdentityProvider, 
    controllerDecodeGetApplication, 
    controllerDecodeListCurrentApplication, 
    controllerDecodePatchApplicationAuthSteps
} from "@pet-management-webapp/business-admin-app/data-access/data-access-controller";
import { FormButtonToolbar, FormField } from "@pet-management-webapp/shared/ui/ui-basic-components";
import { errorTypeDialog, successTypeDialog } from "@pet-management-webapp/shared/ui/ui-components";
import { checkIfJSONisEmpty } from "@pet-management-webapp/shared/util/util-common";
import { LOADING_DISPLAY_BLOCK, LOADING_DISPLAY_NONE, fieldValidate } from
    "@pet-management-webapp/shared/util/util-front-end-util";
import { Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";
import { Form } from "react-final-form";
import { Loader, Toaster, useToaster } from "rsuite";
import FormSuite from "rsuite/Form";
import styles from "../../../../../../../styles/Settings.module.css";

interface GoogleIdentityProviderProps {
    session: Session
    template: IdentityProviderTemplate
    onIdpCreate: (response: IdentityProvider) => void,
    onCancel: () => void,
}

/**
 * 
 * @param prop - `GoogleIdentityProviderProps`
 * 
 * @returns Form to create google idp
 */
export default function GoogleIdentityProvider(prop: GoogleIdentityProviderProps) {

    const { session, template, onIdpCreate, onCancel } = prop;
    const [ loadingDisplay, setLoadingDisplay ] = useState(LOADING_DISPLAY_NONE);
    const toaster: Toaster = useToaster();

    const [ allApplications, setAllApplications ] = useState<ApplicationList>(null);
    const [ applicationDetail, setApplicationDetail ] = useState<Application>(null);

    const fetchData = useCallback(async () => {
        const res : ApplicationList = ( await controllerDecodeListCurrentApplication(session) as ApplicationList );
        
        await setAllApplications(res);
    }, [ session ]);

    const fetchApplicatioDetails = useCallback(async () => {
        if (!checkIfJSONisEmpty(allApplications) && allApplications.totalResults !== 0) {
            const res : Application = ( 
                await controllerDecodeGetApplication(session, allApplications.applications[0].id) as Application );
                      
            await setApplicationDetail(res);
        }
    }, [ session, allApplications ]);

    useEffect(() => {
        fetchData();
    }, [ fetchData ]);

    useEffect(() => {
        fetchApplicatioDetails();
    }, [ fetchApplicatioDetails ]);

    const validate = (values: Record<string, string>): Record<string, string> => {
        let errors: Record<string, string> = {};

        errors = fieldValidate("application_name", values.application_name, errors);
        errors = fieldValidate("client_id", values.client_id, errors);
        errors = fieldValidate("client_secret", values.client_secret, errors);

        return errors;
    };

    const onIdpAddToLoginFlow = (response: boolean): void => {
        if (response) {
            successTypeDialog(toaster, "Success", "Identity Provider Add to the Login Flow Successfully.");
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while adding the the identity provider.");
        }
    };

    const onUpdate = async (values: Record<string, string>): Promise<void> => {
        setLoadingDisplay(LOADING_DISPLAY_BLOCK);
        controllerDecodeCreateIdentityProvider(session, template, values, IdentityProviderConfigureType.MANUAL)
            .then((response) => {
                onIdpCreate(response);
                const idpDetails = response as IdentityProvider;
                
                controllerDecodePatchApplicationAuthSteps(session, applicationDetail, idpDetails,
                    PatchApplicationAuthMethod.ADD)
                    .then((response) => onIdpAddToLoginFlow(response))
                    .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));
            })
            .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));
    };

    return (
        <div>
            <Form
                onSubmit={ onUpdate }
                validate={ validate }
                render={ ({ handleSubmit, form, submitting, pristine, errors }) => (
                    <FormSuite
                        layout="vertical"
                        className={ styles.addUserForm }
                        onSubmit={ () => { handleSubmit().then(form.restart); } }
                        fluid>
                        <FormField
                            name="application_name"
                            label="Name"
                            helperText="Name of the identity provider."
                            needErrorMessage={ true }
                        >
                            <FormSuite.Control name="input" />
                        </FormField>
                        <FormField
                            name="client_id"
                            label="Client Id"
                            helperText="Client id of the identity provider."
                            needErrorMessage={ true }
                        >
                            <FormSuite.Control name="input" />
                        </FormField>
                        <FormField
                            name="client_secret"
                            label="Client Secret"
                            helperText="Client secret of the identity provider."
                            needErrorMessage={ true }
                        >
                            <FormSuite.Control name="input" />
                        </FormField>
                        <FormButtonToolbar
                            submitButtonText="Create"
                            submitButtonDisabled={ submitting || pristine || !checkIfJSONisEmpty(errors) }
                            onCancel={ onCancel }
                        />
                    </FormSuite>
                ) }
            />
            <div style={ loadingDisplay }>
                <Loader size="lg" backdrop content="Identity provider is creating" vertical />
            </div>
        </div>
    );
}
