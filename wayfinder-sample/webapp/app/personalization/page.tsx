"use client";

import { useAuth } from "../lib/auth/client";
import { getRolesFromPermissions, UserRole } from "../lib/auth/utils";
import WorkspaceShell from "../WorkspaceShell";
import PersonalizationDashboard from "./PersonalizationDashboard";

export default function PersonalizationPage() {
  const { user } = useAuth();
  const roles = user ? getRolesFromPermissions(user.permissions) : [UserRole.MEMBER];

  const canAccess =
    roles.includes(UserRole.ADMIN) ||
    roles.includes(UserRole.BASIC_BRANDING_EDITOR) ||
    roles.includes(UserRole.ADVANCED_BRANDING_EDITOR);

  if (!canAccess) {
    return (
      <WorkspaceShell
        activeHref="/personalization"
        eyebrow="Member workspace"
        roles={roles}
        title="Personalization"
      >
        <section className="workspace-panel">
          <p className="eyebrow">Access restricted</p>
          <h2>You don&apos;t have permission to view this page.</h2>
          <p>
            Personalization settings are available to administrators and branding editors only.
          </p>
        </section>
      </WorkspaceShell>
    );
  }

  return <PersonalizationDashboard roles={roles} />;
}
