import { NextRequest, NextResponse } from "next/server";
import { requireScope } from "../../../lib/auth/guard";
import { Scope, USER_ROLE_TO_ASGARDEO_ROLE, UserRole } from "../../../lib/auth/utils";
import { scimAssignRoleToUser, scimCreateUser, scimFetchRoleIdByName, scimListUsers } from "../../../lib/asgardeo/client";
import { logger } from "../../../lib/logging/logger";
import { logRequestActor } from "../../../lib/auth/log";

const routeLogger = logger.child({ route: "organization/users" });

type InviteRequest = {
  email?: string;
  givenName?: string;
  familyName?: string;
  role?: string;
};

function resolveAsgardeoRoleName(uiRole: string): string {
  return USER_ROLE_TO_ASGARDEO_ROLE[uiRole as UserRole] ?? uiRole;
}

export async function GET(request: NextRequest) {
  logRequestActor("organization/users", request);
  const auth = await requireScope(request, [Scope.USER_LIST]);
  if (auth instanceof NextResponse) return auth;

  try {
    const accessToken = request.headers.get("authorization")!.slice(7);
    const { users } = await scimListUsers(accessToken);

    const localUsers = users.filter((u) => !u["urn:scim:wso2:schema"]?.managedOrg);

    const mapped = localUsers.map((u) => {
      const rawEmail = u.emails?.[0];
      const email =
        typeof rawEmail === "string" ? rawEmail :
        typeof rawEmail === "object" ? rawEmail.value :
        u.userName.replace(/^[^/]+\//, "");
      const givenName = u.name?.givenName ?? "";
      const familyName = u.name?.familyName ?? "";
      const name = [givenName, familyName].filter(Boolean).join(" ") || email.split("@")[0];
      const status = u["urn:scim:wso2:schema"]?.accountLocked === "true" ? "Locked" : "Active";

      return { id: u.id, userName: u.userName, email, name, status };
    });

    return NextResponse.json({ users: mapped, totalResults: mapped.length });
  } catch (error) {
    routeLogger.error({ err: error }, "Failed to list users");
    return NextResponse.json({ message: "Failed to fetch users." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  logRequestActor("organization/users", request);
  const auth = await requireScope(request, [Scope.USER_CREATE]);
  if (auth instanceof NextResponse) return auth;

  try {
    const payload = (await request.json()) as InviteRequest;
    const email = (typeof payload.email === "string" ? payload.email : "").trim().toLowerCase();
    const givenName = typeof payload.givenName === "string" ? payload.givenName.trim() || undefined : undefined;
    const familyName = typeof payload.familyName === "string" ? payload.familyName.trim() || undefined : undefined;
    const uiRole = typeof payload.role === "string" ? payload.role : "Member";

    if (!email) {
      return NextResponse.json({ message: "Email is required." }, { status: 400 });
    }

    const accessToken = request.headers.get("authorization")!.slice(7);

    const user = await scimCreateUser(accessToken, { email, givenName, familyName });

    const roleName = resolveAsgardeoRoleName(uiRole);
    const roleId = await scimFetchRoleIdByName(accessToken, roleName);

    if (roleId) {
      await scimAssignRoleToUser(accessToken, roleId, user.id);
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email,
          name: user.name,
          userName: user.userName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    routeLogger.error({ err: error }, "Failed to invite user");
    return NextResponse.json({ message: "We couldn't send the invitation. Please try again." }, { status: 500 });
  }
}
