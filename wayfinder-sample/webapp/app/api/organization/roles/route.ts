import { NextRequest, NextResponse } from "next/server";
import { requireScope } from "../../../lib/auth/guard";
import { ASGARDEO_ROLE_TO_USER_ROLE, Scope } from "../../../lib/auth/utils";
import { scimListRolesWithUsers } from "../../../lib/asgardeo/client";
import { logger } from "../../../lib/logging/logger";
import { logRequestActor } from "../../../lib/auth/log";

const routeLogger = logger.child({ route: "organization/roles" });

export async function GET(request: NextRequest) {
  logRequestActor("organization/roles", request);
  const auth = await requireScope(request, [Scope.ROLE_VIEW]);
  if (auth instanceof NextResponse) return auth;

  try {
    const accessToken = request.headers.get("authorization")!.slice(7);
    const asgardeoRoles = await scimListRolesWithUsers(accessToken);

    const roles = asgardeoRoles
      .map((r) => {
        const userRole = ASGARDEO_ROLE_TO_USER_ROLE[r.displayName];
        if (!userRole) return null;
        return {
          id: r.id,
          name: userRole,
          userIds: (r.users ?? []).map((u) => u.value),
        };
      })
      .filter(Boolean);

    return NextResponse.json({ roles });
  } catch (error) {
    routeLogger.error({ err: error }, "Failed to list roles");
    return NextResponse.json({ message: "Failed to fetch roles." }, { status: 500 });
  }
}
