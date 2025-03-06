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

import React, { FunctionComponent, ReactElement, useState } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import { DefaultLayout } from "../layouts/default";

/**
 * Page to display Authentication Failure Page.
 *
 * @param {AuthenticationFailureInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const AuthenticationFailure: FunctionComponent = (): ReactElement => {

  const { signIn } = useAuthContext();
  const [ hasAuthenticationErrors, setHasAuthenticationErrors ] = useState<boolean>(false);
  
  const handleLogin = () => {
    signIn()
        .catch(() => setHasAuthenticationErrors(true));
  };

  return (
    <DefaultLayout hasErrors={ hasAuthenticationErrors }>
      <div className="content">
          <div className="ui visible negative message">
              <div className="header"><b>Authentication Error!</b></div>
              <p>Please check application configuration and try login again!.</p>
          </div>
          <button className="btn primary" onClick={ handleLogin }>Login</button>
      </div>
    </DefaultLayout>
  );
};
