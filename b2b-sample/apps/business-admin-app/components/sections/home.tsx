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

import { LogoComponent } from "@b2bsample/business-admin-app/ui/ui-components";
import { FooterComponent, HomeComponent, SignOutComponent } from "@b2bsample/shared/ui/ui-components";
import { signout } from "@b2bsample/business-admin-app/util/util-authorization-config-util";
import React, { useState } from "react";
import "rsuite/dist/rsuite.min.css";
import IdpSectionComponent from "./sections/settingsSection/idpSection/idpSectionComponent";
import ManageUserSectionComponent from "./sections/settingsSection/manageUserSection/manageUserSectionComponent";
import RoleManagementSectionComponent from
    "./sections/settingsSection/roleManagementSection/roleManagementSectionComponent";
import Custom500 from "../../pages/500";
import sideNavData from "../../../../libs/business-admin-app/ui/ui-assets/src/lib/data/sideNav.json";


/**
 * 
 * @param prop - orgId, name, session, colorTheme
 *
 * @returns The home section. Mainly side nav bar and the section to show other settings sections.
 */
export default function Home(prop) {

    const { name, orgId, session } = prop;

    const [activeKeySideNav, setActiveKeySideNav] = useState("2-1");
    const [signOutModalOpen, setSignOutModalOpen] = useState(false);

    const mainPanelComponenet = (activeKey) => {
        switch (activeKey) {
            case "2-1":

                return <ManageUserSectionComponent orgName={name} orgId={orgId} session={session} />;
            case "2-2":

                return <RoleManagementSectionComponent orgName={name} orgId={orgId} session={session} />;
            case "2-3":

                return <IdpSectionComponent orgName={name} orgId={orgId} session={session} />;
        }
    };

    const signOutCallback = () => {
        signout(session);
    };

    const activeKeySideNavSelect = (eventKey) => {
        setActiveKeySideNav(eventKey);
    };

    const signOutModalClose = () => {
        setSignOutModalOpen(false);
    };

    return (
        <div>
            <SignOutComponent
                open={signOutModalOpen}
                onClose={signOutModalClose}
                signOutCallback={signOutCallback} />

            {session && session.scope
                ? (

                    <HomeComponent
                        scope={session.scope}
                        sideNavData={sideNavData}
                        activeKeySideNav={activeKeySideNav}
                        activeKeySideNavSelect={activeKeySideNavSelect}
                        setSignOutModalOpen={setSignOutModalOpen}
                        logoComponent={<LogoComponent imageSize="small" name={name} white={true} />}>

                        {mainPanelComponenet(activeKeySideNav)}

                    </HomeComponent>
                )
                : <Custom500 />}

            <FooterComponent />
        </div>
    );
}
