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

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth/client";
import { getRolesFromPermissions, UserRole } from "../lib/auth/utils";
import LoadingScreen from "../LoadingScreen";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const roles = user ? getRolesFromPermissions(user.permissions) : [UserRole.MEMBER];
    let destination = "/bookings";
    if (roles.includes(UserRole.ADMIN)) destination = "/requests";
    else if (roles.includes(UserRole.IDP_MANAGER)) destination = "/enterprise-idp";
    else if (roles.includes(UserRole.BASIC_BRANDING_EDITOR) || roles.includes(UserRole.ADVANCED_BRANDING_EDITOR)) destination = "/personalization";
    router.replace(destination);
  }, [isLoading, user, router]);

  return <LoadingScreen description="Taking you to your workspace…" steps={[]} title="Loading…" />;
}
