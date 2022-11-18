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
import { Panel } from "rsuite";
import profileImage from "../../../../../public/internal/profile.svg";
import styles from "../../../../../styles/Settings.module.css";

/**
 * 
 * @param prop - me (details of the logged in user)
 *
 * @returns The profile details section
 */
export default function UserDetails(prop) {

    const { me } = prop;

    return (
        me
            ? (<Panel header="User Details" bordered>
                <div id="userDetails" className={styles.homePanel}>
                    <div className={styles.userDetails}>
                        <div className={styles.userDetailsBody}>
                            <p><b>First Name : </b>{me.firstName}</p>
                            <p><b>Last Name : </b>{me.familyName}</p>
                            <p><b>ID : </b>{me.id}</p>
                            <p><b>Username : </b>{me.username}</p>
                            <p><b>Email : </b>{me.email}</p>
                        </div>
                        <Image src={profileImage} className={styles.profileImage} alt="profile image" />
                    </div>
                </div>
            </Panel>)
            : (<Panel bordered>
                <div>Add the user attributes in created the application to display user details</div>
            </Panel>)
    );
}
