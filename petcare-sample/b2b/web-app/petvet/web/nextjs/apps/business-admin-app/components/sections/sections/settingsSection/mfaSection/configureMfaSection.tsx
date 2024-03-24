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

import { SettingsTitleComponent } from "@pet-management-webapp/shared/ui/ui-components";
import { EMAIL, SMS, TOTP } from "@pet-management-webapp/shared/util/util-common";
import { Session } from "next-auth";
import { Container, FlexboxGrid } from "rsuite";
import EmailAsMFA from "./emailAsMFA";
import SmsAsMFA from "./smsAsMFA";
import TotpAsMFA from "./totpAsMFA";
import styles from "../../../../../styles/idp.module.css";

interface ConfigureMFASectionProps {
    session: Session
}

export default function ConfigureMFASection(props: ConfigureMFASectionProps) {

    const { session } = props;

    return (
        <Container>
            <SettingsTitleComponent
                title="Multi Factor Authentication"
                subtitle="Configure Multi Factor Authentication for your application."
            />

            <FlexboxGrid
                style={ { height: "60vh", marginTop: "24px", width: "100%" } }
                justify="start"
                align="top" >
                <div className={ styles.idp__list }>
                    <EmailAsMFA session={ session } key={ EMAIL } id={ EMAIL } />
                    <SmsAsMFA session={ session } key={ SMS } id={ SMS } />
                    <TotpAsMFA session={ session } key={ TOTP } id={ TOTP } />
                </div>
            </FlexboxGrid >

        </Container>
    );

}
