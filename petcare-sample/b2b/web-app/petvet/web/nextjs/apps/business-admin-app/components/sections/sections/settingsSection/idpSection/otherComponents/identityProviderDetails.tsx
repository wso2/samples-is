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

import { IdentityProvider, getImageForTheIdentityProvider, selectedTemplateBaesedonTemplateId } from
    "@pet-management-webapp/business-admin-app/data-access/data-access-common-models-util";
import { controllerDecodeGetDetailedIdentityProvider } from
    "@pet-management-webapp/business-admin-app/data-access/data-access-controller";
import { AccordianItemHeaderComponent, JsonDisplayComponent } from "@pet-management-webapp/shared/ui/ui-components";
import { SAML_IDP } from "@pet-management-webapp/shared/util/util-common";
import CodeIcon from "@rsuite/icons/Code";
import { Session } from "next-auth";
import React, { useCallback, useEffect, useState } from "react";
import { Nav, Panel, Stack } from "rsuite";
import ButtonGroupIdentityProviderDetails from "./buttonGroupIdentityProviderDetails";
import Attributes from "./idpDetailsSections/attributes";
import General from "./idpDetailsSections/general";
import Groups from "./idpDetailsSections/groups";
import Roles from "./idpDetailsSections/roles";
import Settings from "./idpDetailsSections/settings";

interface IdentityProviderDetailsProps {
    session: Session
    id: string
    fetchAllIdPs: () => Promise<void>
}

/**
 * 
 * @param prop - session, id (idp id), fetchAllIdPs (function to fetch all Idps)
 * 
 * @returns idp item details component
 */
export default function IdentityProviderDetails(props: IdentityProviderDetailsProps) {

    const { session, id, fetchAllIdPs } = props;

    const [ idpDetails, setIdpDetails ] = useState<IdentityProvider>(null);
    const [ activeKeyNav, setActiveKeyNav ] = useState<string>("1");

    const fetchData = useCallback(async () => {
        const res: IdentityProvider = await controllerDecodeGetDetailedIdentityProvider(session, id);

        setIdpDetails(res);
    }, [ session, id ]);

    useEffect(() => {
        fetchData();
    }, [ fetchData ]);

    const activeKeyNavSelect = (eventKey): void => {
        setActiveKeyNav(eventKey);
    };

    const idpDetailsComponent = (activeKey): JSX.Element => {
        switch (activeKey) {
            case "1":

                return <General session={ session } idpDetails={ idpDetails } fetchData={ fetchData } />;
            case "2":

                return <Settings session={ session } idpDetails={ idpDetails } />;
            case "3":

                return <JsonDisplayComponent jsonObject={ idpDetails } />;
            case "4":

                return <Groups session={ session } idpDetails={ idpDetails } fetchData={ fetchData } />;
            case "5":

                return <Roles session={ session } idpDetails={ idpDetails } fetchData={ fetchData } />;
            case "6":

                return <Attributes session={ session } idpDetails={ idpDetails } fetchData={ fetchData } />;
        }
    };

    return (

        idpDetails
            ? (<Panel
                header={
                    (<AccordianItemHeaderComponent
                        imageSrc={ getImageForTheIdentityProvider(idpDetails.templateId) }
                        title={ idpDetails.name }
                        description={ idpDetails.description } />)
                }
                eventKey={ id }
                id={ id }>
                <div style={ { marginLeft: "25px", marginRight: "25px" } }>
                    <Stack direction="column" alignItems="stretch">
                        <ButtonGroupIdentityProviderDetails
                            session={ session }
                            id={ id }
                            fetchAllIdPs={ fetchAllIdPs }
                            idpDetails={ idpDetails } />
                        <IdentityProviderDetailsNav
                            activeKeyNav={ activeKeyNav }
                            idpDetails={ idpDetails }
                            activeKeyNavSelect={ activeKeyNavSelect } />
                        <div>
                            { idpDetailsComponent(activeKeyNav) }
                        </div>
                    </Stack>
                </div>
            </Panel>)
            : null
    );
}

/**
 * 
 * @param prop - `idpDetails`, `activeKeyNav`, `activeKeyNavSelect`
 * 
 * @returns navigation component of idp details
 */
function IdentityProviderDetailsNav(prop) {

    const { idpDetails, activeKeyNav, activeKeyNavSelect } = prop;

    const templateIdCheck = (): boolean => {
        const selectedTemplate = selectedTemplateBaesedonTemplateId(idpDetails.templateId);

        if (selectedTemplate) {
            return true;
        } else {
            return false;
        }
    };

    return (
        <Nav appearance="subtle" activeKey={ activeKeyNav } style={ { marginBottom: 10, marginTop: 15 } }>
            <div
                style={ {
                    alignItems: "stretch",
                    display: "flex"
                } }>
                <Nav.Item
                    eventKey="1"
                    onSelect={ (eventKey) => activeKeyNavSelect(eventKey) }>General</Nav.Item>

                {
                    templateIdCheck()
                        ? (<Nav.Item
                            eventKey="2"
                            onSelect={ (eventKey) => activeKeyNavSelect(eventKey) }>
                            Settings
                        </Nav.Item>)
                        : null
                }

                <Nav.Item
                    eventKey="4"
                    onSelect={ (eventKey) => activeKeyNavSelect(eventKey) }>
                    Groups
                </Nav.Item>
                <Nav.Item
                    eventKey="5"
                    onSelect={ (eventKey) => activeKeyNavSelect(eventKey) }>
                    Roles
                </Nav.Item>

                {
                    idpDetails?.templateId === SAML_IDP && (
                        <Nav.Item
                            eventKey="6"
                            onSelect={ (eventKey) => activeKeyNavSelect(eventKey) }>
                            Attributes
                        </Nav.Item>
                    )
                }

                <div style={ { flexGrow: "1" } }></div>

                <Nav.Item
                    eventKey="3"
                    onSelect={ (eventKey) => activeKeyNavSelect(eventKey) }
                    icon={ <CodeIcon /> }>
                    Developer Tools
                </Nav.Item>
            </div>

        </Nav>
    );
}
