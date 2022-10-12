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

import Image from 'next/image';
import React from 'react';
import logoImage from '../../public/logo.png';

export default function Logo(props) {

    function switchImageSize(size) {
        switch (size) {
            case 'small':
                return { width: '200px' }
            case 'medium':
                return { width: '250px' }
            case 'large':
                return { width: '600px' }
            case 'x-large':
                return { width: '600px' }
            default:
                break;
        }
    }

    return (
        <div style={switchImageSize(props.imageSize)}>
            <Image src={logoImage}
                alt="404 image" />
        </div>
    )
}
