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

import { IndexHomeComponent } from "@b2bsample/shared/ui/ui-components";
import { useRouter } from "next/router";
import React from "react";
import "rsuite/dist/rsuite.min.css";
import homeImage from "../../../libs/shared/ui/ui-assets/src/lib/images/home.jpeg";

/**
 * 
 * @returns - First interface of the app
 */
export default function Home() {

    const router = useRouter();
    const signinOnClick = () => {
        router.push("/signin");
    };

    return (
        <IndexHomeComponent
            image={ homeImage }
            tagText="Let&apos;s get your journey started."
            signinOnClick={ signinOnClick }
        />
       
    );
}
