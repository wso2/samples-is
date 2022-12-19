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

import { CustomHtmlHeading } from "@b2bsample/shared/ui/ui-basic-components";
import { EmptySettingsComponent, SettingsTitleComponent } from "@b2bsample/shared/ui/ui-components";
import PeopleBranchIcon from "@rsuite/icons/PeopleBranch";
import Image from "next/image";
import { Button, Container, Stack } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import googleImage from "../../../../../../libs/business-app/ui-assets/src/lib/images/google.svg";
import microsoftImage from "../../../../../../libs/business-app/ui-assets/src/lib/images/microsoft.svg";

/**
 * 
 * @param prop - session
 *
 * @returns Dashboard interface section
 */
export default function MeetingsSectionComponent() {

    return (
        <Container>
            <SettingsTitleComponent
                title="Meetings"
                subtitle="Create and schedule your meetings" />
            <br />
            <EmptySettingsComponent
                bodyString="Schedule new and manage existing meetings all in one place"
                buttonString="Create meeting"
                icon={ <PeopleBranchIcon style={ { opacity: 0.2 } } width="150px" height="150px" /> }
                onAddButtonClick={ () => true }
            />
            <br />
            <Stack direction="column" alignItems="flex-start" spacing={ 20 }>
                <h5>Schedule your meetings directly from your calendar.</h5>
                <Stack spacing={ 30 }>
                    <Button appearance="ghost">
                        <Stack spacing={ 20 }>
                            <Image src={ googleImage } alt="google logo image" width={ 50 } />
                            <CustomHtmlHeading
                                content="Google Calander"
                                headingType="h5"
                                fontWeight="normal" />
                        </Stack>
                    </Button>

                    <Button appearance="ghost">
                        <Stack spacing={ 20 }>
                            <Image src={ microsoftImage } alt="microsoft logo image" width={ 50 } />
                            <CustomHtmlHeading
                                content="Microsoft Outlook Calander"
                                headingType="h5"
                                fontWeight="normal" />
                        </Stack>
                    </Button>
                </Stack>
            </Stack>

        </Container>
    );
}
