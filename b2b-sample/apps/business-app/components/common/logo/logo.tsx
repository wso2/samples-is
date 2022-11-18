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
import React from "react";
import logoImage from "../../../../../libs/shared/ui-assets/src/lib/images/logo.png";

/**
 * 
 * @param prop - imageSize `small` | `medium` | `large` | `x-large`
 * 
 * @returns Logo component
 */
export default function Logo(prop) {

    const { imageSize, white } = prop;

    const getImageStyle = (size, white) => {

        const imageStyle = {
            "height": "auto"
        };

        switch (size) {
            case "small":
                imageStyle["width"] = "200px";

                break;
            case "medium":
                imageStyle["width"] = "350px";

                break;
            case "large":
                imageStyle["width"] = "600px";

                break;
            case "x-large":
                imageStyle["width"] = "600px";

                break;
            default:
                break;
        }


        if (white) {
            imageStyle["filter"] = "brightness(0) invert(1)";
        }

        return imageStyle;
    };

    return (
        <Image
            src={ logoImage }
            alt="404 image"
            style={ getImageStyle(imageSize, white) } />
    );
}
