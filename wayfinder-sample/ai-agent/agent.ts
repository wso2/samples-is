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
import { AsyncLocalStorage } from "node:async_hooks";
import { createHash, randomUUID } from "node:crypto";
import { performance } from "node:perf_hooks";
import type { Duplex } from "node:stream";

import { AsgardeoJavaScriptClient } from "@asgardeo/javascript";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import dotenv from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config({
    path: resolve(__dirname, ".env"),
});

type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

const LOG_LEVEL_ORDER: Record<LogLevel, number> = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40,
    fatal: 50,
};

type LogContext = Record<string, unknown>;

function normalizeLogLevel(value: string | undefined): LogLevel {
    return value === "debug" || value === "info" || value === "warn" || value === "error" || value === "fatal"
        ? value
        : "info";
}

function redactLogValue(key: string, value: unknown): unknown {
    if (
        key.toLowerCase().includes("authorization") ||
        key.toLowerCase().includes("token") ||
        key.toLowerCase().includes("secret")
    ) {
        return "[redacted]";
    }

    if (value instanceof Error) {
        return summarizeError(value);
    }

    return value;
}

function formatLogContext(context: LogContext) {
    const entries = Object.entries(context)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => {
            const redactedValue = redactLogValue(key, value);
            const formattedValue = typeof redactedValue === "string"
                ? redactedValue.replace(/\s+/g, " ")
                : JSON.stringify(redactedValue);

            return `${key}=${formattedValue}`;
        });

    return entries.length > 0 ? ` ${entries.join(" ")}` : "";
}

function createLogger(context: LogContext = {}) {
    const configuredLevel = normalizeLogLevel(process.env.LOG_LEVEL);

    function write(level: LogLevel, first: string | LogContext, second?: string) {
        if (LOG_LEVEL_ORDER[level] < LOG_LEVEL_ORDER[configuredLevel]) {
            return;
        }

        const message = typeof first === "string" ? first : second || "";
        const childContext = typeof first === "string" ? {} : first;
        const timestamp = new Date().toISOString();
        const contextText = formatLogContext({ ...context, ...childContext });
        const line = `${timestamp} ${level.toUpperCase()} ${message}${contextText}`;

        if (level === "warn") {
            console.warn(line);
        } else if (level === "error" || level === "fatal") {
            console.error(line);
        } else {
            console.log(line);
        }
    }

    return {
        child: (childContext: LogContext) => createLogger({ ...context, ...childContext }),
        debug: (first: string | LogContext, second?: string) => write("debug", first, second),
        info: (first: string | LogContext, second?: string) => write("info", first, second),
        warn: (first: string | LogContext, second?: string) => write("warn", first, second),
        error: (first: string | LogContext, second?: string) => write("error", first, second),
        fatal: (first: string | LogContext, second?: string) => write("fatal", first, second),
    };
}

const logger = createLogger();

function summarizeError(error: Error) {
    const errorLike = error as Error & {
        code?: string;
        statusCode?: number;
        statusText?: string;
    };
    const collapsedMessage = error.message.replace(/\s+/g, " ");
    const truncatedMessage = collapsedMessage.length > 500
        ? `${collapsedMessage.slice(0, 500)}...`
        : collapsedMessage;

    return [
        error.name,
        errorLike.code,
        errorLike.statusCode ? `status=${errorLike.statusCode}` : "",
        errorLike.statusText,
        truncatedMessage,
    ].filter(Boolean).join(" ");
}

function getEnv(name: string) {
    return process.env[name]?.trim() || "";
}

const asgardeoConfig = {
    afterSignInUrl: getEnv("REDIRECT_URI"),
    clientId: getEnv("CLIENT_ID"),
    clientSecret: getEnv("CLIENT_SECRET"),
    baseUrl: getEnv("ASGARDEO_BASE_URL").replace(/\/$/, ""),
};

const agentConfig = {
    agentID: getEnv("AGENT_ID"),
    agentSecret: getEnv("AGENT_SECRET"),
};

const DEFAULT_ORGANIZATION_API_SCOPES = [
    "openid",
    "internal_org_user_mgt_create",
    "internal_org_user_mgt_list",
    "internal_org_user_mgt_update",
    "internal_org_role_mgt_view",
    "internal_org_role_mgt_users_update",
    "create_travel_policy",
    "view_travel_policy",
    "update_travel_policy",
    "delete_travel_policy",
    "view_booking",
    "create_booking",
    "delete_booking",
].join(" ");

const appBaseUrl = (getEnv("APP_BASE_URL") || "http://localhost:3000").replace(/\/$/, "");
const autonomousTravelPolicyScopes = getEnv("AGENT_TRAVEL_POLICY_SCOPES") || "view_travel_policy";
const delegatedBookingScopes = getEnv("DELEGATED_BOOKING_SCOPES") || "create_booking";
const delegatedUserOrganizationScopes = getEnv("DELEGATED_USER_ORG_SCOPES") || DEFAULT_ORGANIZATION_API_SCOPES;
const oboRedirectUri = getEnv("OBO_REDIRECT_URI") || new URL("/obo/callback", asgardeoConfig.afterSignInUrl).toString();
const oboResource = getEnv("OBO_RESOURCE");
const oboRequiredMessage = "I need your authorization to perform this action. Please click the Authorize button to grant me access.";
const insufficientPermissionsPattern = /insufficient permissions/i;
const allowedCorsOrigin = (() => {
    try {
        return new URL(appBaseUrl).origin;
    } catch {
        return appBaseUrl;
    }
})();

type ModelProvider = "gemini" | "openai" | "anthropic" | "deepseek";

async function anthropicFetch(url: Parameters<typeof fetch>[0], init?: Parameters<typeof fetch>[1]): Promise<Response> {
    if (init?.body && typeof init.body === "string") {
        try {
            const body = JSON.parse(init.body);
            delete body.top_p;
            return fetch(url, { ...init, body: JSON.stringify(body) });
        } catch { /* fall through */ }
    }
    return fetch(url, init);
}

function createModel() {
    const provider = (getEnv("MODEL_PROVIDER") || "gemini").toLowerCase() as ModelProvider;
    const modelName = getEnv("MODEL_NAME");
    const defaultModelNames: Record<ModelProvider, string> = {
        openai: "gpt-4o-mini",
        anthropic: "claude-sonnet-4-6",
        deepseek: "deepseek-chat",
        gemini: "gemini-2.0-flash",
    };

    logger.info({
        provider,
        model: modelName || defaultModelNames[provider] || "gemini-2.0-flash",
    }, "LLM provider initialized");

    switch (provider) {
        case "openai":
            return new ChatOpenAI({
                apiKey: getEnv("OPENAI_API_KEY"),
                model: modelName || "gpt-4o-mini",
            });
        case "anthropic":
            return new ChatAnthropic({
                apiKey: getEnv("ANTHROPIC_API_KEY"),
                model: modelName || "claude-sonnet-4-6",
                temperature: null,
                topP: 1,
            });
        case "deepseek":
            return new ChatOpenAI({
                apiKey: getEnv("DEEPSEEK_API_KEY"),
                model: modelName || "deepseek-chat",
                configuration: { baseURL: "https://api.deepseek.com/v1" },
            });
        case "gemini":
        default:
            return new ChatGoogleGenerativeAI({
                apiKey: getEnv("GOOGLE_API_KEY"),
                model: modelName || "gemini-2.0-flash",
            });
    }
}

