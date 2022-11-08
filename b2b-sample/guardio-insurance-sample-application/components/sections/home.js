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

import DashboardIcon from "@rsuite/icons/legacy/Dashboard";
import GearCircleIcon from "@rsuite/icons/legacy/GearCircle";
import React, { useState } from "react";
import { Button, Nav, Sidenav } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import DashboardSectionComponent from "./dashboardSection/dashboardSectionComponent";
import IdpSectionComponent from "./settingsSection/idpSection/idpSectionComponent";
import ManageUserSectionComponent from "./settingsSection/manageUserSection/manageUserSectionComponent";
import Custom500 from "../../pages/500";
import styles from "../../styles/Settings.module.css";
import { hideBasedOnScopes } from "../../util/util/frontendUtil/frontendUtil";
import LogoComponent from "../common/logo/logoComponent";
import SignOutModal from "../common/signOutModal";

/**
 * 
 * @param prop - orgId, name, session, colorTheme
 *
 * @returns The home section. Mainly side nav bar and the section to show other settings sections.
 */
export default function Home(prop) {

    const { name, orgId, session } = prop;

    const [ activeKeySideNav, setActiveKeySideNav ] = useState("1");
    const [ signOutModalOpen, setSignOutModalOpen ] = useState(false);

    const mainPanelComponenet = (activeKey) => {
        switch (activeKey) {
            case "1":

                return <DashboardSectionComponent orgName={ name } orgId={ orgId } session={ session } />;
            case "2-1":

                return <ManageUserSectionComponent orgName={ name } orgId={ orgId } session={ session } />;
            case "2-3":

                return <IdpSectionComponent orgName={ name } orgId={ orgId } session={ session } />;
        }
    };

    const activeKeySideNavSelect = (eventKey) => {
        setActiveKeySideNav(eventKey);
    };

    const signOutModalClose = () => {
        setSignOutModalOpen(false);
    };

    return (
        <div>
            <SignOutModal session={ session } open={ signOutModalOpen } onClose={ signOutModalClose } />
            { session && session.scope
                ? (<div className={ styles.mainDiv }>
                    <div className={ styles.sideNavDiv }>
                        <SideNavSection
                            name={ name }
                            scope={ session.scope }
                            activeKeySideNav={ activeKeySideNav }
                            activeKeySideNavSelect={ activeKeySideNavSelect }
                            setSignOutModalOpen={ setSignOutModalOpen } />
                    </div>
                    <div className={ styles.mainPanelDiv }>
                        { mainPanelComponenet(activeKeySideNav, session) }
                    </div>
                </div>)
                : <Custom500 /> }
        </div>
    );
}

function SideNavSection(prop) {

    const { name, scope, activeKeySideNav, activeKeySideNavSelect, setSignOutModalOpen } = prop;

    const signOutOnClick = () => setSignOutModalOpen(true);

    return (
        <Sidenav appearance="inverse" className={ styles.sideNav } defaultOpenKeys={ [ "3", "4" ] }>
            <Sidenav.Header>
                <div style={ { marginBottom: "25px", marginTop: "35px" } }>
                    <LogoComponent imageSize="small" name={ name } white={ true }/>
                </div>
            </Sidenav.Header>
            <Sidenav.Body>
                <Nav activeKey={ activeKeySideNav }>
                    <Nav.Item
                        eventKey="1"
                        icon={ <DashboardIcon /> }
                        onSelect={ (eventKey) => activeKeySideNavSelect(eventKey) }>
                        Dashboard
                    </Nav.Item>
                    <Nav.Menu
                        eventKey="2"
                        title="Settings"
                        icon={ <GearCircleIcon /> }
                        style={ hideBasedOnScopes(scope) }>
                        <Nav.Item
                            eventKey="2-1"
                            onSelect={ (eventKey) => activeKeySideNavSelect(eventKey) }>
                            Manage Users</Nav.Item>
                        <Nav.Item
                            eventKey="2-3"
                            onSelect={ (eventKey) => activeKeySideNavSelect(eventKey) }>
                            Identity Providers</Nav.Item>
                    </Nav.Menu>
                </Nav>
            </Sidenav.Body>
            <div className={ styles.nextButtonDiv }>
                <Button size="lg" appearance="default" onClick={ signOutOnClick }>Sign Out</Button>
            </div>
        </Sidenav>
    );
}
