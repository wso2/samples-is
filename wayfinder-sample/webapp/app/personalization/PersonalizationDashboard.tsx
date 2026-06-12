"use client";

import { useEffect, useRef, useState } from "react";
import WorkspaceShell from "../WorkspaceShell";
import { useAuth } from "../lib/auth/client";
import { Tier, UserRole } from "../lib/auth/utils";

interface BrandingConfig {
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

const DEFAULTS: BrandingConfig = {
  primaryColor: "#2563EB",
  secondaryColor: "#FBBF24",
  logoUrl: "",
  faviconUrl: "",
  fontFamily: "Inter",
  fontImportUrl: "https://fonts.googleapis.com/css?family=Inter",
  textPrimaryColor: "#111827",
  displayName: "",
  supportEmail: "",
};

const FONT_OPTIONS = [
  { family: "Inter", importUrl: "https://fonts.googleapis.com/css?family=Inter" },
  { family: "Roboto", importUrl: "https://fonts.googleapis.com/css?family=Roboto" },
  { family: "Open Sans", importUrl: "https://fonts.googleapis.com/css?family=Open+Sans" },
  { family: "Lato", importUrl: "https://fonts.googleapis.com/css?family=Lato" },
  { family: "Poppins", importUrl: "https://fonts.googleapis.com/css?family=Poppins" },
  { family: "Montserrat", importUrl: "https://fonts.googleapis.com/css?family=Montserrat" },
  { family: "Source Sans Pro", importUrl: "https://fonts.googleapis.com/css?family=Source+Sans+Pro" },
];

const UPGRADE_WAIT_MS = Number(process.env.NEXT_PUBLIC_UPGRADE_WAIT_MS ?? 5000);

function SpinnerIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      fill="none"
      height={size}
      stroke="currentColor"
      strokeWidth="2.2"
      viewBox="0 0 24 24"
      width={size}
      style={{ animation: "spin 0.9s linear infinite" }}
    >
      <circle cx="12" cy="12" opacity="0.25" r="10" />
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}

