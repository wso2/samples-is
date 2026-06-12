/*
Copyright (c) 2026, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import { createLogger } from "./logger.js";

let requestCounter = 0;

const logger = createLogger({ service: "mcp-server" });

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnvFile(filePath: string) {
    if (!existsSync(filePath)) {
        return;
    }

    const lines = readFileSync(filePath, "utf8").split(/\r?\n/);

    for (const line of lines) {
        const trimmedLine = line.trim();

        if (!trimmedLine || trimmedLine.startsWith("#")) {
            continue;
        }

        const separatorIndex = trimmedLine.indexOf("=");

        if (separatorIndex <= 0) {
            continue;
        }

        const key = trimmedLine.slice(0, separatorIndex).trim();
        const rawValue = trimmedLine.slice(separatorIndex + 1).trim();
        const value = rawValue.replace(/^\s*["']|["']\s*$/g, "");

        if (key && process.env[key] === undefined) {
            process.env[key] = value;
        }
    }
}

loadEnvFile(resolve(__dirname, ".env"));

const appBaseUrl = (process.env.APP_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const port = Number(process.env.PORT || process.env.MCP_PORT || 8001);
const host = process.env.HOST || "localhost";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

class ApiRequestError extends Error {
    constructor(
        message: string,
        readonly statusCode: number,
        readonly body: JsonValue,
    ) {
        super(message);
        this.name = "ApiRequestError";
    }
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
    const [, payload] = token.split(".");

    if (!payload) {
        return null;
    }

    try {
        return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Record<string, unknown>;
    } catch {
        return null;
    }
}

function getBearerToken(authorization?: string) {
    return authorization?.startsWith("Bearer ") ? authorization.slice(7) : "";
}

function getAuthorizationHeader(request: IncomingMessage): string | undefined {
    const authorization = request.headers.authorization;

    return Array.isArray(authorization) ? authorization[0] : authorization;
}

function createApiClient(authorization?: string) {
    const apiLogger = logger.child({ component: "api" });

    async function requestApi(path: string, options: RequestInit = {}): Promise<JsonValue> {
        const headers = new Headers(options.headers);
        const method = options.method ?? "GET";

        headers.set("Accept", "application/json");

        if (options.body && !headers.has("Content-Type")) {
            headers.set("Content-Type", "application/json");
        }

        if (authorization) {
            headers.set("Authorization", authorization);
        }

        apiLogger.debug({ method, path }, "outbound request");

        const t0 = Date.now();

        const response = await fetch(`${appBaseUrl}${path}`, {
            ...options,
            headers,
            signal: AbortSignal.timeout(30000),
        });

        const durationMs = Date.now() - t0;

        apiLogger.info({ method, path, status: response.status, durationMs }, "response received");

        const contentType = response.headers.get("content-type") || "";
        const body = contentType.includes("application/json")
            ? await response.json()
            : await response.text();

        if (!response.ok) {
            apiLogger.warn({ method, path, status: response.status }, "upstream error response");
            throw new ApiRequestError(`B2B app request failed with ${response.status}`, response.status, body as JsonValue);
        }

        return body as JsonValue;
    }

    return {
        get: (path: string) => requestApi(path),
        post: (path: string, body: JsonValue) => requestApi(path, {
            method: "POST",
            body: JSON.stringify(body),
        }),
        put: (path: string, body: JsonValue) => requestApi(path, {
            method: "PUT",
            body: JSON.stringify(body),
        }),
    };
}

function toToolContent(data: JsonValue) {
    return {
        content: [
            {
                type: "text" as const,
                text: typeof data === "string" ? data : JSON.stringify(data, null, 2),
            },
        ],
    };
}

function getFailureMessage(error: unknown) {
    if (error instanceof ApiRequestError) {
        if (typeof error.body === "object" && error.body !== null && !Array.isArray(error.body)) {
            const body = error.body as Record<string, JsonValue>;

            if (typeof body.error === "string") {
                return body.error;
            }

            if (typeof body.message === "string") {
                return body.message;
            }
        }

        return error.message;
    }

    return error instanceof Error ? error.message : "The booking request failed.";
}

function toBookingFailureToolContent(error: unknown) {
    const message = getFailureMessage(error);
    const insufficientPermissions = /insufficient permissions/i.test(message);

    return toToolContent({
        authorizationRequired: insufficientPermissions,
        error: message,
        errorCode: insufficientPermissions ? "insufficient_permissions" : "booking_failed",
        message: insufficientPermissions
            ? "Insufficient permissions. User authorization is required before creating this booking."
            : "The flight booking could not be created.",
        statusCode: error instanceof ApiRequestError ? error.statusCode : 500,
        success: false,
    });
}

function createEnterpriseMcpServer(authorization?: string, reqId?: number) {
    const api = createApiClient(authorization);
    const tokenPayload = decodeJwtPayload(getBearerToken(authorization));

    const tokenContext = {
        sub: typeof tokenPayload?.sub === "string" ? tokenPayload.sub : undefined,
        org_id: typeof tokenPayload?.org_id === "string" ? tokenPayload.org_id : undefined,
        roles: Array.isArray(tokenPayload?.roles)
            ? tokenPayload.roles.map(String)
            : typeof tokenPayload?.roles === "string"
            ? [tokenPayload.roles]
            : [],
        hasAct: tokenPayload?.act != null,
    };

    const mcpLogger = logger.child({ component: "mcp", reqId });
    const toolLogger = logger.child({ component: "tool", reqId });

    mcpLogger.info({ ...tokenContext }, "creating MCP server instance");

    const server = new McpServer({
        name: "wayfinder-enterprise-mcp",
        version: "1.0.0",
    });

    async function runTool<T>(name: string, args: Record<string, unknown>, fn: () => Promise<T>): Promise<T> {
        toolLogger.info({ tool: name, args }, "invoked");
        const t0 = Date.now();
        try {
            const result = await fn();
            toolLogger.info({ tool: name, durationMs: Date.now() - t0 }, "completed");
            return result;
        } catch (err) {
            toolLogger.error({ tool: name, durationMs: Date.now() - t0, err }, "failed");
            throw err;
        }
    }

    server.tool(
        "get_travel_policy",
        "Get the active travel policy for the authenticated organization. Use this before answering travel-policy questions and before creating a flight booking.",
        {},
        () => runTool("get_travel_policy", {}, async () =>
            toToolContent(await api.get("/api/travel-policies")),
        ),
    );

    server.tool(
        "update_travel_policy",
        "Update the active travel policy for the authenticated organization.",
        {
            domestic_cabin: z.enum(["Economy", "Premium Economy", "Business", "First Class"]).optional(),
            max_flight_price: z.number().int().min(0).max(100000).optional(),
            price_cap_percent: z.number().int().min(0).max(200).optional(),
        },
        (policy) => runTool("update_travel_policy", policy as Record<string, unknown>, async () =>
            toToolContent(await api.put("/api/travel-policies", policy as JsonValue)),
        ),
    );

    server.tool(
        "list_organization_users",
        "List users in the authenticated organization.",
        {},
        () => runTool("list_organization_users", {}, async () =>
            toToolContent(await api.get("/api/organization/users")),
        ),
    );

    server.tool(
        "invite_organization_user",
        "Invite a new user to the authenticated organization.",
        {
            email: z.string().email().describe("The employee email address."),
            givenName: z.string().optional().describe("The employee given name."),
            familyName: z.string().optional().describe("The employee family name."),
            role: z.enum(["Admin", "Member", "Idp Manager", "Basic Branding Editor", "Advanced Branding Editor"]).optional(),
        },
        ({ email, givenName, familyName, role }) =>
            runTool("invite_organization_user", { email, givenName, familyName, role }, async () =>
                toToolContent(await api.post("/api/organization/users", {
                    email,
                    givenName: givenName ?? "",
                    familyName: familyName ?? "",
                    role: role ?? "Member",
                })),
            ),
    );

    server.tool(
        "list_organization_roles",
        "List organization roles and assigned user IDs.",
        {},
        () => runTool("list_organization_roles", {}, async () =>
            toToolContent(await api.get("/api/organization/roles")),
        ),
    );

    server.tool(
        "search_enterprise_flights",
        "Search available flight options from the Wayfinder booking database.",
        {
            from: z.string().optional().describe("Origin city, for example New York."),
            to: z.string().optional().describe("Destination city, for example Los Angeles."),
            cabin: z.enum(["Economy", "Premium Economy", "Business", "First Class"]).optional(),
        },
        ({ from, to, cabin }) =>
            runTool("search_enterprise_flights", { from, to, cabin }, async () => {
                const params = new URLSearchParams();

                if (from) params.set("from", from);
                if (to) params.set("to", to);
                if (cabin) params.set("cabin", cabin);

                const path = `/api/flights${params.size > 0 ? `?${params.toString()}` : ""}`;

                return toToolContent(await api.get(path));
            }),
    );

    server.tool(
        "list_flight_bookings",
        "List flight bookings visible to the authenticated user.",
        {
            all: z.boolean().optional().describe("When true, admins can list all organization bookings."),
        },
        ({ all }) => runTool("list_flight_bookings", { all }, async () =>
            toToolContent(await api.get(`/api/bookings${all ? "?all=true" : ""}`)),
        ),
    );

    server.tool(
        "create_flight_booking",
        "Create a flight booking for the authenticated user. Only use after get_travel_policy has been called in the current turn and a single matching flight is clear.",
        {
            bookedByName: z.string().optional().describe("Display name of the user making the booking."),
            bookedForName: z.string().optional().describe("Display name of the traveler when an admin books for someone else."),
            bookedForUserId: z.string().optional().describe("User ID of the traveler when an admin books for someone else."),
            flightId: z.string().describe("The ID of the flight to book."),
            travelers: z.number().int().min(1).max(9).optional().describe("Number of travelers."),
        },
        ({ bookedByName, bookedForName, bookedForUserId, flightId, travelers }) =>
            runTool("create_flight_booking", { bookedForUserId, flightId, travelers }, async () => {
                try {
                    const bookingResponse = await api.post("/api/bookings", {
                        bookedByName: bookedByName ?? "AI-assisted user",
                        bookedForName: bookedForName ?? "",
                        bookedForUserId: bookedForUserId ?? "",
                        flightId,
                        travelers: travelers ?? 1,
                    });

                    return toToolContent({
                        data: bookingResponse,
                        message: "Flight booking created successfully.",
                        success: true,
                    });
                } catch (error) {
                    return toBookingFailureToolContent(error);
                }
            }),
    );

    return server;
}

async function readJsonBody(request: IncomingMessage): Promise<unknown> {
    const chunks: Buffer[] = [];

    for await (const chunk of request) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    if (chunks.length === 0) {
        return undefined;
    }

    const body = Buffer.concat(chunks).toString("utf8");

    return body ? JSON.parse(body) : undefined;
}

function sendJson(response: ServerResponse, statusCode: number, body: JsonValue) {
    response.writeHead(statusCode, { "Content-Type": "application/json" });
    response.end(JSON.stringify(body));
}

const httpLogger = logger.child({ component: "http" });

const httpServer = createServer(async (request, response) => {
    const reqId = ++requestCounter;
    const remoteAddr = request.socket.remoteAddress;
    const reqLogger = httpLogger.child({ reqId });

    reqLogger.info({ method: request.method, url: request.url, remoteAddr }, "incoming request");

    if (request.url === "/health") {
        sendJson(response, 200, { status: "ok" });
        reqLogger.debug("health check");

        return;
    }

    if (request.url !== "/mcp") {
        reqLogger.warn({ url: request.url }, "unknown route");
        sendJson(response, 404, { error: "Not found" });

        return;
    }

    if (request.method !== "POST") {
        reqLogger.warn({ method: request.method }, "method not allowed");
        sendJson(response, 405, { error: "Method not allowed" });

        return;
    }

    try {
        const server = createEnterpriseMcpServer(getAuthorizationHeader(request), reqId);
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
        });
        const body = await readJsonBody(request);

        reqLogger.debug("connecting transport");

        response.on("close", () => {
            reqLogger.info("connection closed");
            transport.close();
        });

        await server.connect(transport);
        await transport.handleRequest(request, response, body);
    } catch (error) {
        reqLogger.error({ err: error }, "unhandled error");

        if (!response.headersSent) {
            sendJson(response, 500, {
                error: error instanceof Error ? error.message : "Failed to handle MCP request.",
            });
        }
    }
});

httpServer.listen(port, host, () => {
    logger.info({ url: `http://${host}:${port}/mcp` }, "MCP server listening");
    logger.info({ url: `http://${host}:${port}/health` }, "health check available");
});
