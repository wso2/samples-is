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

export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";
export type LogContext = Record<string, unknown>;

const LOG_LEVEL_ORDER: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40, fatal: 50 };

function normalizeLogLevel(value: string | undefined): LogLevel {
    return value === "debug" || value === "info" || value === "warn" || value === "error" || value === "fatal"
        ? value
        : "info";
}

function summarizeError(error: Error) {
    const e = error as Error & { code?: string; statusCode?: number; statusText?: string };
    const msg = error.message.replace(/\s+/g, " ");
    return {
        code: e.code,
        message: msg.length > 500 ? `${msg.slice(0, 500)}...` : msg,
        name: error.name,
        statusCode: e.statusCode,
        statusText: e.statusText,
    };
}

function isSensitiveKey(key: string) {
    const k = key.toLowerCase();
    return k.includes("authorization") || k.includes("token") || k.includes("secret") || k.includes("password");
}

function redactLogValue(key: string, value: unknown, depth = 0): unknown {
    if (isSensitiveKey(key)) return "[redacted]";
    if (value instanceof Error) return summarizeError(value);
    if (!value || typeof value !== "object" || depth > 4) return value;
    if (Array.isArray(value)) return value.map((item) => redactLogValue(key, item, depth + 1));
    return Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, redactLogValue(k, v, depth + 1)]),
    );
}

function stringifyLogValue(value: unknown) {
    if (typeof value === "string") return value.replace(/\s+/g, " ");
    try { return JSON.stringify(value); } catch { return "[unserializable]"; }
}

function formatLogContext(context: LogContext) {
    const entries = Object.entries(context)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => `${k}=${stringifyLogValue(redactLogValue(k, v))}`);
    return entries.length > 0 ? ` ${entries.join(" ")}` : "";
}

export function createLogger(context: LogContext = {}) {
    const configuredLevel = normalizeLogLevel(process.env.LOG_LEVEL);

    function write(level: LogLevel, first: string | LogContext, second?: string) {
        if (LOG_LEVEL_ORDER[level] < LOG_LEVEL_ORDER[configuredLevel]) return;
        const message = typeof first === "string" ? first : second || "";
        const childContext = typeof first === "string" ? {} : first;
        const line = `${new Date().toISOString()} ${level.toUpperCase()} ${message}${formatLogContext({ ...context, ...childContext })}`;
        if (level === "warn") console.warn(line);
        else if (level === "error" || level === "fatal") console.error(line);
        else console.log(line);
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
