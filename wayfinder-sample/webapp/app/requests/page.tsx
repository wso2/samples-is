"use client";

import { useAuth } from "../lib/auth/client";
import { getRolesFromPermissions, UserRole } from "../lib/auth/utils";
import TravelPolicyDashboard from "./TravelPolicyDashboard";
import WorkspaceShell from "../WorkspaceShell";

export default function RequestsPage() {
  const { user } = useAuth();
  const roles = user ? getRolesFromPermissions(user.permissions) : [UserRole.MEMBER];

  if (!roles.includes(UserRole.ADMIN)) {
    return (
      <WorkspaceShell activeHref="/requests" eyebrow="Member workspace" roles={roles} title="Travel policies">
        <section className="workspace-panel">
          <p className="eyebrow">Access restricted</p>
          <h2>You don&apos;t have permission to view this page.</h2>
          <p>Travel policy management is available to administrators only.</p>
        </section>
      </WorkspaceShell>
    );
  }

  return <TravelPolicyDashboard roles={roles} />;
}
