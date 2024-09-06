/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { CustomHtmlHeading } from "@b2bsample/shared/ui/ui-basic-components";
import Image from "next/image";
import { Button, FlexboxGrid, Panel, Stack } from "rsuite";
import reportsImage from "../../../../../../../../libs/business-app/ui-assets/src/lib/images/reports.svg";

export default function ReportsComponent() {

    return (
        <Panel bordered>
            <FlexboxGrid align="middle">
                <FlexboxGrid.Item colspan={ 16 }>
                    <Stack direction="column" alignItems="flex-start" spacing={ 30 }>
                        <Stack direction="column" alignItems="flex-start" spacing={ 10 }>
                            <CustomHtmlHeading
                                content="Looks like you don’t have Reports feature enabled"
                                headingType="h4"
                                fontWeight="normal" />

                            <Button appearance="primary">
                                Upgrade to unlock this feature
                            </Button>
                        </Stack>


                        <Stack direction="column" alignItems="flex-start" spacing={ 10 }>
                            <CustomHtmlHeading
                                content="What you will get..."
                                headingType="h6" />

                            <ul>
                                <li>24x7 service</li>
                                <li>Capability to view your previous claim reports</li>
                                <li>Auto Attendant and IVR</li>
                                <li>Special discounts for our other <a href=""><u>features</u></a></li>
                            </ul>
                            
                        </Stack>
                    </Stack>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={ 8 }>
                    <Image src={ reportsImage } alt="reports image" width={ 300 } />
                </FlexboxGrid.Item>
            </FlexboxGrid>

        </Panel>
    );
}
