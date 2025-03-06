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

import styles from "./homeComponent.module.css";
import { HomeComponentProps } from "../../models/homeComponent/homeComponent";
import MainPanelComponent from "../mainPanelComponent/mainPanelComponent";
import SidenavComponent from "../sidenavComponent/sidenavComponent";

export function HomeComponent(prop: HomeComponentProps) {

    const { scope, sideNavData, activeKeySideNav, activeKeySideNavSelect, setSignOutModalOpen, children, logoComponent }
        = prop;

    return (
        <div className={ styles["mainDiv"] }>

            <SidenavComponent
                scope={ scope }
                sideNavData={ sideNavData }
                activeKeySideNav={ activeKeySideNav }
                activeKeySideNavSelect={ activeKeySideNavSelect }
                setSignOutModalOpen={ setSignOutModalOpen }
                logoComponent={ logoComponent } />

            <MainPanelComponent>
                { children }
            </MainPanelComponent>

        </div>
    );
}

export default HomeComponent;
