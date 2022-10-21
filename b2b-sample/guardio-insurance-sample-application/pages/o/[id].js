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

import React, { useEffect } from 'react';

import { getSession } from 'next-auth/react';
import Settings from '../../components/settingsComponents/settings';
import { orgSignin, redirect } from '../../util/util/routerUtil/routerUtil';

export async function getServerSideProps(context) {

	const routerQuery = context.query.id;
	const session = await getSession(context);

	if (session === null || session === undefined) {

		return {
			props: { routerQuery },
		};
	} else {
		if (routerQuery !== session.orgId) {

			return redirect('/404');
		} else {

			return {
				props: { session },
			}
		}

	}

}

export default function Org(props) {

	useEffect(() => {
		if (props.routerQuery) {
			orgSignin(props.routerQuery);
			return;
		}
	}, [props.routerQuery]);

	return (
		props.session
			? <Settings 
			        orgId={props.session.orgId} 
			        name={props.session.orgName} 
			        session={props. Session}
				colorTheme={'blue'} 
			/>
			: null
	)
}
