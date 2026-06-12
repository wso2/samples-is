import { logger } from "../logging/logger";

const clientLogger = logger.child({ component: "asgardeo/client" });

const getBaseUrl = () => (process.env.NEXT_PUBLIC_BASE_URL ?? "").replace(/\/$/, "");
const getUserStoreName = () => process.env.USER_STORE_NAME ?? "DEFAULT";

export interface ScimUser {
  id: string;
  userName: string;
  name?: { givenName?: string; familyName?: string };
  emails?: string[] | Array<{ value: string; primary?: boolean }>;
  "urn:scim:wso2:schema"?: { accountLocked?: string; managedOrg?: string };
}

export interface ScimRole {
  id: string;
  displayName: string;
}

export async function scimCreateUser(
  accessToken: string,
  { email, givenName, familyName }: { email: string; givenName?: string; familyName?: string }
): Promise<ScimUser> {
  const body: Record<string, unknown> = {
    schemas: ["urn:ietf:params:scim:schemas:core:2.0:User", "urn:scim:wso2:schema"],
    emails: [{ primary: true, value: email }],
    "urn:scim:wso2:schema": { askPassword: "true" },
    userName: `${getUserStoreName()}/${email}`,
  };

  if (givenName || familyName) {
    body.name = { givenName, familyName };
  }

  const response = await fetch(`${getBaseUrl()}/o/scim2/Users`, {
    body: JSON.stringify(body),
    headers: {
      Accept: "application/scim+json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/scim+json",
    },
    method: "POST",
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof json?.detail === "string" ? json.detail :
      typeof json?.Errors?.[0]?.description === "string" ? json.Errors[0].description :
      typeof json?.message === "string" ? json.message :
      "Failed to create user.";
    clientLogger.error({ responseBody: json, statusCode: response.status }, "scimCreateUser failed");
    throw new Error(message);
  }

  return json as ScimUser;
}

export async function scimFetchRoleIdByName(accessToken: string, roleName: string): Promise<string | null> {
  const filter = encodeURIComponent(`displayName eq ${roleName}`);
  const response = await fetch(`${getBaseUrl()}/o/scim2/v2/Roles?filter=${filter}`, {
    headers: {
      Accept: "application/scim+json",
      Authorization: `Bearer ${accessToken}`,
    },
    method: "GET",
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(`Failed to fetch role "${roleName}".`);
  }

  const resources = json?.Resources;
  if (!Array.isArray(resources) || resources.length === 0) return null;
  return typeof resources[0]?.id === "string" ? resources[0].id : null;
}

export async function scimListUsers(
  accessToken: string,
  { count = 100, startIndex = 1 }: { count?: number; startIndex?: number } = {}
): Promise<{ users: ScimUser[]; totalResults: number }> {
  const params = new URLSearchParams({ count: String(count), startIndex: String(startIndex) });
  const response = await fetch(`${getBaseUrl()}/o/scim2/Users?${params}`, {
    headers: {
      Accept: "application/scim+json",
      Authorization: `Bearer ${accessToken}`,
    },
    method: "GET",
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof json?.detail === "string" ? json.detail :
      typeof json?.message === "string" ? json.message :
      "Failed to fetch users.";
    clientLogger.error({ responseBody: json, statusCode: response.status }, "scimListUsers failed");
    throw new Error(message);
  }

  const users: ScimUser[] = Array.isArray(json?.Resources) ? json.Resources : [];
  return { users, totalResults: typeof json?.totalResults === "number" ? json.totalResults : users.length };
}

export async function scimSendPasswordResetLink(accessToken: string, userId: string): Promise<void> {
  const response = await fetch(`${getBaseUrl()}/o/scim2/Users/${userId}`, {
    body: JSON.stringify({
      Operations: [{ op: "add", value: { "urn:scim:wso2:schema": { forcePasswordReset: "true" } } }],
      schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
    }),
    headers: {
      Accept: "application/scim+json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/scim+json",
    },
    method: "PATCH",
  });

  if (!response.ok) {
    const json = await response.json().catch(() => null);
    const message = typeof json?.detail === "string" ? json.detail : "Failed to send password reset link.";
    clientLogger.error({ responseBody: json, statusCode: response.status }, "scimSendPasswordResetLink failed");
    throw new Error(message);
  }
}

export async function scimUpdateAccountLocked(accessToken: string, userId: string, locked: boolean): Promise<void> {
  const response = await fetch(`${getBaseUrl()}/o/scim2/Users/${userId}`, {
    body: JSON.stringify({
      Operations: [{ op: "replace", value: { "urn:scim:wso2:schema": { accountLocked: String(locked) } } }],
      schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
    }),
    headers: {
      Accept: "application/scim+json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/scim+json",
    },
    method: "PATCH",
  });

  if (!response.ok) {
    const json = await response.json().catch(() => null);
    const message = typeof json?.detail === "string" ? json.detail : `Failed to ${locked ? "lock" : "unlock"} account.`;
    clientLogger.error({ responseBody: json, statusCode: response.status }, "scimUpdateAccountLocked failed");
    throw new Error(message);
  }
}

export interface ScimRoleWithUsers {
  id: string;
  displayName: string;
  users?: Array<{ value: string }>;
}

export async function scimListRolesWithUsers(accessToken: string): Promise<ScimRoleWithUsers[]> {
  const response = await fetch(`${getBaseUrl()}/o/scim2/v2/Roles?attributes=id,displayName,users`, {
    headers: {
      Accept: "application/scim+json",
      Authorization: `Bearer ${accessToken}`,
    },
    method: "GET",
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof json?.detail === "string" ? json.detail :
      typeof json?.message === "string" ? json.message :
      "Failed to fetch roles.";
    clientLogger.error({ responseBody: json, statusCode: response.status }, "scimListRolesWithUsers failed");
    throw new Error(message);
  }

  return Array.isArray(json?.Resources) ? json.Resources : [];
}

export async function scimGetRoleById(accessToken: string, roleId: string): Promise<ScimRoleWithUsers> {
  const response = await fetch(`${getBaseUrl()}/o/scim2/v2/Roles/${roleId}`, {
    headers: {
      Accept: "application/scim+json",
      Authorization: `Bearer ${accessToken}`,
    },
    method: "GET",
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof json?.detail === "string" ? json.detail :
      typeof json?.message === "string" ? json.message :
      `Failed to fetch role ${roleId}.`;
    clientLogger.error({ responseBody: json, statusCode: response.status }, "scimGetRoleById failed");
    throw new Error(message);
  }

  return json as ScimRoleWithUsers;
}

export async function scimUpdateRoleUsers(
  accessToken: string,
  roleId: string,
  toAdd: string[],
  toRemove: string[]
): Promise<void> {
  if (toAdd.length === 0 && toRemove.length === 0) return;

  const operations = [
    ...toAdd.map((userId) => ({ op: "add", path: "users", value: [{ value: userId }] })),
    ...toRemove.map((userId) => ({ op: "remove", path: `users[value eq "${userId}"]` })),
  ];

  const response = await fetch(`${getBaseUrl()}/o/scim2/v2/Roles/${roleId}`, {
    body: JSON.stringify({
      Operations: operations,
      schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
    }),
    headers: {
      Accept: "application/scim+json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/scim+json",
    },
    method: "PATCH",
  });

  if (!response.ok) {
    const json = await response.json().catch(() => null);
    const message = typeof json?.detail === "string" ? json.detail : "Failed to update role users.";
    clientLogger.error({ responseBody: json, statusCode: response.status }, "scimUpdateRoleUsers failed");
    throw new Error(message);
  }
}

export interface IdpConfig {
  orgId: string;
  name: string;
  clientId: string;
  clientSecret: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  logoutEndpoint?: string;
  jwksUri?: string;
}

export interface IdpDetail {
  id: string;
  name: string;
  clientId: string;
  clientSecret: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  logoutEndpoint: string;
  jwksUri: string;
}

function buildIdpPayload(config: IdpConfig): Record<string, unknown> {
  const baseUrl = getBaseUrl().replace(/\/t\/[^/]+$/, "");
  const callbackUrl = `${baseUrl}/o/${config.orgId}/commonauth`;

  return {
    image: "assets/images/logos/enterprise.svg",
    isPrimary: false,
    roles: { mappings: [], outboundProvisioningRoles: [] },
    certificate: {
      jwksUri: config.jwksUri ?? "",
      certificates: [""],
    },
    claims: {
      userIdClaim: { uri: "" },
      provisioningClaims: [],
      roleClaim: { uri: "" },
    },
    name: config.name,
    description: "",
    federatedAuthenticators: {
      defaultAuthenticatorId: "T3BlbklEQ29ubmVjdEF1dGhlbnRpY2F0b3I",
      authenticators: [
        {
          isEnabled: true,
          authenticatorId: "T3BlbklEQ29ubmVjdEF1dGhlbnRpY2F0b3I",
          properties: [
            { key: "ClientId", value: config.clientId },
            { key: "ClientSecret", value: config.clientSecret },
            { key: "OAuth2AuthzEPUrl", value: config.authorizationEndpoint },
            { key: "OAuth2TokenEPUrl", value: config.tokenEndpoint },
            { key: "OIDCLogoutEPUrl", value: config.logoutEndpoint ?? "" },
            { key: "callbackUrl", value: callbackUrl },
          ],
        },
      ],
    },
    homeRealmIdentifier: "",
    provisioning: {
      jit: { userstore: "DEFAULT", scheme: "PROVISION_SILENTLY", isEnabled: true },
    },
    isFederationHub: false,
    templateId: "enterprise-oidc-idp",
  };
}

function extractIdpDetail(json: Record<string, unknown>): IdpDetail {
  const authenticators = (
    (json?.federatedAuthenticators as Record<string, unknown>)?.authenticators as Array<Record<string, unknown>>
  ) ?? [];
  const properties: Array<{ key: string; value: string }> =
    (authenticators[0]?.properties as Array<{ key: string; value: string }>) ?? [];

  const prop = (key: string) => properties.find((p) => p.key === key)?.value ?? "";

  return {
    id: typeof json.id === "string" ? json.id : "",
    name: typeof json.name === "string" ? json.name : "",
    clientId: prop("ClientId"),
    clientSecret: prop("ClientSecret"),
    authorizationEndpoint: prop("OAuth2AuthzEPUrl"),
    tokenEndpoint: prop("OAuth2TokenEPUrl"),
    logoutEndpoint: prop("OIDCLogoutEPUrl"),
    jwksUri: typeof (json?.certificate as Record<string, unknown>)?.jwksUri === "string"
      ? ((json.certificate as Record<string, unknown>).jwksUri as string)
      : "",
  };
}

export async function idpCreate(accessToken: string, config: IdpConfig): Promise<IdpDetail> {
  const response = await fetch(`${getBaseUrl()}/o/api/server/v1/identity-providers`, {
    method: "POST",
    body: JSON.stringify(buildIdpPayload(config)),
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const json = await response.json().catch(() => ({})) as Record<string, unknown>;

  if (!response.ok) {
    const message =
      typeof json?.description === "string" ? json.description :
      typeof json?.message === "string" ? json.message :
      "Failed to create identity provider.";
    clientLogger.error({ responseBody: json, statusCode: response.status }, "idpCreate failed");
    throw new Error(message);
  }

  const idpId = typeof json.id === "string" ? json.id : "";
  return idpGet(accessToken, idpId);
}

export async function idpGet(accessToken: string, idpId: string): Promise<IdpDetail> {
  const baseUrl = getBaseUrl();

  const response = await fetch(`${baseUrl}/o/api/server/v1/identity-providers/${idpId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const json = await response.json().catch(() => ({})) as Record<string, unknown>;

  if (!response.ok) {
    const message =
      typeof json?.description === "string" ? json.description :
      typeof json?.message === "string" ? json.message :
      "Failed to fetch identity provider.";
    clientLogger.error({ responseBody: json, statusCode: response.status }, "idpGet failed");
    throw new Error(message);
  }

  // The main GET response doesn't inline authenticator properties — fetch them separately.
  const authenticatorId = (
    (json.federatedAuthenticators as Record<string, unknown>)?.defaultAuthenticatorId as string | undefined
  ) ?? "T3BlbklEQ29ubmVjdEF1dGhlbnRpY2F0b3I";

  const authRes = await fetch(
    `${baseUrl}/o/api/server/v1/identity-providers/${idpId}/federated-authenticators/${authenticatorId}`,
    {
      method: "GET",
      headers: { Accept: "application/json", Authorization: `Bearer ${accessToken}` },
    }
  );

  if (authRes.ok) {
    const authJson = await authRes.json().catch(() => ({})) as Record<string, unknown>;
    (json.federatedAuthenticators as Record<string, unknown>).authenticators = [authJson];
  }

  return extractIdpDetail(json);
}

export async function idpUpdate(accessToken: string, idpId: string, config: IdpConfig): Promise<IdpDetail> {
  const baseUrl = getBaseUrl();
  const authenticatorId = "T3BlbklEQ29ubmVjdEF1dGhlbnRpY2F0b3I";
  const callbackUrl = `${baseUrl.replace(/\/t\/[^/]+$/, "")}/o/${config.orgId}/commonauth`;

  // PATCH the IDP for name and certificate (jwksUri) — the only fields supported by the main endpoint.
  const patchRes = await fetch(`${baseUrl}/o/api/server/v1/identity-providers/${idpId}`, {
    method: "PATCH",
    headers: { Accept: "application/json", Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify([
      { operation: "REPLACE", path: "/name", value: config.name },
      { operation: "REPLACE", path: "/certificate/jwksUri", value: config.jwksUri ?? "" },
    ]),
  });

  if (!patchRes.ok) {
    const json = await patchRes.json().catch(() => ({})) as Record<string, unknown>;
    const message =
      typeof json?.description === "string" ? json.description :
      typeof json?.message === "string" ? json.message :
      "Failed to update identity provider.";
    clientLogger.error({ responseBody: json, statusCode: patchRes.status }, "idpUpdate PATCH failed");
    throw new Error(message);
  }

  // PUT the federated authenticator to update OIDC-specific properties.
  const authRes = await fetch(
    `${baseUrl}/o/api/server/v1/identity-providers/${idpId}/federated-authenticators/${authenticatorId}`,
    {
      method: "PUT",
      headers: { Accept: "application/json", Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        authenticatorId,
        isEnabled: true,
        properties: [
          { key: "ClientId", value: config.clientId },
          { key: "ClientSecret", value: config.clientSecret },
          { key: "OAuth2AuthzEPUrl", value: config.authorizationEndpoint },
          { key: "OAuth2TokenEPUrl", value: config.tokenEndpoint },
          { key: "OIDCLogoutEPUrl", value: config.logoutEndpoint ?? "" },
          { key: "callbackUrl", value: callbackUrl },
        ],
      }),
    }
  );

  if (!authRes.ok) {
    const json = await authRes.json().catch(() => ({})) as Record<string, unknown>;
    const message =
      typeof json?.description === "string" ? json.description :
      typeof json?.message === "string" ? json.message :
      "Failed to update identity provider authenticator.";
    clientLogger.error({ responseBody: json, statusCode: authRes.status }, "idpUpdate PUT authenticator failed");
    throw new Error(message);
  }

  return idpGet(accessToken, idpId);
}

export async function idpDelete(accessToken: string, idpId: string): Promise<void> {
  const response = await fetch(`${getBaseUrl()}/o/api/server/v1/identity-providers/${idpId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const json = await response.json().catch(() => null);
    const message =
      typeof json?.description === "string" ? json.description :
      typeof json?.message === "string" ? json.message :
      "Failed to delete identity provider.";
    clientLogger.error({ responseBody: json, statusCode: response.status }, "idpDelete failed");
    throw new Error(message);
  }
}

export async function shareApplicationRoles(
  accessToken: string,
  orgId: string,
  roleNames: string[],
  applicationId: string,
  appDisplayName: string
): Promise<{ status: string; details: string }> {
  const baseUrl = getBaseUrl();

  const response = await fetch(`${baseUrl}/api/server/v1/applications/share`, {
    method: "PATCH",
    body: JSON.stringify({
      Operations: [
        {
          op: "add",
          path: `organizations[orgId eq "${orgId}"].roles`,
          value: roleNames.map((displayName) => ({
            audience: { display: appDisplayName, type: "application" },
            displayName,
          })),
        },
      ],
      applicationId,
    }),
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const json = await response.json().catch(() => ({})) as Record<string, unknown>;

  if (!response.ok && response.status !== 202) {
    const message =
      typeof json?.message === "string" ? json.message :
      typeof json?.description === "string" ? json.description :
      "Failed to share application roles.";
    clientLogger.error({ responseBody: json, statusCode: response.status }, "shareApplicationRoles failed");
    throw new Error(message);
  }

  return {
    status: typeof json?.status === "string" ? json.status : "Processing",
    details: typeof json?.details === "string" ? json.details : "Application sharing process triggered.",
  };
}

export async function removeApplicationRoles(
  accessToken: string,
  orgId: string,
  roleNames: string[],
  applicationId: string,
  appDisplayName: string
): Promise<{ status: string; details: string }> {
  const baseUrl = getBaseUrl();

  const response = await fetch(`${baseUrl}/api/server/v1/applications/share`, {
    method: "PATCH",
    body: JSON.stringify({
      Operations: [
        {
          op: "remove",
          path: `organizations[orgId eq "${orgId}"].roles`,
          value: roleNames.map((displayName) => ({
            audience: { display: appDisplayName, type: "application" },
            displayName,
          })),
        },
      ],
      applicationId,
    }),
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const json = await response.json().catch(() => ({})) as Record<string, unknown>;

  if (!response.ok && response.status !== 202) {
    const message =
      typeof json?.message === "string" ? json.message :
      typeof json?.description === "string" ? json.description :
      "Failed to remove application roles.";
    clientLogger.error({ responseBody: json, statusCode: response.status }, "removeApplicationRoles failed");
    throw new Error(message);
  }

  return {
    status: typeof json?.status === "string" ? json.status : "Processing",
    details: typeof json?.details === "string" ? json.details : "Application role removal process triggered.",
  };
}

export async function appGetIdByName(accessToken: string, appName: string): Promise<string | null> {
  const filter = encodeURIComponent(`name eq ${appName}`);
  const response = await fetch(`${getBaseUrl()}/o/api/server/v1/applications?filter=${filter}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const json = await response.json().catch(() => ({})) as Record<string, unknown>;

  if (!response.ok) {
    const message =
      typeof json?.description === "string" ? json.description :
      typeof json?.message === "string" ? json.message :
      "Failed to fetch applications.";
    clientLogger.error({ responseBody: json, statusCode: response.status }, "appGetIdByName failed");
    throw new Error(message);
  }

  const applications = json?.applications as Array<Record<string, unknown>> | undefined;
  if (!Array.isArray(applications) || applications.length === 0) return null;
  return typeof applications[0]?.id === "string" ? applications[0].id : null;
}

export async function appAddIdpToAuthSequence(accessToken: string, appId: string, idpName: string): Promise<void> {
  const response = await fetch(`${getBaseUrl()}/o/api/server/v1/applications/${appId}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      authenticationSequence: {
        attributeStepId: 1,
        requestPathAuthenticators: [],
        steps: [
          {
            id: 1,
            options: [
              { idp: "LOCAL", authenticator: "BasicAuthenticator" },
              { authenticator: "OpenIDConnectAuthenticator", idp: idpName },
            ],
          },
        ],
        subjectStepId: 1,
        type: "USER_DEFINED",
      },
    }),
  });

  if (!response.ok) {
    const json = await response.json().catch(() => ({})) as Record<string, unknown>;
    const message =
      typeof json?.description === "string" ? json.description :
      typeof json?.message === "string" ? json.message :
      "Failed to update application authentication sequence.";
    clientLogger.error({ responseBody: json, statusCode: response.status }, "appAddIdpToAuthSequence failed");
    throw new Error(message);
  }
}

export async function appRemoveIdpFromAuthSequence(accessToken: string, appId: string): Promise<void> {
  const response = await fetch(`${getBaseUrl()}/o/api/server/v1/applications/${appId}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      authenticationSequence: {
        attributeStepId: 1,
        requestPathAuthenticators: [],
        steps: [
          {
            id: 1,
            options: [
              { idp: "LOCAL", authenticator: "BasicAuthenticator" },
            ],
          },
        ],
        subjectStepId: 1,
        type: "USER_DEFINED",
      },
    }),
  });

  if (!response.ok) {
    const json = await response.json().catch(() => ({})) as Record<string, unknown>;
    const message =
      typeof json?.description === "string" ? json.description :
      typeof json?.message === "string" ? json.message :
      "Failed to update application authentication sequence.";
    clientLogger.error({ responseBody: json, statusCode: response.status }, "appRemoveIdpFromAuthSequence failed");
    throw new Error(message);
  }
}

export interface BrandingConfig {
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  faviconUrl: string;
  fontFamily: string;
  fontImportUrl: string;
  textPrimaryColor: string;
  displayName: string;
  supportEmail: string;
}

function buildBrandingPayload(orgId: string, config: BrandingConfig): Record<string, unknown> {
  const makeColor = (main: string) => ({ contrastText: "", dark: "", inverted: "", light: "", main });

  const makeTheme = (isDark: boolean) => ({
    buttons: {
      externalConnection: {
        base: {
          background: { backgroundColor: config.secondaryColor },
          border: { borderRadius: "8px" },
          font: { color: "#151E24" },
        },
      },
      primary: { base: { border: { borderRadius: "8px" }, font: { color: "#FFFFFF" } } },
      secondary: {
        base: { border: { borderRadius: "8px" }, font: { color: isDark ? "#1F2937" : "#111827" } },
      },
    },
    colors: {
      alerts: {
        error: makeColor(isDark ? "#ff000054" : "#ffd8d8"),
        info: makeColor(isDark ? "#1971c233" : "#eff7fd"),
        neutral: makeColor(isDark ? "#343a4033" : "#f8f8f9"),
        warning: makeColor(isDark ? "#f08c0033" : "#fff6e7"),
      },
      background: {
        body: makeColor(isDark ? "#111827" : "#FFFFFF"),
        surface: makeColor(isDark ? "#1F2937" : "#F3F4F6"),
      },
      illustrations: {
        accent1: makeColor("#3865B5"),
        accent2: makeColor("#19BECE"),
        accent3: makeColor("#FFFFFF"),
        primary: makeColor(config.primaryColor),
        secondary: makeColor("#E0E1E2"),
      },
      outlined: { default: isDark ? "#374151" : "#E5E7EB" },
      primary: makeColor(config.primaryColor),
      secondary: makeColor(config.secondaryColor),
      text: {
        primary: isDark ? "#E5E7EB" : (config.textPrimaryColor || "#111827"),
        secondary: isDark ? "#B9B9C6" : "#00000066",
      },
    },
    footer: { border: { borderColor: "" }, font: { color: "" } },
    images: {
      favicon: config.faviconUrl ? { imgURL: config.faviconUrl } : {},
      logo: config.logoUrl ? { imgURL: config.logoUrl } : {},
      myAccountLogo: { title: "Account" },
    },
    inputs: {
      base: {
        background: { backgroundColor: isDark ? "#000000" : "#FFFFFF" },
        border: { borderColor: "", borderRadius: "8px" },
        font: { color: "" },
        labels: { font: { color: "" } },
      },
    },
    loginBox: {
      background: { backgroundColor: "" },
      border: { borderColor: "", borderRadius: "12px", borderWidth: "1px" },
      font: { color: "" },
    },
    loginPage: { background: { backgroundColor: "" }, font: { color: "" } },
    typography: {
      font: { fontFamily: config.fontFamily, importURL: config.fontImportUrl },
      heading: { font: { color: "" } },
    },
  });

  return {
    locale: "en-US",
    name: orgId,
    preference: {
      configs: { isBrandingEnabled: true, removeDefaultBranding: false },
      layout: { activeLayout: "centered" },
      organizationDetails: {
        displayName: config.displayName,
        supportEmail: config.supportEmail,
      },
      theme: {
        activeTheme: "LIGHT",
        LIGHT: makeTheme(false),
        DARK: makeTheme(true),
      },
      urls: { cookiePolicyURL: "", privacyPolicyURL: "", termsOfUseURL: "" },
    },
    type: "ORG",
  };
}

function extractBrandingConfig(json: Record<string, unknown>): BrandingConfig {
  const pref = (json?.preference as Record<string, unknown>) ?? {};
  const theme = (pref?.theme as Record<string, unknown>) ?? {};
  const light = (theme?.LIGHT as Record<string, unknown>) ?? {};
  const colors = (light?.colors as Record<string, unknown>) ?? {};
  const primary = (colors?.primary as Record<string, unknown>) ?? {};
  const secondary = (colors?.secondary as Record<string, unknown>) ?? {};
  const text = (colors?.text as Record<string, unknown>) ?? {};
  const images = (light?.images as Record<string, unknown>) ?? {};
  const logo = (images?.logo as Record<string, unknown>) ?? {};
  const favicon = (images?.favicon as Record<string, unknown>) ?? {};
  const typography = (light?.typography as Record<string, unknown>) ?? {};
  const font = (typography?.font as Record<string, unknown>) ?? {};
  const orgDetails = (pref?.organizationDetails as Record<string, unknown>) ?? {};

  return {
    primaryColor: typeof primary.main === "string" ? primary.main : "#2563EB",
    secondaryColor: typeof secondary.main === "string" ? secondary.main : "#FBBF24",
    logoUrl: typeof logo.imgURL === "string" ? logo.imgURL : "",
    faviconUrl: typeof favicon.imgURL === "string" ? favicon.imgURL : "",
    fontFamily: typeof font.fontFamily === "string" ? font.fontFamily : "Inter",
    fontImportUrl: typeof font.importURL === "string" ? font.importURL : "https://fonts.googleapis.com/css?family=Inter",
    textPrimaryColor: typeof text.primary === "string" ? text.primary : "#111827",
    displayName: typeof orgDetails.displayName === "string" ? orgDetails.displayName : "",
    supportEmail: typeof orgDetails.supportEmail === "string" ? orgDetails.supportEmail : "",
  };
}

export async function brandingGet(accessToken: string): Promise<BrandingConfig | null> {
  const response = await fetch(
    `${getBaseUrl()}/o/api/server/v1/branding-preference?type=ORG&locale=en-US`,
    {
      method: "GET",
      headers: { Accept: "application/json", Authorization: `Bearer ${accessToken}` },
    }
  );

  if (response.status === 404) return null;

  const json = await response.json().catch(() => ({})) as Record<string, unknown>;

  if (!response.ok) {
    const message =
      typeof json?.description === "string" ? json.description :
      typeof json?.message === "string" ? json.message :
      "Failed to fetch branding preference.";
    clientLogger.error({ responseBody: json, statusCode: response.status }, "brandingGet failed");
    throw new Error(message);
  }

  return extractBrandingConfig(json);
}

export async function brandingCreate(
  accessToken: string,
  orgId: string,
  config: BrandingConfig
): Promise<void> {
  const response = await fetch(`${getBaseUrl()}/o/api/server/v1/branding-preference`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildBrandingPayload(orgId, config)),
  });
  
  clientLogger.debug({ statusCode: response.status }, "brandingCreate response received");
  if (!response.ok) {
    const json = await response.json().catch(() => ({})) as Record<string, unknown>;
    const message =
      typeof json?.description === "string" ? json.description :
      typeof json?.message === "string" ? json.message :
      "Failed to create branding preference.";
    clientLogger.error({ responseBody: json, statusCode: response.status }, "brandingCreate failed");
    throw new Error(message);
  }
}

export async function brandingUpdate(
  accessToken: string,
  orgId: string,
  config: BrandingConfig
): Promise<void> {
  const response = await fetch(`${getBaseUrl()}/o/api/server/v1/branding-preference`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildBrandingPayload(orgId, config)),
  });

  if (!response.ok) {
    const json = await response.json().catch(() => ({})) as Record<string, unknown>;
    const message =
      typeof json?.description === "string" ? json.description :
      typeof json?.message === "string" ? json.message :
      "Failed to update branding preference.";
    clientLogger.error({ responseBody: json, statusCode: response.status }, "brandingUpdate failed");
    throw new Error(message);
  }
}

export async function brandingDelete(accessToken: string, orgId: string): Promise<void> {
  const params = new URLSearchParams({ type: "ORG", locale: "en-US", name: orgId });
  const response = await fetch(
    `${getBaseUrl()}/o/api/server/v1/branding-preference?${params}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok && response.status !== 404) {
    const json = await response.json().catch(() => null);
    const message =
      typeof json?.description === "string" ? json.description :
      typeof json?.message === "string" ? json.message :
      "Failed to delete branding preference.";
    clientLogger.error({ responseBody: json, statusCode: response.status }, "brandingDelete failed");
    throw new Error(message);
  }
}

export async function scimAssignRoleToUser(accessToken: string, roleId: string, userId: string): Promise<void> {
  const response = await fetch(`${getBaseUrl()}/o/scim2/v2/Roles/${roleId}`, {
    body: JSON.stringify({
      Operations: [{ op: "add", path: "users", value: [{ value: userId }] }],
      schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
    }),
    headers: {
      Accept: "application/scim+json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/scim+json",
    },
    method: "PATCH",
  });

  if (!response.ok) {
    const json = await response.json().catch(() => null);
    const message = typeof json?.detail === "string" ? json.detail : "Failed to assign role to user.";
    throw new Error(message);
  }
}
