/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
    Application, ApplicationList, 
    IdentityProvider, IdentityProviderConfigureType, 
    IdentityProviderTemplate, PatchApplicationAuthMethod 
} from "@pet-management-webapp/business-admin-app/data-access/data-access-common-models-util";
import { 
    controllerDecodeCreateIdentityProvider, controllerDecodeGetApplication, 
    controllerDecodeListCurrentApplication, controllerDecodePatchApplicationAuthSteps 
} from "@pet-management-webapp/business-admin-app/data-access/data-access-controller";
import { FormButtonToolbar, FormField } from "@pet-management-webapp/shared/ui/ui-basic-components";
import { errorTypeDialog, successTypeDialog } from "@pet-management-webapp/shared/ui/ui-components";
import { checkIfJSONisEmpty } from "@pet-management-webapp/shared/util/util-common";
import { LOADING_DISPLAY_BLOCK, LOADING_DISPLAY_NONE, fieldValidate } from
    "@pet-management-webapp/shared/util/util-front-end-util";
import { Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";
import { Form } from "react-final-form";
import { Loader, Radio, RadioGroup, Toaster, Uploader, useToaster } from "rsuite";
import FormSuite from "rsuite/Form";
import styles from "../../../../../../../styles/Settings.module.css";

interface SAMLIdentityProviderProps {
    session: Session
    template: IdentityProviderTemplate
    onIdpCreate: (response: IdentityProvider) => void,
    onCancel: () => void,
}

/**
* 
* @param prop - `ExternalIdentityProviderProps`
* 
* @returns Form to create external idp
*/
export default function SAMLIdentityProvider(prop: SAMLIdentityProviderProps) {

    const { session, template, onIdpCreate, onCancel } = prop;

    const [ loadingDisplay, setLoadingDisplay ] = useState(LOADING_DISPLAY_NONE);
    const [ configureType, setConfigureType ]
        = useState<IdentityProviderConfigureType>(IdentityProviderConfigureType.AUTO);
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
        errors = fieldValidate("sp_entity_id", values.sp_entity_id, errors);

        switch (configureType) {
            case IdentityProviderConfigureType.AUTO:
                errors = fieldValidate("meta_data_saml", values.meta_data_saml, errors);

                break;

            case IdentityProviderConfigureType.MANUAL:
                errors = fieldValidate("sso_url", values.sso_url, errors);
                errors = fieldValidate("idp_entity_id", values.idp_entity_id, errors);

                break;
        }

        return errors;
    };

    const onConfigureTypeChange = (value: IdentityProviderConfigureType): void => {
        setConfigureType(value);
    };

    const onIdpAddToLoginFlow = (response: boolean): void => {
        if (response) {
            successTypeDialog(toaster, "Success", "Identity Provider Add to the Login Flow Successfully.");
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while adding the the identity provider.");
        }
    };

    const onUpdate = async (values: Record<string, any>): Promise<void> => {

        setLoadingDisplay(LOADING_DISPLAY_BLOCK);
        if (values.meta_data_saml) {
            const blobFile = values?.meta_data_saml[0].blobFile as Blob;
            
            fileToBase64(blobFile)
                .then(base64Content => {
                    values.meta_data_saml = base64Content;
                    createIdPandAddToLoginFlow(values);
                })
                .catch(error => {
                    // TODO: Handle error
                });
        } else {
            createIdPandAddToLoginFlow(values);
        }        
    };

    const createIdPandAddToLoginFlow = async (values: Record<string, string>): Promise<void> => {

        controllerDecodeCreateIdentityProvider(session, template, values, configureType)
            .then((response) => {
                onIdpCreate(response);
                const idpDetails = response as IdentityProvider;
                
                controllerDecodePatchApplicationAuthSteps(session, applicationDetail, idpDetails,
                    PatchApplicationAuthMethod.ADD)
                    .then((response) => {
                        onIdpAddToLoginFlow(response);
                    })
                    .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));
            })
            .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));
    };

    function fileToBase64(file: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = reader.result as string;
                const base64Content = base64String.split(",")[1];
                
                resolve(base64Content);
            };
            reader.onerror = error => reject(error);
        });
    }

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
                            needErrorMessage={ true }
                        >
                            <FormSuite.Control name="input" />
                        </FormField>
                        <FormField
                            name="sp_entity_id"
                            label="Service Provider Entity ID"
                            needErrorMessage={ true }
                        >
                            <FormSuite.Control 
                                name="input" />
                        </FormField>
                        <RadioGroup name="radioList" value={ configureType } onChange={ onConfigureTypeChange }>
                            <Radio value={ IdentityProviderConfigureType.AUTO }>
                                File based configuration
                            </Radio>
                            <Radio value={ IdentityProviderConfigureType.MANUAL }>
                                Manually configuration
                            </Radio>
                        </RadioGroup>
                        <br />
                        {
                            configureType === IdentityProviderConfigureType.AUTO
                                ? (<>
                                    <FormField
                                        name="meta_data_saml"
                                        label="SAML Metadata File"
                                        helperText="Upload an XML file here."
                                        needErrorMessage={ true }
                                    >
                                        <FormSuite.Control name="uploader" accepter={ Uploader } action="#" />
                                    </FormField>
                                </>)
                                : null
                        }

                        {
                            configureType === IdentityProviderConfigureType.MANUAL
                                ? (<>
                                    <FormField
                                        name="sso_url"
                                        label="Identity provider Single Sign-On URL"
                                        needErrorMessage={ true }
                                    >
                                        <FormSuite.Control name="input" type="url" />
                                    </FormField>
                                    <FormField
                                        name="idp_entity_id"
                                        label="Identity provider entity ID"
                                        needErrorMessage={ true }
                                    >
                                        <FormSuite.Control name="input" />
                                    </FormField>
                                </>)
                                : null
                        }
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
