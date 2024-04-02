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

import React, { FunctionComponent, ReactElement } from "react";
import { DefaultLayout } from "../layouts/default";

/**
 * Page to display for Invalid System Time Page.
 *
 * @param {InvalidSystemTimePagePropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const InvalidSystemTimePage: FunctionComponent = (): ReactElement => {

  return (
    <DefaultLayout>
      <h6 style={{
          fontSize: "30px",
          textTransform: "uppercase",
          fontWeight: 600,
          marginTop: "3rem",
          marginBottom: "8px",
          color: "#151515"
        }}>
          Your Clock is Invalid !
      </h6>
      <p style={{
          fontSize: "20px",
          fontWeight: 400,
          marginTop: "3rem",
          marginBottom: "3rem",
          color: "#151515"
        }}>
          It looks like your computer&rsquo;s date and time is incorrect. Please validate and try again
      </p>
    </DefaultLayout>
  );
};
