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

import { getSession } from "next-auth/react";
import React, { useEffect } from "react";
import Home from "../../components/sections/home";
import { orgSignin, redirect } from "../../util/util/routerUtil/routerUtil";

export async function getServerSideProps(context) {

    const routerQuery = context.query.id;
    const session = await getSession(context);

    if (session === null || session === undefined) {

        return {
            props: { routerQuery }
        };
    } else {
        if (routerQuery !== session.orgId) {

            return redirect("/404");
        } else {

            return {
                props: { session }
            };
        }

    }

}

/**
 * 
 * @param prop - session, routerQuery (orgId)
 * 
 * @returns Organization distinct interace
 */
export default function Org(prop) {

    const { session, routerQuery } = prop;

    useEffect(() => {
        if (routerQuery) {
            orgSignin(routerQuery);

            return;
        }
    }, [ routerQuery ]);

    return (
        session
            ? (<Home
                orgId={ session.orgId }
                name={ session.orgName }
                session={ session }/>)
            : null
    );
}
