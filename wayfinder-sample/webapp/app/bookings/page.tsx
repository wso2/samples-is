"use client";

import { useAuth } from "../lib/auth/client";
import { getRolesFromPermissions, UserRole } from "../lib/auth/utils";
import BookingsDashboard from "./BookingsDashboard";

export default function BookingsPage() {
  const { user } = useAuth();
  const roles = user ? getRolesFromPermissions(user.permissions) : [UserRole.MEMBER];

  return <BookingsDashboard roles={roles} />;
}
