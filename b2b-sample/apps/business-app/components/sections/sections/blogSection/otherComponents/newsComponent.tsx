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

import { getCurrentDate } from "@b2bsample/shared/util/util-common";
import Image from "next/image";
import { Stack } from "rsuite";
import image1 from "../../../../../../../libs/business-app/ui-assets/src/lib/images/news/news1.jpeg";
import image2 from "../../../../../../../libs/business-app/ui-assets/src/lib/images/news/news2.jpeg";
import image3 from "../../../../../../../libs/business-app/ui-assets/src/lib/images/news/news3.jpeg";
import image4 from "../../../../../../../libs/business-app/ui-assets/src/lib/images/news/news4.jpeg";

interface NewsComponentInterface {
    header: string,
    body: string
}

/**
 * 
 * @param prop - header (header text), body (body text)
 *
 * @returns Single news component
 */
export default function NewsComponent(props: NewsComponentInterface) {

    const { header, body } = props;

    return (
        <Stack spacing={ 20 }>
            <Image src={ selectImage() } height={ 250 } width={ 300 } alt="news image" />
            <Stack direction="column" alignItems="flex-start">
                <p>{ getCurrentDate() }</p>
                <br />
                <h4>{ header }</h4>
                <p>{ body }</p>
            </Stack>

        </Stack>
    );
}

function selectImage(): string {
    const imageList: string[] = [ image1, image2, image3, image4 ];

    return imageList[imageList.length * Math.random() | 0];
}
