/*
 * Copyright (c) 2022 WSO2 LLC. (http://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *http://www.apache.org/licenses/LICENSE-2.
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import config from '../../config.json';
import styles from '../../styles/Settings.module.css';
import Logo from '../logo/logo';

export default function LogoComponent(props) {

    return (
        <div className={styles.logoDiv}>
            <Logo imageSize={props.imageSize} />
            <p className={styles.nameTag}>{config.CUSTOMIZATION.tag} </p>
            {
                props.name
                    ? <>
                        <hr />
                        <h5 className={styles.nameTag}>{props.name}</h5>
                        <hr />
                    </>
                    : null
            }

        </div>
    );
}
