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

import { LogoComponent } from "@b2bsample/business-app/ui/ui-components";
import { signout } from "@b2bsample/business-app/util/util-authorization-config-util";
import { FooterComponent, HomeComponent, SignOutComponent } from "@b2bsample/shared/ui/ui-components";
import { Session } from "next-auth";
import { useState } from "react";
import "rsuite/dist/rsuite.min.css";

import sideNavGuardioInsuranceData
    from "../../../../../libs/business-app/ui-assets/src/lib/data/sideNav-GuardioInsurance.json";
import Custom500 from "../../../pages/500";
import BlogSectionComponent from "../sections/GuardioInsurance/blogSection/blogSectionComponent";
import ClaimsSectionComponent from "../sections/GuardioInsurance/claimsSection/claimsSectionComponent";
import ProfileSectionComponent from "../sections/GuardioInsurance/profileSection/profileSectionComponent";
import ReportsSectionComponent
    from "../sections/GuardioInsurance/reportsSection/reportsSectionComponent";


interface HomeInterface {
    session: Session
}

/**
 * 
 * @param prop - orgId, session,
 *
 * @returns The home section. Mainly side nav bar and the section to show other settings sections.
 */
export default function GuardioInsuranceHome(props: HomeInterface) {

    const { session } = props;

    const [ activeKeySideNav, setActiveKeySideNav ] = useState<string>("1");
    const [ signOutModalOpen, setSignOutModalOpen ] = useState<boolean>(false);

    const mainPanelComponenet = (activeKey: string): JSX.Element => {
        switch (activeKey) {
            case "1":

                return <ProfileSectionComponent session={ session } />;
            case "2":

                return <ReportsSectionComponent />;
            case "3":

                return <ClaimsSectionComponent />;
            case "4":

                return <BlogSectionComponent />;
        }
    };

    const signOutCallback = (): void => {
        signout(session);
    };

    const activeKeySideNavSelect = (eventKey: string): void => {
        setActiveKeySideNav(eventKey);
    };

    const signOutModalClose = (): void => {
        setSignOutModalOpen(false);
    };

    return (
        <div>
            <SignOutComponent
                open={ signOutModalOpen }
                onClose={ signOutModalClose }
                signOutCallback={ signOutCallback } />

            { session
                ? (

                    <HomeComponent
                        scope={ session.scope }
                        sideNavData={ sideNavGuardioInsuranceData }
                        activeKeySideNav={ activeKeySideNav }
                        activeKeySideNavSelect={ activeKeySideNavSelect }
                        setSignOutModalOpen={ setSignOutModalOpen }
                        logoComponent={ <LogoComponent imageSize="small" white={ true } /> }>

                        { mainPanelComponenet(activeKeySideNav) }

                    </HomeComponent>
                )
                : <Custom500 /> }

            <FooterComponent />
        </div>
    );
}
