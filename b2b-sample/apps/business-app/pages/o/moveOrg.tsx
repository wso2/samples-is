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

import { redirect } from "@b2bsample/shared/util/util-authorization-config-util";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

export async function getServerSideProps(context) {

    const session = await getSession(context);

    if (session) {

        if (session.expires || session.error) {

            return redirect("/500");
        } else {

            const orgId = session.orgId;
            const orgName = session.orgName;

            return {
                props: { orgId, orgName }
            };
        }
    } else {

        return redirect("/404");
    }
}

/**
 * 
 * @param prop - orgId, orgName
 * 
 * @returns Interface to call organization switch function
 */
export default function MoveOrg(prop) {

    const { orgId, orgName } = prop;

    const router = useRouter();

    const moveTime = 40;
    const [ redirectSeconds, setRedirectSeconds ] = useState(moveTime);

    const redirectToOrg = useCallback(() => {
        router.push(`/o/${orgId}`);
    },[ orgId, router ]);

    useEffect(() => {
        if (redirectSeconds <= 1) {
            redirectToOrg();

            return;
        }

        setTimeout(() => {
            setRedirectSeconds((redirectSeconds) => redirectSeconds - 1);
        }, moveTime);
    }, [ redirectSeconds, orgId, redirectToOrg ]);

    return (
        <div
            style={
                {      
                    alignItems: "center",
                    backgroundColor: "black",
                    color: "whitesmoke",
                    display: "flex",
                    height: "100vh",
                    justifyContent: "center"
                }
            }>
            <p
                style={
                    {
                        fontSize: "2em"
                    }
                }>You will be redirected to { orgName }</p>
        </div>

    );
}
