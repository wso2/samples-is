/*
 * Copyright (c) 2022 WSO2 LLC. (https://www.wso2.com).
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

import React from 'react'
import { Form, Stack } from 'rsuite'
import InfoOutlineIcon from '@rsuite/icons/InfoOutline';

export default function HelperText(props) {
    return (
        <Stack style={{ marginTop: "5px" }}>
            <InfoOutlineIcon style={{ marginRight: "10px", marginLeft: "2px" }} />
            <Form.HelpText>{props.text}</Form.HelpText>
        </Stack>
    )
}
