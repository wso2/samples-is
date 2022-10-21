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

import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { setOrgId } from '../../util/util/orgUtil/orgUtil';
import { redirect } from '../../util/util/routerUtil/routerUtil';

export async function getServerSideProps(context) {

    const session = await getSession(context);

    if (session) {

        if (session.expires || session.error) {

            return redirect('/500');
        } else {

            const orgId = session.orgId;
            const orgName = session.orgName;

            setOrgId(orgId);

            return {
                props: { session, orgId, orgName },
            }
        }
    } else {

        return redirect('/404');
    }
}

export default function MoveOrg(props) {

    const router = useRouter();

    const moveTime = 40;
    const [redirectSeconds, setRedirectSeconds] = useState(moveTime);

    const redirectToOrg = useCallback(() => {
        router.push(`/o/${props.orgId}`)
    },[props.orgId, router])

    useEffect(() => {
        if (redirectSeconds <= 1) {
            redirectToOrg();

            return;
        }

        setTimeout(() => {
            setRedirectSeconds((redirectSeconds) => redirectSeconds - 1);
        }, moveTime)
    }, [redirectSeconds, props.orgId, redirectToOrg]);

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
            }>You will be redirected to {props.orgName}</p>
        </div>

    )
}
