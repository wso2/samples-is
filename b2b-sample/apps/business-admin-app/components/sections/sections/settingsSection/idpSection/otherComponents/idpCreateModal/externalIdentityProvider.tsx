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

import { IdentityProvider, IdentityProviderTemplate } from
    "@b2bsample/business-admin-app/data-access/data-access-common-models-util";
import { controllerDecodeCreateIdentityProvider } from
    "@b2bsample/business-admin-app/data-access/data-access-controller";
import { FormButtonToolbar, FormField } from "@b2bsample/shared/ui/ui-basic-components";
import { checkIfJSONisEmpty } from "@b2bsample/shared/util/util-common";
import { fieldValidate, LOADING_DISPLAY_BLOCK, LOADING_DISPLAY_NONE } from
    "@b2bsample/shared/util/util-front-end-util";
import IdentityProviderConfigureType from
    "libs/business-admin-app/data-access/data-access-common-models-util/src/lib/identityProvider/identityProviderConfigureType";
import { Session } from "next-auth";
import { useState } from "react";
import { Form } from "react-final-form";
import { Loader, Radio, RadioGroup } from "rsuite";
import FormSuite from "rsuite/Form";
import styles from "../../../../../../../styles/Settings.module.css";

interface ExternalIdentityProviderProps {
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
export default function ExternalIdentityProvider(prop: ExternalIdentityProviderProps) {

    const { session, template, onIdpCreate, onCancel } = prop;

    const [loadingDisplay, setLoadingDisplay] = useState(LOADING_DISPLAY_NONE);
    const [configureType, setConfigureType]
        = useState<IdentityProviderConfigureType>(IdentityProviderConfigureType.AUTO);

    const validate = (values: Record<string, string>): Record<string, string> => {
        let errors: Record<string, string> = {};

        errors = fieldValidate("application_name", values.application_name, errors);
        errors = fieldValidate("client_id", values.client_id, errors);
        errors = fieldValidate("client_secret", values.client_secret, errors);

        return errors;
    };

    const onConfigureTypeChange = (value: IdentityProviderConfigureType): void => {
        setConfigureType(value);
    }

    const onUpdate = async (values: Record<string, string>): Promise<void> => {
        setLoadingDisplay(LOADING_DISPLAY_BLOCK);
        controllerDecodeCreateIdentityProvider(session, template, values)
            .then((response) => onIdpCreate(response))
            .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));
    };

    return (
        <div>

            <Form
                onSubmit={onUpdate}
                validate={validate}

                render={({ handleSubmit, form, submitting, pristine, errors }) => (
                    <FormSuite
                        layout="vertical"
                        className={styles.addUserForm}
                        onSubmit={() => { handleSubmit().then(form.restart); }}
                        fluid>

                        <FormField
                            name="application_name"
                            label="Name"
                            helperText="Name of the identity provider."
                            needErrorMessage={true}
                        >
                            <FormSuite.Control name="input" />
                        </FormField>

                        <FormField
                            name="client_id"
                            label="Client Id"
                            helperText="Client id of the identity provider."
                            needErrorMessage={true}
                        >
                            <FormSuite.Control name="input" />
                        </FormField>

                        <FormField
                            name="client_secret"
                            label="Client Secret"
                            helperText="Client secret of the identity provider."
                            needErrorMessage={true}
                        >
                            <FormSuite.Control name="input" />
                        </FormField>

                        <RadioGroup name="radioList" value={configureType} onChange={onConfigureTypeChange}>
                            <Radio value={IdentityProviderConfigureType.AUTO}>
                                Use the <mark>discovery endpoint</mark>  to  create the identity provider
                            </Radio>
                            <Radio value={IdentityProviderConfigureType.MANUAL}>
                                Manually configure the identity provider
                            </Radio>
                        </RadioGroup>
                        <br />

                        {
                            configureType === IdentityProviderConfigureType.AUTO
                                ? <>
                                    <FormField
                                        name="discovery_url"
                                        label="Discovery URL"
                                        helperText="Discovery URL of the identity provider."
                                        needErrorMessage={true}
                                    >
                                        <FormSuite.Control name="input" />
                                    </FormField>

                                </>
                                : null
                        }

                        {
                            configureType === IdentityProviderConfigureType.MANUAL
                                ? <>
                                    <FormField
                                        name="authorization_endpoint_url"
                                        label="Authorization Endpoint URL"
                                        helperText="Authorization Endpoint URL of the identity provider."
                                        needErrorMessage={true}
                                    >
                                        <FormSuite.Control name="input" />
                                    </FormField>

                                    <FormField
                                        name="token_endpoint_url"
                                        label="Token Endpoint URL"
                                        helperText="Token Endpoint URL of the identity provider."
                                        needErrorMessage={true}
                                    >
                                        <FormSuite.Control name="input" />
                                    </FormField>

                                    <FormField
                                        name="logout_url"
                                        label="Logout URL (optional)"
                                        helperText="The URL of the identity provider to which Asgardeo will send session invalidation requests."
                                        needErrorMessage={true}
                                    >
                                        <FormSuite.Control name="input" />
                                    </FormField>

                                    <FormField
                                        name="certificate"
                                        label="JWKS endpoint URL (optional)"
                                        helperText="JWKS endpoint URL of the identity provider."
                                        needErrorMessage={true}
                                    >
                                        <FormSuite.Control name="input" />
                                    </FormField>
                                </>
                                : null
                        }

                        <FormButtonToolbar
                            submitButtonText="Create"
                            submitButtonDisabled={submitting || pristine || !checkIfJSONisEmpty(errors)}
                            onCancel={onCancel}
                        />

                    </FormSuite>
                )}
            />

            <div style={loadingDisplay}>
                <Loader size="lg" backdrop content="Identity provider is creating" vertical />
            </div>
        </div>
    );
}
