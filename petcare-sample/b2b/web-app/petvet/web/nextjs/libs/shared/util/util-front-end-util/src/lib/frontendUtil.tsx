/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { SideNavItem } from "@pet-management-webapp/shared/data-access/data-access-common-models-util";
import AdminIcon from "@rsuite/icons/Admin";
import CalendarIcon from "@rsuite/icons/Calendar";
import EditIcon from "@rsuite/icons/Edit";
import GridIcon from "@rsuite/icons/Grid";
import DashboardIcon from "@rsuite/icons/legacy/Dashboard";
import GearCircleIcon from "@rsuite/icons/legacy/GearCircle";
import MemberIcon from "@rsuite/icons/Member";
import PageIcon from "@rsuite/icons/Page";
import PeopleBranchIcon from "@rsuite/icons/PeopleBranch";
import PeoplesCostomizeIcon from "@rsuite/icons/PeoplesCostomize";
import PhoneIcon from "@rsuite/icons/Phone";
import SettingHorizontalIcon from "@rsuite/icons/SettingHorizontal";
import ShieldIcon from "@rsuite/icons/Shield";
import SpeakerIcon from "@rsuite/icons/Speaker";
import TagLockIcon from "@rsuite/icons/TagLock";
import PeoplesIcon from '@rsuite/icons/Peoples';

export const LOADING_DISPLAY_NONE = {
    display: "none"
};
export const LOADING_DISPLAY_BLOCK = {
    display: "block"
};

/**
 * 
 * @param scopes - scopes of the user
 * @param itemScopes - scopes that required for this section
 * 
 * @returns `true` if user has the necessary scopes, else `false`
 */
function hideBasesdOnScopesSideNavItems(scopes: string[], itemScopes: string[]): boolean {
    return itemScopes.every(scope => scopes.includes(scope));
}

/**
 * hide content based on the user's realated privilages
 * 
 * @param scopes - scopes related for the user
 * 
 * @returns `LOADING_DISPLAY_BLOCK` if admin, else `LOADING_DISPLAY_NONE` 
 */
export function hideBasedOnScopes(scopes: string, sideNavType: string, sideNavItems?: SideNavItem[],
    itemScopes?: string[]): Record<string, string> {

    const scopesList: string[] = scopes.split(/\s+/);

    switch (sideNavType) {
        case "item":
            if (hideBasesdOnScopesSideNavItems(scopesList, itemScopes as string[])) {

                return LOADING_DISPLAY_BLOCK;
            } else {

                return LOADING_DISPLAY_NONE;
            }

        case "menu": {
            let check: Record<string, string> = LOADING_DISPLAY_NONE;

            if (sideNavItems) {
                for (let i = 0; i < sideNavItems.length; i++) {
                    if (hideBasesdOnScopesSideNavItems(scopesList, sideNavItems[i].scopes as string[])) {
                        check = LOADING_DISPLAY_BLOCK;

                        break;
                    }
                }

            }

            return check;

        }

        default:
            return LOADING_DISPLAY_NONE;
    }
}

export function getIconFromString(iconString: string | undefined): JSX.Element | undefined {
    switch (iconString) {
        case "DashboardIcon":

            return (<DashboardIcon />);
        case "GearCircleIcon":

            return (<GearCircleIcon />);
        case "SettingHorizontalIcon":

            return (<SettingHorizontalIcon />);
        case "AdminIcon":

            return (<AdminIcon />);
        case "PageIcon":

            return (<PageIcon />);
        case "PhoneIcon":

            return (<PhoneIcon />);
        case "PeopleBranchIcon":

            return (<PeopleBranchIcon />);
        case "SpeakerIcon":

            return (<SpeakerIcon />);
        case "ShieldIcon":

            return (<ShieldIcon />);
        case "ManageDoctorIcon":

            return (<PeoplesCostomizeIcon />); 
        case "ProfileIcon":
            return(<MemberIcon/>);   

        case "BookingsIcon":
            return(<CalendarIcon/>); 

        case "PetsIcon":
            return(<GridIcon/>);

        case "ChannellingIcon":
            return(<CalendarIcon/>);  

        case "BrandingIcon":
            return(<EditIcon/>);
        
        case "MFAIcon":
            return(<TagLockIcon/>);

        case "ManageGroups":
            return(<PeoplesIcon/>);

        default:

            return;
    }
}

export default {
    LOADING_DISPLAY_BLOCK, LOADING_DISPLAY_NONE, getIconFromString, hideBasedOnScopes
};
