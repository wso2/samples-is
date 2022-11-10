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

import CodeIcon from "@rsuite/icons/Code";
import React, { useState } from "react";
import { Nav, Panel, Stack } from "rsuite";
import { selectedTemplateBaesedonTemplateId } from "../../../../../../util/util/applicationUtil/applicationUtil";
import AccordianItemHeader from "../../../../../common/accordianItemHeader";
import JsonDisplay from "../../../../../common/jsonDisplay";

/**
 * 
 * @param prop
 * 
 * @returns role item componet
 */
export default function RoleItem(prop) {

    const { session, id, name } = prop;

    const [idpDetails, setIdpDetails] = useState({});
    const [activeKeyNav, setActiveKeyNav] = useState("1");

    // const fetchData = useCallback(async () => {
    //     const res = await decodeGetDetailedIdentityProvider(session, id);

    //     setIdpDetails(res);
    // }, [session, id]);

    // useEffect(() => {
    //     fetchData();
    // }, [fetchData]);

    // const activeKeyNavSelect = (eventKey) => {
    //     setActiveKeyNav(eventKey);
    // };

    return (

        idpDetails
            ? (<Panel
                header={
                    <AccordianItemHeader
                    title={name}
                    description = {`Organization role ${name} details`}/>
                }
                eventKey={id}
                id={id}>
                <div style={{ marginLeft: "25px", marginRight: "25px" }}>
                    <Stack direction="column" alignItems="stretch">
                        as
                    </Stack>
                </div>
            </Panel>)
            : null
    );
}

function IdentityProviderDetailsNav(prop) {

    const { idpDetails, activeKeyNav, activeKeyNavSelect } = prop;

    const templateIdCheck = () => {
        let selectedTemplate = selectedTemplateBaesedonTemplateId(idpDetails.templateId);

        if (selectedTemplate) {
            return true;
        } else {
            return false;
        }
    };

    return (
        <Nav appearance="subtle" activeKey={activeKeyNav} style={{ marginBottom: 10, marginTop: 15 }}>
            <div
                style={{
                    alignItems: "stretch",
                    display: "flex"
                }}>
                <Nav.Item
                    eventKey="1"
                    onSelect={(eventKey) => activeKeyNavSelect(eventKey)}>General</Nav.Item>

                {
                    templateIdCheck()
                        ? (<Nav.Item
                            eventKey="2"
                            onSelect={(eventKey) => activeKeyNavSelect(eventKey)}>
                            Settings
                        </Nav.Item>)
                        : null
                }

                <div style={{ flexGrow: "1" }}></div>

                <Nav.Item
                    eventKey="3"
                    onSelect={(eventKey) => activeKeyNavSelect(eventKey)}
                    icon={<CodeIcon />}>
                    Developer Tools
                </Nav.Item>
            </div>

        </Nav>
    );
}
