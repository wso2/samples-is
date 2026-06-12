import { NextRequest, NextResponse } from "next/server";
import { requireScope } from "../../../../lib/auth/guard";
import { Scope } from "../../../../lib/auth/utils";
import { scimUpdateAccountLocked } from "../../../../lib/asgardeo/client";
import { logger } from "../../../../lib/logging/logger";
import { logRequestActor } from "../../../../lib/auth/log";

const routeLogger = logger.child({ route: "organization/users/[id]" });

type PatchRequest = { locked?: boolean };

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  logRequestActor("organization/users/[id]", request);
  const auth = await requireScope(request, [Scope.USER_UPDATE]);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ message: "User ID is required." }, { status: 400 });
  }

  try {
    const payload = (await request.json()) as PatchRequest;
    if (typeof payload.locked !== "boolean") {
      return NextResponse.json({ message: "'locked' boolean field is required." }, { status: 400 });
    }

    const accessToken = request.headers.get("authorization")!.slice(7);
    await scimUpdateAccountLocked(accessToken, id, payload.locked);

    return NextResponse.json({ success: true });
  } catch (error) {
    routeLogger.error({ err: error, userId: id }, "Failed to update account lock status");
    return NextResponse.json({ message: "Failed to update account status." }, { status: 500 });
  }
}
