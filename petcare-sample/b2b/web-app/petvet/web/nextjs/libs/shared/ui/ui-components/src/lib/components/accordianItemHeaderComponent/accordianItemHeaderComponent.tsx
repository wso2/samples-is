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

import Image from "next/image";
import { Avatar, Stack } from "rsuite";
import { TypeAttributes } from "rsuite/esm/@types/common";
import { AccordianItemHeaderComponentProps } from
    "../../models/accordianItemHeaderComponent/accordianItemHeaderComponent";

/**
 * 
 * @param prop - `title`, `description`, `imageUrl`
 * 
 * @returns header componet for items in an accordian
 */
export function AccordianItemHeaderComponent(prop: AccordianItemHeaderComponentProps) {

    const { title, description, imageSrc, avatarSize = "lg" } = prop;

    return (
        <Stack>
            <Stack spacing={ 20 }>
                <Avatar
                    size={ avatarSize as TypeAttributes.Size } 
                    alt="IDP image"
                    style={ imageSrc ? { background: "rgba(255,0,0,0)" } : { background: "rgba(125,125,125,255)" } }
                >
                    { imageSrc 
                        ?(<Image
                            src={ imageSrc }
                            alt="idp image"
                            width={ 50 } />)
                        : null 
                    }
                </Avatar>
                <Stack direction="column" justifyContent="flex-start" alignItems="stretch">
                    <h5>{ title }</h5>
                    <p>{ description ? description : "" }</p>
                </Stack>
            </Stack>

        </Stack>
    );
}

export default AccordianItemHeaderComponent;
