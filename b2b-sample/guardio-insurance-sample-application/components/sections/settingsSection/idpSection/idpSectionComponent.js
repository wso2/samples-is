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

import AppSelectIcon from "@rsuite/icons/AppSelect";
import React, { useCallback, useEffect, useState } from "react";
import { Avatar, Button, Container, FlexboxGrid, Form, Modal, Stack, useToaster } from "rsuite";
import Enterprise from "./data/templates/enterprise-identity-provider.json";
import Google from "./data/templates/google.json";
import IdentityProviderList from "./otherComponents/identityProviderList";
import styles from "../../../../styles/idp.module.css";
import decodeCreateIdentityProvider from
    "../../../../util/apiDecode/settings/identityProvider/decodeCreateIdentityProvider";
import decodeListAllIdentityProviders from
    "../../../../util/apiDecode/settings/identityProvider/decodeListAllIdentityProviders";
import { EMPTY_STRING, ENTERPRISE_ID, GOOGLE_ID, checkIfJSONisEmpty, sizeOfJson } from
    "../../../../util/util/common/common";
import { errorTypeDialog, successTypeDialog } from "../../../common/dialog";
import SettingsTitle from "../../../common/settingsTitle";

/**
 * 
 * @param prop - session
 * @returns The idp interface section.
 */
export default function IdpSectionComponent(prop) {

    const { session } = prop;

    const toaster = useToaster();

    const [ idpList, setIdpList ] = useState([]);
    const [ openAddModal, setOpenAddModal ] = useState(false);
    const [ selectedTemplate, setSelectedTemplate ] = useState(undefined);

    const templates = [
        Enterprise,
        Google
    ];

    useEffect(() => {
        fetchAllIdPs();
    }, [ fetchAllIdPs ]);

    const fetchAllIdPs = useCallback(async () => {

        const res = await decodeListAllIdentityProviders(session);

        if (res) {
            if (res.identityProviders) {
                setIdpList(res.identityProviders);
            } else {
                setIdpList([]);
            }
        } else {
            setIdpList(null);
        }

    }, [ session ]);

    const onAddIdentityProviderClick = () => {
        setOpenAddModal(true);
    };

    const onCreationDismiss = () => {
        setSelectedTemplate(undefined);
    };

    const onIdpCreated = (response) => {
        if (response) {
            successTypeDialog(toaster, "Success", "Identity Provider Created Successfully");

            setIdpList([
                ...idpList,
                response
            ]);

            setOpenAddModal(false);
            setSelectedTemplate(undefined);
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while creating the identity provider. Try again.");
        }
    };

    const onIdPSave = async (formValues, template) => {

        if (checkEmpty(formValues, template)) {
            errorTypeDialog(toaster, "Fields Cannot be Empty", "Form fields cannot be empty occured.");
        } else {
            decodeCreateIdentityProvider(session, template, formValues)
                .then((response) => onIdpCreated(response));
        }

    };

    const checkEmpty = (formValue, template) => {

        if (checkIfJSONisEmpty(formValue)) {
            return true;
        }

        let size = sizeOfJson(formValue);
        let key;
        let val;

        switch (template.templateId) {
            case GOOGLE_ID:
                if (size == 3) {
                    for (key in formValue) {
                        val = formValue[key];

                        if (!val) {
                            return true;
                        }
                    }

                    return false;
                }

                break;

            case ENTERPRISE_ID:
                if (size == 6) {
                    for (key in formValue) {
                        val = formValue[key];

                        if (!val) {
                            return true;
                        }
                    }

                    return false;
                }

                break;

            default:

                return true;
        }

        return true;
    };

    return (
        <Container>

            <SettingsTitle
                title="Identity Providers"
                subtitle="Manage identity providers to allow users to log in to your application through them." />

            {
                idpList
                    ? (<FlexboxGrid
                        style={ { height: "60vh", marginTop: "24px", width: "100%" } }
                        justify={ idpList.length === 0 ? "center" : "start" }
                        align={ idpList.length === 0 ? "middle" : "top" }>
                        { idpList.length === 0
                            ? (<EmptyIdentityProviderList
                                onAddIdentityProviderClick={ onAddIdentityProviderClick }
                            />)
                            : (<IdentityProviderList
                                fetchAllIdPs={ fetchAllIdPs }
                                idpList={ idpList }
                                session={ session }
                            />)
                        }
                    </FlexboxGrid>)
                    : null
            }

            {
                openAddModal && (
                    <AddIdentityProviderModal
                        templates={ templates }
                        onClose={ () => setOpenAddModal(false) }
                        openModal={ openAddModal }
                        onTemplateSelected={ (template) => {
                            setOpenAddModal(false);
                            setSelectedTemplate(template);
                        } }
                    />
                )
            }
            {
                selectedTemplate && (
                    <IdPCreationModal
                        onSave={ onIdPSave }
                        onCancel={ onCreationDismiss }
                        openModal={ !!selectedTemplate }
                        template={ selectedTemplate } />
                )
            }
        </Container>
    );

}

