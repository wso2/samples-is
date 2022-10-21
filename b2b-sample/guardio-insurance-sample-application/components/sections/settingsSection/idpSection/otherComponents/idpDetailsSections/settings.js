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

import React, { useCallback, useEffect, useState } from "react";
import { Form } from "react-final-form";
import { Button, ButtonToolbar, Loader, useToaster } from "rsuite";
import FormSuite from "rsuite/Form";
import SettingsFormSelection from "./settingsFormSection/settingsFormSelection";
import styles from "../../../../../../styles/Settings.module.css";
import decodeGetFederatedAuthenticators from
    "../../../../../../util/apiDecode/settings/identityProvider/decodeGetFederatedAuthenticators";
import decodeUpdateFederatedAuthenticators from
    "../../../../../../util/apiDecode/settings/identityProvider/decodeUpdateFederatedAuthenticators";
import { checkIfJSONisEmpty } from "../../../../../../util/util/common/common";
import { LOADING_DISPLAY_BLOCK, LOADING_DISPLAY_NONE } from "../../../../../../util/util/frontendUtil/frontendUtil";
import { errorTypeDialog, successTypeDialog } from "../../../../../common/dialog";

/**
 * 
 * @param prop - session, idpDetails
 * @returns The settings section of an idp
 */
export default function Settings(prop) {

    const { session, idpDetails } = prop;

    const [ loadingDisplay, setLoadingDisplay ] = useState(LOADING_DISPLAY_NONE);
    const [ federatedAuthenticators, setFederatedAuthenticators ] = useState({});

    const toaster = useToaster();

    const fetchData = useCallback(async () => {
        const res = await decodeGetFederatedAuthenticators(
            session,  idpDetails.id,  idpDetails.federatedAuthenticators.defaultAuthenticatorId
        );

        await setFederatedAuthenticators(res);
    }, [ session, idpDetails ]);

    useEffect(() => {
        fetchData();
    }, [ fetchData ]);

    const validate = () => {
        let errors = {};

        if (federatedAuthenticators.properties) {
            federatedAuthenticators.properties.filter((property) => {
                if (!eval(property.key) && !eval(property.key).value) {
                    errors[ property.key ] = "This field cannot be empty";
                }
            } );
        }

        return errors;
    };

    const onDataSubmit = (response) => {
        if (response) {
            successTypeDialog(toaster, "Changes Saved Successfully", "Idp updated successfully.");
            fetchData();
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while updating the Idp. Try again.");
        }
    };

    const onUpdate = async (values, form) => {
        setLoadingDisplay(LOADING_DISPLAY_BLOCK);
        decodeUpdateFederatedAuthenticators( session,  idpDetails.id, federatedAuthenticators, values)
            .then((response) => onDataSubmit(response, form))
            .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));
    };

    return (
        <div className={ styles.addUserMainDiv }>

            <div>

                <Form
                    onSubmit={ onUpdate }
                    validate={ validate }

                    render={ ( { handleSubmit, submitting, pristine, errors } ) => (
                        <FormSuite 
                            layout="vertical" 
                            className={ styles.addUserForm }
                            onSubmit={ handleSubmit } 
                            fluid>

                            { federatedAuthenticators.properties
                                ? (<SettingsFormSelection 
                                    federatedAuthenticators={ federatedAuthenticators.properties }
                                    templateId={ idpDetails.templateId } />)
                                : null
                            }

                            <div className="buttons">
                                <FormSuite.Group>
                                    <ButtonToolbar>
                                        <Button 
                                            className={ styles.addUserButton } 
                                            size="lg" 
                                            appearance="primary"
                                            type="submit"
                                            disabled={ submitting || pristine || !checkIfJSONisEmpty(errors) }>
                                            Update
                                        </Button>
                                    </ButtonToolbar>
                                </FormSuite.Group>
                            </div>
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
