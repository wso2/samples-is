"use client";

import { useAuth } from "../lib/auth/client";
import { getRolesFromPermissions, UserRole } from "../lib/auth/utils";
import WorkspaceShell from "../WorkspaceShell";
import BillingDashboard from "./BillingDashboard";

export default function BillingPage() {
  const { user } = useAuth();
  const roles = user ? getRolesFromPermissions(user.permissions) : [UserRole.MEMBER];

  if (!roles.includes(UserRole.ADMIN)) {
    return (
      <WorkspaceShell activeHref="/billing" eyebrow="Member workspace" roles={roles} title="Billing">
        <section className="workspace-panel">
          <p className="eyebrow">Access restricted</p>
          <h2>You don&apos;t have permission to view this page.</h2>
          <p>Billing settings are available to administrators only.</p>
        </section>
      </WorkspaceShell>
    );
  }

  return <BillingDashboard roles={roles} />;
}
