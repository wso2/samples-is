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

import { IdentityProvider, IdentityProviderTemplate } from
    "@b2bsample/business-admin-app/data-access/data-access-common-models-util";
import { controllerDecodeListAllIdentityProviders } from
    "@b2bsample/business-admin-app/data-access/data-access-controller";
import { EmptySettingsComponent, SettingsTitleComponent, errorTypeDialog, successTypeDialog } from
    "@b2bsample/shared/ui/ui-components";
import AppSelectIcon from "@rsuite/icons/AppSelect";
import { Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";
import { Container, useToaster } from "rsuite";
import IdentityProviderList from "./otherComponents/identityProviderList";
import IdpCreate from "./otherComponents/idpCreateModal/idpCreate";
import SelectIdentityProvider from "./otherComponents/selectIdentityProvider";
import Enterprise from
    // eslint-disable-next-line
    "../../../../../../../libs/business-admin-app/data-access/data-access-common-models-util/src/lib/identityProvider/data/templates/enterprise-identity-provider.json";
import Google from
    // eslint-disable-next-line    
    "../../../../../../../libs/business-admin-app/data-access/data-access-common-models-util/src/lib/identityProvider/data/templates/google.json";

interface IdpSectionComponentProps {
    session: Session
}

/**
 * 
 * @param prop - session
 * 
 * @returns The idp interface section.
 */
export default function IdpSectionComponent(props: IdpSectionComponentProps) {

    const { session } = props;

    const toaster = useToaster();

    const [ idpList, setIdpList ] = useState<IdentityProvider[]>([]);
    const [ openSelectModal, setOpenSelectModal ] = useState<boolean>(false);
    const [ selectedTemplate, setSelectedTemplate ] = useState<IdentityProviderTemplate>(undefined);

    const templates: IdentityProviderTemplate[] = [
        Enterprise,
        Google
    ];

    const fetchAllIdPs = useCallback(async () => {

        const res = await controllerDecodeListAllIdentityProviders(session);

        if (res) {
            setIdpList(res);
        } else {
            setIdpList([]);
        }

    }, [ session ]);

    useEffect(() => {
        fetchAllIdPs();
    }, [ fetchAllIdPs ]);

    const onAddIdentityProviderClick = (): void => {
        setOpenSelectModal(true);
    };

    const onTemplateSelect = (template: IdentityProviderTemplate): void => {
        setOpenSelectModal(false);
        setSelectedTemplate(template);
    };

    const onSelectIdpModalClose = (): void => {
        setOpenSelectModal(false);
    };

    const onCreationDismiss = (): void => {
        setSelectedTemplate(undefined);
    };

    const onIdpCreated = (response: IdentityProvider): void => {
        if (response) {
            successTypeDialog(toaster, "Success", "Identity Provider Created Successfully");

            setIdpList([
                ...idpList,
                response
            ]);

            setOpenSelectModal(false);
            setSelectedTemplate(undefined);
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while creating the identity provider. Try again.");
        }
    };

    return (
        <Container>

            <SettingsTitleComponent
                title="Identity Providers"
                subtitle="Manage identity providers to allow users to log in to your application through them." />

            {
                idpList
                    ? idpList.length === 0
                        ? (<EmptySettingsComponent
                            bodyString="There are no identity providers available at the moment."
                            buttonString="Add Identity Provider"
                            icon={ <AppSelectIcon style={ { opacity: .2 } } width="150px" height="150px" /> }
                            onAddButtonClick={ onAddIdentityProviderClick }
                        />)
                        : (<IdentityProviderList
                            fetchAllIdPs={ fetchAllIdPs }
                            idpList={ idpList }
                            session={ session }
                        />)
                    : null
            }

            {
                openSelectModal && (
                    <SelectIdentityProvider
                        templates={ templates }
                        onClose={ onSelectIdpModalClose }
                        openModal={ openSelectModal }
                        onTemplateSelected={ onTemplateSelect }
                    />
                )
            }
            {
                selectedTemplate && (
                    <IdpCreate
                        session={ session }
                        onIdpCreate={ onIdpCreated }
                        onCancel={ onCreationDismiss }
                        openModal={ !!selectedTemplate }
                        template={ selectedTemplate }
                        orgId={ session.orgId } />
                )
            }
        </Container>
    );

}
