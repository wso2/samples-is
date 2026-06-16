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
import { scimSendPasswordResetLink } from "../../../../../lib/asgardeo/client";
import { logRequestActor } from "../../../../../lib/auth/log";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  logRequestActor("organization/users/[id]/reset-password", request);
  const auth = await requireScope(request, [Scope.USER_UPDATE]);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ message: "User ID is required." }, { status: 400 });
  }

  try {
    const accessToken = request.headers.get("authorization")!.slice(7);
    await scimSendPasswordResetLink(accessToken, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[organization/users/${id}/reset-password] Failed to send reset link.`, error);
    return NextResponse.json({ message: "Failed to send password reset link." }, { status: 500 });
  }
}
