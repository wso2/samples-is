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

import { IdentityProvider, IdentityProviderFederatedAuthenticator } from
    "@pet-management-webapp/business-admin-app/data-access/data-access-common-models-util";
import { controllerDecodeGetFederatedAuthenticators, controllerDecodeUpdateFederatedAuthenticators } from
    "@pet-management-webapp/business-admin-app/data-access/data-access-controller";
import { FormButtonToolbar } from "@pet-management-webapp/shared/ui/ui-basic-components";
import { errorTypeDialog, successTypeDialog } from "@pet-management-webapp/shared/ui/ui-components";
import { checkIfJSONisEmpty } from "@pet-management-webapp/shared/util/util-common";
import { LOADING_DISPLAY_BLOCK, LOADING_DISPLAY_NONE } 
    from "@pet-management-webapp/shared/util/util-front-end-util";
import { Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";
import { Form } from "react-final-form";
import { Loader, Toaster, useToaster } from "rsuite";
import FormSuite from "rsuite/Form";
import SettingsFormSelection from "./settingsFormSection/settingsFormSelection";
import styles from "../../../../../../../styles/Settings.module.css";

interface SettingsProps {
    session: Session,
    idpDetails: IdentityProvider
}

/**
 * 
 * @param prop - session, idpDetails
 *
 * @returns The settings section of an idp
 */
export default function Settings(props: SettingsProps) {

    const { session, idpDetails } = props;

    const [ loadingDisplay, setLoadingDisplay ] = useState(LOADING_DISPLAY_NONE);
    const [ federatedAuthenticators, setFederatedAuthenticators ]
        = useState<IdentityProviderFederatedAuthenticator>(null);

    const toaster: Toaster = useToaster();

    const fetchData = useCallback(async () => {
        const res = await controllerDecodeGetFederatedAuthenticators(
            session, idpDetails.id, idpDetails.federatedAuthenticators.defaultAuthenticatorId);
        
        await setFederatedAuthenticators(res);
    }, [ session, idpDetails ]);

    useEffect(() => {
        fetchData();
    }, [ fetchData ]);

    const validate = () => {
        const errors = {};

        if (federatedAuthenticators && federatedAuthenticators.properties) {
            federatedAuthenticators.properties.filter((property) => {
                if (document.getElementById(property.key)) {
                    if (!(document.getElementById(property.key) as HTMLInputElement).value) {
                        errors[property.key] = "This field cannot be empty";
                    }
                }
            });
        }

        return errors;
    };

    const onDataSubmit = (response: IdentityProviderFederatedAuthenticator): void => {
        if (response) {
            successTypeDialog(toaster, "Changes Saved Successfully", "Idp updated successfully.");
            fetchData();
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while updating the Idp. Try again.");
        }
    };

    const onUpdate = async (values: Record<string, string>): Promise<void> => {
        setLoadingDisplay(LOADING_DISPLAY_BLOCK);
        controllerDecodeUpdateFederatedAuthenticators(session, idpDetails.id, federatedAuthenticators, values)
            .then((response) => onDataSubmit(response))
            .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));
    };

    return (
        <div className={ styles.addUserMainDiv }>

            <div>
                {
                    federatedAuthenticators
                        ? (<Form
                            onSubmit={ onUpdate }
                            validate={ validate }

                            render={ ({ handleSubmit, submitting, pristine, errors }) => (
                                <FormSuite
                                    layout="vertical"
                                    className={ styles.addUserForm }
                                    onSubmit={ () => handleSubmit() }
                                    fluid>

                                    { federatedAuthenticators.properties
                                        ? (<SettingsFormSelection
                                            federatedAuthenticators={ federatedAuthenticators.properties }
                                            templateId={ idpDetails.templateId } />)
                                        : null
                                    }

                                    <FormButtonToolbar
                                        submitButtonText="Update"
                                        submitButtonDisabled={ submitting || pristine || !checkIfJSONisEmpty(errors) }
                                        needCancel={ false }
                                    />

                                </FormSuite>
                            ) }
                        />)
                        : null
                }

            </div>

            <div style={ loadingDisplay }>
                <Loader size="lg" backdrop content="User is adding" vertical />
            </div>
        </div>
    );
}
