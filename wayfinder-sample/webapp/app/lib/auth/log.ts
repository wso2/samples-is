import { NextRequest } from "next/server";

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const [, payload] = token.split(".");
  if (!payload) return null;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function logRequestActor(routeName: string, request: NextRequest) {
  const authorization = request.headers.get("authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : "";
  const payload = token ? decodeJwtPayload(token) : null;
  const actor =
    typeof payload?.act === "object" && payload.act !== null
      ? (payload.act as Record<string, unknown>).sub
      : undefined;

  console.error(`[${routeName}]`, request.method, request.nextUrl.pathname, {
    actor: typeof actor === "string" ? actor : null,
    sub: typeof payload?.sub === "string" ? payload.sub : null,
  });
}
