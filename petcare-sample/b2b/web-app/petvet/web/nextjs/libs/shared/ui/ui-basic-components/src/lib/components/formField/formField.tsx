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

import { HelperTextComponent } from "@pet-management-webapp/shared/ui/ui-components";
import React from "react";
import { Field } from "react-final-form";
import FormSuite from "rsuite/Form";
import { FormFieldProps } from "../../models/formField/formFieldProps";

export function FormField(props: FormFieldProps) {

    const { name, label, helperText, needErrorMessage, children, subscription } = props;

    return (
        <Field
            name={ name }
            render={ ({ input, meta }) => (
                <FormSuite.Group controlId={ name }>
                    <FormSuite.ControlLabel><b>{ label }</b></FormSuite.ControlLabel>

                    { React.cloneElement(children, { ...input }) }

                    {
                        helperText
                            ? <HelperTextComponent text={ helperText } />
                            : null
                    }

                    {
                        needErrorMessage && meta.error && meta.touched && (<FormSuite.ErrorMessage show={ true } >
                            { meta.error }
                        </FormSuite.ErrorMessage>)
                    }

                </FormSuite.Group>
            ) }
            subscription={ subscription }
        />
    );
}

export default FormField;
