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

import { LogoComponent } from "@b2bsample/business-app/ui/ui-components";
import { SigninRedirectComponent } from "@b2bsample/shared/ui/ui-components";
import { orgSignin, redirect } from "@b2bsample/shared/util/util-authorization-config-util";
import { getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import "rsuite/dist/rsuite.min.css";

export async function getServerSideProps(context) {
    const session = await getSession(context);

    if (session) {

        return redirect("/o/moveOrg");
    }

    return {
        props: {}
    };
}

/**
 * 
 * @returns Signin interface (redirecting to the login or main interface)
 */
export default function Signin() {

    const moveTime = 40;
    const [ redirectSeconds, setRedirectSeconds ] = useState(moveTime);

    useEffect(() => {
        if (redirectSeconds <= 1) {
            orgSignin(false);

            return;
        }

        setTimeout(() => {
            setRedirectSeconds((redirectSeconds) => redirectSeconds - 1);
        }, moveTime);
    }, [ redirectSeconds ]);

    return (
        <SigninRedirectComponent
            logoComponent={ <LogoComponent imageSize="medium" /> }
            loaderContent="Redirecting to the organization login."
        />
    );
}
