/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
