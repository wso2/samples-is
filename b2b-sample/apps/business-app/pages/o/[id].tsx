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

import { orgSignin, redirect } from "@b2bsample/shared/util/util-authorization-config-util";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { useEffect } from "react";
import Home from "../../components/sections/home";

export async function getServerSideProps(context) {

    const routerQuery: string = context.query.id;
    const session: Session = await getSession(context);

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

interface OrgProps {
    session: Session,
    routerQuery: string
}

/**
 * 
 * @param prop - session, routerQuery (orgId)
 * 
 * @returns Organization distinct interace
 */
export default function Org(props: OrgProps) {

    const { session, routerQuery } = props;

    useEffect(() => {
        if (routerQuery) {
            orgSignin(false,routerQuery);

            return;
        }
    }, [ routerQuery ]);

    return (
        session
            ? (<Home
                orgId={ session.orgId }
                session={ session }/>)
            : null
    );
}
