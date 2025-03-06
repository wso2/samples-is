/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import React from "react";
import ContentLoader from "react-content-loader";

export function LoadContent() {

    return (
        <ContentLoader 
          speed={2}
          width={300}
          height={300}
          viewBox="0 0 300 100"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
        >
        </ContentLoader>
      );

}