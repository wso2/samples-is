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

import React from 'react';

import { getSession } from 'next-auth/react';
import Settings from '../../components/settingsComponents/settings';
import { getOrg, getRouterQuery } from '../../util/util/orgUtil/orgUtil';
import { parseCookies, redirect } from '../../util/util/routerUtil/routerUtil';

export async function getServerSideProps(context) {

  const routerQuery = context.query.id;
  const session = await getSession(context);
  let setOrg = {};

  const cookies = parseCookies(context.req);
  const subOrgId = cookies.orgId;

  if (session === null || session === undefined || session.expires || session.error
    || routerQuery !== getRouterQuery(subOrgId)) {

    return redirect(`/o/moveOrg?o=${routerQuery}`);
  } else {
    setOrg = getOrg(subOrgId);

    return {
      props: { session, setOrg },
    }
  }

}

export default function Org(props) {

  return (
    <Settings orgId={props.setOrg.id} routerQuery={props.setOrg.routerQuery} name={props.setOrg.name}
      session={props.session} olorTheme={props.setOrg.colorTheme} />
  )
}
