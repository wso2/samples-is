"use client";

import { useAuth } from "./lib/auth/client";

export default function ImpersonationBanner() {
  const { isImpersonating, impersonatedUserName, stopImpersonation } = useAuth();

  if (!isImpersonating) return null;

  return (
    <div className="impersonation-banner" role="alert">
      <span>
        You are currently impersonating <strong>{impersonatedUserName}</strong>.
      </span>
      <button onClick={stopImpersonation} type="button">
        Exit Impersonation
      </button>
    </div>
  );
}
