"use client";

import { useAuth } from "../lib/auth/client";
import { getRolesFromPermissions, UserRole } from "../lib/auth/utils";
import EnterpriseIdpDashboard from "./EnterpriseIdpDashboard";
import WorkspaceShell from "../WorkspaceShell";

export default function EnterpriseIdpPage() {
  const { user } = useAuth();
  const roles = user ? getRolesFromPermissions(user.permissions) : [UserRole.MEMBER];

  if (!roles.includes(UserRole.ADMIN) && !roles.includes(UserRole.IDP_MANAGER)) {
    return (
      <WorkspaceShell activeHref="/enterprise-idp" eyebrow="Member workspace" roles={roles} title="Enterprise IdP">
        <section className="workspace-panel">
          <p className="eyebrow">Access restricted</p>
          <h2>You don&apos;t have permission to view this page.</h2>
          <p>Enterprise identity provider configuration is available to administrators and IdP managers only.</p>
        </section>
      </WorkspaceShell>
    );
  }

  return <EnterpriseIdpDashboard roles={roles} />;
}
