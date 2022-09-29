/*
 * Copyright (c) 2022 WSO2 LLC. (http://www.wso2.com).
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

import React, { useCallback, useEffect, useState } from 'react';
import { Form } from 'react-final-form';
import { Button, ButtonToolbar, Loader, useToaster } from 'rsuite';
import FormSuite from 'rsuite/Form';
import { LOADING_DISPLAY_BLOCK, LOADING_DISPLAY_NONE } from '../../../../util/util/frontendUtil/frontendUtil';
import { errorTypeDialog, successTypeDialog } from '../../../util/dialog';

import styles from '../../../../styles/Settings.module.css';
import SettingsFormSelection from './settingsFormSection/settingsFormSelection';
import decodeGetFederatedAuthenticators from '../../../../util/apiDecode/settings/identityProvider/decodeGetFederatedAuthenticators';

export default function Settings(props) {

    const [loadingDisplay, setLoadingDisplay] = useState(LOADING_DISPLAY_NONE);
    const [federatedAuthenticators, setFederatedAuthenticators] = useState({});
    const toaster = useToaster();

    const fetchData = useCallback(async () => {
        decodeGetFederatedAuthenticators(
            props.session, props.idpDetails.id, props.idpDetails.federatedAuthenticators.defaultAuthenticatorId
        ).then((res) => setFederatedAuthenticators(res));
    }, [props])

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    const clientIdValidate = (clientId, errors) => {
        if (!clientId) {
            errors.clientId = 'This field cannot be empty'
        }
        return errors;
    }

    const clientSecretValidate = (clientSecret, errors) => {
        if (!clientSecret) {
            errors.clientSecret = 'This field cannot be empty'
        }
        return errors;
    }

    const redirectURIValidate = (redirectURI, errors) => {
        if (!redirectURI) {
            errors.redirectURI = 'This field cannot be empty'
        }
        return errors;
    }

    const queryParamValidate = (queryParam, errors) => {
        if (!queryParam) {
            errors.queryParam = 'This field cannot be empty'
        }
        return errors;
    }

    const validate = values => {
        const errors = {}
        errors = clientIdValidate(values.clientId, errors);
        errors = clientSecretValidate(values.clientSecret, errors);
        errors = redirectURIValidate(values.redirectURI, errors);
        errors = queryParamValidate(values.queryParam, errors);
        return errors
    }

    const onDataSubmit = (response, form) => {
        if (response) {
            successTypeDialog(toaster, "Changes Saved Successfully", "User add to the organization successfully.");
            form.restart();
            props.onClose();
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while adding the user. Try again.");
        }
    }

    const onUpdate = async (values, form) => {
        setLoadingDisplay(LOADING_DISPLAY_BLOCK);
        onDataSubmit(true, form);
        // decodeAddUser(props.session, values.firstName, values.familyName, values.email,
        //     values.username, values.password)
        //     .then((response) => onDataSubmit(response, form))
        //     .finally((response) => setLoadingDisplay(LOADING_DISPLAY_NONE))
    }


    return (
        <div className={styles.addUserMainDiv}>

            <div>

                <Form
                    onSubmit={onUpdate}
                    validate={validate}
                    render={({ handleSubmit, form, submitting, pristine, values }) => (
                        <FormSuite layout="vertical" className={styles.addUserForm}
                            onSubmit={event => { handleSubmit(event).then(form.restart); }} fluid>

                            {federatedAuthenticators.properties
                                ? <SettingsFormSelection federatedAuthenticators={federatedAuthenticators.properties}
                                    templateId={props.idpDetails.templateId} />
                                : <></>
                            }

                            <div className="buttons">
                                <FormSuite.Group>
                                    <ButtonToolbar>
                                        <Button className={styles.addUserButton} size="lg" appearance="primary"
                                            type='submit' disabled={submitting || pristine}>Update</Button>
                                    </ButtonToolbar>
                                </FormSuite.Group>

                            </div>
                        </FormSuite>
                    )}
                />

            </div>

            <div style={loadingDisplay}>
                <Loader size="lg" backdrop content="Idp is updating" vertical />
            </div>
        </div>

    )
}