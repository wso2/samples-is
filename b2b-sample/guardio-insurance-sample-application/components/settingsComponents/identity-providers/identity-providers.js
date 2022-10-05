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

import AppSelectIcon from '@rsuite/icons/AppSelect';
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Avatar, Button, Container, FlexboxGrid, Form, Modal, Stack, useToaster } from "rsuite";

import { useSession } from "next-auth/react";
import styles from "../../../styles/idp.module.css";
import decodeCreateIdentityProvider from
    '../../../util/apiDecode/settings/identityProvider/decodeCreateIdentityProvider';
import decodeListAllIdentityProviders from
    '../../../util/apiDecode/settings/identityProvider/decodeListAllIdentityProviders';
import { EMPTY_STRING, ENTERPRISE_ID, FACEBOOK_ID, GOOGLE_ID } from '../../../util/util/common/common';
import Enterprise from "../../data/templates/enterprise-identity-provider.json";
import Facebook from "../../data/templates/facebook.json";
import Google from "../../data/templates/google.json";
import { errorTypeDialog, successTypeDialog } from "../../util/dialog";
import SettingsTitle from '../../util/settingsTitle';
import IdentityProviderList from './identityProviderList';

export default function IdentityProviders() {

    const toaster = useToaster();

    const [idpList, setIdpList] = useState([]);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(undefined);
    const { data: session } = useSession();

    const templates = () => {

        return [
            Enterprise,
            Google,
            Facebook,
        ];
    };

    useEffect(() => {
        fetchAllIdPs().finally();
    }, [fetchAllIdPs]);

    const fetchAllIdPs = useCallback(async () => {

        const res = await decodeListAllIdentityProviders(session);
        if (res && res.identityProviders) {
            setIdpList(res.identityProviders);
        } else {
            setIdpList([]);
        }
    },[session]);

    const onAddIdentityProviderClick = () => {
        setOpenAddModal(true);
    };

    const onCreationDismiss = () => {
        setSelectedTemplate(undefined)
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
    }

    const onIdPSave = async (formValues, template) => {

        let name = formValues.application_name.toString();
        let clientId = formValues.client_id.toString();
        let clientSecret = formValues.client_secret.toString();

        decodeCreateIdentityProvider(session, template, name, clientId, clientSecret)
            .then((response) => onIdpCreated(response))

    };

    return (
        <Container>

            <SettingsTitle title="Identity Providers"
                subtitle="Manage identity providers to allow users to log in to your application through them." />

            <FlexboxGrid
                style={{ width: "100%", height: "60vh", marginTop: "24px" }}
                justify={idpList.length === 0 ? "center" : "start"}
                align={idpList.length === 0 ? "middle" : "top"}>
                {idpList.length === 0
                    ? <EmptyIdentityProviderList
                        onAddIdentityProviderClick={onAddIdentityProviderClick}
                    />
                    : <IdentityProviderList
                        fetchAllIdPs={fetchAllIdPs}
                        idpList={idpList}
                    />
                }
            </FlexboxGrid>
            {
                openAddModal && (
                    <AddIdentityProviderModal
                        templates={templates}
                        onClose={() => setOpenAddModal(false)}
                        openModal={openAddModal}
                        onTemplateSelected={(template) => {
                            setOpenAddModal(false);
                            setSelectedTemplate(template);
                        }}
                    />
                )
            }
            {
                selectedTemplate && (
                    <IdPCreationModal
                        onSave={onIdPSave}
                        onCancel={onCreationDismiss}
                        openModal={!!selectedTemplate}
                        template={selectedTemplate} />
                )
            }
        </Container>
    );

}

