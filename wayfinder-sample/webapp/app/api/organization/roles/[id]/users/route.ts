import { NextRequest, NextResponse } from "next/server";
import { requireScope } from "../../../../../lib/auth/guard";
import { Scope } from "../../../../../lib/auth/utils";
import { scimGetRoleById, scimUpdateRoleUsers } from "../../../../../lib/asgardeo/client";
import { logger } from "../../../../../lib/logging/logger";
import { logRequestActor } from "../../../../../lib/auth/log";

const routeLogger = logger.child({ route: "organization/roles/[id]/users" });

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  logRequestActor("organization/roles/[id]/users", request);
  const auth = await requireScope(request, [Scope.ROLE_USERS_UPDATE]);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ message: "Role ID is required." }, { status: 400 });
  }

  try {
    const payload = await request.json();
    const newUserIds: string[] = Array.isArray(payload.userIds) ? payload.userIds : [];

    const accessToken = request.headers.get("authorization")!.slice(7);

    const role = await scimGetRoleById(accessToken, id);
    const currentUserIds = (role.users ?? []).map((u) => u.value);

    const toAdd = newUserIds.filter((uid) => !currentUserIds.includes(uid));
    const toRemove = currentUserIds.filter((uid) => !newUserIds.includes(uid));

    await scimUpdateRoleUsers(accessToken, id, toAdd, toRemove);

    return NextResponse.json({ success: true });
  } catch (error) {
    routeLogger.error({ err: error, roleId: id }, "Failed to update role users");
    return NextResponse.json({ message: "Failed to update role assignments." }, { status: 500 });
  }
}
