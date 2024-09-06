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

import { Loader, Panel, Stack } from "rsuite";
import styles from "./moveOrganizationComponent.module.css";

/* eslint-disable-next-line */
export interface MoveOrganizationComponentProps {
    orgName: string
}

export function MoveOrganizationComponent(prop: MoveOrganizationComponentProps) {

    const { orgName } = prop;

    return (
        <div className={ styles["getStartedSectionComponentGetStartedTextDiv"] }>
            <Panel bordered className={ styles["getStartedSectionComponentGetStartedTextPanel"] }>

                <Stack direction="column" spacing={ 50 } justifyContent="center">

                    <Loader size="lg" content={ "" } vertical />
                    
                </Stack>

            </Panel>

        </div>
    );
}

export default MoveOrganizationComponent;
