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
import { requireAuth } from "../../lib/auth/guard";
import { listFlights } from "../../lib/db/queries/flights";
import { logRequestActor } from "../../lib/auth/log";

export async function GET(request: NextRequest) {
  logRequestActor("flights", request);
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(request.url);

  const flights = listFlights({
    from: searchParams.get("from") ?? undefined,
    to: searchParams.get("to") ?? undefined,
    cabin: searchParams.get("cabin") ?? undefined,
  });

  return NextResponse.json({ flights });
}
