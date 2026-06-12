"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { AppUser } from "./lib/auth/utils";
import { useBranding } from "./lib/branding/BrandingProvider";

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
};

export default function AdminSidebar({
  activeHref,
  navItems,
  user
}: Readonly<{
  activeHref: string;
  navItems: NavItem[];
  user: AppUser | null;
}>) {
  const { branding } = useBranding();
  const logoSrc = branding?.logoUrl || "/wayfinder-logo.png";
  const brandLabel = branding?.displayName || "Wayfinder";
  const hasCustomBranding = !!branding?.displayName;
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setIsCollapsed(window.localStorage.getItem("wayfinder.sidebar.collapsed") === "true");
  }, []);

  function toggleSidebar() {
    setIsCollapsed((current) => {
      const nextValue = !current;

      window.localStorage.setItem("wayfinder.sidebar.collapsed", String(nextValue));

      return nextValue;
    });
  }

  return (
    <aside className={isCollapsed ? "sidebar collapsed" : "sidebar"}>
      <div className="sidebar-top">
        <Link className="sidebar-brand" href="/">
          <img src={logoSrc} className="sidebar-brand-mark" alt={brandLabel} />
          <span className="sidebar-brand-label">{brandLabel}</span>
        </Link>
        <button
          aria-label={isCollapsed ? "Expand navigation" : "Collapse navigation"}
          className="sidebar-toggle"
          onClick={toggleSidebar}
          type="button"
        >
          <span aria-hidden="true" />
        </button>
      </div>
      {!hasCustomBranding && (
        <div className="sidebar-user" title={isCollapsed ? (user?.orgName || "Organization") : undefined}>
          <span className="sidebar-user-avatar" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h18M3 7l9-4 9 4M4 21V7M20 21V7M9 21v-4a3 3 0 0 1 6 0v4" />
            </svg>
          </span>
          <span className="sidebar-user-copy">
            <strong>{user?.orgName || "Organization"}</strong>
          </span>
        </div>
      )}
      <nav className="side-nav" aria-label="Workspace navigation">
        {navItems.map((item) => (
          <Link
            aria-label={item.label}
            className={item.href === activeHref ? "active" : undefined}
            href={item.href}
            key={item.href}
            title={isCollapsed ? item.label : undefined}
          >
            <span className="side-nav-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="side-nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
