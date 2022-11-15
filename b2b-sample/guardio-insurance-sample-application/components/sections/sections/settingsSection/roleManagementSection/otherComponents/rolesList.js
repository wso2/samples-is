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

import React from "react";
import { FlexboxGrid, PanelGroup } from "rsuite";
import RoleItem from "./roleItem/roleItem";
import styles from "../../../../../../styles/idp.module.css";
import CreateRoleComponent from "./createRoleComponent/createRoleComponent";

/**
 * 
 * @param prop - `session`, `roleList`
 *
 * @returns List of all the roles in an organization
 */
export default function RolesList(prop) {

    const { session, rolesList } = prop;

    return (
        <FlexboxGrid
            style={{ height: "60vh", marginTop: "24px", width: "100%" }}
            justify="start"
            align="top" >
            <div className={styles.idp__list}>
                <PanelGroup accordion bordered>
                    {rolesList.map((role) => (
                        <RoleItem
                            key={role.id}
                            session={session}
                            id={role.id}
                            roleUri={role.meta.location} />
                    ))}
                </PanelGroup>
            </div>
        </FlexboxGrid >
    );
}
