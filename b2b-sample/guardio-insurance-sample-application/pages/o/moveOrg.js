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

import React, { useEffect, useState } from 'react';

import { getSession } from 'next-auth/react';
import { getOrg, getOrgIdFromQuery } from '../../util/util/orgUtil/orgUtil';
import { orgSignin, redirect } from '../../util/util/routerUtil/routerUtil';

export async function getServerSideProps(context) {

    const session = await getSession(context);
    let setOrg = {};

    const routerQuery = context.query.o;
    let orgIdFromQuery = getOrgIdFromQuery(routerQuery);

    if (orgIdFromQuery == null) {
        return redirect('/404');
    }

    if (session == null || session == undefined) {
        let orgName = getOrg(orgIdFromQuery).name;
        return {
            props: { routerQuery, orgIdFromQuery, orgName },
        }
    } else {
        if (session.expires || session.error) {
            return redirect('/500');
        } else {
            return redirect('/404');
        }
    }
}

export default function Org(props) {

    const moveTime = 40;
    const [redirectSeconds, setRedirectSeconds] = useState(moveTime);

    useEffect(() => {
        if (redirectSeconds <= 0) {
            orgSignin(props.orgIdFromQuery);
            return;
        }

        setTimeout(() => {
            setRedirectSeconds((redirectSeconds) => redirectSeconds - 1);
        }, moveTime)
    }, [redirectSeconds]);

    return (
        <div style={
            {
                backgroundColor: 'black',
                height: '100vh',
                color: 'whitesmoke',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }
        }>
            <p style={
                {
                    fontSize: '2em'
                }
            }>You will be redirected to the {props.orgName} login page</p>
        </div>

    )
}
