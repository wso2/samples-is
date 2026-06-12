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
