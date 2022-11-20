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
import config from "../../../../../../../config.json";
import logoImage from "../../../../../../../libs/shared/ui-assets/src/lib/images/logo.png";
import { LogoComponentProps, LogoImageStyle, LogoProps } from "../../models/logoComponent/logoComponent";
import styles from "./logoComponent.module.css";

/**
 * 
 * @param prop - name (org name), imageSize `small` | `medium` | `large` | `x-large`
 *
 * @returns 
 */
export function LogoComponent(prop: LogoComponentProps) {

    const { name, imageSize, white } = prop;

    return (
        <div className={styles["logoDiv"]}>
            <Logo imageSize={imageSize} white={white} />
            <p className={styles["nameTag"]}>{config.ApplicationConfig.Branding.tag} </p>
            {
                name
                    ? (
                        <>
                            <hr />
                            <h5 className={styles["nameTag"]}>{name}</h5>
                            <hr />
                        </>
                    )
                    : null
            }
        </div>
    );
}

/**
 * 
 * @param prop - imageSize `small` | `medium` | `large` | `x-large`
 * 
 * @returns Logo component
 */
function Logo(prop: LogoProps) {

    const { imageSize, white } = prop;

    const getImageStyle = (size: string, white?: boolean) => {

        const imageStyle: LogoImageStyle = {
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
            src={logoImage}
            alt="404 image"
            style={getImageStyle(imageSize, white)} />
    );
}

export default LogoComponent;
