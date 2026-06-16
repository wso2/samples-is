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

import { NextResponse } from "next/server";
import { logger } from "../../../lib/logging/logger";

const routeLogger = logger.child({ route: "auth/token" });

type TokenResponse = {
  access_token?: string;
  id_token?: string;
  error?: string;
  error_description?: string;
};

export async function POST(request: Request) {
  try {
    const { code } = (await request.json()) as { code?: string };

    if (!code) {
      return NextResponse.json({ error: "Authorization code is required." }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const redirectUri = process.env.NEXT_PUBLIC_AFTER_SIGN_IN_URL;

    if (!baseUrl || !clientId || !clientSecret || !redirectUri) {
      return NextResponse.json({ error: "Server auth configuration is incomplete." }, { status: 500 });
    }

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const response = await fetch(`${baseUrl}/oauth2/token`, {
      body: new URLSearchParams({
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri
      }),
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST"
    });

    const body = (await response.json().catch(() => ({}))) as TokenResponse;

    if (!response.ok || !body.access_token) {
      const message = body.error_description ?? body.error ?? "Failed to exchange authorization code.";
      routeLogger.warn({
        error: body.error,
        statusCode: response.status,
      }, "Token exchange returned an unsuccessful response");
      return NextResponse.json({ error: message }, { status: response.ok ? 500 : response.status });
    }

    return NextResponse.json({ access_token: body.access_token, id_token: body.id_token });
  } catch (error) {
    routeLogger.error({ err: error }, "Token exchange failed");
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
