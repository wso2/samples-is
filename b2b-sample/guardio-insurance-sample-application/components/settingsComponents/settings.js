/*
 * Copyright (c) 2022 WSO2 LLC. (http://www.wso2.com).
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

import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import GearCircleIcon from '@rsuite/icons/legacy/GearCircle';
import React, { useEffect, useState } from 'react';
import { Button, Nav, Sidenav } from 'rsuite';
import styles from '../../styles/Settings.module.css';

import { useSession } from 'next-auth/react';
import "rsuite/dist/rsuite.min.css";
import { checkCustomization, hideBasedOnScopes } from '../../util/util/frontendUtil/frontendUtil';
import { orgSignout } from '../../util/util/routerUtil/routerUtil';
import AddUserComponent from './addUserComponent';
import Application from "./application/application";
import HomeComponent from './homeComponet/homeComponent';
import IdentityProviders from "./identity-providers/identity-providers";
import LogoComponent from './logoComponent';
import ViewUserComponent from './viewUserComponent';

export default function Settings(props) {

    const SETTINGS_UI = "settings interface"

    const { data: session, status } = useSession();

    const [activeKeySideNav, setActiveKeySideNav] = useState('1');

    const signOutOnClick = () => orgSignout();

    const mainPanelComponenet = (activeKey, session) => {
        switch (activeKey) {
            case '1':
                return <HomeComponent orgName={props.name} orgId={props.orgId} session={session} />;
            case '2-1':
                return <ViewUserComponent orgName={props.name} orgId={props.orgId} session={session} />;
            case '2-2':
                return <AddUserComponent orgName={props.name} orgId={props.orgId} session={session} />;
            case '2-3':
                return <IdentityProviders orgName={props.name} orgId={props.orgId} session={session} />;
            case '3-1':
                return <Application orgName={props.name} session={session} />
        }
    }

    const activeKeySideNavSelect = (eventKey) => {
        setActiveKeySideNav(eventKey);
    }

    useEffect(() => {
        document.body.className = checkCustomization(props.colorTheme)
    }, [props.colorTheme]);

    return (

        <div className={styles.mainDiv}>
            <div className={styles.sideNavDiv}>
                <Sidenav className={styles.sideNav} defaultOpenKeys={['3', '4']}>
                    <Sidenav.Header>
                        <LogoComponent name={props.name} />
                    </Sidenav.Header>
                    <Sidenav.Body>
                        <Nav activeKey={activeKeySideNav}>
                            <Nav.Item eventKey="1" icon={<DashboardIcon />}
                                onSelect={(eventKey) => activeKeySideNavSelect(eventKey)}>
                                Dashboard
                            </Nav.Item>
                            <Nav.Menu eventKey="2" title="Settings" icon={<GearCircleIcon />}
                                style={hideBasedOnScopes(session.scope)}>
                                <Nav.Item eventKey="2-1"
                                    onSelect={(eventKey) => activeKeySideNavSelect(eventKey)}>
                                    Manage Users</Nav.Item>
                                <Nav.Item eventKey="2-2"
                                    onSelect={(eventKey) => activeKeySideNavSelect(eventKey)}>
                                    Add User</Nav.Item>
                                <Nav.Item eventKey="2-3"
                                    onSelect={(eventKey) => activeKeySideNavSelect(eventKey)}>
                                    Identity Providers</Nav.Item>
                                <Nav.Item
                                    eventKey="3-1"
                                    onSelect={(eventKey) => activeKeySideNavSelect(eventKey)}>
                                    Manage Application
                                </Nav.Item>
                            </Nav.Menu>
                        </Nav>
                    </Sidenav.Body>
                    <div className={styles.nextButtonDiv}>
                        <Button size="lg" appearance='ghost' onClick={signOutOnClick}>Sign Out</Button>
                    </div>
                </Sidenav>
            </div>
            <div className={styles.mainPanelDiv}>
                {mainPanelComponenet(activeKeySideNav, session)}
            </div>
        </div>
    )
}
