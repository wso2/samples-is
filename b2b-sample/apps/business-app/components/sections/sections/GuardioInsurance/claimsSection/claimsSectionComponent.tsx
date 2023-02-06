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
import { EmptySettingsComponent, SettingsTitleComponent } from "@b2bsample/shared/ui/ui-components";
import ShieldIcon from "@rsuite/icons/Shield";
import { Button, Container, Stack } from "rsuite";
import "rsuite/dist/rsuite.min.css";

/**
 * 
 * @param prop - session
 *
 * @returns Dashboard interface section
 */
export default function PhoneSectionComponent() {

    return (
        <Container>
            <SettingsTitleComponent
                title="Claim"
                subtitle="Make a claim and view your claims history" />
            <br />

            <EmptySettingsComponent
                bodyString="No claims have been made"
                buttonString="Make a claim"
                icon={ <ShieldIcon style={ { opacity: 0.2 } } width="150px" height="150px" /> }
                onAddButtonClick={ () => true }
            />
            <br />
            <Stack direction="column" alignItems="flex-start" spacing={ 20 }>
                <h5>If you are in am emergency, please contact relevant autorities</h5>
                <Stack spacing={ 30 }>
                    <Button appearance="ghost">
                        <Stack spacing={ 5 }>
                            <CustomHtmlHeading
                                content="119"
                                headingType="h5" />
                            <CustomHtmlHeading
                                content="- Police Department"
                                headingType="h5"
                                fontWeight="normal" />
                        </Stack>
                    </Button>

                    <Button appearance="ghost">
                        <Stack spacing={ 5 }>
                            <CustomHtmlHeading
                                content="118"
                                headingType="h5" />
                            <CustomHtmlHeading
                                content="- Police Department"
                                headingType="h5"
                                fontWeight="normal" />
                        </Stack>
                    </Button>

                    <Button appearance="ghost">
                        <Stack spacing={ 5 }>
                            <CustomHtmlHeading
                                content="1919"
                                headingType="h5" />
                            <CustomHtmlHeading
                                content="- Suwa Sariya"
                                headingType="h5"
                                fontWeight="normal" />
                        </Stack>
                    </Button>

                    <Button appearance="ghost">
                        <Stack spacing={ 5 }>
                            <CustomHtmlHeading
                                content="110"
                                headingType="h5" />
                            <CustomHtmlHeading
                                content="- Ambulance / Fire & rescue"
                                headingType="h5"
                                fontWeight="normal" />
                        </Stack>
                    </Button>

                </Stack>

                <Stack spacing={ 30 }>
                    <Button appearance="ghost">
                        <Stack spacing={ 5 }>
                            <CustomHtmlHeading
                                content="011-2691111"
                                headingType="h5" />
                            <CustomHtmlHeading
                                content="- Accident Service-General Hospital-Colombo"
                                headingType="h5"
                                fontWeight="normal" />
                        </Stack>
                    </Button>

                    <Button appearance="ghost">
                        <Stack spacing={ 5 }>
                            <CustomHtmlHeading
                                content="011-2422222"
                                headingType="h5" />
                            <CustomHtmlHeading
                                content="- Fire & Ambulance Service"
                                headingType="h5"
                                fontWeight="normal" />
                        </Stack>
                    </Button>

                </Stack>
            </Stack>
        </Container>
    );
}
