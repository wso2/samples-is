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

export interface LogoutRequestDeniedInterface {
  /**
   * Error message to show in the title
   */
  errorMessage: string;
  /**
   * Handles Login process
   */
  handleLogin: () => void;
  /**
   * Handles Logout process
   */
  handleLogout: () => void;
}

/**
 * Page to display for Invalid System Time Page.
 *
 * @param {LogoutRequestDeniedInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const LogoutRequestDenied: FunctionComponent<LogoutRequestDeniedInterface> = (
  props: LogoutRequestDeniedInterface
): ReactElement => {
  
  const {
    errorMessage,
    handleLogin,
    handleLogout
  } = props;

  return (
    <DefaultLayout>
      <div className="ui visible negative message">
        <div className="mt-4 h3 b"> { errorMessage } </div>
        <p className="my-4">
          <a className="link-button pointer" role="button" onClick={handleLogin}>
            Try Log in again
          </a>
          &nbsp;or&nbsp;
          <a onClick={handleLogout} className="link-button pointer" role="button">
            Log out from the application.
          </a>
        </p>
      </div>
    </DefaultLayout>
  );
};
