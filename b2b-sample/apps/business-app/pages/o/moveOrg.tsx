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

import { MoveOrganizationComponent } from "@b2bsample/shared/ui/ui-components";
import { redirect } from "@b2bsample/shared/util/util-authorization-config-util";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { NextRouter, useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export async function getServerSideProps(context) {

    const session: Session = await getSession(context);

    if (session) {

        if (session.expires || session.error) {

            return redirect("/sigin");
        } else {

            const orgId = session.orgId;

            return {
                props: { orgId }
            };
        }
    } else {

        return redirect("/404");
    }
}

interface MoveOrgInterface {
    orgId: string
}

/**
 * 
 * @param prop - orgId
 * 
 * @returns Interface to show which organization the user has logged into.
 */
export default function MoveOrg(props: MoveOrgInterface) {

    const { orgId } = props;

    const router: NextRouter = useRouter();

    const moveTime = 40;
    const [ redirectSeconds, setRedirectSeconds ] = useState<number>(moveTime);

    const redirectToOrg = useCallback(() => {
        router.push(`/o/${orgId}`);
    }, [ orgId, router ]);

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
        <MoveOrganizationComponent orgName={ "Easy Meeting" } />
    );
}
