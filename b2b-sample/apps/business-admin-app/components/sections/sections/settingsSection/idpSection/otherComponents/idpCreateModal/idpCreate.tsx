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

import { infoTypeDialog } from "@b2bsample/shared/ui/ui-components";
import { CopyTextToClipboardCallback, copyTheTextToClipboard, ENTERPRISE_ID, GOOGLE_ID } from
    "@b2bsample/shared/util/util-common";
import { useState } from "react";
import { Button, FlexboxGrid, Input, InputGroup, Modal, Panel, Placeholder, Stack, useToaster } from "rsuite";
import CopyIcon from "@rsuite/icons/Copy";
import InfoRoundIcon from "@rsuite/icons/InfoRound";
import { getCallbackUrl } from "@b2bsample/business-admin-app/data-access/data-access-common-models-util";
import GoogleIdentityProvider from "./googleIdentityProvider";

interface PrerequisiteProps {
    orgId: string
}

interface IdpCreateProps {
    orgId: string,
    openModal: boolean,
}

export default function IdpCreate(prop) {

    const { session, openModal, onIdpCreate, onCancel, template, orgId } = prop;

    const [formValues, setFormValues] = useState<Record<string, string>>({});

    const handleModalClose = () => {
        onCancel();
    };

    const resolveTemplateForm = () => {
        switch (template.templateId) {

            case GOOGLE_ID:
                return <GoogleIdentityProvider
                    session={session}
                    template={template}
                    onIdpCreate={onIdpCreate}
                    onCancel={onCancel} />

            // return (
            //     <GoogleIdentityProvider
            //         formValues={formValues}
            //         onFormValuesChange={setFormValues} />
            // );
            case ENTERPRISE_ID:

            // return (
            //     <EnterpriseIdentityProvider
            //         formValues={formValues}
            //         onFormValuesChange={setFormValues} />
            // );
        }
    };

    return (
        <Modal
            open={openModal}
            onClose={handleModalClose}
            onBackdropClick={handleModalClose}
            size="md">
            <Modal.Header>
                <Modal.Title><b>{template.name}</b></Modal.Title>
                <p>{template.description}</p>
            </Modal.Header>
            <Modal.Body>
                <FlexboxGrid justify="space-between">
                    <FlexboxGrid.Item colspan={12}>
                        {resolveTemplateForm()}
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item colspan={11}>
                        <Prerequisite orgId={orgId} />
                    </FlexboxGrid.Item>
                </FlexboxGrid>

            </Modal.Body>
        </Modal>
    );
}

function Prerequisite(prop: PrerequisiteProps) {

    const { orgId } = prop;

    const toaster = useToaster();

    const copyValueToClipboard = (text) => {
        const callback: CopyTextToClipboardCallback = () => infoTypeDialog(toaster, "Text copied to clipboard");

        copyTheTextToClipboard(text, callback);
    };

    return (
        <Panel
            header={
                (<Stack alignItems="center" spacing={10}>
                    <InfoRoundIcon />
                    <b>Prerequisite</b>
                </Stack>)
            }
            bordered>
            <p>
                Before you begin, create an OAuth application, and obtain a client ID & secret.
                Add the following URL as the Authorized Redirect URI.
            </p>
            <br />
            <InputGroup >
                <Input readOnly value={getCallbackUrl(orgId)} size="lg" />
                <InputGroup.Button
                    onClick={() => copyValueToClipboard(getCallbackUrl(orgId))}>
                    <CopyIcon />
                </InputGroup.Button>
            </InputGroup>
        </Panel>
    )
}
