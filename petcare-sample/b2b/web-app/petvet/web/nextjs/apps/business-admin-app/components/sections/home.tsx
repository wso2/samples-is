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

import { LogoComponent } from "@pet-management-webapp/business-admin-app/ui/ui-components";
import { signout } from "@pet-management-webapp/business-admin-app/util/util-authorization-config-util";
import { SignOutComponent } from "@pet-management-webapp/shared/ui/ui-components";
import { getPersonalization } from "apps/business-admin-app/APICalls/GetPersonalization/get-personalization";
import DoctorBookingsSection 
    from "apps/business-admin-app/components/sections/sections/sectionsRelatedToDoctor/doctorBookings";
import { Session } from "next-auth";
import React, { useCallback, useEffect, useState } from "react";
import "rsuite/dist/rsuite.min.css";
import GetStartedSectionComponent from "./sections/getStartedSection/getStartedSectionComponent";
import GetStartedSectionComponentForAdmin from "./sections/getStartedSection/getStartedSectionForAdmin";
import GetStartedSectionComponentForDoctor from "./sections/getStartedSection/getStartedSectionForDoctor";
import GetStartedSectionComponentForPetOwner from "./sections/getStartedSection/getStartedSectionForPetOwner";
import PetsSection from "./sections/sectionsReatedToPetOwner/petsPage";
import SettingsSection from "./sections/sectionsReatedToPetOwner/settings";
import BookingsInPetOwnerSection from "./sections/sectionsRelatedToBookings/bookingsInPetOwnerView";
import ChannelDoctorSection from "./sections/sectionsRelatedToBookings/channelDocSection";
import DoctorProfileSection from "./sections/sectionsRelatedToDoctor/doctorProfile";
import ManageDoctorsSection from "./sections/sectionsRelatedToDoctor/manageDoctors";
import IdpSectionComponent from "./sections/settingsSection/idpSection/idpSectionComponent";
import ManageGroupSectionComponent from "./sections/settingsSection/manageGroupSection/manageGroupSectionComponent";
import ManageUserSectionComponent from "./sections/settingsSection/manageUserSection/manageUserSectionComponent";
import ConfigureMFASection from "./sections/settingsSection/mfaSection/configureMfaSection";
import PersonalizationSectionComponent 
    from "./sections/settingsSection/personalizationSection/personalizationSectionComponent";
import personalize from "./sections/settingsSection/personalizationSection/personalize";
import RoleManagementSectionComponent from
    "./sections/settingsSection/roleManagementSection/roleManagementSectionComponent";
import sideNavDataForAdmin
    from "../../../../libs/business-admin-app/ui/ui-assets/src/lib/data/sideNavDataForAdmin.json";
import HomeComponentForAdmin
    from "../../../../libs/shared/ui/ui-components/src/lib/components/homeComponent/homeComponentForAdmin";
import Custom500 from "../../pages/500";


interface HomeProps {
    name: string,
    session: Session
}

/**
 * 
 * @param prop - orgId, name, session, colorTheme
 *
 * @returns The home section. Mainly side nav bar and the section to show other settings sections.
 */
export default function Home(props: HomeProps): JSX.Element {

    const { name, session } = props;

    const [ activeKeySideNav, setActiveKeySideNav ] = useState("1");
    const [ signOutModalOpen, setSignOutModalOpen ] = useState(false);

    const fetchData = useCallback(async () => {
        fetchBrandingPreference();
    }, [ session ]);

    useEffect(() => {
        fetchData();
        fetchBrandingPreference();
    }, [ fetchData ]);

    const fetchBrandingPreference = async () => {
        // getPersonalization(session.accessToken, session.orgId)
        //     .then((response) => {
        //         personalize(response.data);
        //     });
    };

    


    const mainPanelComponenet = (activeKey): JSX.Element => {
        switch (activeKey) {
            case "1":

                return <GetStartedSectionComponent />;
            case "2-1":

                return <ManageUserSectionComponent session={ session } />;
            case "2-2":

                return <RoleManagementSectionComponent session={ session } />;
            case "2-3":

                return <ManageGroupSectionComponent session={ session } />;    
            case "2-4":

                return <IdpSectionComponent session={ session } />;
            case "3":

                return <ManageDoctorsSection session={ session } />;
            case "4":

                return <DoctorProfileSection session={ session } />;
            case "5":

                return <DoctorBookingsSection session={ session } />;
            case "6":

                return <PetsSection session={ session } />;
            case "7-1":

                return <ChannelDoctorSection session={ session } />;
            case "7-2":

                return <BookingsInPetOwnerSection session={ session } />;

            case "8":

                return <SettingsSection session={ session } />;
            case "9":

                return <GetStartedSectionComponentForDoctor  session={ session } />; 
            case "10":

                return <GetStartedSectionComponentForAdmin  session={ session } />;
            case "11":

                return <GetStartedSectionComponentForPetOwner  session={ session } />;     
            case "12":

                return <PersonalizationSectionComponent  session={ session } />;    
            case "13":

                return <ConfigureMFASection  session={ session } />;   
        }
    };

    const signOutCallback = (): void => {
        signout(session);
    };

    const activeKeySideNavSelect = (eventKey: string | undefined): void => {
        setActiveKeySideNav(eventKey);
    };

    const signOutModalClose = (): void => {
        setSignOutModalOpen(false);
    };

    let homeComponent;

    if (session) {
        homeComponent = (
            <HomeComponentForAdmin
                scope={ session.scope }
                sideNavData={ sideNavDataForAdmin }
                activeKeySideNav={ activeKeySideNav }
                activeKeySideNavSelect={ activeKeySideNavSelect }
                setSignOutModalOpen={ setSignOutModalOpen }
                logoComponent={ (
                    <LogoComponent 
                        imageSize="small" 
                        name={ name } 
                        white={ true } 
                    /> 
                ) }
            >

                { mainPanelComponenet(activeKeySideNav) }

            </HomeComponentForAdmin>)
        ;

    } else {
        homeComponent = <Custom500 />;
    }

    return (
        <div>
            <SignOutComponent
                open={ signOutModalOpen }
                onClose={ signOutModalClose }
                signOutCallback={ signOutCallback } />

            { homeComponent }
        </div>
    );
}
