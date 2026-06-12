"use client";

import { useEffect, useState } from "react";
import WorkspaceShell from "../WorkspaceShell";
import { useAuth } from "../lib/auth/client";
import { Tier, UserRole } from "../lib/auth/utils";

interface IdpConfig {
  name: string;
  clientId: string;
  clientSecret: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  logoutEndpoint: string;
  jwksUri: string;
}

interface IdpDetail extends IdpConfig {
  id: string;
}

const EMPTY_FORM: IdpConfig = {
  name: "",
  clientId: "",
  clientSecret: "",
  authorizationEndpoint: "",
  tokenEndpoint: "",
  logoutEndpoint: "",
  jwksUri: "",
};

const UPGRADE_WAIT_MS = Number(process.env.NEXT_PUBLIC_UPGRADE_WAIT_MS ?? 5000);

function LockIcon() {
  return (
    <svg fill="none" height="28" viewBox="0 0 24 24" width="28">
      <rect height="11" rx="2" stroke="currentColor" strokeWidth="1.7" width="14" x="5" y="11" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
      <circle cx="12" cy="16.5" fill="currentColor" r="1.5" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      fill="none"
      height="20"
      stroke="currentColor"
      strokeWidth="2.2"
      viewBox="0 0 24 24"
      width="20"
      style={{ animation: "spin 0.9s linear infinite" }}
    >
      <circle cx="12" cy="12" opacity="0.25" r="10" />
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg fill="none" height="20" viewBox="0 0 24 24" width="20">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7.5 12l3 3 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

interface UpgradeWallProps {
  isUpgrading: boolean;
  upgradeWaiting: boolean;
  showReloginPrompt: boolean;
  upgradeError: string | null;
  onUpgrade: () => void;
  onSignOut: () => void;
}

function UpgradeWall({
  isUpgrading,
  upgradeWaiting,
  showReloginPrompt,
  upgradeError,
  onUpgrade,
  onSignOut,
}: UpgradeWallProps) {
  const busy = isUpgrading || upgradeWaiting;

  if (showReloginPrompt) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          padding: "48px 32px",
          textAlign: "center",
        }}
      >
        <div style={{ color: "var(--color-success, #16a34a)" }}>
          <CheckCircleIcon />
        </div>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>Enterprise SSO is ready</h3>
        <p style={{ margin: 0, maxWidth: "400px", color: "var(--color-text-subtle, #6b7280)", lineHeight: 1.6 }}>
          Your plan has been upgraded. Sign out and sign back in to activate Enterprise SSO for your
          organization.
        </p>
        <button className="button button-primary" onClick={onSignOut} style={{ marginTop: "8px" }} type="button">
          Sign out &amp; sign back in
        </button>
      </div>
    );
  }

  if (busy) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "14px",
          padding: "48px 32px",
          textAlign: "center",
        }}
      >
        <SpinnerIcon />
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
          {isUpgrading ? "Upgrading your plan…" : "Activating Enterprise SSO…"}
        </h3>
        <p style={{ margin: 0, color: "var(--color-text-subtle, #6b7280)" }}>
          {isUpgrading
            ? "Updating your subscription."
            : "Setting up Enterprise SSO for your organization. This takes a few seconds."}
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "24px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "14px",
          padding: "16px 20px",
          background: "var(--color-surface-subtle, #f9fafb)",
          border: "1px solid var(--color-border, #e5e7eb)",
          borderRadius: "10px",
        }}
      >
        <div style={{ color: "var(--color-text-subtle, #6b7280)", flexShrink: 0, paddingTop: "2px" }}>
          <LockIcon />
        </div>
        <div>
          <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: "15px" }}>
            Enterprise SSO requires the Enterprise plan
          </p>
          <p style={{ margin: 0, fontSize: "14px", color: "var(--color-text-subtle, #6b7280)", lineHeight: 1.55 }}>
            Connect your company identity provider via OIDC so employees sign in through your existing
            directory. Upgrade your organization to the Enterprise plan to unlock this feature.
          </p>
        </div>
      </div>

      {upgradeError && (
        <div
          style={{
            padding: "10px 14px",
            background: "#fff5f5",
            border: "1px solid #fecaca",
            borderRadius: "6px",
            color: "#b91c1c",
            fontSize: "14px",
          }}
        >
          {upgradeError}
        </div>
      )}

      <div
        style={{
          border: "2px solid var(--color-primary, #2563eb)",
          borderRadius: "12px",
          padding: "28px 28px 24px",
          display: "flex",
          gap: "24px",
          alignItems: "flex-start",
          background: "var(--color-primary-surface, #eff6ff)",
        }}
      >
        <div style={{ flex: 1 }}>
          <p
            style={{
              margin: "0 0 2px",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              color: "var(--color-primary, #2563eb)",
            }}
          >
            ADVANCED · Enterprise
          </p>
          <p style={{ margin: "0 0 6px", fontSize: "22px", fontWeight: 700 }}>$99 <span style={{ fontSize: "14px", fontWeight: 400, color: "var(--color-text-subtle, #6b7280)" }}>per seat / month</span></p>
          <ul
            style={{
              margin: "10px 0 0",
              padding: "0 0 0 16px",
              fontSize: "13px",
              color: "var(--color-text-subtle, #6b7280)",
              lineHeight: 1.8,
            }}
          >
            <li>Unlimited travelers</li>
            <li>Enterprise SSO (OIDC) — required for this feature</li>
            <li>Advanced branding &amp; custom API</li>
            <li>Dedicated account manager</li>
            <li>24/7 phone &amp; chat support</li>
          </ul>
        </div>
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
          <button
            className="button button-primary"
            disabled={busy}
            onClick={onUpgrade}
            type="button"
          >
            Upgrade to Enterprise
          </button>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--color-text-subtle, #6b7280)" }}>
            You can manage your plan in Billing
          </p>
        </div>
      </div>
    </div>
  );
}

