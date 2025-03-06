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

import { Role } from "@pet-management-webapp/business-admin-app/data-access/data-access-common-models-util";
import { controllerDecodeListAllRoles }
    from "@pet-management-webapp/business-admin-app/data-access/data-access-controller";
import { getConfig } from "@pet-management-webapp/business-admin-app/util/util-application-config-util";
import { EmptySettingsComponent, SettingsTitleComponent } from "@pet-management-webapp/shared/ui/ui-components";
import PeoplesIcon from "@rsuite/icons/Peoples";
import { Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";
import { Container } from "rsuite";
import RolesList from "./otherComponents/rolesList";

interface RoleManagementSectionComponentProps {
    session: Session
}

/**
 * 
 * @param prop - session
 * 
 * @returns The role management interface section.
 */
export default function RoleManagementSectionComponent(props: RoleManagementSectionComponentProps) {

    const { session } = props;

    const [ rolesList, setRolesList ] = useState<Role[]>([]);

    const fetchAllRoles = useCallback(async () => {

        const res = await controllerDecodeListAllRoles(session);

        if (res) {
            setRolesList(res.filter((role) => 
                role?.audience.type == "application" && 
                role?.audience.display === getConfig().BusinessAdminAppConfig.ManagementAPIConfig.SharedApplicationName
            ));
        } else {
            setRolesList([]);
        }

    }, [ session ]);

    useEffect(() => {
        fetchAllRoles();
    }, [ fetchAllRoles ]);

    return (
        <Container>

            <SettingsTitleComponent
                title="Manage Roles"
                subtitle="Manage organization roles here." />

            {
                rolesList
                    ? <RolesList session={ session } rolesList={ rolesList } />
                    : (<EmptySettingsComponent
                        bodyString="There are no roles created for the organization."
                        buttonString="Create role"
                        icon={ <PeoplesIcon style={ { opacity: .2 } } width="150px" height="150px" /> }
                    />)
            }

        </Container>
    );

}
