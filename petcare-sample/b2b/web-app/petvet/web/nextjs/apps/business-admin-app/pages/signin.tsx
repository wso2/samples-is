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
import { LogoComponent } from "@pet-management-webapp/business-admin-app/ui/ui-components";
import { SigninRedirectComponent } from "@pet-management-webapp/shared/ui/ui-components";
import { orgSignin } from "@pet-management-webapp/shared/util/util-authorization-config-util";
import React, { useEffect, useState } from "react";
import "rsuite/dist/rsuite.min.css";

/**
 * 
 * @returns Signin interface (redirecting to the login or main interface)
 */
export default function Signin() {

    const moveTime = 40;
    const [ redirectSeconds, setRedirectSeconds ] = useState<number>(moveTime);

    const getOrgIdFromUrl = (): string => {
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        const searchParams = url.searchParams;
        const orgId = searchParams.get("orgId");
      
        return orgId;
    };

    useEffect(() => {
        if (redirectSeconds <= 1) {
            if (getOrgIdFromUrl()) {
                orgSignin(true, getOrgIdFromUrl());
            } else {
                orgSignin(true);
            }

            return;
        }

        setTimeout(() => {
            setRedirectSeconds((redirectSeconds) => redirectSeconds - 1);
        }, moveTime);
    }, [ redirectSeconds ]);

    return (
        <SigninRedirectComponent
            logoComponent={ <LogoComponent imageSize="medium" /> }
            loaderContent="Redirecting to the organization login"
        />
    );
}
