"use client";

import { useEffect, useState } from "react";
import WorkspaceShell from "../WorkspaceShell";
import { useAuth } from "../lib/auth/client";
import { Tier, UserRole } from "../lib/auth/utils";

const UPGRADE_WAIT_MS = Number(process.env.NEXT_PUBLIC_UPGRADE_WAIT_MS ?? 5000);

interface PlanDef {
  tier: Tier;
  name: string;
  price: string;
  priceNote: string;
  description: string;
  features: string[];
}

const PLANS: PlanDef[] = [
  {
    tier: Tier.FREE,
    name: "Starter",
    price: "Free",
    priceNote: "forever",
    description: "For small teams taking their first steps in managed travel.",
    features: [
      "Up to 5 travelers",
      "Basic trip requests",
      "1 travel policy",
      "Standard expense reports",
      "Email support",
    ],
  },
  {
    tier: Tier.BASIC,
    name: "Business",
    price: "$29",
    priceNote: "per seat / month",
    description: "For growing teams that need smart workflows and visibility.",
    features: [
      "Up to 50 travelers",
      "Smart trip recommendations",
      "Unlimited travel policies",
      "Approval workflows",
      "Analytics dashboard",
      "Priority support",
    ],
  },
  {
    tier: Tier.ADVANCED,
    name: "Enterprise",
    price: "$99",
    priceNote: "per seat / month",
    description: "For large organizations with complex travel programs and SSO needs.",
    features: [
      "Unlimited travelers",
      "Enterprise SSO (OIDC)",
      "Advanced branding & custom API",
      "Dedicated account manager",
      "24/7 phone & chat support",
      "Custom reporting & exports",
    ],
  },
];

const TIER_ORDER: Record<Tier, number> = {
  [Tier.FREE]: 0,
  [Tier.BASIC]: 1,
  [Tier.ADVANCED]: 2,
};

type PlanActionState =
  | { type: "idle" }
  | { type: "upgrading"; targetTier: Tier }
  | { type: "waiting"; targetTier: Tier }
  | { type: "relogin"; newTier: Tier }
  | { type: "downgraded"; newTier: Tier };

