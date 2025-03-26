/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import React, { FunctionComponent, ReactElement } from "react";
import { DefaultLayout } from "../layouts/default";
import { AsgardeoAuthException } from "@asgardeo/auth-react";

interface VerifyIDTokenFailureProps {
    error?: AsgardeoAuthException;
}

/**
 * Page to display for ID token verifying failures Page.
 *
 * @param {VerifyIDTokenFailureProps} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const VerifyIDTokenFailure: FunctionComponent<VerifyIDTokenFailureProps> =
    ({error}): ReactElement => {

    return (
        <DefaultLayout>
            <h6 className="error-page_h6">
                ID token validation failed!
            </h6>
            <p className="error-page_p">
                Issue occurred while verifying ID token.
            </p>
            <p className="error-page_p">
                Error message : {error?.message}<br />
                Error reason : {error?.name}
            </p>
        </DefaultLayout>
    );
};
