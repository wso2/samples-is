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
