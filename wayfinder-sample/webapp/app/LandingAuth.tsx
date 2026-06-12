"use client";

import Link from "next/link";
import { useAuth } from "./lib/auth/client";
import { useBranding } from "./lib/branding/BrandingProvider";

function useLandingUser() {
  const { isSignedIn, user, signIn, signOut } = useAuth();

  const firstName = user?.firstName || "";
  const lastName = user?.lastName || "";
  const displayName = `${firstName} ${lastName}`.trim() || (user?.email?.split("@")[0] ?? "") || "Workspace user";
  const initials = (() => {
    const parts = [firstName, lastName].filter(Boolean);
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : displayName.slice(0, 2).toUpperCase();
  })();

  return {
    displayName,
    email: user?.email ?? "",
    firstName: displayName === "Workspace user" ? "there" : (firstName || displayName.split(/\s+/)[0]),
    initials,
    isSignedIn,
    signIn,
    signOut
  };
}

export function LandingHeader() {
  const { displayName, email, initials, isSignedIn, signIn, signOut } = useLandingUser();
  const { branding } = useBranding();
  const logoSrc = branding?.logoUrl || "/wayfinder-logo.png";
  const appName = branding?.displayName || "Wayfinder";

  return (
    <nav className="topbar public-topbar">
      <Link className="brand" href="/">
        <img src={logoSrc} className="brand-logo" alt={appName} />
        {appName}
      </Link>
      <div className="public-nav-links" aria-label="Landing page sections">
        <a href="#platform">Platform</a>
        <a href="#workflow">Workflow</a>
        <a href="#outcomes">Outcomes</a>
      </div>
      <div className="nav-actions">
        {isSignedIn ? (
          <>
            <div className="header-user" aria-label="Current user">
              <span className="header-user-avatar" aria-hidden="true">
                {initials}
              </span>
              <span className="header-user-copy">
                <strong>{displayName}</strong>
                {email ? <span>{email}</span> : null}
              </span>
            </div>
            <Link className="button button-secondary" href="/dashboard">
              Dashboard
            </Link>
            <button className="button button-ghost" onClick={signOut} type="button">
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link className="button button-secondary" href="/onboarding">
              Get started
            </Link>
            <button className="button button-primary" onClick={() => signIn({ fidp: "OrganizationSSO" })} type="button">
              Sign in
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export function FooterBrand() {
  const { branding } = useBranding();
  const logoSrc = branding?.logoUrl || "/wayfinder-logo.png";
  const appName = branding?.displayName || "Wayfinder";

  return (
    <Link className="brand" href="/">
      <img src={logoSrc} className="brand-logo" alt={appName} />
      {appName}
    </Link>
  );
}

export function LandingHeroCopy() {
  const { firstName, isSignedIn, signIn } = useLandingUser();

  if (isSignedIn) {
    return (
      <div className="hero-copy">
        <p className="eyebrow">Welcome back</p>
        <h1>Good to see you, {firstName}.</h1>
        <p className="hero-text">
          Your travel workspace is ready for today&apos;s requests, approvals, policy checks, and spend reviews.
        </p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/dashboard">
            Open workspace
          </Link>
          <Link className="button button-secondary" href="/bookings">
            Book flight
          </Link>
        </div>
        <div className="hero-proof" aria-label="Platform highlights">
          <span>Workspace ready</span>
          <span>Policy-aware booking</span>
          <span>Spend review live</span>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-copy">
      <p className="eyebrow">Enterprise Travel Management</p>
      <h1>Corporate travel control for every client workspace.</h1>
      <p className="hero-text">
        Coordinate flights, approvals, travel policies, and spend across multiple workspaces with a platform built for
        agencies and enterprise travel teams.
      </p>
      <div className="hero-actions">
        <Link className="button button-primary" href="/onboarding">
          Get started
        </Link>
        <button className="button button-secondary" onClick={() => signIn()} type="button">
          View demo workspace
        </button>
      </div>
      <div className="hero-proof" aria-label="Platform highlights">
        <span>Multi-workspace controls</span>
        <span>Policy-aware booking</span>
        <span>Centralized spend review</span>
      </div>
    </div>
  );
}
