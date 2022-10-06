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

import React, { useState } from 'react';
import { Avatar, Button, Col, Grid, Loader, Modal, Row, useToaster } from 'rsuite';
import stylesSettings from '../../../styles/Settings.module.css';
import decodePatchApplicationAuthSteps from '../../../util/apiDecode/settings/application/decodePatchApplicationAuthSteps';
import { PatchApplicationAuthMethod } from '../../../util/util/applicationUtil/applicationUtil';
import { checkIfJSONisEmpty } from '../../../util/util/common/common';
import { LOADING_DISPLAY_BLOCK, LOADING_DISPLAY_NONE } from '../../../util/util/frontendUtil/frontendUtil';
import { errorTypeDialog, successTypeDialog } from '../../util/dialog';

export default function ConfirmAddRemoveLoginFlowModal(props) {

    const toaster = useToaster();

    const [loadingDisplay, setLoadingDisplay] = useState(LOADING_DISPLAY_NONE);

    const onSubmit = async (patchApplicationAuthMethod) => {
        setLoadingDisplay(LOADING_DISPLAY_BLOCK);

        decodePatchApplicationAuthSteps(props.session, props.applicationDetail, props.idpDetails,
            patchApplicationAuthMethod)
            .then((response) => props.idpIsinAuthSequence
                ? onIdpRemovefromLoginFlow(response)
                : onIdpAddToLoginFlow(response))
            .finally((response) => setLoadingDisplay(LOADING_DISPLAY_NONE));
    }

    const onRemove = async () => {
        await onSubmit(PatchApplicationAuthMethod.REMOVE);
    }

    const onAdd = async () => {
        await onSubmit(PatchApplicationAuthMethod.ADD);
    }

    const onSuccess = () => {
        props.onModalClose();
        props.fetchAllIdPs().finally();
    }

    const onIdpAddToLoginFlow = (response) => {
        if (response) {
            onSuccess();
            successTypeDialog(toaster, "Success", "Identity Provider Add to the Login Flow Successfully.");
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while adding the the identity provider.");
        }
    }

    const onIdpRemovefromLoginFlow = (response) => {
        if (response) {
            onSuccess();
            successTypeDialog(toaster, "Success", "IIdentity Provider Remove from the Login Flow Successfully.");
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while removing the identity provider. Try again.");
        }
    }

    return (

        <Modal
            open={props.openModal}
            onClose={props.onModalClose}>
            <Modal.Header>
                <Modal.Title><b>
                    {
                        props.idpIsinAuthSequence
                            ? "Remove Identity Provider from the Login Flow"
                            : "Add Identity Provider to the Login Flow"
                    }
                </b></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    checkIfJSONisEmpty(props.applicationDetail)
                        ? <EmptySelectApplicationBody />
                        : <ApplicationListAvailable applicationDetail={props.applicationDetail}
                            idpIsinAuthSequence={props.idpIsinAuthSequence} />
                }
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.idpIsinAuthSequence ? onRemove : onAdd} className={stylesSettings.addUserButton} appearance="primary">
                    Confirm
                </Button>
                <Button onClick={props.onModalClose} className={stylesSettings.addUserButton} appearance="ghost">
                    Cancel
                </Button>
            </Modal.Footer>

            <div style={loadingDisplay}>
                <Loader size="lg" backdrop content="Idp is adding to the login flow" vertical />
            </div>

        </Modal >
    )
}

function EmptySelectApplicationBody() {

    return (
        <div >
            <p>No Applications Available</p>
            <div style={{ marginLeft: "5px" }}>
                <div>Create an application from the WSO2 IS or Asgardeo console to add authentication.</div>
                <p>For more details check out the following links</p>
                <ul>
                    <li>
                        <a href='https://wso2.com/asgardeo/docs/guides/applications/' target="_blank">
                            Add application from Asgardeo console
                        </a>
                    </li>
                </ul>
            </div>


        </div>
    )
}

function ApplicationListAvailable(props) {

    return (
        <div>
            {
                props.idpIsinAuthSequence
                    ? <p>This will remove the Idp as an authentication step from all applicaitons</p>
                    : <p>This will add the Idp as an authentication step to the authentication flow of the following
                        applicaiton</p>
            }

            {
                props.idpIsinAuthSequence
                    ? <></>
                    : <ApplicationListItem application={props.applicationDetail} />
            }

            <p>Please confirm your action to procced</p>

        </div>
    );

}

function ApplicationListItem(props) {

    return (
        <div style={{ marginTop: 15, marginBottom: 15 }}>
            <Grid fluid>
                <Row>
                    <Col>
                        <Avatar>{props.application.name[0]}</Avatar>
                    </Col>

                    <Col>
                        <div>{props.application.name}</div>
                        <p>{props.application.description}</p>
                    </Col>
                </Row>
            </Grid>
        </div>

    )
}