const modelProvider = (getEnv("MODEL_PROVIDER") || "gemini").toLowerCase() as ModelProvider;
const model = createModel();

const agentPrompt = [
"You are Wayfinder Enterprise's AI assistant for business travel administrators and employees.",
"Help users manage business travel in a friendly, clear, and professional way.",
"You can help with travel policies, employee access, roles, flight options, and bookings.",
"Use the available tools whenever you need information instead of guessing.",
"Respond naturally, like a helpful travel coordinator or concierge, not a technical support system.",
"Keep conversations smooth and conversational. Avoid sounding procedural or overly rigid.",
"Never expose internal system details, technical identifiers, raw JSON, tokens, or implementation concepts to users.",
"When users ask about travel policies, check the current policy before answering or making decisions.",
"If no travel policy exists, continue helping the user normally and treat flights as unrestricted.",
"Before searching for flights, make sure you know the origin, destination, and preferred travel date.",
"If any booking details are missing, ask for all missing details together in one concise follow-up question.",
"When a user wants to book a flight, first identify the correct flight option before proceeding with the booking.",
"If multiple flight options match the request, ask a brief clarifying question instead of making assumptions.",
"When users request policy changes, only update the parts they clearly asked to modify.",
"When inviting employees, make sure an email address is provided before sending an invitation.",
"Acknowledge the user's request naturally before presenting information or results.",
"Present information clearly using markdown, tables, and bullet points when helpful.",
"Never dump raw tool output directly to the user. Summarize and explain information in a human-friendly way.",
"Always try to leave the conversation with a clear next step, recommendation, or question."
].join("\n");

type ChatMessage = {
    role: "user" | "assistant" | "system";
    content: string;
};

type ChatRequest = {
    message?: unknown;
    messages?: unknown;
    mode?: unknown;
    orgId?: unknown;
    orgName?: unknown;
};

type ChatInvocationMode = "agent" | "user";

type ParsedChatRequest = {
    messages: ChatMessage[];
    mode?: ChatInvocationMode;
    orgId?: string;
    orgName?: string;
};

type TravelPolicy = {
    domestic_cabin: string;
    max_flight_price: number;
    price_cap_percent: number;
};

type Flight = {
    id: string;
    from_city: string;
    to_city: string;
    airline: string;
    departure_time: string;
    arrival_time: string;
    duration: string;
    stops: number;
    price: number;
    currency: string;
    cabin: string;
    dates: string;
    tags: string[];
};

type PolicyStatus = "in-policy" | "approval-required" | "out-of-policy";

type SuggestedFlight = Flight & {
    policyStatus: PolicyStatus;
    policyNotes: string[];
};

type BookingSearchCriteria = {
    departureDate?: string;
    from?: string;
    to?: string;
};

type AgentInvokeResult = {
    messages: Array<{ content?: unknown }>;
};

type RunnableAgent = {
    invoke: (input: { messages: ChatMessage[] }) => Promise<AgentInvokeResult>;
};

type AgentRuntime = {
    agent: RunnableAgent;
    client: MultiServerMCPClient;
    tools: ToolWithSchema[];
};

type RootAgentRuntime = {
    agentActorToken: string;
};

type PendingDelegation = {
    createdAt: number;
    flightId?: string;
    orgId?: string;
    request: ParsedChatRequest;
    scopes: string;
    socket: Duplex;
};

type WebSocketFrame = {
    opcode: number;
    payload: Buffer<ArrayBufferLike>;
};

const WEB_SOCKET_GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
const JSON_SCHEMA_TYPE_VALUES = new Set(["string", "number", "integer", "boolean", "array", "object"]);

type JsonSchemaObject = {
    [key: string]: unknown;
};

type ToolWithSchema = {
    name?: string;
    schema?: unknown;
    invoke?: (...args: unknown[]) => Promise<unknown> | unknown;
};

type PermissionTrackingContext = {
    hasInsufficientPermissions: boolean;
    toolName?: string;
};

const permissionTrackingContext = new AsyncLocalStorage<PermissionTrackingContext>();


