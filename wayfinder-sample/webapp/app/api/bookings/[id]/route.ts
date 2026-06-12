import { NextRequest, NextResponse } from "next/server";
import { requireScope } from "../../../lib/auth/guard";
import { getRolesFromPermissions, Scope, UserRole } from "../../../lib/auth/utils";
import { cancelOrgBooking } from "../../../lib/db/queries/bookings";
import { logRequestActor } from "../../../lib/auth/log";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  logRequestActor("bookings/[id]", request);
  const auth = await requireScope(request, [Scope.BOOKING_DELETE]);
  if (auth instanceof NextResponse) return auth;

  const { orgId, sub, roles } = auth.claims;
  const isAdmin = getRolesFromPermissions(roles).includes(UserRole.ADMIN);
  const { id } = await params;

  const booking = cancelOrgBooking(orgId, id, sub, isAdmin);

  if (!booking) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }

  return NextResponse.json({ booking });
}
