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

import { SideNavItem, SideNavList } from "@pet-management-webapp/shared/data-access/data-access-common-models-util";
import { getIconFromString, hideBasedOnScopes } from "@pet-management-webapp/shared/util/util-front-end-util";
import { Button, Nav, Sidenav, Stack, Tag } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import styles from "./sidenavComponent.module.css";
import { SidenavComponentProps } from "../../models/sidenavComponent/sidenavComponent";

export function SidenavComponent(prop: SidenavComponentProps) {
    const { scope, sideNavData, activeKeySideNav, activeKeySideNavSelect, setSignOutModalOpen, logoComponent } = prop;

    const signOutOnClick = () => setSignOutModalOpen(true);

    const sideNavConfigList: SideNavList = sideNavData;

    return (
        <div className={ styles["sideNavDiv"] }>
            <Sidenav appearance="inverse" className={ styles["sideNav"] } defaultOpenKeys={ [ "1", "2", "3", "4" ] }>
                <Sidenav.Header>
                    <div className={ styles["logoComponentDiv"] }>
                        { logoComponent }
                    </div>
                </Sidenav.Header>
                <Sidenav.Body>
                    <Nav activeKey={ activeKeySideNav }>
                        {
                            sideNavConfigList.items.map((item: SideNavItem) => {

                                if (item.items) {
                                    return (
                                        <Nav.Menu
                                            eventKey={ item.eventKey }
                                            title={ item.title }
                                            icon={ getIconFromString(item.icon) }
                                            style={ item.hideBasedOnScope
                                                ? hideBasedOnScopes(scope, item.type, item.items)
                                                : {} }
                                            key={ item.eventKey }>
                                            {
                                                item.items.map((item) =>
                                                    (<Nav.Item
                                                        key={ item.eventKey }
                                                        eventKey={ item.eventKey }
                                                        onSelect={ (eventKey) =>
                                                            activeKeySideNavSelect(eventKey) }
                                                        style={ item.hideBasedOnScope
                                                            ? hideBasedOnScopes(scope, item.type, 
                                                                item.items, item.scopes)
                                                            : {} }>
                                                        <Stack spacing={ 10 }>
                                                            { item.title }
                                                            { item.new
                                                                ? <Tag><b>NEW</b></Tag>
                                                                : null }
                                                        </Stack>
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
                                            icon={ getIconFromString(item.icon) }
                                            onSelect={ (eventKey) => activeKeySideNavSelect(eventKey) }
                                            style={ item.hideBasedOnScope
                                                ? hideBasedOnScopes(scope, item.type, item.items, item.scopes)
                                                : {} }
                                        >
                                            <Stack spacing={ 10 }>
                                                { item.title }
                                                { item.new
                                                    ? <Tag><b>NEW</b></Tag>
                                                    : null }
                                            </Stack>
                                        </Nav.Item>
                                    );
                                }
                            })
                        }
                    </Nav>
                </Sidenav.Body>
                <div className={ styles["nextButtonDiv"] }>
                    <Button size="lg" appearance="default" onClick={ signOutOnClick }>Sign Out</Button>
                </div>
            </Sidenav>
        </div>
    );
}

export default SidenavComponent;
