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
    IdentityProviderFederatedAuthenticatorProperty, IdentityProviderTemplate,
    IdentityProviderTemplateModelAuthenticatorProperty, selectedTemplateBaesedonTemplateId
} from "@pet-management-webapp/business-admin-app/data-access/data-access-common-models-util";
import { HelperTextComponent, infoTypeDialog } from "@pet-management-webapp/shared/ui/ui-components";
import { CopyTextToClipboardCallback, copyTheTextToClipboard } from "@pet-management-webapp/shared/util/util-common";
import CopyIcon from "@rsuite/icons/Copy";
import React from "react";
import { Field } from "react-final-form";
import { InputGroup, Toaster, useToaster } from "rsuite";
import FormSuite from "rsuite/Form";

interface SettingsFormSelectionProps {
    templateId: string
    federatedAuthenticators: IdentityProviderFederatedAuthenticatorProperty[]
}

/**
 * 
 * @param prop - templateId, federatedAuthenticators (federatedAuthenticators as a list)
 * 
 * @returns Component of the settings section of the idp interface
 */
export default function SettingsFormSelection(props: SettingsFormSelectionProps) {

    const { templateId, federatedAuthenticators } = props;

    const toaster: Toaster = useToaster();

    const propList = (): IdentityProviderTemplateModelAuthenticatorProperty[] => {
        const selectedTemplate: IdentityProviderTemplate = selectedTemplateBaesedonTemplateId(templateId);

        if (selectedTemplate) {
            return selectedTemplate.idp.federatedAuthenticators.authenticators[0].properties;
        } else {
            return null;
        }
    };

    const selectedValue = (key: string): string => {

        const keyFederatedAuthenticator = federatedAuthenticators.filter((obj) => obj.key === key)[0];

        return keyFederatedAuthenticator ? keyFederatedAuthenticator.value : "";
    };

    const copyValueToClipboard = (text: string): void => {
        const callback: CopyTextToClipboardCallback = () => infoTypeDialog(toaster, "Text copied to clipboard");

        copyTheTextToClipboard(text, callback);
    };

    return (
        <>
            {
                propList()
                    ? propList().map((property) => {
                        return (
                            <Field
                                id={ property.key }
                                key={ property.key }
                                name={ property.key }
                                initialValue={ selectedValue(property.key) }
                                render={ ({ input, meta }) => (
                                    <FormSuite.Group controlId={ property.key }>
                                        <FormSuite.ControlLabel><b>{ property.displayName }</b></FormSuite.ControlLabel>
                                        <InputGroup inside style={ { width: "100%" } }>

                                            <FormSuite.Control
                                                readOnly={ property.readOnly ? property.readOnly : false }
                                                { ...input }
                                            />

                                            {
                                                property.readOnly
                                                    ? (<InputGroup.Button
                                                        onClick={ () =>
                                                            copyValueToClipboard(selectedValue(property.key))
                                                        }
                                                    >
                                                        <CopyIcon />
                                                    </InputGroup.Button>)
                                                    : null
                                            }

                                        </InputGroup>
                                        <HelperTextComponent
                                            text={ property.description } />

                                        { meta.error && meta.touched && (<FormSuite.ErrorMessage show={ true } >
                                            { meta.error }
                                        </FormSuite.ErrorMessage>) }

                                    </FormSuite.Group>
                                ) }
                            />
                        );
                    })
                    : <p>Access the console to edit this identity provider</p>
            }

        </>

    );
}

