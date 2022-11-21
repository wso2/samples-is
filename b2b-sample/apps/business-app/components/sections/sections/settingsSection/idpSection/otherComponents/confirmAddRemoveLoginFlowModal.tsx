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

import { errorTypeDialog, successTypeDialog } from "@b2bsample/shared/ui-components";
import { checkIfJSONisEmpty } from "@b2bsample/shared/util-common";
import React, { useState } from "react";
import { Avatar, Button, Col, Grid, Loader, Modal, Row, useToaster } from "rsuite";
import stylesSettings from "../../../../../../styles/Settings.module.css";
import decodePatchApplicationAuthSteps from
    "../../../../../../util/apiDecode/settings/application/decodePatchApplicationAuthSteps";
import { PatchApplicationAuthMethod } from "../../../../../../util/util/applicationUtil/applicationUtil";
import { LOADING_DISPLAY_BLOCK, LOADING_DISPLAY_NONE } from "../../../../../../util/util/frontendUtil/frontendUtil";

/**
 * 
 * @param prop - session, applicationDetail, idpDetails, idpIsinAuthSequence, openModal, onModalClose, fetchAllIdPs
 * 
 * @returns Add/Remove from login flow button
 */
export default function ConfirmAddRemoveLoginFlowModal(prop) {

    const { session, applicationDetail, idpDetails, idpIsinAuthSequence, openModal, onModalClose, fetchAllIdPs } = prop;

    const toaster = useToaster();

    const [ loadingDisplay, setLoadingDisplay ] = useState(LOADING_DISPLAY_NONE);

    const onSubmit = async (patchApplicationAuthMethod) => {
        setLoadingDisplay(LOADING_DISPLAY_BLOCK);

        decodePatchApplicationAuthSteps(session, applicationDetail, idpDetails,
            patchApplicationAuthMethod)
            .then((response) => idpIsinAuthSequence
                ? onIdpRemovefromLoginFlow(response)
                : onIdpAddToLoginFlow(response))
            .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));
    };

    const onRemove = async () => {
        await onSubmit(PatchApplicationAuthMethod.REMOVE);
    };

    const onAdd = async () => {
        await onSubmit(PatchApplicationAuthMethod.ADD);
    };

    const onSuccess = () => {
        onModalClose();
        fetchAllIdPs().finally();
    };

    const onIdpAddToLoginFlow = (response) => {
        if (response) {
            onSuccess();
            successTypeDialog(toaster, "Success", "Identity Provider Add to the Login Flow Successfully.");
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while adding the the identity provider.");
        }
    };

    const onIdpRemovefromLoginFlow = (response) => {
        if (response) {
            onSuccess();
            successTypeDialog(toaster, "Success", "IIdentity Provider Remove from the Login Flow Successfully.");
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while removing the identity provider. Try again.");
        }
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
function ApplicationListAvailable(prop) {

    const { idpIsinAuthSequence, applicationDetail } = prop;

    return (
        <div>
            {
                idpIsinAuthSequence
                    ? <p>This will remove the Idp as an authentication step from all applicaitons</p>
                    : (<p>This will add the Idp as an authentication step to the authentication flow of the following
                        applicaiton</p>)
            }

            {
                idpIsinAuthSequence
                    ? null
                    : <ApplicationListItem application={ applicationDetail } />
            }

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
function ApplicationListItem(prop) {

    const { application } = prop;

    return (
        <div style={ { marginBottom: 15, marginTop: 15 } }>
            <Grid fluid>
                <Row>
                    <Col>
                        <Avatar>{ application.name[0] }</Avatar>
                    </Col>

                    <Col>
                        <div>{ application.name }</div>
                        <p>{ application.description }</p>
                    </Col>
                </Row>
            </Grid>
        </div>

    );
}
