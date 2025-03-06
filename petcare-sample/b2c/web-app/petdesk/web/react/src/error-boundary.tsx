import { AsgardeoAuthException } from "@asgardeo/auth-react";
import React, { FunctionComponent, ReactElement } from "react";
import { AuthenticationFailure } from "./pages/AuthenticationFailure";
import { InvalidSystemTimePage } from "./pages/InvalidSystemTime";

interface ErrorBoundaryProps {
  error: AsgardeoAuthException;
  children: ReactElement;
}

export const ErrorBoundary: FunctionComponent<ErrorBoundaryProps> = (
  props: ErrorBoundaryProps
): ReactElement => {
  const { error, children } = props;

  if (error?.code === "SPA-CRYPTO-UTILS-VJ-IV01" || error?.message === "ERR_JWT_CLAIM_VALIDATION_FAILED nbf") {
    return <InvalidSystemTimePage />
  } else if (error?.code === "SPA-MAIN_THREAD_CLIENT-SI-SE01") {
    return <AuthenticationFailure />
  }

  return children;
};
