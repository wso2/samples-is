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

import { Application, IdentityProvider, PatchApplicationAuthMethod } from
    "@pet-management-webapp/business-admin-app/data-access/data-access-common-models-util";
import { controllerDecodePatchApplicationAuthSteps } from
    "@pet-management-webapp/business-admin-app/data-access/data-access-controller";
import { errorTypeDialog, successTypeDialog } from "@pet-management-webapp/shared/ui/ui-components";
import { checkIfJSONisEmpty } from "@pet-management-webapp/shared/util/util-common";
import { LOADING_DISPLAY_BLOCK, LOADING_DISPLAY_NONE } from "@pet-management-webapp/shared/util/util-front-end-util";
import { Session } from "next-auth";
import React, { useState } from "react";
import { Avatar, Button, Col, Grid, Loader, Modal, Row, Toaster, useToaster } from "rsuite";
import stylesSettings from "../../../../../../styles/Settings.module.css";

interface ApplicationListItemProps {
    applicationDetail: Application
}

interface ApplicationListAvailableProps {
    applicationDetail: Application,
    idpIsinAuthSequence: boolean
}

interface ConfirmAddRemoveLoginFlowModalProps {
    session: Session,
    applicationDetail: Application,
    idpDetails: IdentityProvider,
    idpIsinAuthSequence: boolean,
    openModal: boolean,
    onModalClose: () => void,
    fetchAllIdPs: () => Promise<void>
}

/**
 * 
 * @param prop - session, applicationDetail, idpDetails, idpIsinAuthSequence, openModal, onModalClose, fetchAllIdPs
 * 
 * @returns Add/Remove from login flow button
 */
export default function ConfirmAddRemoveLoginFlowModal(props: ConfirmAddRemoveLoginFlowModalProps) {

    const { session, applicationDetail, idpDetails, idpIsinAuthSequence, openModal, onModalClose, fetchAllIdPs }
        = props;

    const toaster: Toaster = useToaster();

    const [ loadingDisplay, setLoadingDisplay ] = useState(LOADING_DISPLAY_NONE);

    const onSuccess = (): void => {
        onModalClose();
        fetchAllIdPs().finally();
    };

    const onIdpAddToLoginFlow = (response: boolean): void => {
        if (response) {
            onSuccess();
            successTypeDialog(toaster, "Success", "Identity Provider Add to the Login Flow Successfully.");
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while adding the the identity provider.");
        }
    };

    const onIdpRemovefromLoginFlow = (response: boolean): void => {
        if (response) {
            onSuccess();
            successTypeDialog(toaster, "Success", "Identity Provider Remove from the Login Flow Successfully.");
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while removing the identity provider. Try again.");
        }
    };

    const onSubmit = async (patchApplicationAuthMethod): Promise<void> => {
        setLoadingDisplay(LOADING_DISPLAY_BLOCK);

        controllerDecodePatchApplicationAuthSteps(session, applicationDetail, idpDetails,
            patchApplicationAuthMethod)
            .then((response) => idpIsinAuthSequence
                ? onIdpRemovefromLoginFlow(response)
                : onIdpAddToLoginFlow(response))
            .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));
    };

    const onRemove = async (): Promise<void> => {
        await onSubmit(PatchApplicationAuthMethod.REMOVE);
    };

    const onAdd = async (): Promise<void> => {
        await onSubmit(PatchApplicationAuthMethod.ADD);
    };

    return (
        <Modal
            open={ openModal }
            onClose={ onModalClose }>
            <Modal.Header>
                <Modal.Title><b>
                    {
                        idpIsinAuthSequence
                            ? "Remove Identity Provider from the Login Flow"
                            : "Add Identity Provider to the Login Flow"
                    }
                </b></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    checkIfJSONisEmpty(applicationDetail)
                        ? <EmptySelectApplicationBody />
                        : (<ApplicationListAvailable
                            applicationDetail={ applicationDetail }
                            idpIsinAuthSequence={ idpIsinAuthSequence } />)
                }
            </Modal.Body>
            <Modal.Footer>
                <Button
                    onClick={ idpIsinAuthSequence ? onRemove : onAdd }
                    className={ stylesSettings.addUserButton }
                    appearance="primary">
                    Confirm
                </Button>
                <Button onClick={ onModalClose } className={ stylesSettings.addUserButton } appearance="ghost">
                    Cancel
                </Button>
            </Modal.Footer>

            <div style={ loadingDisplay }>
                <Loader size="lg" backdrop content="Idp is adding to the login flow" vertical />
            </div>

        </Modal >
    );
}

/**
 * 
 * @returns When then `config.ManagementAPIConfig.SharedApplicationName` is not the correct applicaiton, 
 * it will show this section
 */
function EmptySelectApplicationBody() {

    return (
        <div >
            <p>No Application Available</p>
            <div style={ { marginLeft: "5px" } }>
                <div>Create an application from the WSO2 IS or Asgardeo Console app to add authentication.</div>
                <p>For more details check out the following links</p>
                <ul>
                    <li>
                        <a href="https://wso2.com/asgardeo/docs/guides/applications/" target="_blank" rel="noreferrer">
                            Add application from Asgardeo Console
                        </a>
                    </li>
                </ul>
            </div>

        </div>
    );
}

/**
 * 
 * @param prop - idpIsinAuthSequence, applicationDetail
 * 
 * @returns  When then config.ManagementAPIConfig.SharedApplicationName is the correct applicaiton, 
 * it will show this section 
 */
function ApplicationListAvailable(props: ApplicationListAvailableProps) {

    const { idpIsinAuthSequence, applicationDetail } = props;

    return (
        <div>
            {
                idpIsinAuthSequence
                    ? (<p>This will remove the Idp as an authentication step from the following
                    applicaiton</p>)
                    : (<p>This will add the Idp as an authentication step to the authentication flow of the following
                        applicaiton</p>)
            }

<ApplicationListItem applicationDetail={ applicationDetail } />

            <p>Please confirm your action to procced</p>

        </div>
    );

}

/**
 * 
 * @param prop - application
 * 
 * @returns The component to show the applicaiton name and the description
 */
function ApplicationListItem(props: ApplicationListItemProps) {

    const { applicationDetail } = props;

    return (
        <div style={ { marginBottom: 15, marginTop: 15 } }>
            <Grid fluid>
                <Row>
                    <Col>
                        <Avatar>{ applicationDetail.name[0] }</Avatar>
                    </Col>

                    <Col>
                        <div>{ applicationDetail.name }</div>
                        <p>{ applicationDetail.description }</p>
                    </Col>
                </Row>
            </Grid>
        </div>

    );
}
