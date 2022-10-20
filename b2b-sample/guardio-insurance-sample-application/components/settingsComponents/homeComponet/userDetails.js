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
import profileImage from "../../../public/internal/profile.svg";
import styles from "../../../styles/Settings.module.css";

export default function UserDetails(props) {
    
    return (
        <div className={ styles.userDetails }>
            <div className={ styles.userDetailsBody }>
                <p><b>First Name : </b>{ props.me.firstName }</p>
                <p><b>Last Name : </b>{ props.me.familyName }</p>
                <p><b>ID : </b>{ props.me.id }</p>
                <p><b>Username : </b>{ props.me.username }</p>
                <p><b>Email : </b>{ props.me.email }</p>
            </div>
            <div className={ styles.profileImage }>
                <Image src={ profileImage } alt="profile image" />
            </div>
        </div>
    );
}
