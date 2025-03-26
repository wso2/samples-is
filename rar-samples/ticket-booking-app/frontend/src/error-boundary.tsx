/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { AsgardeoAuthException } from "@asgardeo/auth-react";
import React, { FunctionComponent, ReactElement } from "react";
import { AuthenticationFailure } from "./pages/AuthenticationFailure";
import { InvalidSystemTimePage } from "./pages/InvalidSystemTime";
import { IssuerClaimValidationFailure } from "./pages/IssuerClaimValidationFailure";
import { VerifyIDTokenFailure } from "./pages/VerifyIDTokenFailure";

interface ErrorBoundaryProps {
  error: AsgardeoAuthException;
  children: ReactElement;
}

export const ErrorBoundary: FunctionComponent<ErrorBoundaryProps> = (
  props: ErrorBoundaryProps
): ReactElement => {
  const { error, children } = props;

  if (error?.code === "SPA-CRYPTO-UTILS-VJ-IV01") {
    if (error?.message === "ERR_JWT_CLAIM_VALIDATION_FAILED nbf") {
      return <InvalidSystemTimePage />
    } else if (error?.message === "ERR_JWT_CLAIM_VALIDATION_FAILED iss") {
      return <IssuerClaimValidationFailure/>
    } else {
      return <VerifyIDTokenFailure error={error}/>
    }
  } else if (error?.code === "SPA-MAIN_THREAD_CLIENT-SI-SE01") {
    return <AuthenticationFailure />
  }

  return children;
};
