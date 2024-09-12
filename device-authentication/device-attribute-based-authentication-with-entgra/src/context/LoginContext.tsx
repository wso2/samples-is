/*
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, {useContext, useState} from 'react';

const initialState = {
  accessToken: '',
  allowedScopes: '',
  amr: '',
  at_hash: '',
  aud: '',
  azp: '',
  c_hash: '',
  exp: '',
  hasLogin: false,
  hasLogoutInitiated: false,
  iat: '',
  idToken: '',
  iss: '',
  loading: false,
  nbf: '',
  refreshToken: '',
  sessionState: '',
  sub: '',
  username: '',
};

const LoginContext = React.createContext({});

const LoginContextProvider = (props: {
  children:
    | boolean
    | React.ReactChild
    | React.ReactFragment
    | React.ReactPortal;
}) => {
  const [loginState, setLoginState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  return (
    <LoginContext.Provider
      value={{
        loading,
        loginState,
        setLoading,
        setLoginState,
      }}>
      {props.children}
    </LoginContext.Provider>
  );
};

const useLoginContext = (): any => {
  return useContext(LoginContext);
};

export {initialState, LoginContextProvider, useLoginContext};
