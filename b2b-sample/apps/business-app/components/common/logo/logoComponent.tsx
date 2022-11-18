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
import Logo from "./logo";
import config from "../../../config.json";
import styles from "../../../styles/Settings.module.css";

/**
 * 
 * @param prop - name (org name), imageSize `small` | `medium` | `large` | `x-large`
 *
 * @returns 
 */
export default function LogoComponent(prop) {

    const { name, imageSize, white } = prop;

    return (
        <div className={ styles.logoDiv }>
            <Logo imageSize={ imageSize } white={ white } />
            <p className={ styles.nameTag }>{ config.ApplicationConfig.Branding.tag } </p>
            {
                name
                    ? (<>
                        <hr />
                        <h5 className={ styles.nameTag }>{ name }</h5>
                        <hr />
                    </>)
                    : null
            }
        </div>
    );
}
