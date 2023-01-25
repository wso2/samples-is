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

import { Stack } from "rsuite";
import NewsComponent from "./newsComponent";
import newsList from "../../../../../../../../libs/business-app/ui-assets/src/lib/data/news.json";

export default function LatestNewsComponent() {

    return (
        <div>
            <Stack direction="column" spacing={ 10 }>
                {
                    newsList.news.map(news => {

                        return (<NewsComponent
                            key={ news.id * -1 }
                            header={ news.header }
                            body={ news.body } />);
                    })
                }
                {
                    newsList.news.map(news => {

                        return (<NewsComponent
                            key={ news.id * -1 }
                            header={ news.header }
                            body={ news.body } />);
                    })
                }
            </Stack>
        </div>
    );
}
