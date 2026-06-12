import { NextRequest, NextResponse } from "next/server";
import { requireScope } from "../../../lib/auth/guard";
import { Scope } from "../../../lib/auth/utils";
import { getEnterpriseIdp, upsertEnterpriseIdp, deleteEnterpriseIdp } from "../../../lib/db/queries/enterprise-idp";
import { idpCreate, idpGet, idpUpdate, idpDelete, appGetIdByName, appAddIdpToAuthSequence, appRemoveIdpFromAuthSequence, type IdpConfig } from "../../../lib/asgardeo/client";
import { logger } from "../../../lib/logging/logger";
import { logRequestActor } from "../../../lib/auth/log";

const routeLogger = logger.child({ route: "organization/enterprise-idp" });

export async function GET(request: NextRequest) {
  logRequestActor("organization/enterprise-idp", request);
  const auth = await requireScope(request, [Scope.IDP_VIEW]);
  if (auth instanceof NextResponse) return auth;

  const { orgId } = auth.claims;
  const record = getEnterpriseIdp(orgId);

  if (!record) {
    return NextResponse.json({ idp: null });
  }

  const accessToken = request.headers.get("authorization")!.slice(7);

  try {
    const idp = await idpGet(accessToken, record.idp_id);
    return NextResponse.json({ idp });
  } catch (err) {
    routeLogger.error({ err, idpId: record.idp_id, orgId }, "Failed to fetch identity provider");
    const message = err instanceof Error ? err.message : "Failed to fetch identity provider.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

type CreateBody = {
  name?: string;
  clientId?: string;
  clientSecret?: string;
  authorizationEndpoint?: string;
  tokenEndpoint?: string;
  logoutEndpoint?: string;
  jwksUri?: string;
};

async function parseBody(request: NextRequest): Promise<CreateBody | NextResponse> {
  try {
    return (await request.json()) as CreateBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
}

function validateConfig(body: CreateBody): IdpConfig | NextResponse {
  const { name, clientId, clientSecret, authorizationEndpoint, tokenEndpoint, logoutEndpoint, jwksUri } = body;

  if (!name?.trim()) return NextResponse.json({ error: "name is required." }, { status: 422 });
  if (!clientId?.trim()) return NextResponse.json({ error: "clientId is required." }, { status: 422 });
  if (!clientSecret?.trim()) return NextResponse.json({ error: "clientSecret is required." }, { status: 422 });
  if (!authorizationEndpoint?.trim()) return NextResponse.json({ error: "authorizationEndpoint is required." }, { status: 422 });
  if (!tokenEndpoint?.trim()) return NextResponse.json({ error: "tokenEndpoint is required." }, { status: 422 });

  return { orgId: "" as string, name: name.trim(), clientId: clientId.trim(), clientSecret: clientSecret.trim(), authorizationEndpoint: authorizationEndpoint.trim(), tokenEndpoint: tokenEndpoint.trim(), logoutEndpoint: logoutEndpoint?.trim() || undefined, jwksUri: jwksUri?.trim() || undefined };
}

export async function POST(request: NextRequest) {
  logRequestActor("organization/enterprise-idp", request);
  const auth = await requireScope(request, [Scope.IDP_CREATE, Scope.APP_MGT_VIEW, Scope.APP_MGT_UPDATE], "all");
  if (auth instanceof NextResponse) return auth;

  const body = await parseBody(request);
  if (body instanceof NextResponse) return body;

  const config = validateConfig(body);
  if (config instanceof NextResponse) return config;

  const { orgId } = auth.claims;
  config.orgId = orgId;
  const accessToken = request.headers.get("authorization")!.slice(7);

  try {
    const idp = await idpCreate(accessToken, config);

    const appName = process.env.APP_DISPLAY_NAME;
    if (appName) {
      const appId = await appGetIdByName(accessToken, appName);
      if (appId) {
        await appAddIdpToAuthSequence(accessToken, appId, idp.name);
      }
    }

    upsertEnterpriseIdp(orgId, idp.id, idp.name);
    return NextResponse.json({ idp }, { status: 201 });
  } catch (err) {
    routeLogger.error({ err, orgId }, "Failed to create identity provider");
    const message = err instanceof Error ? err.message : "Failed to create identity provider.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function PUT(request: NextRequest) {
  logRequestActor("organization/enterprise-idp", request);
  const auth = await requireScope(request, [Scope.IDP_UPDATE]);
  if (auth instanceof NextResponse) return auth;

  const { orgId } = auth.claims;
  const record = getEnterpriseIdp(orgId);

  if (!record) {
    return NextResponse.json({ error: "No identity provider configured for this organization." }, { status: 404 });
  }

  const body = await parseBody(request);
  if (body instanceof NextResponse) return body;

  const config = validateConfig(body);
  if (config instanceof NextResponse) return config;

  config.orgId = orgId;
  const accessToken = request.headers.get("authorization")!.slice(7);

  try {
    const idp = await idpUpdate(accessToken, record.idp_id, config);
    upsertEnterpriseIdp(orgId, idp.id, idp.name);
    return NextResponse.json({ idp });
  } catch (err) {
    routeLogger.error({ err, idpId: record.idp_id, orgId }, "Failed to update identity provider");
    const message = err instanceof Error ? err.message : "Failed to update identity provider.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function DELETE(request: NextRequest) {
  logRequestActor("organization/enterprise-idp", request);
  const auth = await requireScope(request, [Scope.IDP_DELETE, Scope.APP_MGT_VIEW, Scope.APP_MGT_UPDATE], "all");
  if (auth instanceof NextResponse) return auth;

  const { orgId } = auth.claims;
  const record = getEnterpriseIdp(orgId);

  if (!record) {
    return NextResponse.json({ error: "No identity provider configured for this organization." }, { status: 404 });
  }

  const accessToken = request.headers.get("authorization")!.slice(7);

  try {
    const appName = process.env.APP_DISPLAY_NAME;
    if (appName) {
      const appId = await appGetIdByName(accessToken, appName);
      if (appId) {
        await appRemoveIdpFromAuthSequence(accessToken, appId);
      }
    }

    await idpDelete(accessToken, record.idp_id);
    deleteEnterpriseIdp(orgId);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    routeLogger.error({ err, idpId: record.idp_id, orgId }, "Failed to delete identity provider");
    const message = err instanceof Error ? err.message : "Failed to delete identity provider.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
