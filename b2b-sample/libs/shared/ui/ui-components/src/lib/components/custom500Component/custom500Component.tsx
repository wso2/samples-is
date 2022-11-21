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

import { orgSignout } from "@b2bsample/shared/util/util-authorization-config-util";
import Image from "next/image";
import { Button, Stack } from "rsuite";
import errorImage from "../../../../../ui-assets/src/lib/images/500.svg";
import styles from "./custom500Component.module.css";

export function Custom500Component() {
    const goBack = async () => await orgSignout(null);

    return (
        <Stack
            className={styles["errorMainContent"]}
            spacing={50}
            direction="column"
            justifyContent="center"
            alignItems="center">

            <Image src={errorImage} width={500} alt="404 image" />

            <Stack
                spacing={25}
                direction="column"
                justifyContent="center"
                alignItems="center">

                <p className={styles["p"]}><b>It looks like you have been inactive for a long time.</b>
                    <br />
                    When you click on <i>Go back</i>, we will try to recover the session if it exists.
                    <br />
                    If you don&apos;t have an active session, you will be redirected to the login page.
                </p>
                <Button
                    size="lg"
                    appearance="ghost"
                    onClick={goBack}>
                    Go Back
                </Button>
            </Stack>
            
        </Stack>
    );
};


export default Custom500Component;
