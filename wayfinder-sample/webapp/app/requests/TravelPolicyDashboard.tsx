"use client";

import { useEffect, useState } from "react";
import WorkspaceShell from "../WorkspaceShell";
import { useAuth } from "../lib/auth/client";
import { UserRole } from "../lib/auth/utils";

interface Policy {
  domestic_cabin: string;
  max_flight_price: number;
  price_cap_percent: number;
}

interface FormValues {
  domesticCabin: string;
  maxFlightPrice: string;
  priceCapPercent: string;
}

const DEFAULT_FORM: FormValues = {
  domesticCabin: "Economy",
  maxFlightPrice: "500",
  priceCapPercent: "20",
};

function policyToForm(p: Policy): FormValues {
  return {
    domesticCabin: p.domestic_cabin,
    maxFlightPrice: String(p.max_flight_price),
    priceCapPercent: String(p.price_cap_percent),
  };
}

export default function TravelPolicyDashboard({ roles }: { roles: UserRole[] }) {
  const { accessToken } = useAuth();

  const [policy, setPolicy] = useState<Policy | null>(null);
  const [form, setForm] = useState<FormValues>(DEFAULT_FORM);

  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [banner, setBanner] = useState<"saved" | "deleted" | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    fetch("/api/travel-policies", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data: { policy?: Policy | null }) => {
        if (data.policy) {
          setPolicy(data.policy);
          setForm(policyToForm(data.policy));
        }
      })
      .catch(() => setLoadFailed(true))
      .finally(() => setLoading(false));
  }, [accessToken]);

  function showBanner(type: "saved" | "deleted") {
    setBanner(type);
    setTimeout(() => setBanner(null), 4000);
  }

  function handleSave() {
    if (!accessToken || saving) return;
    setSaving(true);
    setError(null);

    const body = {
      domestic_cabin: form.domesticCabin,
      max_flight_price: Number(form.maxFlightPrice),
      price_cap_percent: Number(form.priceCapPercent),
    };

    fetch("/api/travel-policies", {
      method: policy ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data: { policy?: Policy }) => {
        if (data.policy) {
          setPolicy(data.policy);
          setForm(policyToForm(data.policy));
        }
        showBanner("saved");
      })
      .catch(() => setError("Failed to save the policy. Please try again."))
      .finally(() => setSaving(false));
  }

  function handleDelete() {
    if (!accessToken || deleting) return;
    setDeleting(true);
    setError(null);

    fetch("/api/travel-policies", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        setPolicy(null);
        setForm(DEFAULT_FORM);
        showBanner("deleted");
      })
      .catch(() => setError("Failed to delete the policy. Please try again."))
      .finally(() => setDeleting(false));
  }

  function field(key: keyof FormValues, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <WorkspaceShell
      activeHref="/requests"
      eyebrow="Admin workspace"
      roles={roles}
      title="Travel policy management"
    >
      {/* ── Banner ────────────────────────────────────────────── */}
      {banner === "saved" && (
        <div className="form-status" style={{ marginBottom: 18 }}>
          Policy published — changes are now active for all employees.
        </div>
      )}
      {banner === "deleted" && (
        <div className="form-status form-status-warn" style={{ marginBottom: 18 }}>
          Policy removed — employees can now book flights without restrictions.
        </div>
      )}
      {error && (
        <div className="form-error" style={{ marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>{error}</span>
          <button onClick={() => setError(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1rem", lineHeight: 1, padding: "0 2px" }} aria-label="Dismiss">✕</button>
        </div>
      )}

      {/* ── Command panel ────────────────────────────────────── */}
      <section className="command-panel">
        <div>
          <p className="eyebrow">Travel policies</p>
          <h2>Control how employees book flights.</h2>
          <p>
            Set the allowed cabin class, maximum ticket price, and how much over that limit
            employees can go with manager approval.
          </p>
        </div>
      </section>

      {/* ── Load error ───────────────────────────────────────── */}
      {loadFailed && (
        <div className="form-error" style={{ marginBottom: 18 }}>
          Could not load the travel policy. Please refresh the page and try again.
        </div>
      )}

      {/* ── Skeleton loading state ────────────────────────────── */}
      {loading && (
        <>
          <section className="workspace-panel policy-rule-panel" aria-busy="true">
            <div className="section-heading">
              <div>
                <div className="skeleton-block" style={{ height: "12px", width: "80px", marginBottom: "8px" }} />
                <div className="skeleton-block" style={{ height: "22px", width: "200px" }} />
              </div>
            </div>
            <div className="rule-builder">
              {Array.from({ length: 3 }).map((_, i) => (
                <div className="rule-row" key={i}>
                  <div className="skeleton-block skeleton-name" />
                  <div className="skeleton-block skeleton-badge" />
                  <div className="skeleton-block skeleton-email" />
                </div>
              ))}
            </div>
          </section>

        </>
      )}

      {/* ── Policy form ───────────────────────────────────────── */}
      {!loading && !loadFailed && (
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <section className="workspace-panel policy-rule-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Flight policy</p>
                <h2>Cabin class &amp; price limits</h2>
              </div>
            </div>
            <div className="rule-builder">
              <div className="rule-row">
                <label className="rule-label">Cabin class</label>
                <select
                  value={form.domesticCabin}
                  onChange={(e) => field("domesticCabin", e.target.value)}
                >
                  <option>Economy</option>
                  <option>Premium Economy</option>
                  <option>Business</option>
                  <option>First Class</option>
                </select>
                <span className="rule-qualifier">for all domestic routes</span>
              </div>

              <div className="rule-row">
                <label className="rule-label">Maximum flight price</label>
                <div style={{ display: "flex", alignItems: "stretch", border: "1px solid var(--app-border)", borderRadius: 8, overflow: "hidden", background: "#fff" }}>
                  <span style={{ display: "flex", alignItems: "center", padding: "0 10px", background: "#f1f5f9", color: "var(--app-muted)", fontSize: "0.88rem", borderRight: "1px solid var(--app-border)" }}>$</span>
                  <input
                    min="0"
                    type="number"
                    value={form.maxFlightPrice}
                    onChange={(e) => field("maxFlightPrice", e.target.value)}
                    style={{ border: "none", borderRadius: 0, minHeight: 38, width: 100, padding: "0 10px" }}
                  />
                </div>
                <span className="rule-qualifier">per ticket</span>
              </div>

              <div className="rule-row">
                <label className="rule-label">Allow up to</label>
                <input
                  min="0"
                  max="200"
                  type="number"
                  value={form.priceCapPercent}
                  onChange={(e) => field("priceCapPercent", e.target.value)}
                />
                <span className="rule-qualifier">% above the max price with manager approval</span>
              </div>
            </div>
            <div className="action-cluster" style={{ marginTop: 18 }}>
              <button className="button button-primary" type="submit" disabled={saving}>
                {saving ? "Publishing…" : policy ? "Update policy" : "Create policy"}
              </button>
              {policy && (
                <button
                  className="button button-danger"
                  type="button"
                  disabled={deleting}
                  onClick={handleDelete}
                >
                  {deleting ? "Deleting…" : "Delete policy"}
                </button>
              )}
            </div>
          </section>
        </form>
      )}
    </WorkspaceShell>
  );
}
