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
import React, { useEffect, useState } from "react";
import { Panel } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import LatestNewsComponent from "./otherComponents/latestNewsComponent";
import UserDetails from "./otherComponents/userDetails";
import styles from "../../../../styles/Settings.module.css";
import decodeMe from "../../../../util/apiDecode/dashboard/decodeMe";

/**
 * 
 * @param prop - session, orgName
 *
 * @returns Dashboard interface section
 */
export default function DashboardSectionComponent(prop) {

    const { session, orgName } = prop;

    const [ me, setMe ] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const res = await decodeMe(session);

            setMe(res);
        }
        fetchData();
    }, [ session ]);

    return (
        <div className={ styles.homeMainPanelDiv }>
            <Panel bordered>
                <div className={ styles.homePanel }>
                    <LogoComponent imageSize="medium" name={ orgName } />
                </div>
            </Panel>

            <UserDetails me={ me } session={ session } />

            <LatestNewsComponent />
        </div>
    );
}
