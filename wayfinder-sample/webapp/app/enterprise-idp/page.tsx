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
