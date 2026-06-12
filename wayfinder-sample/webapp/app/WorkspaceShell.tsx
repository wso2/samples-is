"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAuth } from "./lib/auth/client";
import AdminSidebar from "./AdminSidebar";
import AgentChatWidget from "./AgentChatWidget";
import ImpersonationBanner from "./ImpersonationBanner";
import LoadingScreen from "./LoadingScreen";
import WorkspaceLoader from "./WorkspaceLoader";
import { UserRole } from "./lib/auth/utils";
import { useBranding } from "./lib/branding/BrandingProvider";

const icon = (d: string | string[], extraProps?: Record<string, string>) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...extraProps}>
    {(Array.isArray(d) ? d : [d]).map((path, i) => <path key={i} d={path} />)}
  </svg>
);

const ALL_NAV_ITEMS = [
  {
    href: "/requests",
    label: "Travel policies",
    icon: icon(["M9 12h6M9 16h4M7 3H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2", "M9 3v2a2 2 0 0 0 4 0V3"]),
  },
  {
    href: "/organization",
    label: "Users and roles",
    icon: icon(["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75", "M9 7a4 4 0 1 1 0 8 4 4 0 0 1 0-8z"]),
  },
  {
    href: "/enterprise-idp",
    label: "Enterprise IdP",
    icon: icon(["M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"]),
  },
  {
    href: "/bookings",
    label: "Flight booking",
    icon: icon("M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.9 12.72 19.79 19.79 0 0 1 1.85 4.1 2 2 0 0 1 3.83 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"),
  },
  {
    href: "/personalization",
    label: "Personalization",
    icon: icon(["M12 2a10 10 0 1 0 0 20", "M12 2c2.5 2.5 4 6 4 10s-1.5 7.5-4 10", "M2 12h20", "M12 2c-2.5 2.5-4 6-4 10s1.5 7.5 4 10"]),
  },
  {
    href: "/billing",
    label: "Billing",
    icon: icon(["M2 7h20v14H2z", "M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z", "M6 14h4"]),
  },
];

const IDP_MANAGER_NAV_ITEMS = [ALL_NAV_ITEMS[2]];

const BRANDING_NAV_ITEMS = [ALL_NAV_ITEMS[4]];

function getNavItems(roles: UserRole[]) {
  if (roles.includes(UserRole.ADMIN)) return ALL_NAV_ITEMS;
  if (roles.includes(UserRole.IDP_MANAGER)) return IDP_MANAGER_NAV_ITEMS;
  if (roles.includes(UserRole.BASIC_BRANDING_EDITOR) || roles.includes(UserRole.ADVANCED_BRANDING_EDITOR)) return BRANDING_NAV_ITEMS;
  return [];
}


function hasAdminShell(roles: UserRole[]) {
  return (
    roles.includes(UserRole.ADMIN) ||
    roles.includes(UserRole.IDP_MANAGER) ||
    roles.includes(UserRole.BASIC_BRANDING_EDITOR) ||
    roles.includes(UserRole.ADVANCED_BRANDING_EDITOR)
  );
}

function ProfileActions() {
  const { user, signOut } = useAuth();

  const firstName = user?.firstName || "";
  const lastName = user?.lastName || "";
  const displayName = `${firstName} ${lastName}`.trim() || (user?.email?.split("@")[0] ?? "") || "Workspace user";
  const initials = (() => {
    const parts = [firstName, lastName].filter(Boolean);
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : displayName.slice(0, 2).toUpperCase();
  })();

  return (
    <div className="profile-actions">
      <div className="header-user" aria-label="Current user">
        <span className="header-user-avatar" aria-hidden="true">
          {initials}
        </span>
        <span className="header-user-copy">
          <strong>{displayName}</strong>
          {user?.email ? <span>{user.email}</span> : null}
        </span>
      </div>
      <button className="button button-ghost" onClick={signOut} type="button">
        Sign out
      </button>
    </div>
  );
}

export default function WorkspaceShell({
  activeHref,
  children,
  eyebrow,
  loading,
  roles,
  title
}: Readonly<{
  activeHref: string;
  children: ReactNode;
  eyebrow: string;
  loading?: boolean;
  roles: UserRole[];
  title: string;
}>) {
  const { isLoading: authLoading, user } = useAuth();
  const { branding } = useBranding();
  const logoSrc = branding?.logoUrl || "/wayfinder-logo.png";
  const brandLabel = branding?.displayName || "Wayfinder";

  if (authLoading) {
    return <LoadingScreen description="Please wait while we set up your workspace." steps={[]} title="Loading your workspace…" />;
  }

  if (!hasAdminShell(roles)) {
    return (
      <main className="member-shell">
        <ImpersonationBanner />
        <header className="member-topbar">
          <Link className="sidebar-brand" href="/">
            <img src={logoSrc} className="sidebar-brand-mark" alt={brandLabel} />
            <span className="sidebar-brand-label">{brandLabel}</span>
          </Link>
          <ProfileActions />
        </header>

        <section className="workspace member-workspace">
          <header className="workspace-header">
            <div>
              <p className="eyebrow">{eyebrow}</p>
              <h1>{title}</h1>
            </div>
          </header>
          <div style={{ position: "relative" }}>
            {loading && <WorkspaceLoader />}
            {children}
          </div>
        </section>
        <AgentChatWidget />
      </main>
    );
  }

  return (
    <main className="app-shell admin-shell">
      <ImpersonationBanner />
      <AdminSidebar activeHref={activeHref} navItems={getNavItems(roles)} user={user} />

      <section className="workspace">
        <header className="workspace-header">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
          </div>
          <ProfileActions />
        </header>
        <div style={{ position: "relative" }}>
          {loading && <WorkspaceLoader />}
          {children}
        </div>
      </section>
      <AgentChatWidget />
    </main>
  );
}
