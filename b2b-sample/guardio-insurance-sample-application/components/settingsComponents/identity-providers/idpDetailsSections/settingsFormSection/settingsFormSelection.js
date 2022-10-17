/*
 * Copyright (c) 2022 WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *http://www.apache.org/licenses/LICENSE-2.
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import CopyIcon from '@rsuite/icons/Copy';
import React from 'react';
import { Field } from 'react-final-form';
import { InputGroup, useToaster } from 'rsuite';
import FormSuite from 'rsuite/Form';
import { selectedTemplateBaesedonTemplateId } from '../../../../../util/util/applicationUtil/applicationUtil';
import { copyTheTextToClipboard } from '../../../../../util/util/common/common';
import { infoTypeDialog } from '../../../../util/dialog';
import HelperText from '../../../../util/helperText';

export default function SettingsFormSelection(props) {

    const toaster = useToaster();

    const propList = () => {
        let selectedTemplate = selectedTemplateBaesedonTemplateId(props.templateId);
        if (selectedTemplate) {
            return selectedTemplate.idp.federatedAuthenticators.authenticators[0].properties;
        } else {
            return null;
        }
    };

    const selectedValue = (key) => {

        let keyFederatedAuthenticator = props.federatedAuthenticators.filter((obj) => obj.key === key)[0];

        return keyFederatedAuthenticator ? keyFederatedAuthenticator.value : "";
    }

    const copyValueToClipboard = (text) => {
        copyTheTextToClipboard(text);
        infoTypeDialog(toaster, "Text copied to clipboard")
    }

    return (

        propList()
            ? propList().map((prop) => {
                return (
                    <Field
                        key={prop.key}
                        name={prop.key}
                        initialValue={selectedValue(prop.key)}
                        render={({ input, meta }) => (
                            <FormSuite.Group controlId={prop.key}>
                                <FormSuite.ControlLabel>{prop.displayName}</FormSuite.ControlLabel>
                                <InputGroup inside style={{ width: "100%" }}>

                                    <FormSuite.Control
                                        readOnly={prop.readOnly ? prop.readOnly : false}
                                        {...input}
                                    />

                                    {
                                        prop.readOnly
                                            ? <InputGroup.Button
                                                onClick={() => copyValueToClipboard(selectedValue(prop.key))}>
                                                <CopyIcon />
                                            </InputGroup.Button>
                                            : null
                                    }

                                </InputGroup>
                                <HelperText
                                    text={prop.description} />

                                {meta.error && meta.touched && <FormSuite.ErrorMessage show={true} >
                                    {meta.error}
                                </FormSuite.ErrorMessage>}

                            </FormSuite.Group>
                        )}
                    />)
                    ;
            })
            : <p>Access the console to edit this identity provider</p>

    )
}

