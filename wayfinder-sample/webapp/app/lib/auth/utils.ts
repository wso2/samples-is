export enum Tier {
  FREE = "FREE",
  BASIC = "BASIC",
  ADVANCED = "ADVANCED",
}

export enum Scope {
  USER_LIST = "internal_org_user_mgt_list",
  USER_CREATE = "internal_org_user_mgt_create",
  USER_UPDATE = "internal_org_user_mgt_update",
  ROLE_VIEW = "internal_org_role_mgt_view",
  ROLE_USERS_UPDATE = "internal_org_role_mgt_users_update",
  TRAVEL_POLICY_VIEW = "view_travel_policy",
  TRAVEL_POLICY_CREATE = "create_travel_policy",
  TRAVEL_POLICY_UPDATE = "update_travel_policy",
  TRAVEL_POLICY_DELETE = "delete_travel_policy",
  IDP_VIEW = "internal_org_idp_view",
  IDP_CREATE = "internal_org_idp_create",
  IDP_UPDATE = "internal_org_idp_update",
  IDP_DELETE = "internal_org_idp_delete",
  APP_MGT_VIEW = "internal_org_application_mgt_view",
  APP_MGT_UPDATE = "internal_org_application_mgt_update",
  UPGRADE_VIEW = "view_upgrade",
  UPGRADE_CREATE = "create_upgrade",
  UPGRADE_UPDATE = "update_upgrade",
  UPGRADE_DELETE = "delete_upgrade",
  BRANDING_CREATE_BASIC = "create_basic_branding",
  BRANDING_CREATE_ADVANCED = "create_advanced_branding",
  BRANDING_DELETE = "delete_branding",
  BOOKING_VIEW = "view_booking",
  BOOKING_CREATE = "create_booking",
  BOOKING_DELETE = "delete_booking",
}

export enum UserRole {
  ADMIN = "Admin",
  MEMBER = "Member",
  IDP_MANAGER = "Idp Manager",
  BASIC_BRANDING_EDITOR = "Basic Branding Editor",
  ADVANCED_BRANDING_EDITOR = "Advanced Branding Editor",
}

const ROLE_NAME_ADMIN = process.env.NEXT_PUBLIC_ADMIN_ROLE_NAME ?? "WayFinder-Admin";
const ROLE_NAME_MEMBER = process.env.NEXT_PUBLIC_MEMBER_ROLE_NAME ?? "WayFinder-Member";
const ROLE_NAME_IDP_MANAGER = process.env.NEXT_PUBLIC_IDP_MANAGER_ROLE_NAME ?? "IdP-Manager";
const ROLE_NAME_BASIC_BRANDING_EDITOR = process.env.NEXT_PUBLIC_BASIC_BRANDING_EDITOR_ROLE_NAME ?? "Basic-Branding-Editor";
const ROLE_NAME_ADVANCED_BRANDING_EDITOR = process.env.NEXT_PUBLIC_ADVANCED_BRANDING_EDITOR_ROLE_NAME ?? "Advanced-Branding-Editor";

export const ASGARDEO_ROLE_TO_USER_ROLE: Record<string, UserRole> = {
  [ROLE_NAME_ADMIN]: UserRole.ADMIN,
  [ROLE_NAME_MEMBER]: UserRole.MEMBER,
  [ROLE_NAME_IDP_MANAGER]: UserRole.IDP_MANAGER,
  [ROLE_NAME_BASIC_BRANDING_EDITOR]: UserRole.BASIC_BRANDING_EDITOR,
  [ROLE_NAME_ADVANCED_BRANDING_EDITOR]: UserRole.ADVANCED_BRANDING_EDITOR,
};

export const USER_ROLE_TO_ASGARDEO_ROLE: Record<UserRole, string> = {
  [UserRole.ADMIN]: ROLE_NAME_ADMIN,
  [UserRole.MEMBER]: ROLE_NAME_MEMBER,
  [UserRole.IDP_MANAGER]: ROLE_NAME_IDP_MANAGER,
  [UserRole.BASIC_BRANDING_EDITOR]: ROLE_NAME_BASIC_BRANDING_EDITOR,
  [UserRole.ADVANCED_BRANDING_EDITOR]: ROLE_NAME_ADVANCED_BRANDING_EDITOR,
};

export interface AppUser {
  email: string;
  firstName: string;
  lastName: string;
  orgId: string;
  orgName: string;
  permissions: string[];
}

export function getRolesFromPermissions(permissions: string[]): UserRole[] {
  const roles = permissions
    .map((perm) => ASGARDEO_ROLE_TO_USER_ROLE[perm])
    .filter(Boolean) as UserRole[];
  return roles.length > 0 ? roles : [UserRole.MEMBER];
}

export function buildUserFromTokens(
  accessPayload: Record<string, unknown>,
  idPayload: Record<string, unknown>
): AppUser {
  const rawRoles = accessPayload.roles;
  const roles = Array.isArray(rawRoles)
    ? (rawRoles as unknown[]).map(String)
    : typeof rawRoles === "string" && rawRoles.length > 0
    ? [rawRoles]
    : [];

  return {
    email: typeof idPayload.email === "string" ? idPayload.email : "",
    firstName: typeof idPayload.given_name === "string" ? idPayload.given_name : "",
    lastName: typeof idPayload.family_name === "string" ? idPayload.family_name : "",
    orgId: typeof idPayload.org_id === "string" ? idPayload.org_id : (typeof accessPayload.org_id === "string" ? accessPayload.org_id : ""),
    orgName: typeof idPayload.org_name === "string" ? idPayload.org_name : (typeof accessPayload.org_name === "string" ? accessPayload.org_name : ""),
    permissions: roles
  };
}
