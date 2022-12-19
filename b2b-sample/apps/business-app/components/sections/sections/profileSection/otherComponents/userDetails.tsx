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

import { InternalUser } from "@b2bsample/shared/data-access/data-access-common-models-util";
import { CustomHtmlHeading } from "@b2bsample/shared/ui/ui-basic-components";
import Image from "next/image";
import { FlexboxGrid, Message, Panel, Stack } from "rsuite";
import profileImage from "../../../../../../../libs/business-app/ui-assets/src/lib/images/profile.svg";
import styles from "../../../../../styles/Settings.module.css";

interface UserDetailsInterface {
    me: InternalUser
}

/**
 * 
 * @param prop - me (details of the logged in user)
 *
 * @returns The profile details section
 */
export default function UserDetails(props: UserDetailsInterface) {

    const { me } = props;

    return (
        me
            ? (
                <div className={ styles.homeMainPanelDiv }>
                    <FlexboxGrid align="middle" justify="space-between">

                        <FlexboxGrid.Item colspan={ 4 }>
                            <Image src={ profileImage } className={ styles.profileImage } alt="profile image" />
                        </FlexboxGrid.Item>

                        <FlexboxGrid.Item colspan={ 18 }>

                            <CustomHtmlHeading content={ `${me.firstName} ${me.firstName}` } headingType="h2" />
                            <CustomHtmlHeading
                                content={ `${me.email}` }
                                headingType="h4"
                                fontWeight="normal" />

                        </FlexboxGrid.Item>
                    </FlexboxGrid>

                    <Message>
                        <b>Profile Details</b>
                    </Message>

                    <FlexboxGrid align="middle" justify="space-around">

                        <FlexboxGrid.Item colspan={ 2 }>

                            <Stack direction="column" alignItems="flex-start" spacing={ 15 }>
                                <h5>First Name :</h5>
                                <h5>Last Name :</h5>
                                <h5>User ID :</h5>
                                <h5>Username :</h5>
                                <h5>Email :</h5>
                            </Stack>

                        </FlexboxGrid.Item>

                        <FlexboxGrid.Item colspan={ 19 }>
                            <Stack direction="column" alignItems="flex-start" spacing={ 15 }>
                                <CustomHtmlHeading
                                    content={ `${me.firstName}` }
                                    headingType="h5"
                                    fontWeight="normal" />

                                <CustomHtmlHeading
                                    content={ `${me.familyName}` }
                                    headingType="h5"
                                    fontWeight="normal" />

                                <CustomHtmlHeading
                                    content={ `${me.id}` }
                                    headingType="h5"
                                    fontWeight="normal" />

                                <CustomHtmlHeading
                                    content={ `${me.username}` }
                                    headingType="h5"
                                    fontWeight="normal" />

                                <CustomHtmlHeading
                                    content={ `${me.email}` }
                                    headingType="h5"
                                    fontWeight="normal" />
                            </Stack>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>

                </div>)
            : (<Panel bordered>
                <div>Add the user attributes in created the application to display user details</div>
            </Panel>)
    );
}