/**
 * 
 * @param prop - openModal (function to open the modal), onClose (what will happen when modal closes), 
 *               templates (templates list), onTemplateSelected 
 *              (what will happen when a particular template is selected)
 * @returns A modal to select idp's
 */
const AddIdentityProviderModal = (prop) => {

    const { openModal, onClose, templates, onTemplateSelected } = prop;

    const resolveIconName = (template) => {
        if (GOOGLE_ID === template.templateId) {

            return "google.svg";
        }
        if (ENTERPRISE_ID === template.templateId) {

            return "enterprise.svg";
        }

        return EMPTY_STRING;
    };

    return (
        <Modal
            open={ openModal }
            onClose={ onClose }
            onBackdropClick={ onClose }>
            <Modal.Header>
                <Modal.Title><b>Select Identity Provider</b></Modal.Title>
                <p>Choose one of the following identity providers.</p>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <div className={ styles.idp__template__list }>
                        { templates.map((template) => {

                            return (
                                <div
                                    key={ template.id }
                                    className={ styles.idp__template__card }
                                    onClick={ () => onTemplateSelected(template) }>
                                    <div>
                                        <h5>{ template.name }</h5>
                                        <small>{ template.description }</small>
                                    </div>
                                    <Avatar
                                        style={ { background: "rgba(255,0,0,0)" } }
                                        src={ `/icons/${resolveIconName(template)}` } />
                                </div>
                            );
                        }) }
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );

};

/**
 * 
 * @param prop - onAddIdentityProviderClick (function to open add idp modal)
 * @returns The componet to show when there is no idp's.
 */
const EmptyIdentityProviderList = (prop) => {

    const { onAddIdentityProviderClick } = prop;

    return (
        <Stack alignItems="center" direction="column">
            <AppSelectIcon style={ { opacity: .2 } } width="150px" height="150px" />
            <p style={ { fontSize: 14, marginTop: "20px" } }>
                There are no identity providers available at the moment.
            </p>
            <Button
                appearance="primary"
                onClick={ onAddIdentityProviderClick }
                size="md"
                style={ { marginTop: "12px" } }>
                Add Identity Provider
            </Button>
        </Stack>
    );

};

/**
 * 
 * @param prop - openModal (open the modal), onSave (create the idp), onCancel (when close the modal), 
 *               template (selected template)
 * @returns Idp creation modal
 */