function isJsonSchemaObject(value: unknown): value is JsonSchemaObject {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getGeminiSchemaType(schema: JsonSchemaObject): string | undefined {
    const type = schema.type;

    if (typeof type === "string" && JSON_SCHEMA_TYPE_VALUES.has(type)) {
        return type;
    }

    if (Array.isArray(type)) {
        const nullable = type.includes("null");
        const schemaType = type.find((candidate): candidate is string => (
            typeof candidate === "string" &&
            candidate !== "null" &&
            JSON_SCHEMA_TYPE_VALUES.has(candidate)
        ));

        if (schemaType) {
            if (nullable && schema.nullable === undefined) {
                schema.nullable = true;
            }

            return schemaType;
        }
    }

    if (isJsonSchemaObject(schema.properties)) {
        return "object";
    }

    if (isJsonSchemaObject(schema.items)) {
        return "array";
    }

    if (Array.isArray(schema.enum)) {
        return "string";
    }

    return undefined;
}

function sanitizeGeminiSchema(schema: unknown): unknown {
    if (!isJsonSchemaObject(schema)) {
        return schema;
    }

    const type = getGeminiSchemaType(schema);
    const sanitized: JsonSchemaObject = {};

    if (type) {
        sanitized.type = type;
    }

    if (typeof schema.description === "string") {
        sanitized.description = schema.description;
    }

    if (typeof schema.nullable === "boolean") {
        sanitized.nullable = schema.nullable;
    }

    if (type === "string" && typeof schema.format === "string") {
        sanitized.format = schema.format;
    }

    if (type === "string" && Array.isArray(schema.enum)) {
        sanitized.enum = schema.enum.filter((value): value is string => typeof value === "string");
        sanitized.format = "enum";
    }

    if ((type === "number" || type === "integer") && typeof schema.format === "string") {
        sanitized.format = schema.format;
    }

    if (type === "array") {
        sanitized.items = sanitizeGeminiSchema(schema.items);

        if (typeof schema.minItems === "number") {
            sanitized.minItems = schema.minItems;
        }

        if (typeof schema.maxItems === "number") {
            sanitized.maxItems = schema.maxItems;
        }
    }

    if (type === "object") {
        const properties: JsonSchemaObject = {};

        if (isJsonSchemaObject(schema.properties)) {
            for (const [propertyName, propertySchema] of Object.entries(schema.properties)) {
                properties[propertyName] = sanitizeGeminiSchema(propertySchema);
            }
        }

        sanitized.properties = properties;

        if (Array.isArray(schema.required)) {
            sanitized.required = schema.required.filter((propertyName): propertyName is string => (
                typeof propertyName === "string" &&
                Object.hasOwn(properties, propertyName)
            ));
        }
    }

    return sanitized;
}

function sanitizeToolSchemasForGemini<T extends ToolWithSchema>(tools: T[]): T[] {
    return tools.map((tool) => {
        if (tool.schema) {
            tool.schema = sanitizeGeminiSchema(tool.schema);
        }

        return tool;
    });
}

function parseChatRequest(payload: string): ParsedChatRequest {

    try {
        const request = JSON.parse(payload) as ChatRequest;
        const orgId = typeof request.orgId === "string" && request.orgId.trim()
            ? request.orgId.trim()
            : undefined;
        const explicitOrgName = typeof request.orgName === "string" && request.orgName.trim()
            ? request.orgName.trim()
            : undefined;
        const mode = request.mode === "agent" || request.mode === "user"
            ? request.mode
            : undefined;

        if (typeof request.message === "string" && request.message.trim()) {
            const messages = [{ role: "user" as const, content: request.message }];

            return {
                messages,
                mode,
                orgId,
                orgName: explicitOrgName,
            };
        }

        if (Array.isArray(request.messages)) {
            const messages = request.messages.filter((message): message is ChatMessage => {
                if (typeof message !== "object" || message === null) {
                    return false;
                }

                const candidate = message as Partial<ChatMessage>;

                return (
                    typeof candidate.content === "string" &&
                    ["user", "assistant", "system"].includes(candidate.role || "")
                );
            });

            if (messages.length > 0) {
                return {
                    messages,
                    mode,
                    orgId,
                    orgName: explicitOrgName,
                };
            }
        }
    } catch {
        if (payload.trim()) {
            return { messages: [{ role: "user", content: payload }] };
        }
    }

    throw new Error("Send a non-empty text message or JSON payload with a `message` field.");
}

function getResponseContent(content: unknown): string {
    if (typeof content === "string") {
        return content;
    }

    return JSON.stringify(content);
}

function addContextToFirstUserMessage(messages: ChatMessage[], context: string): ChatMessage[] {
    let contextAdded = false;

    return messages.map((message) => {
        if (contextAdded || message.role !== "user") {
            return message;
        }

        contextAdded = true;

        return {
            ...message,
            content: `${context}\n\n${message.content}`,
        };
    });
}

async function requestAppApi<T>(path: string, accessToken: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers);

    headers.set("Accept", "application/json");
    headers.set("Authorization", `Bearer ${accessToken}`);

    if (options.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    logger.info({
        method: options.method ?? "GET",
        path,
    }, "Agent direct app API request");

    const response = await fetch(`${appBaseUrl}${path}`, {
        ...options,
        headers,
        signal: AbortSignal.timeout(30000),
    });
    const contentType = response.headers.get("content-type") || "";
    const body = contentType.includes("application/json")
        ? await response.json().catch(() => ({}))
        : await response.text();

    logger.info({
        method: options.method ?? "GET",
        path,
        statusCode: response.status,
    }, "Agent direct app API response");

    if (!response.ok) {
        throw new Error(`App API request failed with ${response.status}: ${JSON.stringify(body)}`);
    }

    return body as T;
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, description: string): Promise<T> {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    try {
        return await Promise.race([
            promise,
            new Promise<never>((_, reject) => {
                timeout = setTimeout(() => reject(new Error(`${description} timed out after ${timeoutMs}ms`)), timeoutMs);
            }),
        ]);
    } finally {
        if (timeout) {
            clearTimeout(timeout);
        }
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

function getBearerToken(authorization?: string | string[]) {
    const value = Array.isArray(authorization) ? authorization[0] : authorization;

    return value?.startsWith("Bearer ") ? value.slice(7) : "";
}

function getWebSocketProtocolToken(protocolHeader?: string | string[]) {
    const value = Array.isArray(protocolHeader) ? protocolHeader[0] : protocolHeader;
    const protocols = value?.split(",").map((protocol) => protocol.trim()).filter(Boolean) ?? [];
    const bearerIndex = protocols.indexOf("bearer");

    return bearerIndex >= 0 ? protocols[bearerIndex + 1] ?? "" : "";
}

function getTokenOrganizationId(token: string): string {
    const payload = decodeJwtPayload(token);

    return typeof payload?.org_id === "string" ? payload.org_id : "";
}

async function exchangeOrganizationToken({
    scopes,
    switchingOrganizationId,
    token,
}: {
    scopes: string;
    switchingOrganizationId: string;
    token: string;
}) {
    const credentials = Buffer.from(`${asgardeoConfig.clientId}:${asgardeoConfig.clientSecret}`).toString("base64");
    const response = await fetch(`${asgardeoConfig.baseUrl}/oauth2/token`, {
        body: new URLSearchParams({
            grant_type: "organization_switch",
            scope: scopes,
            switching_organization: switchingOrganizationId,
            token,
        }),
        headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
        signal: AbortSignal.timeout(30000),
    });
    const body = await response.json().catch(() => ({})) as {
        access_token?: string;
        error?: string;
        error_description?: string;
    };

    if (!response.ok || !body.access_token) {
        throw new Error(body.error_description ?? body.error ?? "Failed to exchange token for the organization.");
    }

    return body.access_token;
}



function normalizeDateText(value: string) {
    return value
        .toLowerCase()
        .replace(/\bjanuary\b/g, "jan")
        .replace(/\bfebruary\b/g, "feb")
        .replace(/\bmarch\b/g, "mar")
        .replace(/\bapril\b/g, "apr")
        .replace(/\bjune\b/g, "jun")
        .replace(/\bjuly\b/g, "jul")
        .replace(/\baugust\b/g, "aug")
        .replace(/\bseptember\b/g, "sep")
        .replace(/\boctober\b/g, "oct")
        .replace(/\bnovember\b/g, "nov")
        .replace(/\bdecember\b/g, "dec")
        .replace(/[,]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function flightMatchesDepartureDate(flight: Flight, departureDate?: string) {
    if (!departureDate || /\b(today|tomorrow)\b/i.test(departureDate)) {
        return true;
    }

    return normalizeDateText(flight.dates).includes(normalizeDateText(departureDate));
}

const CABIN_RANK: Record<string, number> = {
    "Economy": 0,
    "Premium Economy": 1,
    "Business": 2,
    "First Class": 3,
};

function evaluateFlightPolicy(flight: Flight, policy: TravelPolicy | null): { notes: string[]; status: PolicyStatus } {
    if (!policy) {
        return { notes: [], status: "in-policy" };
    }

    const notes: string[] = [];
    const priceCap = policy.max_flight_price;
    const approvalCap = priceCap * (1 + policy.price_cap_percent / 100);
    const allowedCabinRank = CABIN_RANK[policy.domestic_cabin] ?? 0;
    const flightCabinRank = CABIN_RANK[flight.cabin] ?? 0;
    const priceOver = flight.price > priceCap;
    const priceWayOver = flight.price > approvalCap;
    const cabinOver = flightCabinRank > allowedCabinRank;
    const cabinWayOver = flightCabinRank > allowedCabinRank + 1;

    if (priceWayOver) notes.push(`price exceeds $${approvalCap.toFixed(0)} approval limit`);
    else if (priceOver) notes.push(`price exceeds $${priceCap} cap`);

    if (cabinWayOver) notes.push(`${flight.cabin} is not allowed by ${policy.domestic_cabin} policy`);
    else if (cabinOver) notes.push(`${flight.cabin} is above ${policy.domestic_cabin}`);

    if (priceWayOver || cabinWayOver) return { notes, status: "out-of-policy" };
    if (priceOver || cabinOver) return { notes, status: "approval-required" };

    return { notes: [], status: "in-policy" };
}

function formatTravelPolicyAndFlights(policy: TravelPolicy | null, flights: SuggestedFlight[]) {
    const eligibleFlights = flights.filter((flight) => flight.policyStatus !== "out-of-policy").slice(0, 5);

    const policyLine = policy
        ? `Your organization's travel policy covers **${policy.domestic_cabin}** class up to **$${policy.max_flight_price}**/ticket (flights up to ${policy.price_cap_percent}% above the cap require manager approval).`
        : "Your organization has no active travel policy configured, so all available flights are eligible.";

    if (eligibleFlights.length === 0) {
        return `${policyLine}\n\nUnfortunately, I wasn't able to find any eligible flights at the moment. Would you like to try a different route or date?`;
    }

    const policyBadge = (status: PolicyStatus) =>
        status === "in-policy" ? "✓ In policy" : "⚠ Needs approval";

    const rows = eligibleFlights.map((flight, index) =>
        `| ${index + 1} | ${flight.airline} | ${flight.from_city} → ${flight.to_city} | ${flight.departure_time} | ${flight.cabin} | $${flight.price} | ${flight.duration} | ${policyBadge(flight.policyStatus)} |`
    );

    return [
        policyLine,
        "",
        "Here are the available flights for your trip:",
        "",
        "| # | Airline | Route | Departure | Class | Price | Duration | Policy |",
        "|---|---------|-------|-----------|-------|-------|----------|--------|",
        ...rows,
        "",
        "Which flight would you like to book? Just reply with the number or flight ID.",
    ].join("\n");
}


const pendingDelegations = new Map<string, PendingDelegation>();

function buildOboAuthorizeUrl(state: string, request: ParsedChatRequest, scopes = delegatedBookingScopes) {
    const params = new URLSearchParams({
        client_id: asgardeoConfig.clientId,
        redirect_uri: oboRedirectUri,
        requested_actor: agentConfig.agentID,
        response_type: "code",
        scope: scopes,
        state,
    });

    if (oboResource) {
        params.set("resource", oboResource);
    }

    if (request.orgName) {
        params.set("org", request.orgName);
    }

    if (request.orgId) {
        params.set("orgId", request.orgId);
    }

    params.set("fidp", "OrganizationSSO");

    return `${asgardeoConfig.baseUrl}/oauth2/authorize?${params.toString()}`;
}

async function exchangeOboAuthorizationCode(code: string, agentActorToken: string) {
    logger.info("Exchanging OBO authorization code for delegated access token");

    const response = await fetch(`${asgardeoConfig.baseUrl}/oauth2/token`, {
        body: new URLSearchParams({
            actor_token: agentActorToken,
            client_id: asgardeoConfig.clientId,
            client_secret: asgardeoConfig.clientSecret,
            code,
            grant_type: "authorization_code",
            redirect_uri: oboRedirectUri,
            tokenBindingId: randomUUID(),
        }),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
        signal: AbortSignal.timeout(30000),
    });

    logger.info({ statusCode: response.status }, "OBO token exchange response received");

    const body = await response.json().catch(() => ({})) as {
        access_token?: string;
        error?: string;
        error_description?: string;
    };

    if (!response.ok || !body.access_token) {
        throw new Error(body.error_description ?? body.error ?? "Failed to exchange the OBO authorization code.");
    }

    return body.access_token;
}

function createWebSocketAcceptKey(key: string): string {
    return createHash("sha1")
        .update(`${key}${WEB_SOCKET_GUID}`)
        .digest("base64");
}

function encodeWebSocketFrame(payload: string, opcode = 0x1): Buffer {
    const payloadBuffer = Buffer.from(payload);
    const payloadLength = payloadBuffer.length;

    if (payloadLength <= 125) {
        return Buffer.concat([
            Buffer.from([0x80 | opcode, payloadLength]),
            payloadBuffer,
        ]);
    }

    if (payloadLength <= 65535) {
        const header = Buffer.alloc(4);
        header[0] = 0x80 | opcode;
        header[1] = 126;
        header.writeUInt16BE(payloadLength, 2);

        return Buffer.concat([header, payloadBuffer]);
    }

    const header = Buffer.alloc(10);
    header[0] = 0x80 | opcode;
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(payloadLength), 2);

    return Buffer.concat([header, payloadBuffer]);
}

function parseWebSocketFrame(
    buffer: Buffer<ArrayBufferLike>
): { frame: WebSocketFrame; remaining: Buffer<ArrayBufferLike> } | null {
    if (buffer.length < 2) {
        return null;
    }

    const opcode = buffer[0] & 0x0f;
    const isMasked = (buffer[1] & 0x80) === 0x80;
    let payloadLength = buffer[1] & 0x7f;
    let offset = 2;

    if (payloadLength === 126) {
        if (buffer.length < offset + 2) {
            return null;
        }

        payloadLength = buffer.readUInt16BE(offset);
        offset += 2;
    } else if (payloadLength === 127) {
        if (buffer.length < offset + 8) {
            return null;
        }

        const extendedPayloadLength = buffer.readBigUInt64BE(offset);

        if (extendedPayloadLength > BigInt(Number.MAX_SAFE_INTEGER)) {
            throw new Error("WebSocket message is too large.");
        }

        payloadLength = Number(extendedPayloadLength);
        offset += 8;
    }

    const maskOffset = offset;

    if (isMasked) {
        offset += 4;
    }

    if (buffer.length < offset + payloadLength) {
        return null;
    }

    const payload = Buffer.from(buffer.subarray(offset, offset + payloadLength));

    if (isMasked) {
        const mask = buffer.subarray(maskOffset, maskOffset + 4);

        for (let index = 0; index < payload.length; index += 1) {
            payload[index] = payload[index] ^ mask[index % 4];
        }
    }

    return {
        frame: { opcode, payload },
        remaining: buffer.subarray(offset + payloadLength),
    };
}

function isSocketWritable(socket: Duplex) {
    return !socket.destroyed && !socket.writableEnded;
}

function writeFrame(socket: Duplex, frame: Buffer) {
    if (!isSocketWritable(socket)) {
        return false;
    }

    try {
        socket.write(frame);

        return true;
    } catch (error) {
        logger.warn({ err: error }, "Unable to write WebSocket frame");

        return false;
    }
}

function sendJson(socket: Duplex, payload: Record<string, unknown>) {
    return writeFrame(socket, encodeWebSocketFrame(JSON.stringify(payload)));
}

function closeWebSocket(socket: Duplex) {
    if (isSocketWritable(socket)) {
        try {
            socket.end(encodeWebSocketFrame("", 0x8));
        } catch {
            socket.destroy();
        }
    }
}

function redactSecret(value: string) {
    if (!value) {
        return "";
    }

    if (value.length <= 6) {
        return "***";
    }

    return `${value.slice(0, 3)}***${value.slice(-3)}`;
}

function includeClientSecretInAgentAuthorizeRequest(client: AsgardeoJavaScriptClient) {
    if (getEnv("INCLUDE_CLIENT_SECRET_IN_AUTHORIZE") === "false") {
        logger.warn("Skipping client_secret injection for the agent authorize request");

        return;
    }

    if (!asgardeoConfig.clientSecret) {
        return;
    }

    const sdkClient = client as unknown as {
        auth?: {
            getSignInUrl?: (requestConfig?: Record<string, unknown>, userId?: string) => Promise<string>;
        };
    };
    const getSignInUrl = sdkClient.auth?.getSignInUrl?.bind(sdkClient.auth);

    if (!getSignInUrl || !sdkClient.auth) {
        return;
    }

    sdkClient.auth.getSignInUrl = async (requestConfig = {}, userId?: string) => {
        const signInUrl = await getSignInUrl({
            ...requestConfig,
            client_secret: requestConfig.client_secret ?? "__include_client_secret__",
        }, userId);

        return signInUrl;
    };
}

function validateAgentConfiguration() {
    const providerApiKeyEnvVar: Record<ModelProvider, string> = {
        gemini: "GOOGLE_API_KEY",
        openai: "OPENAI_API_KEY",
        anthropic: "ANTHROPIC_API_KEY",
        deepseek: "DEEPSEEK_API_KEY",
    };
    const apiKeyEnvVar = providerApiKeyEnvVar[modelProvider] ?? "GOOGLE_API_KEY";

    const requiredValues: Record<string, string | undefined> = {
        ASGARDEO_BASE_URL: asgardeoConfig.baseUrl,
        CLIENT_ID: asgardeoConfig.clientId,
        CLIENT_SECRET: asgardeoConfig.clientSecret,
        REDIRECT_URI: asgardeoConfig.afterSignInUrl,
        AGENT_ID: agentConfig.agentID,
        AGENT_SECRET: agentConfig.agentSecret,
        [apiKeyEnvVar]: getEnv(apiKeyEnvVar),
    };
    const missingValues = Object.entries(requiredValues)
        .filter(([, value]) => !value)
        .map(([name]) => name);

    if (missingValues.length > 0) {
        throw new Error(`Missing required AI agent environment values: ${missingValues.join(", ")}`);
    }

    if (asgardeoConfig.baseUrl.includes("<") || asgardeoConfig.baseUrl.includes(">")) {
        throw new Error("ASGARDEO_BASE_URL still contains a placeholder value.");
    }

    try {
        new URL(asgardeoConfig.afterSignInUrl);
    } catch {
        throw new Error("REDIRECT_URI must be an absolute URL, for example http://localhost:8791.");
    }
}

function writeCorsHeaders(response: ServerResponse) {
    response.setHeader("Access-Control-Allow-Origin", allowedCorsOrigin);
    response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.setHeader("Vary", "Origin");
}

function writeHttpJson(response: ServerResponse, statusCode: number, body: Record<string, unknown>) {
    writeCorsHeaders(response);
    response.writeHead(statusCode, { "Content-Type": "application/json" });
    response.end(JSON.stringify(body));
}

function writeHttpHtml(response: ServerResponse, statusCode: number, body: string) {
    response.writeHead(statusCode, { "Content-Type": "text/html; charset=utf-8" });
    response.end(body);
}

async function readJsonRequestBody(request: IncomingMessage): Promise<unknown> {
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

function isInsufficientPermissionsResponse(value: unknown): boolean {
    if (typeof value === "string") {
        return insufficientPermissionsPattern.test(value);
    }

    if (value instanceof Error) {
        return insufficientPermissionsPattern.test(value.message);
    }

    try {
        return insufficientPermissionsPattern.test(JSON.stringify(value));
    } catch {
        return false;
    }
}

function markInsufficientPermissions(toolName?: string) {
    const context = permissionTrackingContext.getStore();

    if (!context) {
        return;
    }

    context.hasInsufficientPermissions = true;
    context.toolName = toolName;
}

function wrapMcpToolsForPermissionTracking<T extends ToolWithSchema>(tools: T[]): T[] {
    return tools.map((tool) => {
        const originalInvoke = tool.invoke?.bind(tool);

        if (!originalInvoke) {
            return tool;
        }

        tool.invoke = async (...args: unknown[]) => {
            try {
                const result = await originalInvoke(...args);

                if (isInsufficientPermissionsResponse(result)) {
                    markInsufficientPermissions(tool.name);
                }

                return result;
            } catch (error) {
                if (isInsufficientPermissionsResponse(error)) {
                    markInsufficientPermissions(tool.name);
                }

                throw error;
            }
        };

        return tool;
    });
}

async function createMcpAgent(authorization: string, mode: ChatInvocationMode): Promise<AgentRuntime> {
    const client = new MultiServerMCPClient({
        travel: {
            transport: "http",
            url: process.env.MCP_SERVER_URL || "http://localhost:8001/mcp",
            headers: {
                Authorization: authorization,
            },
        },
    });

    const rawTools = await client.getTools();
    const sanitizedTools = modelProvider === "gemini" ? sanitizeToolSchemasForGemini(rawTools) : rawTools;
    const tools = wrapMcpToolsForPermissionTracking(sanitizedTools);
    logger.info({
        mode,
        tools: tools.map((tool) => tool.name).filter(Boolean),
    }, "Loaded MCP tools");

    const agent = createReactAgent({
        llm: model,
        tools: tools,
        prompt: agentPrompt,
    }) as RunnableAgent;

    return { agent, client, tools };
}

async function getAutonomousAgentOrganizationToken(rootAgentToken: string, organizationId: string) {
    logger.info({
        organizationId,
        tokenType: "autonomous-agent",
        scopes: autonomousTravelPolicyScopes,
    }, `[org: ${organizationId}] Obtaining autonomous agent organization-scoped token`);

    const token = await exchangeOrganizationToken({
        scopes: autonomousTravelPolicyScopes,
        switchingOrganizationId: organizationId,
        token: rootAgentToken,
    });

    logger.info({ organizationId, tokenType: "autonomous-agent" }, `[org: ${organizationId}] Autonomous agent organization-scoped token obtained`);

    return token;
}

async function getDelegatedUserOrganizationToken(accessToken: string, orgId?: string, scopes = delegatedUserOrganizationScopes) {
    if (!orgId) {
        return accessToken;
    }

    if (getTokenOrganizationId(accessToken) === orgId) {
        logger.info({ organizationId: orgId }, `[org: ${orgId}] Delegated token already scoped to organization, skipping exchange`);

        return accessToken;
    }

    logger.info({
        organizationId: orgId,
        tokenType: "delegated-user",
        scopes,
    }, `[org: ${orgId}] Obtaining delegated user organization-scoped token`);

    const token = await exchangeOrganizationToken({
        scopes,
        switchingOrganizationId: orgId,
        token: accessToken,
    });

    logger.info({ organizationId: orgId, tokenType: "delegated-user" }, `[org: ${orgId}] Delegated user organization-scoped token obtained`);

    return token;
}

async function createRootAgentRuntime(): Promise<RootAgentRuntime> {
    logger.info("Starting Wayfinder Enterprise AI agent with Asgardeo and LangChain");
    validateAgentConfiguration();
    logger.info({
        baseUrl: asgardeoConfig.baseUrl,
        clientId: redactSecret(asgardeoConfig.clientId),
        redirectUri: asgardeoConfig.afterSignInUrl,
        agentId: redactSecret(agentConfig.agentID),
    }, "Requesting Asgardeo agent token");

    const asgardeoJavaScriptClient = new AsgardeoJavaScriptClient(asgardeoConfig);
    includeClientSecretInAgentAuthorizeRequest(asgardeoJavaScriptClient);
    const agentToken = await asgardeoJavaScriptClient.getAgentToken(agentConfig);

    return {
        agentActorToken: agentToken.accessToken,
    };
}

async function createAutonomousAgentRuntime(rootRuntime: RootAgentRuntime, organizationId: string) {
    const organizationAccessToken = await getAutonomousAgentOrganizationToken(rootRuntime.agentActorToken, organizationId);

    return createMcpAgent(`Bearer ${organizationAccessToken}`, "agent");
}

async function getTravelPolicyAndEligibleFlights(
    rootRuntime: RootAgentRuntime,
    organizationId: string,
    criteria: BookingSearchCriteria = {}
) {
    const organizationAccessToken = await getAutonomousAgentOrganizationToken(rootRuntime.agentActorToken, organizationId);
    const params = new URLSearchParams();

    if (criteria.from) params.set("from", criteria.from);
    if (criteria.to) params.set("to", criteria.to);

    const flightsPath = `/api/flights${params.size > 0 ? `?${params.toString()}` : ""}`;
    const [{ policy }, { flights }, bookingsResult] = await Promise.all([
        requestAppApi<{ policy: TravelPolicy | null }>("/api/travel-policies", organizationAccessToken),
        requestAppApi<{ flights: Flight[] }>(flightsPath, organizationAccessToken),
        requestAppApi<{ bookings: Array<{ flight_id: string; status: string }> }>("/api/bookings?all=true", organizationAccessToken)
            .catch(() => ({ bookings: [] })),
    ]);
    const bookedFlightIds = new Set(
        bookingsResult.bookings
            .filter((b) => b.status === "confirmed")
            .map((b) => b.flight_id)
    );
    const evaluatedFlights = flights
        .filter((flight) => !bookedFlightIds.has(flight.id))
        .filter((flight) => flightMatchesDepartureDate(flight, criteria.departureDate))
        .map((flight) => {
            const result = evaluateFlightPolicy(flight, policy);

            return {
                ...flight,
                policyNotes: result.notes,
                policyStatus: result.status,
            };
        })
        .sort((left, right) => {
            const statusRank: Record<PolicyStatus, number> = {
                "in-policy": 0,
                "approval-required": 1,
                "out-of-policy": 2,
            };

            return statusRank[left.policyStatus] - statusRank[right.policyStatus] || left.price - right.price;
        });

    return {
        flights: evaluatedFlights,
        message: formatTravelPolicyAndFlights(policy, evaluatedFlights),
        policy,
    };
}


async function invokeWithDelegatedUserAccess(request: ParsedChatRequest, delegatedAccessToken: string) {
    logger.info({
        hasOrgId: Boolean(request.orgId),
        messageCount: request.messages.length,
    }, "Starting delegated user agent invocation");

    const accessToken = await getDelegatedUserOrganizationToken(delegatedAccessToken, request.orgId);
    logger.info("Delegated organization access token is ready");

    const runtime = await createMcpAgent(`Bearer ${accessToken}`, "user");
    logger.info("Delegated MCP agent runtime is ready");

    try {
        const messages = request.messages;

        logger.info("Invoking delegated MCP agent");
        const result = await withTimeout(
            runtime.agent.invoke({ messages }),
            60000,
            "Delegated MCP agent invocation"
        );
        logger.info("Delegated MCP agent invocation completed");

        return getResponseContent(result.messages.at(-1)?.content);
    } finally {
        await runtime.client.close();
        logger.info("Delegated MCP client closed");
    }
}

async function createBookingWithDelegatedUserAccess(pending: PendingDelegation, delegatedAccessToken: string) {
    if (!pending.flightId) {
        throw new Error("No flight was selected for booking.");
    }

    const accessToken = await getDelegatedUserOrganizationToken(
        delegatedAccessToken,
        pending.orgId,
        delegatedBookingScopes
    );
    const bookingResponse = await requestAppApi<{ booking?: { booking_reference?: string } }>("/api/bookings", accessToken, {
        body: JSON.stringify({
            bookedByName: "AI-assisted user",
            flightId: pending.flightId,
            travelers: 1,
        }),
        method: "POST",
    });
    const reference = bookingResponse.booking?.booking_reference;

    return reference
        ? `Booked flight ${pending.flightId}. Booking reference: ${reference}.`
        : `Booked flight ${pending.flightId}.`;
}

function registerPendingDelegation(
    socket: Duplex,
    request: ParsedChatRequest,
    flightId?: string,
    scopes = delegatedBookingScopes
) {
    const state = randomUUID();

    pendingDelegations.set(state, {
        createdAt: Date.now(),
        flightId,
        orgId: request.orgId,
        request,
        scopes,
        socket,
    });

    return {
        authorizationRequestId: state,
        authorizationUrl: buildOboAuthorizeUrl(state, request, scopes),
        state,
    };
}

function removeExpiredPendingDelegations() {
    const expiresBefore = Date.now() - 10 * 60 * 1000;

    for (const [state, pending] of pendingDelegations) {
        if (pending.createdAt < expiresBefore) {
            pendingDelegations.delete(state);
        }
    }
}

async function handleOboAuthorizeUrlRequest(request: IncomingMessage, response: ServerResponse) {
    if (request.method === "OPTIONS") {
        writeCorsHeaders(response);
        response.writeHead(204);
        response.end();

        return;
    }

    if (request.method !== "POST") {
        writeHttpJson(response, 405, { error: "Method not allowed" });

        return;
    }

    removeExpiredPendingDelegations();

    let body: unknown;

    try {
        body = await readJsonRequestBody(request);
    } catch {
        writeHttpJson(response, 400, { error: "Invalid JSON body." });

        return;
    }

    const authorizationRequestId = typeof body === "object" && body !== null
        ? (body as { authorizationRequestId?: unknown }).authorizationRequestId
        : undefined;
    const state = typeof authorizationRequestId === "string" ? authorizationRequestId.trim() : "";

    if (!state) {
        writeHttpJson(response, 400, { error: "authorizationRequestId is required." });

        return;
    }

    const pending = pendingDelegations.get(state);

    if (!pending) {
        writeHttpJson(response, 404, { error: "Authorization request not found or expired." });

        return;
    }

    const callerToken = getBearerToken(request.headers.authorization);
    const callerOrgId = getTokenOrganizationId(callerToken);

    if (!callerToken || !callerOrgId || (pending.orgId && pending.orgId !== callerOrgId)) {
        writeHttpJson(response, 401, { error: "Unauthorized." });

        return;
    }

    writeHttpJson(response, 200, {
        authorizationUrl: buildOboAuthorizeUrl(state, pending.request, pending.scopes),
    });
}

async function handleOboCallback(url: URL, response: ServerResponse, agentActorToken?: string) {
    removeExpiredPendingDelegations();

    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");
    const errorDescription = url.searchParams.get("error_description");

    if (error) {
        writeHttpHtml(response, 400, `<p>Authorization failed: ${errorDescription || error}</p>`);
        return;
    }

    if (!code || !state) {
        writeHttpHtml(response, 400, "<p>Missing authorization code or state.</p>");
        return;
    }

    if (!agentActorToken) {
        writeHttpHtml(response, 500, "<p>The agent actor token is not available.</p>");
        return;
    }

    const pending = pendingDelegations.get(state);

    if (!pending) {
        writeHttpHtml(response, 410, "<p>This authorization request has expired. Please retry the action from the chat.</p>");
        return;
    }

    pendingDelegations.delete(state);
    writeHttpHtml(response, 200, "<p>Authorization complete. You can close this tab and return to Wayfinder.</p>");

    try {
        logger.info({
            hasPendingSocket: isSocketWritable(pending.socket),
            messageCount: pending.request.messages.length,
        }, "Completing delegated authorization callback");

        const delegatedAccessToken = await exchangeOboAuthorizationCode(code, agentActorToken);
        logger.info("Delegated access token received from OBO callback");

        const responseMessage = pending.flightId
            ? await createBookingWithDelegatedUserAccess(pending, delegatedAccessToken)
            : await invokeWithDelegatedUserAccess(pending.request, delegatedAccessToken);
        logger.info({
            responseLength: responseMessage.length,
            socketWritable: isSocketWritable(pending.socket),
        }, "Sending delegated agent response over WebSocket");

        const sent = sendJson(pending.socket, {
            type: "response",
            message: responseMessage,
        });
        logger.info({ sent }, "Delegated agent WebSocket response send completed");
    } catch (callbackError) {
        logger.error({ err: callbackError }, "Failed to complete delegated authorization callback");
        sendJson(pending.socket, {
            type: "error",
            message: "I couldn't complete the authorization. Please try approving the action again.",
        });
    }
}

async function runAgentServer() {
    const rootRuntime = await createRootAgentRuntime();
    const autonomousRuntimePromises = new Map<string, Promise<AgentRuntime>>();
    const port = Number(process.env.PORT || process.env.AGENT_PORT || 8791);
    const host = process.env.HOST || "localhost";

    const getAutonomousRuntime = (organizationId: string) => {
        if (!autonomousRuntimePromises.has(organizationId)) {
            autonomousRuntimePromises.set(organizationId, createAutonomousAgentRuntime(rootRuntime, organizationId));
        }

        return autonomousRuntimePromises.get(organizationId)!;
    };

    const server = createServer(async (request, response) => {
        const requestId = randomUUID();
        const startedAt = performance.now();
        const requestLogger = logger.child({
            requestId,
            method: request.method,
            path: request.url,
        });

        response.setHeader("X-Request-Id", requestId);
        response.on("finish", () => {
            requestLogger.info({
                statusCode: response.statusCode,
                durationMs: Number((performance.now() - startedAt).toFixed(1)),
            }, "HTTP request completed");
        });
        requestLogger.info("HTTP request started");

        const url = new URL(request.url || "/", `http://${request.headers.host || host}`);

        if (url.pathname === "/obo/callback") {
            await handleOboCallback(url, response, rootRuntime.agentActorToken);

            return;
        }

        if (url.pathname === "/obo/authorize-url") {
            await handleOboAuthorizeUrlRequest(request, response);

            return;
        }

        if (url.pathname === "/health") {
            writeHttpJson(response, 200, {
                status: "ok",
                features: {
                    enterpriseTravelTools: true,
                    autonomousOrganizationToken: autonomousRuntimePromises.size > 0 ? "initialized" : "lazy",
                },
            });

            return;
        }

        writeHttpJson(response, 404, { error: "Not found" });
    });

    const handleConnection = (socket: Duplex, authenticatedOrgId: string) => {
        const connectionId = randomUUID();
        const connectionLogger = logger.child({ connectionId });
        let isClosed = false;

        connectionLogger.info("WebSocket client connected");

        socket.on("close", () => {
            isClosed = true;
            connectionLogger.info("WebSocket client closed connection");
        });

        socket.on("end", () => {
            isClosed = true;
        });

        socket.on("error", (error) => {
            isClosed = true;
            connectionLogger.warn({ err: error }, "WebSocket client disconnected");
        });

        sendJson(socket, {
            type: "ready",
            message: "Connected to the Wayfinder Enterprise AI agent.",
        });

        let queue = Promise.resolve();
        let buffer: Buffer<ArrayBufferLike> = Buffer.alloc(0);

        socket.on("data", (data) => {
            buffer = Buffer.concat([buffer, data]);

            try {
                let parsed = parseWebSocketFrame(buffer);

                while (parsed) {
                    buffer = parsed.remaining;

                    if (parsed.frame.opcode === 0x8) {
                        closeWebSocket(socket);

                        return;
                    }

                    if (parsed.frame.opcode === 0x9) {
                        writeFrame(socket, encodeWebSocketFrame(parsed.frame.payload.toString(), 0xA));
                    }

                    if (parsed.frame.opcode === 0x1) {
                        const payload = parsed.frame.payload.toString("utf8");

                        queue = queue.then(async () => {
                            if (isClosed) {
                                return;
                            }

                            const parsedChatRequest = parseChatRequest(payload);
                            const chatRequest: ParsedChatRequest = {
                                ...parsedChatRequest,
                                orgId: authenticatedOrgId,
                            };
                            const llmMessages = addContextToFirstUserMessage(
                                chatRequest.messages,
                                `Authenticated organization ID for this chat: ${authenticatedOrgId}`
                            );
                            const messageLogger = connectionLogger.child({
                                messageCount: chatRequest.messages.length,
                            });

                            if (!sendJson(socket, { type: "processing" })) {
                                isClosed = true;
                                return;
                            }

                            messageLogger.info("Processing chat message");

                            let responseMessage: string;
                            const permissionTracking: PermissionTrackingContext = {
                                hasInsufficientPermissions: false,
                            };

                            try {
                                const autonomousRuntime = await getAutonomousRuntime(authenticatedOrgId);
                                const result = await permissionTrackingContext.run(
                                    permissionTracking,
                                    () => autonomousRuntime.agent.invoke({ messages: llmMessages })
                                );

                                responseMessage = getResponseContent(
                                    result.messages.at(-1)?.content
                                );
                            } catch (error) {
                                if (isInsufficientPermissionsResponse(error)) {
                                    markInsufficientPermissions();
                                    permissionTracking.hasInsufficientPermissions = true;
                                }

                                if (permissionTracking.hasInsufficientPermissions) {
                                    const { authorizationRequestId } = registerPendingDelegation(
                                        socket,
                                        chatRequest,
                                        undefined,
                                        delegatedUserOrganizationScopes
                                    );

                                    sendJson(socket, {
                                        type: "obo_required",
                                        message: oboRequiredMessage,
                                        authorizationRequestId,
                                    });
                                    messageLogger.info({
                                        authorizationRequestId,
                                        toolName: permissionTracking.toolName,
                                    }, "Delegated authorization required after MCP permission error");

                                    return;
                                }

                                throw error;
                            }

                            if (isClosed) {
                                return;
                            }

                            if (permissionTracking.hasInsufficientPermissions || isInsufficientPermissionsResponse(responseMessage)) {
                                const { authorizationRequestId } = registerPendingDelegation(
                                    socket,
                                    chatRequest,
                                    undefined,
                                    delegatedUserOrganizationScopes
                                );

                                sendJson(socket, {
                                    type: "obo_required",
                                    message: oboRequiredMessage,
                                    authorizationRequestId,
                                });
                                messageLogger.info({
                                    authorizationRequestId,
                                    toolName: permissionTracking.toolName,
                                }, "Delegated authorization required after MCP permission response");

                                return;
                            }

                            sendJson(socket, {
                                type: "response",
                                message: responseMessage,
                            });
                            messageLogger.info({ responseLength: responseMessage.length }, "Chat message processed");
                        }).catch((error: unknown) => {
                            if (isClosed) {
                                return;
                            }

                            connectionLogger.error({ err: error }, "Error handling chat message");
                            sendJson(socket, {
                                type: "error",
                                message: error instanceof Error ? error.message : "Failed to process chat message.",
                            });
                        });
                    }

                    parsed = parseWebSocketFrame(buffer);
                }
            } catch (error) {
                connectionLogger.error({ err: error }, "Error parsing WebSocket frame");
                sendJson(socket, {
                    type: "error",
                    message: error instanceof Error ? error.message : "Invalid WebSocket message.",
                });
                closeWebSocket(socket);
            }
        });
    };

    server.on("upgrade", (request, socket, head) => {
        socket.on("error", (error) => {
            logger.warn({ err: error }, "WebSocket upgrade socket error");
        });

        try {
            const url = new URL(request.url || "", `http://${request.headers.host || host}`);
            const key = request.headers["sec-websocket-key"];

            if (url.pathname !== "/chat" || typeof key !== "string") {
                if (!socket.destroyed && !socket.writableEnded) {
                    socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
                }
                socket.destroy();

                return;
            }

            const callerToken = getBearerToken(request.headers.authorization)
                || getWebSocketProtocolToken(request.headers["sec-websocket-protocol"]);
            const authenticatedOrgId = getTokenOrganizationId(callerToken);

            if (!callerToken || !authenticatedOrgId) {
                if (!socket.destroyed && !socket.writableEnded) {
                    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
                }
                socket.destroy();

                return;
            }

            writeFrame(socket, Buffer.from([
                "HTTP/1.1 101 Switching Protocols",
                "Upgrade: websocket",
                "Connection: Upgrade",
                `Sec-WebSocket-Accept: ${createWebSocketAcceptKey(key)}`,
                "Sec-WebSocket-Protocol: bearer",
                "",
                "",
            ].join("\r\n")));

            if (head.length > 0) {
                socket.unshift(head);
            }

            handleConnection(socket, authenticatedOrgId);
        } catch (error) {
            logger.error({ err: error }, "Error upgrading WebSocket connection");
            socket.destroy();
        }
    });

    server.listen(port, host, () => {
        logger.info({
            chatUrl: `ws://${host}:${port}/chat`,
            healthUrl: `http://${host}:${port}/health`,
        }, "AI agent started");
    });

    const shutdown = async () => {
        logger.info("Shutting down AI agent");
        server.close();
        for (const autonomousRuntimePromise of autonomousRuntimePromises.values()) {
            const autonomousRuntime = await autonomousRuntimePromise;
            await autonomousRuntime.client.close();
        }
        process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
}

runAgentServer().catch((error: unknown) => {
    logger.fatal({ err: error }, "AI agent failed to start");
    process.exit(1);
});
