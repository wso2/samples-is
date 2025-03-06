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

import { IdentityProvider } from "@pet-management-webapp/business-admin-app/data-access/data-access-common-models-util";
import { Session } from "next-auth";
import React from "react";
import { FlexboxGrid, PanelGroup } from "rsuite";
import IdentityProviderDetails from "./identityProviderDetails";
import styles from "../../../../../../styles/idp.module.css";

interface IdentityProviderListProps {
    idpList : IdentityProvider[],
    fetchAllIdPs : ()=>Promise<void>,
    session : Session
}

/**
 * 
 * @param prop - idpDetails (List of idp's), fetchAllIdPs (function to fetch all idp's), session
 *
 * @returns List of idp's created in the organization
 */
export default function IdentityProviderList(props: IdentityProviderListProps) {

    const { idpList, fetchAllIdPs, session } = props;

    return (
        <FlexboxGrid
            style={ { height: "60vh", marginTop: "24px", width: "100%" } }
            justify="start"
            align="top" >
            <div className={ styles.idp__list }>
                <PanelGroup accordion defaultActiveKey={ idpList[0].id } bordered>
                    { idpList.map(({ id }) => (
                        <IdentityProviderDetails
                            key={ id }
                            session={ session }
                            id={ id }
                            fetchAllIdPs={ fetchAllIdPs } />
                    )) }
                </PanelGroup>
            </div>
        </FlexboxGrid >

    );
}
