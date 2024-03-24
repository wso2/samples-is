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

import { Button, FlexboxGrid, Stack } from "rsuite";
import { EmptySettingsComponentProps } from "../../models/emptySettingsComponent/emptySettingsComponent";

/**
 * 
 * @param prop - onAddIdentityProviderClick (function to open add idp modal)
 * 
 * @returns The componet to show when there is no idp's.
 */
export function EmptySettingsComponent(prop: EmptySettingsComponentProps) {

    const { bodyString, buttonString, icon, onAddButtonClick } = prop;

    return (
        <FlexboxGrid
            style={ { height: "60vh", marginTop: "24px", width: "100%" } }
            justify="center"
            align="middle"
        >
            <Stack alignItems="center" direction="column">
                { icon }
                <p style={ { fontSize: 14, marginTop: "20px" } }>
                    { bodyString }
                </p>
                {
                    onAddButtonClick
                        ? (<Button
                            appearance="primary"
                            onClick={ onAddButtonClick }
                            size="md"
                            style={ { marginTop: "12px" } }>
                            { buttonString }
                        </Button>)
                        : null
                }

            </Stack>
        </FlexboxGrid>
    );

}


export default EmptySettingsComponent;