export default function EnterpriseIdpDashboard({ roles }: { roles: UserRole[] }) {
  const { accessToken, signOut } = useAuth();

  const [tier, setTier] = useState<Tier | null>(null);
  const [isTierLoading, setIsTierLoading] = useState(true);
  const [tierError, setTierError] = useState(false);
  const [tierRetryKey, setTierRetryKey] = useState(0);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeWaiting, setUpgradeWaiting] = useState(false);
  const [showReloginPrompt, setShowReloginPrompt] = useState(false);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);

  const [idp, setIdp] = useState<IdpDetail | null>(null);
  const [form, setForm] = useState<IdpConfig>(EMPTY_FORM);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [idpLoadError, setIdpLoadError] = useState<string | null>(null);
  const [idpRetryKey, setIdpRetryKey] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canManage = roles.includes(UserRole.IDP_MANAGER);
  const isAdmin = roles.includes(UserRole.ADMIN);
  const hasIdpAccess = tier === Tier.ADVANCED;

  useEffect(() => {
    if (!accessToken) return;

    setIsTierLoading(true);
    setTierError(false);
    fetch("/api/organization/upgrade", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data: { tier?: string }) => setTier((data.tier ?? Tier.FREE) as Tier))
      .catch(() => setTierError(true))
      .finally(() => setIsTierLoading(false));
  }, [accessToken, tierRetryKey]);

  useEffect(() => {
    if (!accessToken || !hasIdpAccess) return;

    const controller = new AbortController();

    setIsLoading(true);
    setIdpLoadError(null);
    fetch("/api/organization/enterprise-idp", {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data: { idp?: IdpDetail | null; error?: string }) => {
        if (data.error) setIdpLoadError(data.error);
        else setIdp(data.idp ?? null);
      })
      .catch((err) => {
        if (err instanceof Error && err.name !== "AbortError") {
          setIdpLoadError("Failed to load identity provider configuration.");
        }
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [accessToken, hasIdpAccess, idpRetryKey]);

  async function handleUpgrade() {
    if (!accessToken) return;

    setIsUpgrading(true);
    setUpgradeError(null);

    try {
      const res = await fetch("/api/organization/upgrade", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ tier: Tier.ADVANCED }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string };
        setUpgradeError(data.error ?? "Upgrade failed. Please try again.");
        setIsUpgrading(false);
        return;
      }

      setIsUpgrading(false);
      setUpgradeWaiting(true);
      await new Promise<void>((resolve) => setTimeout(resolve, UPGRADE_WAIT_MS));
      setUpgradeWaiting(false);
      setShowReloginPrompt(true);
    } catch {
      setUpgradeError("Upgrade failed. Please try again.");
      setIsUpgrading(false);
      setUpgradeWaiting(false);
    }
  }

  function handleEdit() {
    setForm(
      idp
        ? { name: idp.name, clientId: idp.clientId, clientSecret: idp.clientSecret, authorizationEndpoint: idp.authorizationEndpoint, tokenEndpoint: idp.tokenEndpoint, logoutEndpoint: idp.logoutEndpoint, jwksUri: idp.jwksUri }
        : EMPTY_FORM
    );
    setError(null);
    setIsEditing(true);
  }

  function handleCancel() {
    setIsEditing(false);
    setError(null);
  }

  async function handleSave() {
    if (!accessToken) return;

    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/organization/enterprise-idp", {
        method: idp ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json() as { idp?: IdpDetail; error?: string };

      if (!res.ok || data.error) {
        setError(data.error ?? "Failed to save identity provider.");
        return;
      }

      setIdp(data.idp ?? null);
      setIsEditing(false);
    } catch {
      setError("Failed to save identity provider.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!accessToken || !idp) return;

    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch("/api/organization/enterprise-idp", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string };
        setError(data.error ?? "Failed to delete identity provider.");
        return;
      }

      setIdp(null);
      setForm(EMPTY_FORM);
    } catch {
      setError("Failed to delete identity provider.");
    } finally {
      setIsDeleting(false);
    }
  }

  const field = (key: keyof IdpConfig) =>
    isEditing ? form[key] : (idp?.[key as keyof IdpDetail] as string | undefined) ?? "";
  const setField = (key: keyof IdpConfig) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <WorkspaceShell
      activeHref="/enterprise-idp"
      eyebrow="Admin workspace"
      roles={roles}
      title="Enterprise identity provider"
    >
      <section className="command-panel">
        <div>
          <p className="eyebrow">Single Sign-On</p>
          <h2>Connect your enterprise identity provider.</h2>
          <p>
            Configure an OIDC provider to enable enterprise SSO so employees sign in through your
            existing identity provider.
          </p>
        </div>
      </section>

      <div className="tab-content">
        {isTierLoading ? (
          <section className="workspace-panel" aria-busy="true">
            <div className="section-heading">
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div className="skeleton-block" style={{ height: "12px", width: "160px" }} />
                <div className="skeleton-block" style={{ height: "22px", width: "260px" }} />
              </div>
              <div className="skeleton-block" style={{ height: "28px", width: "140px", borderRadius: "99px" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "24px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px",
                  padding: "16px 20px",
                  border: "1px solid var(--color-border, #e5e7eb)",
                  borderRadius: "10px",
                }}
              >
                <div className="skeleton-block" style={{ height: "28px", width: "28px", borderRadius: "50%", flexShrink: 0 }} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div className="skeleton-block" style={{ height: "15px", width: "55%" }} />
                  <div className="skeleton-block" style={{ height: "13px", width: "85%" }} />
                  <div className="skeleton-block" style={{ height: "13px", width: "70%" }} />
                </div>
              </div>
              <div
                style={{
                  border: "1px solid var(--color-border, #e5e7eb)",
                  borderRadius: "12px",
                  padding: "28px 28px 24px",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div className="skeleton-block" style={{ height: "12px", width: "100px" }} />
                  <div className="skeleton-block" style={{ height: "28px", width: "140px" }} />
                  {[85, 72, 60, 68, 55].map((w, i) => (
                    <div className="skeleton-block" key={i} style={{ height: "13px", width: `${w}%` }} />
                  ))}
                </div>
                <div className="skeleton-block" style={{ height: "38px", width: "180px", borderRadius: "8px", marginTop: "20px" }} />
              </div>
            </div>
          </section>
        ) : tierError ? (
          <section className="workspace-panel">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
                padding: "48px 24px",
                textAlign: "center",
              }}
            >
              <svg fill="none" height="36" viewBox="0 0 24 24" width="36" style={{ color: "var(--color-text-subtle, #9ca3af)" }}>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.7" />
                <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
              </svg>
              <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 600 }}>Failed to load subscription info</h3>
              <p style={{ margin: 0, color: "var(--color-text-subtle, #6b7280)", maxWidth: "360px", lineHeight: 1.6 }}>
                Unable to retrieve your plan details. Check your connection and try again.
              </p>
              <button
                className="button button-secondary"
                onClick={() => setTierRetryKey((k) => k + 1)}
                style={{ marginTop: "4px" }}
                type="button"
              >
                Retry
              </button>
            </div>
          </section>
        ) : !hasIdpAccess ? (
          <section className="workspace-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Single Sign-On · OIDC</p>
                <h2>Enterprise identity provider</h2>
              </div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 10px",
                  background: "var(--color-surface-subtle, #f3f4f6)",
                  border: "1px solid var(--color-border, #e5e7eb)",
                  borderRadius: "99px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--color-text-subtle, #6b7280)",
                }}
              >
                <LockIcon />
                Enterprise plan required
              </span>
            </div>

            {isAdmin ? (
              <UpgradeWall
                isUpgrading={isUpgrading}
                upgradeError={upgradeError}
                upgradeWaiting={upgradeWaiting}
                showReloginPrompt={showReloginPrompt}
                onUpgrade={handleUpgrade}
                onSignOut={signOut}
              />
            ) : (
              <div className="idp-empty-state" style={{ marginTop: "24px" }}>
                <div className="idp-empty-icon" style={{ color: "var(--color-text-subtle, #6b7280)" }}>
                  <LockIcon />
                </div>
                <h3>Enterprise SSO not available on your current plan</h3>
                <p>Ask your organization admin to upgrade to the Enterprise plan to enable this feature.</p>
              </div>
            )}
          </section>
        ) : (
          <section className="workspace-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Single Sign-On · OIDC</p>
                <h2>Enterprise identity provider</h2>
              </div>
              {canManage && (
                <div className="action-cluster">
                  {idp && !isEditing && (
                    <>
                      <button className="button button-secondary" type="button" onClick={handleEdit}>
                        Edit
                      </button>
                      <button
                        className="button"
                        disabled={isDeleting}
                        style={{ background: "#fff5f5", border: "1px solid #fecaca", color: "#b91c1c" }}
                        type="button"
                        onClick={handleDelete}
                      >
                        {isDeleting ? "Deleting…" : "Delete"}
                      </button>
                    </>
                  )}
                  {!idp && !isEditing && !isLoading && !idpLoadError && (
                    <button className="button button-primary" type="button" onClick={handleEdit}>
                      Configure IdP
                    </button>
                  )}
                </div>
              )}
            </div>

            {error && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "10px 14px",
                  background: "#fff5f5",
                  border: "1px solid #fecaca",
                  borderRadius: "6px",
                  color: "#b91c1c",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            )}

            {!isLoading && idpLoadError && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                  padding: "48px 24px",
                  textAlign: "center",
                }}
              >
                <svg fill="none" height="36" viewBox="0 0 24 24" width="36" style={{ color: "var(--color-text-subtle, #9ca3af)" }}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.7" />
                  <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                </svg>
                <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 600 }}>Failed to load identity provider</h3>
                <p style={{ margin: 0, color: "var(--color-text-subtle, #6b7280)", maxWidth: "360px", lineHeight: 1.6 }}>
                  {idpLoadError}
                </p>
                <button
                  className="button button-secondary"
                  onClick={() => setIdpRetryKey((k) => k + 1)}
                  style={{ marginTop: "4px" }}
                  type="button"
                >
                  Retry
                </button>
              </div>
            )}

            {isLoading && (
              <div style={{ marginTop: "18px", display: "grid", gap: "20px" }} aria-busy="true">
                <div className="idp-form-grid">
                  <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div className="skeleton-block" style={{ height: "13px", width: "60px" }} />
                    <div className="skeleton-block" style={{ height: "38px", width: "100%", borderRadius: "6px" }} />
                  </div>
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div className="skeleton-block" style={{ height: "13px", width: `${50 + (i % 3) * 15}%` }} />
                      <div className="skeleton-block" style={{ height: "38px", width: "100%", borderRadius: "6px" }} />
                    </div>
                  ))}
                  <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div className="skeleton-block" style={{ height: "13px", width: "120px" }} />
                    <div className="skeleton-block" style={{ height: "38px", width: "100%", borderRadius: "6px" }} />
                  </div>
                </div>
              </div>
            )}

            {!isLoading && !idpLoadError && !idp && !isEditing && (
              <div className="idp-empty-state">
                <div className="idp-empty-icon">
                  <svg fill="none" height="32" viewBox="0 0 32 32" width="32">
                    <rect height="16" rx="3" stroke="currentColor" strokeWidth="1.8" width="24" x="4" y="8" />
                    <circle cx="16" cy="16" r="4" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M10 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </div>
                <h3>No identity provider configured</h3>
                <p>Connect an OIDC provider to enable enterprise SSO for your organization.</p>
                {canManage && (
                  <button className="button button-primary" type="button" onClick={handleEdit}>
                    Configure OIDC provider
                  </button>
                )}
              </div>
            )}

            {!isLoading && (isEditing || idp) && (
              <div style={{ marginTop: "18px", display: "grid", gap: "20px" }}>
                <div className="idp-form-grid">
                  <label className="form-field-label" style={{ gridColumn: "1 / -1" }}>
                    <span>Name <span style={{ color: "#b91c1c" }}>*</span></span>
                    <input
                      className="form-field-input"
                      placeholder="My Enterprise IdP"
                      readOnly={!isEditing || !canManage}
                      type="text"
                      value={field("name")}
                      onChange={setField("name")}
                    />
                  </label>
                  <label className="form-field-label">
                    <span>Client ID <span style={{ color: "#b91c1c" }}>*</span></span>
                    <input
                      className="form-field-input"
                      placeholder="your-client-id"
                      readOnly={!isEditing || !canManage}
                      type="text"
                      value={field("clientId")}
                      onChange={setField("clientId")}
                    />
                  </label>
                  <label className="form-field-label">
                    <span>Client Secret <span style={{ color: "#b91c1c" }}>*</span></span>
                    <input
                      className="form-field-input"
                      placeholder="••••••••••••••••"
                      readOnly={!isEditing || !canManage}
                      type={isEditing && canManage ? "text" : "password"}
                      value={field("clientSecret")}
                      onChange={setField("clientSecret")}
                    />
                  </label>
                  <label className="form-field-label">
                    <span>Authorization Endpoint URL <span style={{ color: "#b91c1c" }}>*</span></span>
                    <input
                      className="form-field-input"
                      placeholder="https://idp.example.com/oauth2/authorize"
                      readOnly={!isEditing || !canManage}
                      type="url"
                      value={field("authorizationEndpoint")}
                      onChange={setField("authorizationEndpoint")}
                    />
                  </label>
                  <label className="form-field-label">
                    <span>Token Endpoint URL <span style={{ color: "#b91c1c" }}>*</span></span>
                    <input
                      className="form-field-input"
                      placeholder="https://idp.example.com/oauth2/token"
                      readOnly={!isEditing || !canManage}
                      type="url"
                      value={field("tokenEndpoint")}
                      onChange={setField("tokenEndpoint")}
                    />
                  </label>
                  <label className="form-field-label">
                    Logout Endpoint URL
                    <input
                      className="form-field-input"
                      placeholder="https://idp.example.com/oidc/logout"
                      readOnly={!isEditing || !canManage}
                      type="url"
                      value={field("logoutEndpoint")}
                      onChange={setField("logoutEndpoint")}
                    />
                  </label>
                  <label className="form-field-label" style={{ gridColumn: "1 / -1" }}>
                    JWKS Endpoint
                    <input
                      className="form-field-input"
                      placeholder="https://idp.example.com/oauth2/jwks"
                      readOnly={!isEditing || !canManage}
                      type="url"
                      value={field("jwksUri")}
                      onChange={setField("jwksUri")}
                    />
                  </label>
                </div>

                {isEditing && canManage && (
                  <div className="action-cluster">
                    <button
                      className="button button-primary"
                      disabled={isSaving}
                      type="button"
                      onClick={handleSave}
                    >
                      {isSaving ? "Saving…" : "Save configuration"}
                    </button>
                    <button className="button button-secondary" type="button" onClick={handleCancel}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </div>
    </WorkspaceShell>
  );
}
