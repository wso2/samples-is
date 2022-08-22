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

import Plus from '@rsuite/icons/Plus';
import Trash from '@rsuite/icons/Trash';
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Button, Container, IconButton, Loader, Modal, Nav, Stack } from "rsuite";
import config from '../../../config.json';
import { getApplicationDetails, listApplications, patchApplication } from "./api";

import { getDetailedIdentityProvider, listAllIdentityProviders } from "../identity-providers/api";
import styles from "../../../styles/app.module.css";

export default function Application() {

    const [active, setActive] = useState('sign-on-methods');
    const [application, setApplication] = useState(undefined);
    const [openModal, setOpenModal] = useState(false);
    const [activeStep, setActiveStep] = useState(undefined);
    const [steps, setSteps] = useState([]);
    const [idpList, setIdpList] = useState([]);
    const [loading, setLoading] = useState(false);
    const {data: session} = useSession();

    useEffect(() => {
        fetchApplication().finally();
    }, []);

    useEffect(() => {
        setOpenModal(!!activeStep);
    }, [activeStep]);

    useEffect(() => {
        setSteps(application?.authenticationSequence.steps);
    }, [application?.authenticationSequence.steps]);

    const fetchApplication = async () => {

        loadIdentityProviders().finally();

        try {
            const res = await listApplications({
                limit: 30, offset: 0, session
            });

            if (res && res["applications"]) {
                // FIXME: once API changes are done.
                // { access, id, inboundKey?, name, self }
                // `clientId` for OIDC and `issuer` for SAML
                const app = res.applications.find((app) => app &&
                    app["inboundKey"] &&
                    app["inboundKey"] === config.WSO2IS_CLIENT_ID
                );

                const detail = await getApplicationDetails({
                    id: app["id"],
                    session
                });

                setApplication(detail);
                console.log(detail);
            }
        } catch (error) {
            console.error(error);
        }

    };

    const loadIdentityProviders = async () => {

        const res = await listAllIdentityProviders({
            session, offset: 0, limit: 20
        });

        if (res && res.identityProviders) {
            setIdpList(res.identityProviders);
        } else {
            setIdpList([]);
        }

    };

    const onOptionsAddClick = (step) => {
        setActiveStep(step);
    };

    const onOptionsModalCloseClick = (step) => {
        if (step) {
            setOpenModal(false);
            setActiveStep(undefined);
        }
    };

    const onIdPSelected = async (idp) => {

        const FIRST_AUTHENTICATOR = 0;
        const details = await getDetailedIdentityProvider({id: idp.id, session});
        const authenticator = details.federatedAuthenticators.authenticators[FIRST_AUTHENTICATOR];

        /**
         * This sample application will override the rest of
         * steps which are added from other APIs/Dashboards.
         * @type {*[]}
         */
        const authenticationSequence = {...application.authenticationSequence};

        const existingProvidersInFirstStep = new Set(
            authenticationSequence.steps[0].options
                .map(({idp}) => idp)
                .filter(name => name !== "LOCAL")
        );

        if (existingProvidersInFirstStep.has(idp.name)) {
            alert("already exists!")
            return;
        }

        const updatedSequence = Object.assign(authenticationSequence, {
            steps: [
                {
                    id: 1,
                    options: [
                        {idp: 'LOCAL', authenticator: 'BasicAuthenticator'},
                        {idp: idp.name, authenticator: authenticator.name}
                    ],
                }
            ]
        });

        setApplication({
            ...Object.assign(application, {
                authenticationSequence: updatedSequence
            })
        });

        setActiveStep(undefined);
        setOpenModal(false);

    };

    const onIdPRemovedFromSequence = (step, option) => {

        const authenticationSequence = {...application.authenticationSequence};
        const updatedOptions = step.options.filter(o => o.idp !== option.idp);

        const updatedSequence = Object.assign(authenticationSequence, {
            steps: [
                {
                    id: 1,
                    options: updatedOptions,
                }
            ]
        });

        setApplication({
            ...Object.assign(application, {
                authenticationSequence: updatedSequence
            })
        });

    };

    const onUpdateAuthenticationSeqClick = async () => {

        const res = await patchApplication({
            id: application.id,
            partial: application,
            session
        });

        console.log(res);

    };

    return (
        <Container>
            <Stack justifyContent="space-between">
                <Stack direction="column" alignItems="flex-start">
                    <h2>Manage Application</h2>
                    <p>Configure sign-on methods and advanced settings.</p>
                </Stack>
            </Stack>
            <div style={{marginTop: '24px'}}>
                <Nav activeKey={active} onSelect={setActive} style={{marginBottom: 50}} appearance="tabs">
                    <Nav.Item eventKey="sign-on-methods">Sign-on Methods</Nav.Item>
                    <Nav.Item eventKey="advanced">Advanced</Nav.Item>
                </Nav>
            </div>
            <div>
                {
                    (application && steps?.length) && steps
                        .filter(({options}) => options.length > 0)
                        .map((step) => (
                            <Step
                                key={step.id}
                                application={application}
                                step={step}
                                onOptionsAdd={onOptionsAddClick}
                                onOptionDelete={
                                    (option, index) =>
                                        onIdPRemovedFromSequence(step, option, index)
                                }
                            />
                        ))
                }
            </div>
            <Stack style={{marginTop: 20}}>
                <Button
                    onClick={onUpdateAuthenticationSeqClick}
                    appearance="primary" size="lg">
                    Update
                </Button>
            </Stack>
            <AuthenticatorSelectionModal
                idpList={idpList}
                openModal={openModal}
                handleModalClose={onOptionsModalCloseClick}
                handleAdd={onIdPSelected}
            />
            {loading && <Loader
                backdrop size="lg"
                style={{zIndex: 1000}}
                content="loading..."
                vertical/>
            }
        </Container>
    );

};

export const AuthenticatorSelectionModal = ({openModal, handleModalClose, idpList, handleAdd}) => {

    return (
        <Modal open={openModal}
               onClose={handleModalClose}
               onBackdropClick={handleModalClose}>
            <Modal.Header>
                <Modal.Title>Add Authentication</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className={styles.idp_option_list}>
                    {idpList.map((idp) => {
                        return (
                            <div
                                key={idp.id}
                                className={styles.idp_option}
                                onClick={() => handleAdd(idp)}>
                                <div>
                                    <h5>{idp.name}</h5>
                                    <small>{idp.id}</small>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleModalClose}
                        appearance="subtle">
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );

};

export const Step = ({application: _, step, onOptionDelete, onOptionsAdd}) => {

    return (
        <div className={styles.step_wrapper}>
            <div className={styles.step_name}>Step {step && step.id}</div>
            <div className={styles.step}>
                {step && step.options.map((option, index) => (
                    <div className={styles.option_wrapper} key={index}>
                        <div className={styles.option}>
                            {option.authenticator}
                            {option.idp !== "LOCAL" && <IconButton
                                onClick={() => onOptionDelete(option, index)}
                                size="xs"
                                icon={<Trash/>}
                            />}
                        </div>
                        {index < step.options.length - 1 && (
                            <span style={{fontSize: "12px"}}>OR</span>
                        )}
                    </div>
                ))}
            </div>
            <div
                className={styles.option_add_button}
                onClick={() => onOptionsAdd(step)}>
                <Plus/>
            </div>
        </div>
    );

};