function LockIcon() {
  return (
    <svg fill="none" height="28" viewBox="0 0 24 24" width="28">
      <rect height="11" rx="2" stroke="currentColor" strokeWidth="1.7" width="14" x="5" y="11" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
      <circle cx="12" cy="16.5" fill="currentColor" r="1.5" />
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

function ColorField({
  label,
  hint,
  value,
  onChange,
  readOnly,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="branding-field">
      <span className="form-field-label">{label}</span>
      <div className="color-picker-wrapper">
        <input
          className="color-input"
          disabled={readOnly}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <span className="color-preview" style={{ background: value }} />
        <span className="color-hex">{value.toUpperCase()}</span>
      </div>
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}


interface UpgradeWallProps {
  requiredTier: Tier.BASIC | Tier.ADVANCED;
  isUpgrading: boolean;
  upgradeWaiting: boolean;
  showReloginPrompt: boolean;
  upgradeError: string | null;
  isAdmin: boolean;
  onUpgrade: (tier: Tier) => void;
  onSignOut: () => void;
}

function UpgradeWall({
  requiredTier,
  isUpgrading,
  upgradeWaiting,
  showReloginPrompt,
  upgradeError,
  isAdmin,
  onUpgrade,
  onSignOut,
}: UpgradeWallProps) {
  const busy = isUpgrading || upgradeWaiting;
  const isBasic = requiredTier === Tier.BASIC;

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
        <div style={{ color: "var(--app-success, #047857)" }}>
          <CheckCircleIcon />
        </div>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
          {isBasic ? "Basic branding" : "Advanced branding"} is ready
        </h3>
        <p style={{ margin: 0, maxWidth: "400px", color: "var(--app-muted, #64748b)", lineHeight: 1.6 }}>
          Your plan has been upgraded. Sign out and sign back in to activate branding features.
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
          {isUpgrading ? "Upgrading your plan…" : "Activating branding…"}
        </h3>
        <p style={{ margin: 0, color: "var(--app-muted, #64748b)" }}>
          {isUpgrading ? "Updating your subscription." : "Setting up branding features. This takes a few seconds."}
        </p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "14px",
          padding: "28px 20px",
          background: "var(--app-primary-soft, #e8efff)",
          border: "1px solid var(--app-border, #dbe3ee)",
          borderRadius: "10px",
          marginTop: "20px",
        }}
      >
        <div style={{ color: "var(--app-muted, #64748b)", flexShrink: 0, paddingTop: "2px" }}>
          <LockIcon />
        </div>
        <div>
          <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: "15px" }}>
            {isBasic ? "Basic" : "Advanced"} branding requires the {isBasic ? "Basic" : "Enterprise"} plan
          </p>
          <p style={{ margin: 0, fontSize: "14px", color: "var(--app-muted, #64748b)", lineHeight: 1.55 }}>
            Ask your organization admin to upgrade to unlock this feature.
          </p>
        </div>
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
          background: "var(--app-card, #ffffff)",
          border: "1px solid var(--app-border, #dbe3ee)",
          borderRadius: "10px",
        }}
      >
        <div style={{ color: "var(--app-muted, #64748b)", flexShrink: 0, paddingTop: "2px" }}>
          <LockIcon />
        </div>
        <div>
          <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: "15px" }}>
            {isBasic ? "Basic" : "Advanced"} branding requires the {isBasic ? "Basic" : "Enterprise"} plan
          </p>
          <p style={{ margin: 0, fontSize: "14px", color: "var(--app-muted, #64748b)", lineHeight: 1.55 }}>
            {isBasic
              ? "Customize your primary and secondary brand colors across the app."
              : "Upload your logo, choose fonts, and apply your full visual identity across the app."}
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
          border: "2px solid var(--app-primary, #1d4ed8)",
          borderRadius: "12px",
          padding: "28px 28px 24px",
          display: "flex",
          gap: "24px",
          alignItems: "flex-start",
          background: "var(--app-primary-soft, #e8efff)",
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
              color: "var(--app-primary, #1d4ed8)",
            }}
          >
            {isBasic ? "BASIC" : "ADVANCED · Enterprise"}
          </p>
          <p style={{ margin: "0 0 6px", fontSize: "22px", fontWeight: 700 }}>
            {isBasic ? "$29" : "$99"}{" "}
            <span style={{ fontSize: "14px", fontWeight: 400, color: "var(--app-muted, #64748b)" }}>
              per seat / month
            </span>
          </p>
          <ul
            style={{
              margin: "10px 0 0",
              padding: "0 0 0 16px",
              fontSize: "13px",
              color: "var(--app-muted, #64748b)",
              lineHeight: 1.8,
            }}
          >
            {isBasic ? (
              <>
                <li>Custom primary &amp; secondary brand colors</li>
                <li>Color changes reflected across the app</li>
                <li>Up to 50 travelers</li>
                <li>Email support</li>
              </>
            ) : (
              <>
                <li>Everything in Basic</li>
                <li>Custom logo, favicon &amp; fonts</li>
                <li>Full visual identity control</li>
                <li>Enterprise SSO (OIDC)</li>
                <li>Dedicated account manager</li>
              </>
            )}
          </ul>
        </div>
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
          <button
            className="button button-primary"
            disabled={busy}
            onClick={() => onUpgrade(requiredTier)}
            type="button"
          >
            Upgrade to {isBasic ? "Basic" : "Enterprise"}
          </button>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--app-muted, #64748b)" }}>
            Manage your plan in Billing
          </p>
        </div>
      </div>
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div aria-busy="true" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {[1, 2].map((i) => (
        <section className="workspace-panel" key={i}>
          <div className="section-heading">
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div className="skeleton-block" style={{ height: "12px", width: "120px" }} />
              <div className="skeleton-block" style={{ height: "22px", width: "200px" }} />
            </div>
          </div>
          <div className="branding-grid" style={{ marginTop: "18px" }}>
            {[1, 2].map((j) => (
              <div key={j} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div className="skeleton-block" style={{ height: "13px", width: "100px" }} />
                <div className="skeleton-block" style={{ height: "52px", borderRadius: "8px" }} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default function PersonalizationDashboard({ roles }: { roles: UserRole[] }) {
  const { accessToken, signOut } = useAuth();

  const [tier, setTier] = useState<Tier | null>(null);
  const [isTierLoading, setIsTierLoading] = useState(true);
  const [tierError, setTierError] = useState(false);
  const [tierRetryKey, setTierRetryKey] = useState(0);

  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeWaiting, setUpgradeWaiting] = useState(false);
  const [showReloginPrompt, setShowReloginPrompt] = useState(false);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);

  const [savedConfig, setSavedConfig] = useState<BrandingConfig | null>(null);
  const [form, setForm] = useState<BrandingConfig>(DEFAULTS);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [brandingRetryKey, setBrandingRetryKey] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [activeTab, setActiveTab] = useState<"basic" | "advanced">("basic");

  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isAdmin = roles.includes(UserRole.ADMIN);
  const canEditBasic =
    roles.includes(UserRole.ADMIN) ||
    roles.includes(UserRole.BASIC_BRANDING_EDITOR) ||
    roles.includes(UserRole.ADVANCED_BRANDING_EDITOR);
  const canEditAdvanced =
    roles.includes(UserRole.ADMIN) || roles.includes(UserRole.ADVANCED_BRANDING_EDITOR);

  const hasBasicAccess = tier === Tier.BASIC || tier === Tier.ADVANCED;
  const hasAdvancedAccess = tier === Tier.ADVANCED;

  useEffect(() => {
    if (!accessToken) return;
    setIsTierLoading(true);
    setTierError(false);
    fetch("/api/organization/upgrade", { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((res) => res.json())
      .then((data: { tier?: string }) => setTier((data.tier ?? Tier.FREE) as Tier))
      .catch(() => setTierError(true))
      .finally(() => setIsTierLoading(false));
  }, [accessToken, tierRetryKey]);

  useEffect(() => {
    if (!accessToken) return;
    const controller = new AbortController();
    setIsLoading(true);
    setLoadError(null);
    fetch("/api/organization/branding", {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data: { branding?: BrandingConfig | null; error?: string }) => {
        if (data.error) {
          setLoadError(data.error);
        } else if (data.branding) {
          setSavedConfig(data.branding);
          setForm(data.branding);
        }
      })
      .catch((err) => {
        if (err instanceof Error && err.name !== "AbortError") {
          setLoadError("Failed to load branding configuration.");
        }
      })
      .finally(() => setIsLoading(false));
    return () => controller.abort();
  }, [accessToken, brandingRetryKey]);

  async function handleUpgrade(requiredTier: Tier) {
    if (!accessToken) return;
    setIsUpgrading(true);
    setUpgradeError(null);
    try {
      const res = await fetch("/api/organization/upgrade", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ tier: requiredTier }),
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

  async function handleSave() {
    if (!accessToken) return;
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    if (successTimerRef.current) clearTimeout(successTimerRef.current);

    try {
      const method = savedConfig ? "PUT" : "POST";
      const res = await fetch("/api/organization/branding", {
        method,
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json() as { branding?: BrandingConfig; error?: string };
      if (!res.ok || data.error) {
        setSaveError(data.error ?? "Failed to save branding.");
        return;
      }
      if (data.branding) {
        setSavedConfig(data.branding);
        setForm(data.branding);
      }
      setSaveSuccess(true);
      successTimerRef.current = setTimeout(() => window.location.reload(), 1500);
    } catch {
      setSaveError("Failed to save branding.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleReset() {
    if (!accessToken || !savedConfig) return;
    setIsDeleting(true);
    setSaveError(null);
    try {
      const res = await fetch("/api/organization/branding", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string };
        setSaveError(data.error ?? "Failed to reset branding.");
        return;
      }
      setSavedConfig(null);
      setForm(DEFAULTS);
      successTimerRef.current = setTimeout(() => window.location.reload(), 1500);
    } catch {
      setSaveError("Failed to reset branding.");
    } finally {
      setIsDeleting(false);
    }
  }

  function setField<K extends keyof BrandingConfig>(key: K) {
    return (value: BrandingConfig[K]) => setForm((f) => ({ ...f, [key]: value }));
  }

  function handleFontChange(family: string) {
    const opt = FONT_OPTIONS.find((f) => f.family === family);
    setForm((f) => ({
      ...f,
      fontFamily: family,
      fontImportUrl: opt?.importUrl ?? f.fontImportUrl,
    }));
  }

  const upgradeWallProps = {
    isUpgrading,
    upgradeWaiting,
    showReloginPrompt,
    upgradeError,
    isAdmin,
    onUpgrade: handleUpgrade,
    onSignOut: signOut,
  };

  return (
    <WorkspaceShell
      activeHref="/personalization"
      eyebrow="Admin workspace"
      roles={roles}
      title="Personalization"
    >
      <section className="command-panel">
        <div>
          <p className="eyebrow">Brand identity</p>
          <h2>Customize your organization&apos;s brand.</h2>
          <p>
            Apply your company colors, logo, and typography across the entire app so everything
            reflects your organization&apos;s visual identity.
          </p>
        </div>
      </section>

      {isTierLoading ? (
        <SkeletonLoader />
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
            <svg fill="none" height="36" viewBox="0 0 24 24" width="36" style={{ color: "#9ca3af" }}>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.7" />
              <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
            </svg>
            <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 600 }}>
              Failed to load subscription info
            </h3>
            <p style={{ margin: 0, color: "var(--app-muted)", maxWidth: "360px", lineHeight: 1.6 }}>
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
      ) : (
        <div className="tab-content">
          <div className="tab-nav">
            <button
              className={activeTab === "basic" ? "active" : undefined}
              onClick={() => setActiveTab("basic")}
              type="button"
            >
              Basic branding
              {!hasBasicAccess && (
                <em className="tab-paid-badge">Basic plan</em>
              )}
            </button>
            <button
              className={activeTab === "advanced" ? "active" : undefined}
              onClick={() => setActiveTab("advanced")}
              type="button"
            >
              Advanced branding
              {!hasAdvancedAccess && (
                <em className="tab-paid-badge">Enterprise plan</em>
              )}
            </button>
          </div>

          {activeTab === "basic" && (
            <section className="workspace-panel">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Colors</p>
                  <h2>Basic branding</h2>
                </div>
                {hasBasicAccess && canEditBasic && savedConfig && (
                  <div className="action-cluster">
                    <button
                      className="button"
                      disabled={isDeleting}
                      onClick={handleReset}
                      style={{ background: "#fff5f5", border: "1px solid #fecaca", color: "#b91c1c" }}
                      type="button"
                    >
                      {isDeleting ? "Resetting…" : "Reset to defaults"}
                    </button>
                  </div>
                )}
              </div>

              {!hasBasicAccess ? (
                <UpgradeWall requiredTier={Tier.BASIC} {...upgradeWallProps} />
              ) : isLoading ? (
                <div className="branding-grid">
                  {[1, 2].map((i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <div className="skeleton-block" style={{ height: "13px", width: "120px" }} />
                      <div className="skeleton-block" style={{ height: "52px", borderRadius: "8px" }} />
                    </div>
                  ))}
                </div>
              ) : loadError ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "12px",
                    padding: "32px 24px",
                    textAlign: "center",
                  }}
                >
                  <p style={{ margin: 0, color: "var(--app-muted)" }}>{loadError}</p>
                  <button
                    className="button button-secondary"
                    onClick={() => setBrandingRetryKey((k) => k + 1)}
                    type="button"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  <div className="branding-grid">
                    <ColorField
                      label="Primary brand color"
                      hint="Used for buttons, links, and key interactive elements throughout the app."
                      value={form.primaryColor}
                      onChange={setField("primaryColor")}
                      readOnly={!canEditBasic}
                    />
                    <ColorField
                      label="Secondary brand color"
                      hint="Used for accents, highlights, and supporting interactive elements."
                      value={form.secondaryColor}
                      onChange={setField("secondaryColor")}
                      readOnly={!canEditBasic}
                    />
                  </div>

                  {canEditBasic && (
                    <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                      {saveError && (
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
                          {saveError}
                        </div>
                      )}
                      {saveSuccess && (
                        <div
                          style={{
                            padding: "10px 14px",
                            background: "#ecfdf5",
                            border: "1px solid #a7f3d0",
                            borderRadius: "6px",
                            color: "#047857",
                            fontSize: "14px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <CheckCircleIcon />
                          Branding saved successfully.
                        </div>
                      )}
                      <div className="action-cluster">
                        <button
                          className="button button-primary"
                          disabled={isSaving || isDeleting}
                          onClick={handleSave}
                          type="button"
                        >
                          {isSaving ? (
                            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <SpinnerIcon size={16} /> Saving…
                            </span>
                          ) : (
                            "Save branding"
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </section>
          )}

          {activeTab === "advanced" && (
            <section className="workspace-panel">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Visual identity</p>
                  <h2>Advanced branding</h2>
                </div>
                {hasAdvancedAccess && canEditAdvanced && savedConfig && (
                  <div className="action-cluster">
                    <button
                      className="button"
                      disabled={isDeleting}
                      onClick={handleReset}
                      style={{ background: "#fff5f5", border: "1px solid #fecaca", color: "#b91c1c" }}
                      type="button"
                    >
                      {isDeleting ? "Resetting…" : "Reset to defaults"}
                    </button>
                  </div>
                )}
              </div>

              {!hasAdvancedAccess ? (
                <UpgradeWall requiredTier={Tier.ADVANCED} {...upgradeWallProps} />
              ) : isLoading ? (
                <div className="branding-grid">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <div className="skeleton-block" style={{ height: "13px", width: "120px" }} />
                      <div className="skeleton-block" style={{ height: "42px", borderRadius: "8px" }} />
                    </div>
                  ))}
                </div>
              ) : loadError ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "12px",
                    padding: "32px 24px",
                    textAlign: "center",
                  }}
                >
                  <p style={{ margin: 0, color: "var(--app-muted)" }}>{loadError}</p>
                  <button
                    className="button button-secondary"
                    onClick={() => setBrandingRetryKey((k) => k + 1)}
                    type="button"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ marginTop: "18px", display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div>
                      <p
                        style={{
                          margin: "0 0 12px",
                          fontSize: "0.78rem",
                          fontWeight: 750,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          color: "var(--app-muted)",
                        }}
                      >
                        Logo &amp; favicon
                      </p>
                      <div className="branding-grid">
                        <div className="branding-field">
                          <span className="form-field-label">Logo image URL</span>
                          {form.logoUrl && (
                            <div className="logo-upload-area" style={{ marginBottom: "8px" }}>
                              <img
                                alt="Logo preview"
                                src={form.logoUrl}
                                style={{ height: "40px", maxWidth: "120px", objectFit: "contain" }}
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).style.display = "none";
                                }}
                              />
                              <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--app-muted)" }}>
                                Logo preview
                              </p>
                            </div>
                          )}
                          <input
                            className="form-field-input"
                            disabled={!canEditAdvanced}
                            placeholder="https://yourcompany.com/logo.png"
                            type="url"
                            value={form.logoUrl}
                            onChange={(e) => setField("logoUrl")(e.target.value)}
                          />
                          <p className="field-hint">Your organization&apos;s logo. PNG or SVG recommended.</p>
                        </div>

                        <div className="branding-field">
                          <span className="form-field-label">Favicon URL</span>
                          <input
                            className="form-field-input"
                            disabled={!canEditAdvanced}
                            placeholder="https://yourcompany.com/favicon.ico"
                            type="url"
                            value={form.faviconUrl}
                            onChange={(e) => setField("faviconUrl")(e.target.value)}
                          />
                          <p className="field-hint">
                            Browser tab icon. ICO, PNG, or SVG.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p
                        style={{
                          margin: "0 0 12px",
                          fontSize: "0.78rem",
                          fontWeight: 750,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          color: "var(--app-muted)",
                        }}
                      >
                        Typography
                      </p>
                      <div className="branding-grid">
                        <div className="branding-field">
                          <span className="form-field-label">Font family</span>
                          <select
                            className="form-field-input"
                            disabled={!canEditAdvanced}
                            value={form.fontFamily}
                            onChange={(e) => handleFontChange(e.target.value)}
                          >
                            {FONT_OPTIONS.map((f) => (
                              <option key={f.family} value={f.family}>
                                {f.family}
                              </option>
                            ))}
                            {!FONT_OPTIONS.some((f) => f.family === form.fontFamily) && (
                              <option value={form.fontFamily}>{form.fontFamily}</option>
                            )}
                          </select>
                          <p className="field-hint">Applied to primary text throughout the app.</p>
                        </div>

                        <div className="branding-field">
                          <span className="form-field-label">Font import URL</span>
                          <input
                            className="form-field-input"
                            disabled={!canEditAdvanced}
                            placeholder="https://fonts.googleapis.com/css?family=Inter"
                            type="url"
                            value={form.fontImportUrl}
                            onChange={(e) => setField("fontImportUrl")(e.target.value)}
                          />
                          <p className="field-hint">
                            Google Fonts URL or self-hosted stylesheet. Auto-filled when selecting a
                            font above.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p
                        style={{
                          margin: "0 0 12px",
                          fontSize: "0.78rem",
                          fontWeight: 750,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          color: "var(--app-muted)",
                        }}
                      >
                        Colors
                      </p>
                      <div className="branding-grid">
                        <ColorField
                          label="Text primary color"
                          hint="Main text color shown throughout the app."
                          value={form.textPrimaryColor}
                          onChange={setField("textPrimaryColor")}
                          readOnly={!canEditAdvanced}
                        />
                      </div>
                    </div>

                    <div>
                      <p
                        style={{
                          margin: "0 0 12px",
                          fontSize: "0.78rem",
                          fontWeight: 750,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          color: "var(--app-muted)",
                        }}
                      >
                        Organization details
                      </p>
                      <div className="branding-grid">
                        <div className="branding-field">
                          <label className="form-field-label">
                            Display name
                            <input
                              className="form-field-input"
                              disabled={!canEditAdvanced}
                              placeholder="Acme Corp"
                              type="text"
                              value={form.displayName}
                              onChange={(e) => setField("displayName")(e.target.value)}
                            />
                          </label>
                          <p className="field-hint">
                            Your organization&apos;s display name shown across the app.
                          </p>
                        </div>

                        <div className="branding-field">
                          <label className="form-field-label">
                            Support email
                            <input
                              className="form-field-input"
                              disabled={!canEditAdvanced}
                              placeholder="it-support@yourcompany.com"
                              type="email"
                              value={form.supportEmail}
                              onChange={(e) => setField("supportEmail")(e.target.value)}
                            />
                          </label>
                          <p className="field-hint">
                            Displayed to users who need help signing in.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {canEditAdvanced && (
                    <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                      {saveError && (
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
                          {saveError}
                        </div>
                      )}
                      {saveSuccess && (
                        <div
                          style={{
                            padding: "10px 14px",
                            background: "#ecfdf5",
                            border: "1px solid #a7f3d0",
                            borderRadius: "6px",
                            color: "#047857",
                            fontSize: "14px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <CheckCircleIcon />
                          Branding saved successfully.
                        </div>
                      )}
                      <div className="action-cluster">
                        <button
                          className="button button-primary"
                          disabled={isSaving || isDeleting}
                          onClick={handleSave}
                          type="button"
                        >
                          {isSaving ? (
                            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <SpinnerIcon size={16} /> Saving…
                            </span>
                          ) : (
                            "Save branding"
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </section>
          )}
        </div>
      )}
    </WorkspaceShell>
  );
}
