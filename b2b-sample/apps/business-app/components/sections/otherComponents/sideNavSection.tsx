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

import { hideBasedOnScopes } from "@b2bsample/business-app/util/util-front-end-util";
import { LogoComponent } from "@b2bsample/shared/ui/ui-components";
import DashboardIcon from "@rsuite/icons/legacy/Dashboard";
import GearCircleIcon from "@rsuite/icons/legacy/GearCircle";
import React from "react";
import { Button, Nav, Sidenav } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import styles from "../../../styles/Settings.module.css";
import sideNavConfig from "../data/sideNav.json";

/**
 * 
 * @param prop - `name`, `scope`, `activeKeySideNav`, `activeKeySideNavSelect`, `setSignOutModalOpen`
 * 
 * @returns side navigation component
 */
export default function SideNavSection(prop) {

    const { name, scope, activeKeySideNav, activeKeySideNavSelect, setSignOutModalOpen } = prop;

    const signOutOnClick = () => setSignOutModalOpen(true);

    const getIcon = (iconString) => {
        switch (iconString) {
            case "DashboardIcon":

                return (<DashboardIcon />);
            case "GearCircleIcon":

                return (<GearCircleIcon />);
            default:
                break;
        }
    };

    return (
        <Sidenav appearance="inverse" className={ styles.sideNav } defaultOpenKeys={ [ "3", "4" ] }>
            <Sidenav.Header>
                <div style={ { marginBottom: "25px", marginTop: "35px" } }>
                    <LogoComponent imageSize="small" name={ name } white={ true } />
                </div>
            </Sidenav.Header>
            <Sidenav.Body>
                <Nav activeKey={ activeKeySideNav }>
                    {
                        sideNavConfig.items.map((item) => {

                            if (item.items) {
                                return (
                                    <Nav.Menu
                                        eventKey={ item.eventKey }
                                        title={ item.title }
                                        icon={ getIcon(item.icon) }
                                        style={ item.hideBasedOnScope ? hideBasedOnScopes(scope) : {} }
                                        key={ item.eventKey }>
                                        {
                                            item.items.map((item) =>
                                                (<Nav.Item
                                                    key={ item.eventKey }
                                                    eventKey={ item.eventKey }
                                                    onSelect={ (eventKey) => activeKeySideNavSelect(eventKey) }>
                                                    { item.title }
                                                </Nav.Item>)
                                            )
                                        }
                                    </Nav.Menu>
                                );
                            } else {
                                return (
                                    <Nav.Item
                                        key={ item.eventKey }
                                        eventKey={ item.eventKey }
                                        icon={ getIcon(item.icon) }
                                        onSelect={ (eventKey) => activeKeySideNavSelect(eventKey) }>
                                        { item.title }
                                    </Nav.Item>
                                );
                            }
                        })
                    }
                </Nav>
            </Sidenav.Body>
            <div className={ styles.nextButtonDiv }>
                <Button size="lg" appearance="default" onClick={ signOutOnClick }>Sign Out</Button>
            </div>
        </Sidenav>
    );
}
