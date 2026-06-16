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
