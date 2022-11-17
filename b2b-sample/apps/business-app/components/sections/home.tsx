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

import React, { useState } from "react";
import "rsuite/dist/rsuite.min.css";
import SideNavSection from "./otherComponents/sideNavSection";
import DashboardSectionComponent from "./sections/dashboardSection/dashboardSectionComponent";
import IdpSectionComponent from "./sections/settingsSection/idpSection/idpSectionComponent";
import ManageUserSectionComponent from "./sections/settingsSection/manageUserSection/manageUserSectionComponent";
import RoleManagementSectionComponent from
    "./sections/settingsSection/roleManagementSection/roleManagementSectionComponent";
import Custom500 from "../../pages/500";
import styles from "../../styles/Settings.module.css";
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
            case "2-2":

                return <RoleManagementSectionComponent orgName={ name } orgId={ orgId } session={ session } />;
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
                        { mainPanelComponenet(activeKeySideNav) }
                    </div>
                </div>)
                : <Custom500 /> }
        </div>
    );
}
