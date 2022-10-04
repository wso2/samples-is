/*
 * Copyright (c) 2022 WSO2 LLC. (https://www.wso2.com).
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

import React, { useCallback, useEffect, useState } from 'react';
import { Avatar, Nav, Panel, Stack, useToaster } from 'rsuite';
import decodeGetDetailedIdentityProvider from
	'../../../util/apiDecode/settings/identityProvider/decodeGetDetailedIdentityProvider';
import ButtonGroupIdentityProviderDetails from './buttonGroupIdentityProviderDetails';
import General from './idpDetailsSections/general';
import Raw from './idpDetailsSections/raw';
import Settings from './idpDetailsSections/settings';

export default function IdentityProviderDetails(props) {

	const toaster = useToaster();
	const [idpDetails, setIdpDetails] = useState({});
	const [activeKeyNav, setActiveKeyNav] = useState('1');

	const fetchData = useCallback(async () => {
		const res = await decodeGetDetailedIdentityProvider(props.session, props.id);
		setIdpDetails(res);
	}, [props])

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const activeKeyNavSelect = (eventKey) => {
		setActiveKeyNav(eventKey);
	}

	const idpDetailsComponent = (activeKey) => {
		switch (activeKey) {
			case '1':
				return <General session={props.session} idpDetails={idpDetails} fetchData={fetchData} />;
			case '2':
				return <Settings session={props.session} idpDetails={idpDetails} />;
			case '3':
				return <Raw idpDetails={idpDetails} />;
		}
	}

	return (
		<Panel header={
			<IdentityProviderDetailsHeader idpDetails={idpDetails} />
		} eventKey={props.id} id={props.id}>
			<div style={{ marginLeft: "25px", marginRight: "25px" }}>
				<Stack direction='column' alignItems='stretch'>
					<ButtonGroupIdentityProviderDetails id={props.id} fetchAllIdPs={props.fetchAllIdPs} />
					<IdentityProviderDetailsNav activeKeyNav={activeKeyNav} activeKeyNavSelect={activeKeyNavSelect} />

					<div>
						{idpDetailsComponent(activeKeyNav)}
					</div>

				</Stack>
			</div>

		</Panel>
	)
}

function IdentityProviderDetailsHeader(props) {
	
	return (
		<Stack>
			<Stack>
				<Avatar
					style={{ background: '#000', marginRight: "20px" }}
					size="lg"
					circle
					src={props.idpDetails.image}
					alt="IDP image"
				/>
				<Stack direction='column' justifyContent='flex-start' alignItems='stretch'>
					<h4>{props.idpDetails.name}</h4>
					<p>{props.idpDetails.description}</p>
				</Stack>
			</Stack>

		</Stack>
	)
}

function IdentityProviderDetailsNav(props) {
	return (
		<Nav appearance="subtle" activeKey={props.activeKeyNav} style={{ marginBottom: 10 }}>
			<Nav.Item eventKey="1"
				onSelect={(eventKey) => props.activeKeyNavSelect(eventKey)}>General</Nav.Item>
			<Nav.Item eventKey="2"
				onSelect={(eventKey) => props.activeKeyNavSelect(eventKey)}>Settings</Nav.Item>
			<Nav.Item eventKey="3"
				onSelect={(eventKey) => props.activeKeyNavSelect(eventKey)}>Raw</Nav.Item>
		</Nav>
	);
}