const IdPCreationModal = (prop) => {

    const { openModal, onSave, onCancel, template } = prop;

    const [ formValues, setFormValues ] = useState({});

    const handleModalClose = () => {
        onCancel();
    };

    const handleCreate = () => {
        onSave(formValues, template);
    };

    const resolveTemplateForm = () => {
        switch (template.templateId) {

            case GOOGLE_ID:

                return (
                    <GoogleIdentityProvider
                        formValues={ formValues }
                        onFormValuesChange={ setFormValues } />
                );
            case ENTERPRISE_ID:

                return (
                    <EnterpriseIdentityProvider
                        formValues={ formValues }
                        onFormValuesChange={ setFormValues } />
                );
        }
    };

    return (
        <Modal
            open={ openModal }
            onClose={ handleModalClose }
            onBackdropClick={ handleModalClose }>
            <Modal.Header>
                <Modal.Title><b>{ template.name }</b></Modal.Title>
                <p>{ template.description }</p>
            </Modal.Header>
            <Modal.Body>
                { resolveTemplateForm() }
            </Modal.Body>
            <Modal.Footer>
                <Button
                    onClick={ handleCreate }
                    appearance="primary">
                    Create
                </Button>
                <Button
                    onClick={ handleModalClose }
                    appearance="subtle">
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );

};

/**
 * 
 * @param prop -  onFormValuesChange, formValues
 * @returns Form to create a Google idp.
 */
const GoogleIdentityProvider = (prop) => {

    const { onFormValuesChange, formValues } = prop;

    return (
        <Form onChange={ onFormValuesChange } formValue={ formValues }>
            <Form.Group controlId="application_name">
                <Form.ControlLabel>Idp Name</Form.ControlLabel>
                <Form.Control name="application_name" />
                <Form.HelpText tooltip>Idp Name is Required</Form.HelpText>
            </Form.Group>
            <Form.Group controlId="client_id">
                <Form.ControlLabel>Client ID</Form.ControlLabel>
                <Form.Control name="client_id" type="text" autoComplete="off" />
                <Form.HelpText tooltip>Client ID is Required</Form.HelpText>
            </Form.Group>
            <Form.Group controlId="client_secret">
                <Form.ControlLabel>Client Secret</Form.ControlLabel>
                <Form.Control name="client_secret" type="password" autoComplete="off" />
                <Form.HelpText tooltip>Client Secret is Required</Form.HelpText>
            </Form.Group>
        </Form>
    );

};

/**
 * 
 * @param prop -  onFormValuesChange, formValues
 * @returns Form to create a enterprise idp.
 */
const EnterpriseIdentityProvider = (prop) => {

    const { onFormValuesChange, formValues } = prop;

    return (
        <Form onChange={ onFormValuesChange } formValue={ formValues }>
            <Form.Group controlId="application_name">
                <Form.ControlLabel>Idp Name</Form.ControlLabel>
                <Form.Control name="application_name" />
                <Form.HelpText tooltip>Idp Name is Required</Form.HelpText>
            </Form.Group>
            <Form.Group controlId="client_id">
                <Form.ControlLabel>Client ID</Form.ControlLabel>
                <Form.Control name="client_id" type="text" autoComplete="off" />
                <Form.HelpText tooltip>Client ID is Required</Form.HelpText>
            </Form.Group>
            <Form.Group controlId="client_secret">
                <Form.ControlLabel>Client Secret</Form.ControlLabel>
                <Form.Control name="client_secret" type="password" autoComplete="off" />
                <Form.HelpText tooltip>Client Secret is Required</Form.HelpText>
            </Form.Group>
            <Form.Group controlId="authorization_endpoint_url">
                <Form.ControlLabel>Authorization Endpoint URL</Form.ControlLabel>
                <Form.Control name="authorization_endpoint_url" type="url" />
                <Form.HelpText tooltip>Authorization Endpoint URL is Required</Form.HelpText>
            </Form.Group>
            <Form.Group controlId="token_endpoint_url">
                <Form.ControlLabel>Token Endpoint URL</Form.ControlLabel>
                <Form.Control name="token_endpoint_url" type="url" />
                <Form.HelpText tooltip>Token Endpoint URL is Required</Form.HelpText>
            </Form.Group>
            <Form.Group controlId="certificate">
                <Form.ControlLabel>JWKS endpoint</Form.ControlLabel>
                <Form.Control name="certificate" type="url" />
                <Form.HelpText tooltip>
                    WSO2 Identity Server will use this certificate to
                    verify the signed responses from your external IdP.
                </Form.HelpText>
            </Form.Group>
        </Form>
    );

};
