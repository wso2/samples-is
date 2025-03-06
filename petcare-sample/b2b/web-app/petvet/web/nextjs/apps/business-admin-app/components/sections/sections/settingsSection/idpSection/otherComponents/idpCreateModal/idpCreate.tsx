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

import { IdentityProvider, IdentityProviderTemplate, getIdPCallbackUrl } from
    "@pet-management-webapp/business-admin-app/data-access/data-access-common-models-util";
import { ModelHeaderComponent } from "@pet-management-webapp/shared/ui/ui-basic-components";
import { infoTypeDialog } from "@pet-management-webapp/shared/ui/ui-components";
import { CopyTextToClipboardCallback, OIDC_IDP, SAML_IDP, copyTheTextToClipboard }
    from "@pet-management-webapp/shared/util/util-common";
import CopyIcon from "@rsuite/icons/Copy";
import InfoRoundIcon from "@rsuite/icons/InfoRound";
import { Session } from "next-auth";
import { FlexboxGrid, Input, InputGroup, Modal, Panel, Stack, useToaster } from "rsuite";
import ExternalIdentityProvider from "./externalIdentityProvider";
import SAMLIdentityProvider from "./samlIdentityProvider";

interface PrerequisiteProps {
    orgId: string
}

interface IdpCreateProps {
    session: Session,
    onIdpCreate: (response: IdentityProvider) => void,
    onCancel: () => void,
    template: IdentityProviderTemplate,
    orgId: string,
    openModal: boolean,
}

/**
 * 
 * @param prop - `IdpCreateProps`
 * @returns Idp creation modal
 */
export default function IdpCreate(prop: IdpCreateProps) {

    const { session, openModal, onIdpCreate, onCancel, template, orgId } = prop;

    const handleModalClose = (): void => {
        onCancel();
    };

    const resolveTemplateForm = (): JSX.Element => {
        switch (template.templateId) {

            case OIDC_IDP:

                return (<ExternalIdentityProvider
                    session={ session }
                    template={ template }
                    onIdpCreate={ onIdpCreate }
                    onCancel={ onCancel } />);

            case SAML_IDP:

                return (<SAMLIdentityProvider
                    session={ session }
                    template={ template }
                    onIdpCreate={ onIdpCreate }
                    onCancel={ onCancel } />);

        }
    };

    return (
        <Modal
            open={ openModal }
            onClose={ handleModalClose }
            onBackdropClick={ handleModalClose }
            size="lg">
            <Modal.Header>
                <ModelHeaderComponent title={ template.name } subTitle = { template.description } />
            </Modal.Header>
            <Modal.Body>
                <FlexboxGrid justify="space-between">
                    <FlexboxGrid.Item colspan={ 14 }>
                        { resolveTemplateForm() }
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item colspan={ 9 }>
                        <Prerequisite orgId={ orgId } />
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
                (<Stack alignItems="center" spacing={ 10 }>
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
                <Input readOnly value={ getIdPCallbackUrl(orgId) } size="lg" />
                <InputGroup.Button
                    onClick={ () => copyValueToClipboard(getIdPCallbackUrl(orgId)) }>
                    <CopyIcon />
                </InputGroup.Button>
            </InputGroup>
        </Panel>
    );
}
