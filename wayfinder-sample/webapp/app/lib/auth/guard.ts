import { createRemoteJWKSet, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export interface TokenClaims {
  orgId: string;
  scopes: string[];
  sub: string;
  roles: string[];
}

let _jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJWKS() {
  if (!_jwks) {
    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL ?? "").replace(/\/$/, "");
    _jwks = createRemoteJWKSet(new URL(`${baseUrl}/oauth2/jwks`));
  }
  return _jwks;
}

/**
 * Validates the Bearer token and returns extracted claims, or a 401 response.
 *
 *   const auth = await requireAuth(request);
 *   if (auth instanceof NextResponse) return auth;
 */
export async function requireAuth(
  request: NextRequest
): Promise<{ claims: TokenClaims } | NextResponse> {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return NextResponse.json({ error: "Missing authorization token." }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, getJWKS());

    const orgId = typeof payload.org_id === "string" ? payload.org_id : "";

    if (!orgId) {
      return NextResponse.json({ error: "Token is missing org_id claim." }, { status: 401 });
    }

    const scopes = typeof payload.scope === "string" ? payload.scope.split(" ") : [];
    const sub = typeof payload.sub === "string" ? payload.sub : "";
    const rawRoles = payload.roles;
    const roles = Array.isArray(rawRoles)
      ? (rawRoles as unknown[]).map(String)
      : typeof rawRoles === "string" && rawRoles.length > 0
      ? [rawRoles]
      : [];

    return { claims: { orgId, scopes, sub, roles } };
  } catch {
    return NextResponse.json({ error: "Invalid or expired token." }, { status: 401 });
  }
}

export type ScopePolicy = "any" | "all";

/**
 * Like requireAuth, but also enforces scope requirements on the token.
 * policy "any" (default): passes if the token has at least one of the listed scopes.
 * policy "all": passes only if the token has every listed scope.
 *
 *   const auth = await requireScope(request, [Scope.IDP_VIEW]);
 *   const auth = await requireScope(request, [Scope.IDP_CREATE, Scope.APP_MGT_VIEW, Scope.APP_MGT_UPDATE], "all");
 *   if (auth instanceof NextResponse) return auth;
 */
export async function requireScope(
  request: NextRequest,
  requiredScopes: string[],
  policy: ScopePolicy = "any"
): Promise<{ claims: TokenClaims } | NextResponse> {
  const result = await requireAuth(request);
  if (result instanceof NextResponse) return result;

  const check = policy === "all"
    ? requiredScopes.every((s) => result.claims.scopes.includes(s))
    : requiredScopes.some((s) => result.claims.scopes.includes(s));

  if (!check) {
    return NextResponse.json({ error: "Insufficient permissions." }, { status: 403 });
  }

  return result;
}