function SpinnerIcon() {
  return (
    <svg
      fill="none"
      height="16"
      stroke="currentColor"
      strokeWidth="2.2"
      viewBox="0 0 24 24"
      width="16"
      style={{ animation: "spin 0.9s linear infinite", display: "block", flexShrink: 0 }}
    >
      <circle cx="12" cy="12" opacity="0.25" r="10" />
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      fill="none"
      height="14"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
      width="14"
      style={{ flexShrink: 0, marginTop: "1px" }}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CheckCircleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg fill="none" height={size} viewBox="0 0 24 24" width={size}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M7.5 12l3 3 6-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="18">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export default function BillingDashboard({ roles }: { roles: UserRole[] }) {
  const { accessToken, signOut } = useAuth();

  const [currentTier, setCurrentTier] = useState<Tier | null>(null);
  const [isTierLoading, setIsTierLoading] = useState(true);
  const [actionState, setActionState] = useState<PlanActionState>({ type: "idle" });
  const [actionError, setActionError] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    if (!accessToken) return;

    fetch("/api/organization/upgrade", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data: { tier?: string }) => setCurrentTier((data.tier ?? Tier.FREE) as Tier))
      .catch(() => setCurrentTier(Tier.FREE))
      .finally(() => setIsTierLoading(false));
  }, [accessToken]);

  async function handleUpgrade(targetTier: Tier.BASIC | Tier.ADVANCED) {
    if (!accessToken) return;

    const isUpdate = currentTier !== Tier.FREE;
    const method = isUpdate ? "PUT" : "POST";

    setActionError(null);
    setActionState({ type: "upgrading", targetTier });

    try {
      const res = await fetch("/api/organization/upgrade", {
        method,
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ tier: targetTier }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setActionError(data.error ?? "Upgrade failed. Please try again.");
        setActionState({ type: "idle" });
        return;
      }

      setActionState({ type: "waiting", targetTier });
      await new Promise<void>((resolve) => setTimeout(resolve, UPGRADE_WAIT_MS));
      setCurrentTier(targetTier);
      setActionState({ type: "relogin", newTier: targetTier });
    } catch {
      setActionError("Upgrade failed. Please try again.");
      setActionState({ type: "idle" });
    }
  }

  async function handleCancel() {
    if (!accessToken) return;

    setActionError(null);
    setShowCancelConfirm(false);
    setActionState({ type: "upgrading", targetTier: Tier.FREE });

    try {
      const res = await fetch("/api/organization/upgrade", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setActionError(data.error ?? "Cancellation failed. Please try again.");
        setActionState({ type: "idle" });
        return;
      }

      setCurrentTier(Tier.FREE);
      setActionState({ type: "downgraded", newTier: Tier.FREE });
    } catch {
      setActionError("Cancellation failed. Please try again.");
      setActionState({ type: "idle" });
    }
  }

  const busy = actionState.type === "upgrading" || actionState.type === "waiting";
  const isPaid = currentTier !== null && currentTier !== Tier.FREE;

  return (
    <WorkspaceShell activeHref="/billing" eyebrow="Admin workspace" roles={roles} title="Billing">
      {/* ── Page header ── */}
      <section className="command-panel">
        <div>
          <p className="eyebrow">Subscription</p>
          <h2>Manage your plan</h2>
          <p>
            Choose the plan that fits your team. Upgrade anytime to unlock advanced workflows and
            priority support. Downgrade or cancel with no penalties.
          </p>
        </div>
      </section>

      {/* ── Current plan status bar ── */}
      {isTierLoading && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "14px 20px",
            border: "1px solid var(--color-border, #e5e7eb)",
            borderRadius: "10px",
            marginBottom: "4px",
          }}
          aria-busy="true"
        >
          <div className="skeleton-block" style={{ height: "18px", width: "18px", borderRadius: "50%", flexShrink: 0 }} />
          <div className="skeleton-block" style={{ height: "14px", width: "220px" }} />
          <div className="skeleton-block" style={{ height: "14px", width: "100px", marginLeft: "8px" }} />
          <div className="skeleton-block" style={{ height: "34px", width: "140px", borderRadius: "6px", marginLeft: "auto", flexShrink: 0 }} />
        </div>
      )}
      {!isTierLoading && currentTier && actionState.type === "idle" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "14px 20px",
            background: isPaid
              ? "var(--color-primary-surface, #eff6ff)"
              : "var(--color-surface-subtle, #f9fafb)",
            border: `1px solid ${isPaid ? "var(--color-primary, #2563eb)" : "var(--color-border, #e5e7eb)"}`,
            borderRadius: "10px",
            marginBottom: "4px",
          }}
        >
          <div style={{ color: isPaid ? "var(--color-primary, #2563eb)" : "var(--color-text-subtle, #6b7280)" }}>
            {isPaid ? <StarIcon /> : <CheckCircleIcon size={18} />}
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-text, #111)" }}>
              {currentTier === Tier.ADVANCED
                ? `You're on the Enterprise plan`
                : currentTier === Tier.BASIC
                ? `You're on the Business plan`
                : `You're on the Starter plan`}
            </span>
            <span
              style={{
                marginLeft: "10px",
                fontSize: "12px",
                color: "var(--color-text-subtle, #6b7280)",
              }}
            >
              {currentTier === Tier.ADVANCED
                ? "$99 per seat / month"
                : currentTier === Tier.BASIC
                ? "$29 per seat / month"
                : "Free forever"}
            </span>
          </div>
          {isPaid && !showCancelConfirm && (
            <button
              className="button button-secondary"
              disabled={busy}
              onClick={() => setShowCancelConfirm(true)}
              style={{ fontSize: "13px" }}
              type="button"
            >
              Cancel subscription
            </button>
          )}
          {isPaid && showCancelConfirm && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "13px", color: "var(--color-text-subtle, #6b7280)" }}>
                Downgrade to Starter?
              </span>
              <button
                className="button"
                disabled={busy}
                onClick={() => void handleCancel()}
                style={{
                  fontSize: "13px",
                  background: "#dc2626",
                  color: "#fff",
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
                type="button"
              >
                Confirm
              </button>
              <button
                className="button button-secondary"
                onClick={() => setShowCancelConfirm(false)}
                style={{ fontSize: "13px" }}
                type="button"
              >
                Keep plan
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Inline status messages ── */}
      {actionError && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 16px",
            background: "#fff5f5",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            color: "#b91c1c",
            fontSize: "14px",
            marginBottom: "16px",
          }}
        >
          <span style={{ flex: 1 }}>{actionError}</span>
          <button
            onClick={() => setActionError(null)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#b91c1c", fontWeight: 700, fontSize: "16px", padding: "0 4px" }}
            type="button"
          >
            ×
          </button>
        </div>
      )}

      {(actionState.type === "upgrading" || actionState.type === "waiting") && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 16px",
            background: "var(--color-primary-surface, #eff6ff)",
            border: "1px solid var(--color-primary, #2563eb)",
            borderRadius: "8px",
            fontSize: "14px",
            color: "var(--color-primary, #2563eb)",
            marginBottom: "16px",
          }}
        >
          <SpinnerIcon />
          {actionState.type === "upgrading"
            ? actionState.targetTier === Tier.FREE
              ? "Cancelling subscription…"
              : `Upgrading to ${PLANS.find((p) => p.tier === actionState.targetTier)?.name ?? actionState.targetTier}…`
            : `Enabling ${PLANS.find((p) => p.tier === (actionState as { targetTier: Tier }).targetTier)?.name ?? ""} features… this takes a few seconds.`}
        </div>
      )}

      {actionState.type === "relogin" && (
        <section
          className="workspace-panel"
          style={{ textAlign: "center", padding: "48px 24px" }}
        >
          <div style={{ color: "var(--color-success, #16a34a)", display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <CheckCircleIcon size={40} />
          </div>
          <h3 style={{ margin: "0 0 10px", fontSize: "20px", fontWeight: 700 }}>
            Welcome to {PLANS.find((p) => p.tier === actionState.newTier)?.name ?? actionState.newTier}!
          </h3>
          <p style={{ margin: "0 auto 24px", color: "var(--color-text-subtle, #6b7280)", maxWidth: "420px", lineHeight: 1.6 }}>
            Your plan has been upgraded. Sign out and sign back in to activate your new permissions
            and unlock all Business features.
          </p>
          <button className="button button-primary" onClick={signOut} type="button">
            Sign out &amp; sign back in
          </button>
        </section>
      )}

      {actionState.type === "downgraded" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "14px 18px",
            background: "var(--color-surface-subtle, #f9fafb)",
            border: "1px solid var(--color-border, #e5e7eb)",
            borderRadius: "8px",
            fontSize: "14px",
            marginBottom: "16px",
          }}
        >
          <div style={{ color: "var(--color-success, #16a34a)", flexShrink: 0 }}>
            <CheckCircleIcon />
          </div>
          <span style={{ flex: 1 }}>
            <strong>Subscription cancelled.</strong> You&apos;re back on the Starter plan. Business
            features will be locked on your next visit.
          </span>
          <button
            className="button button-secondary"
            onClick={() => setActionState({ type: "idle" })}
            style={{ flexShrink: 0, fontSize: "13px" }}
            type="button"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── Plan cards ── */}
      {actionState.type !== "relogin" && (
        <section className="workspace-panel" style={{ marginBottom: 0 }}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Plans</p>
              <h2>Choose your plan</h2>
            </div>
          </div>

          {isTierLoading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px",
                marginTop: "24px",
              }}
              aria-busy="true"
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    border: "1px solid var(--color-border, #e5e7eb)",
                    borderRadius: "14px",
                    padding: "28px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div className="skeleton-block" style={{ height: "22px", width: "40%" }} />
                  <div className="skeleton-block" style={{ height: "14px", width: "80%" }} />
                  <div className="skeleton-block" style={{ height: "34px", width: "30%" }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <div className="skeleton-block" key={j} style={{ height: "13px", width: `${70 + (j % 3) * 8}%` }} />
                    ))}
                  </div>
                  <div className="skeleton-block" style={{ height: "40px", width: "100%", borderRadius: "8px", marginTop: "8px" }} />
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px",
                marginTop: "24px",
              }}
            >
              {PLANS.map((plan) => {
                const isCurrent = currentTier === plan.tier;
                const isUpgrade =
                  currentTier !== null && TIER_ORDER[plan.tier] > TIER_ORDER[currentTier];

                return (
                  <div
                    key={plan.tier}
                    style={{
                      border: isCurrent
                        ? "2px solid var(--color-primary, #2563eb)"
                        : "1px solid var(--color-border, #e5e7eb)",
                      borderRadius: "14px",
                      padding: "28px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0",
                      background: isCurrent
                        ? "var(--color-primary-surface, #eff6ff)"
                        : "var(--color-surface, #fff)",
                      position: "relative",
                    }}
                  >
                    {isCurrent && (
                      <span
                        style={{
                          position: "absolute",
                          top: "-12px",
                          left: "20px",
                          background: "var(--color-primary, #2563eb)",
                          color: "#fff",
                          fontSize: "10px",
                          fontWeight: 700,
                          letterSpacing: "0.07em",
                          textTransform: "uppercase",
                          padding: "3px 12px",
                          borderRadius: "99px",
                        }}
                      >
                        Current plan
                      </span>
                    )}

                    {/* Plan name & price */}
                    <div style={{ marginBottom: "20px" }}>
                      <p
                        style={{
                          margin: "0 0 4px",
                          fontSize: "20px",
                          fontWeight: 700,
                          color: "var(--color-text, #111)",
                        }}
                      >
                        {plan.name}
                      </p>
                      <p
                        style={{
                          margin: "0 0 8px",
                          fontSize: "13px",
                          color: "var(--color-text-subtle, #6b7280)",
                          lineHeight: 1.5,
                        }}
                      >
                        {plan.description}
                      </p>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                        <span style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--color-text, #111)" }}>
                          {plan.price}
                        </span>
                        {plan.price !== "Free" && (
                          <span style={{ fontSize: "13px", color: "var(--color-text-subtle, #6b7280)" }}>
                            {plan.priceNote}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Feature list */}
                    <ul
                      style={{
                        margin: "0 0 24px",
                        padding: 0,
                        listStyle: "none",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        flex: 1,
                      }}
                    >
                      {plan.features.map((feat) => (
                        <li
                          key={feat}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "8px",
                            fontSize: "13px",
                            color: isCurrent
                              ? "var(--color-text, #111)"
                              : "var(--color-text-subtle, #6b7280)",
                          }}
                        >
                          <span
                            style={{
                              color: isCurrent
                                ? "var(--color-primary, #2563eb)"
                                : "var(--color-text-subtle, #9ca3af)",
                            }}
                          >
                            <CheckIcon />
                          </span>
                          {feat}
                        </li>
                      ))}
                    </ul>

                    {/* Action */}
                    {isCurrent ? (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "9px 16px",
                          background: "var(--color-primary, #2563eb)",
                          color: "#fff",
                          borderRadius: "8px",
                          fontSize: "14px",
                          fontWeight: 600,
                        }}
                      >
                        Active
                      </div>
                    ) : isUpgrade ? (
                      <button
                        className="button button-primary"
                        disabled={busy}
                        onClick={() => void handleUpgrade(plan.tier as Tier.BASIC | Tier.ADVANCED)}
                        style={{ width: "100%", fontSize: "14px", padding: "10px 16px" }}
                        type="button"
                      >
                        {busy &&
                        (actionState as { targetTier?: Tier }).targetTier === plan.tier
                          ? "Upgrading…"
                          : `Upgrade to ${plan.name}`}
                      </button>
                    ) : (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "9px 16px",
                          border: "1px solid var(--color-border, #e5e7eb)",
                          borderRadius: "8px",
                          fontSize: "14px",
                          color: "var(--color-text-subtle, #9ca3af)",
                        }}
                      >
                        Included in your plan
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <p
            style={{
              marginTop: "16px",
              fontSize: "12px",
              color: "var(--color-text-subtle, #9ca3af)",
              textAlign: "center",
            }}
          >
            No long-term contracts. Cancel or change plans at any time.
          </p>
        </section>
      )}
    </WorkspaceShell>
  );
}