const AddIdentityProviderModal = ({ openModal, onClose, templates, onTemplateSelected }) => {

    const resolveIconName = (template) => {
        if (GOOGLE_ID === template.templateId) {

            return "google.svg";
        }
        if (FACEBOOK_ID === template.templateId) {

            return "facebook.svg";
        }
        if (ENTERPRISE_ID === template.templateId) {

            return "enterprise.svg";
        }

        return EMPTY_STRING;
    };

    return (
        <Modal open={openModal}
            onClose={onClose}
            onBackdropClick={onClose}>
            <Modal.Header>
                <Modal.Title><b>Select Identity Provider</b></Modal.Title>
                <p>Choose one of the following identity providers.</p>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <div className={styles.idp__template__list}>
                        {templates.map((template) => {

                            return (
                                <div
                                    key={template.id}
                                    className={styles.idp__template__card}
                                    onClick={() => onTemplateSelected(template)}>
                                    <div>
                                        <h5>{template.name}</h5>
                                        <small>{template.description}</small>
                                    </div>
                                    <Avatar src={`/icons/${resolveIconName(template)}`} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );

};

const EmptyIdentityProviderList = ({ onAddIdentityProviderClick }) => {

    return (
        <Stack alignItems="center" direction="column">
            <AppSelectIcon style={{ opacity: .2 }} width="150px" height="150px" />
            <p style={{ marginTop: "20px", fontSize: 14 }}>
                There are no identity providers available at the moment.
            </p>
            <Button appearance="primary"
                onClick={onAddIdentityProviderClick}
                size="md" style={{ marginTop: "12px" }}>
                Add Identity Provider
            </Button>
        </Stack>
    );

};

const IdPCreationModal = ({ openModal, onSave, onCancel, template }) => {

    const [formValues, setFormValues] = useState({});

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
                        formValues={formValues}
                        onFormValuesChange={setFormValues} />
                )
            case FACEBOOK_ID:

                return (
                    <FacebookIdentityProvider
                        formValues={formValues}
                        onFormValuesChange={setFormValues} />
                )
            case ENTERPRISE_ID:
                
                return (
                    <EnterpriseIdentityProvider
                        formValues={formValues}
                        onFormValuesChange={setFormValues} />
                )
        }
    };

    return (
        <Modal open={openModal}
            onClose={handleModalClose}
            onBackdropClick={handleModalClose}>
            <Modal.Header>
                <Modal.Title><b>{template.name}</b></Modal.Title>
                <p>{template.description}</p>
            </Modal.Header>
            <Modal.Body>
                {resolveTemplateForm()}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleCreate}
                    appearance="primary">
                    Create
                </Button>
                <Button onClick={handleModalClose}
                    appearance="subtle">
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );

};

const FacebookIdentityProvider = ({ onFormValuesChange, formValues }) => {

    return (
        <Form onChange={onFormValuesChange} formValue={formValues}>
            <Form.Group controlId="application_name">
                <Form.ControlLabel>Application Name</Form.ControlLabel>
                <Form.Control name="application_name" />
                <Form.HelpText tooltip>Application Name is Required</Form.HelpText>
            </Form.Group>
            <Form.Group controlId="application_id">
                <Form.ControlLabel>Application ID</Form.ControlLabel>
                <Form.Control name="application_id" type="text" autoComplete="off" />
                <Form.HelpText tooltip>Application ID is Required</Form.HelpText>
            </Form.Group>
            <Form.Group controlId="application_secret">
                <Form.ControlLabel>Application Secret</Form.ControlLabel>
                <Form.Control name="application_secret" type="password" autoComplete="off" />
                <Form.HelpText tooltip>Application Secret is Required</Form.HelpText>
            </Form.Group>
        </Form>
    );

}

const GoogleIdentityProvider = ({ onFormValuesChange, formValues }) => {

    return (
        <Form onChange={onFormValuesChange} formValue={formValues}>
            <Form.Group controlId="application_name">
                <Form.ControlLabel>Application Name</Form.ControlLabel>
                <Form.Control name="application_name" />
                <Form.HelpText tooltip>Application Name is Required</Form.HelpText>
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

const EnterpriseIdentityProvider = ({ onFormValuesChange, formValues }) => {

    return (
        <Form onChange={onFormValuesChange} formValue={formValues}>
            <Form.Group controlId="application_name">
                <Form.ControlLabel>Application Name</Form.ControlLabel>
                <Form.Control name="application_name" />
                <Form.HelpText tooltip>Application Name is Required</Form.HelpText>
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
                <Form.Control name="authorization_endpoint_url" type="text" />
                <Form.HelpText tooltip>Authorization Endpoint URL is Required</Form.HelpText>
            </Form.Group>
            <Form.Group controlId="token_endpoint_url">
                <Form.ControlLabel>Token Endpoint URL</Form.ControlLabel>
                <Form.Control name="token_endpoint_url" type="text" />
                <Form.HelpText tooltip>Token Endpoint URL is Required</Form.HelpText>
            </Form.Group>
            <Form.Group controlId="certificate">
                <Form.ControlLabel>IdP Certificate (PEM)</Form.ControlLabel>
                <Form.Control name="certificate" type="text" />
                <Form.HelpText tooltip>
                    WSO2 Identity Server will use this certificate to
                    verify the signed responses from your external IdP.
                </Form.HelpText>
            </Form.Group>
        </Form>
    );

}
