type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

type LogContext = Record<string, unknown>;

const LOG_LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  fatal: 50,
};

function normalizeLogLevel(value: string | undefined): LogLevel {
  return value === "debug" || value === "info" || value === "warn" || value === "error" || value === "fatal"
    ? value
    : "info";
}

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

  return {
    code: errorLike.code,
    message: truncatedMessage,
    name: error.name,
    statusCode: errorLike.statusCode,
    statusText: errorLike.statusText,
  };
}

function isSensitiveKey(key: string) {
  const normalized = key.toLowerCase();

  return normalized.includes("authorization") ||
    normalized.includes("token") ||
    normalized.includes("secret") ||
    normalized.includes("password");
}

function redactLogValue(key: string, value: unknown, depth = 0): unknown {
  if (isSensitiveKey(key)) {
    return "[redacted]";
  }

  if (value instanceof Error) {
    return summarizeError(value);
  }

  if (!value || typeof value !== "object" || depth > 4) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactLogValue(key, item, depth + 1));
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([childKey, childValue]) => [
      childKey,
      redactLogValue(childKey, childValue, depth + 1),
    ])
  );
}

function stringifyLogValue(value: unknown) {
  if (typeof value === "string") {
    return value.replace(/\s+/g, " ");
  }

  try {
    return JSON.stringify(value);
  } catch {
    return "[unserializable]";
  }
}

function formatLogContext(context: LogContext) {
  const entries = Object.entries(context)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${stringifyLogValue(redactLogValue(key, value))}`);

  return entries.length > 0 ? ` ${entries.join(" ")}` : "";
}

export function createLogger(context: LogContext = {}) {
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

export const logger = createLogger({ service: "b2b-app" });
