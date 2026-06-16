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
