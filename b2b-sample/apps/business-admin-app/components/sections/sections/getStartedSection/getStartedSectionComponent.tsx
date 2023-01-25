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

import Image from "next/image";
import { FlexboxGrid } from "rsuite";
import GetStartedText from "./otherComponents/getStartedText";
import getStartedImage from "../../../../../../libs/business-admin-app/ui/ui-assets/src/lib/images/getStarted.svg";

/**
 * 
 * @returns The get started interface section.
 */
export default function GetStartedSectionComponent() {

    return (
        <FlexboxGrid align="middle" justify="space-between" style={ { height: "100%" } }>
            <FlexboxGrid.Item colspan={ 14 }>
                <GetStartedText />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={ 9 }>
                <Image src={ getStartedImage } alt="profile image" width={ 500 } />
            </FlexboxGrid.Item>
        </FlexboxGrid>
    );

}
