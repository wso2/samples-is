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

type TokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

export async function POST(request: Request) {
  try {
    const { subject_token, actor_token } = (await request.json()) as {
      subject_token?: string;
      actor_token?: string;
    };

    if (!subject_token || !actor_token) {
      return NextResponse.json(
        { error: "subject_token and actor_token are required." },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

    if (!baseUrl || !clientId || !clientSecret) {
      return NextResponse.json(
        { error: "Server auth configuration is incomplete." },
        { status: 500 }
      );
    }

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const response = await fetch(`${baseUrl}/oauth2/token`, {
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
        subject_token,
        subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
        requested_token_type: "urn:ietf:params:oauth:token-type:access_token",
        actor_token,
        actor_token_type: "urn:ietf:params:oauth:token-type:id_token",
      }),
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const body = (await response.json().catch(() => ({}))) as TokenResponse;

    if (!response.ok || !body.access_token) {
      const message = body.error_description ?? body.error ?? "Token exchange failed.";
      console.error("[auth/impersonate] Asgardeo token exchange failed.", {
        status: response.status,
        error: body.error,
        error_description: body.error_description,
      });
      return NextResponse.json(
        { error: message },
        { status: response.ok ? 500 : response.status }
      );
    }

    return NextResponse.json({ access_token: body.access_token });
  } catch (error) {
    console.error("[auth/impersonate] Token exchange failed.", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
