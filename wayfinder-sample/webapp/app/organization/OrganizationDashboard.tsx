"use client";

import { useEffect, useState } from "react";
import WorkspaceShell from "../WorkspaceShell";
import { useAuth } from "../lib/auth/client";
import { UserRole } from "../lib/auth/utils";

type Tab = "users" | "roles";
type UserStatus = "Active" | "Locked";
type RoleName = "Admin" | "Member" | "Idp Manager" | "Basic Branding Editor" | "Advanced Branding Editor";
type Permission = "Flight Booking" | "Travel Policy" | "Impersonate" | "IDP Configure" | "Basic Branding" | "Advanced Branding" | "User Mgt";

interface Employee {
  id: string;
  name: string;
  email: string;
  role: RoleName;
  status: UserStatus;
  userName?: string;
}

interface RoleDef {
  name: RoleName;
  description: string;
  permissions: Permission[];
}

interface RoleData {
  id: string;
  name: RoleName;
  userIds: string[];
}

const ALL_PERMISSIONS: Permission[] = [
  "Flight Booking",
  "Travel Policy",
  "Impersonate",
  "IDP Configure",
  "Basic Branding",
  "Advanced Branding",
  "User Mgt",
];

const ROLES: RoleDef[] = [
  { name: "Admin", description: "Full access to all features and settings.", permissions: [...ALL_PERMISSIONS] },
  { name: "Member", description: "Can book flights for personal travel.", permissions: ["Flight Booking"] },
  { name: "Idp Manager", description: "Can configure enterprise identity providers.", permissions: ["IDP Configure"] },
  { name: "Basic Branding Editor", description: "Can edit basic branding settings.", permissions: ["Basic Branding"] },
  { name: "Advanced Branding Editor", description: "Can edit advanced branding settings.", permissions: ["Basic Branding", "Advanced Branding"] },
];


const PAGE_SIZE = 5;

const TABS: { id: Tab; label: string }[] = [
  { id: "users", label: "Users" },
  { id: "roles", label: "Roles & Permissions" },
];

export default function OrganizationDashboard({ roles }: { roles: UserRole[] }) {
  const { accessToken, startImpersonation } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("users");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [editUser, setEditUser] = useState<Employee | null>(null);
  const [editActionLoading, setEditActionLoading] = useState<"reset" | "lock" | null>(null);
  const [editActionFeedback, setEditActionFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [rolesData, setRolesData] = useState<RoleData[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);

  const [assignRoleTarget, setAssignRoleTarget] = useState<RoleName | null>(null);
  const [assignSearch, setAssignSearch] = useState("");
  const [assignSelected, setAssignSelected] = useState<Set<string>>(new Set());
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<RoleName>("Member");
  const [inviteSent, setInviteSent] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const fetchRoles = (token: string, signal?: AbortSignal) => {
    setRolesLoading(true);
    fetch("/api/organization/roles", {
      headers: { Authorization: `Bearer ${token}` },
      signal,
    })
      .then((res) => res.json())
      .then((data: { roles?: RoleData[] }) => {
        if (signal?.aborted) return;
        if (Array.isArray(data.roles)) {
          setRolesData(data.roles as RoleData[]);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!signal?.aborted) setRolesLoading(false);
      });
  };

  const fetchUsers = (token: string, signal?: AbortSignal) => {
    setUsersLoading(true);
    setUsersError(null);
    fetch("/api/organization/users", {
      headers: { Authorization: `Bearer ${token}` },
      signal,
    })
      .then((res) => res.json())
      .then((data: { users?: Employee[]; message?: string }) => {
        if (signal?.aborted) return;
        if (Array.isArray(data.users)) {
          setEmployees(data.users.map((u) => ({ ...u, role: u.role ?? "Member" })));
        } else {
          setUsersError(data.message ?? "Failed to load users.");
        }
      })
      .catch(() => {
        if (!signal?.aborted) setUsersError("Failed to load users.");
      })
      .finally(() => {
        if (!signal?.aborted) setUsersLoading(false);
      });
  };

  useEffect(() => {
    if (!accessToken) return;
    const controller = new AbortController();
    fetchUsers(accessToken, controller.signal);
    fetchRoles(accessToken, controller.signal);
    return () => controller.abort();
  }, [accessToken]);

  const filteredEmployees = employees.filter(
    (u) => !search || u.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedEmployees = filteredEmployees.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleSearch(v: string) {
    setSearch(v);
    setPage(1);
  }

  async function handleToggleStatus(user: Employee) {
    const willLock = user.status === "Active";
    setEditActionLoading("lock");
    setEditActionFeedback(null);
    try {
      const res = await fetch(`/api/organization/users/${user.id}`, {
        body: JSON.stringify({ locked: willLock }),
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        method: "PATCH",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setEditActionFeedback({ type: "error", message: (data as { message?: string }).message ?? "Failed to update account status." });
        return;
      }
      const next: UserStatus = willLock ? "Locked" : "Active";
      setEmployees((prev) => prev.map((u) => u.id === user.id ? { ...u, status: next } : u));
      setEditUser((prev) => prev?.id === user.id ? { ...prev, status: next } : prev);
      setEditActionFeedback({ type: "success", message: willLock ? "Account locked." : "Account unlocked." });
    } catch {
      setEditActionFeedback({ type: "error", message: "Failed to update account status." });
    } finally {
      setEditActionLoading(null);
    }
  }

  async function handleSendResetLink(user: Employee) {
    setEditActionLoading("reset");
    setEditActionFeedback(null);
    try {
      const res = await fetch(`/api/organization/users/${user.id}/reset-password`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setEditActionFeedback({ type: "error", message: (data as { message?: string }).message ?? "Failed to send reset link." });
        return;
      }
      setEditActionFeedback({ type: "success", message: `Password reset link sent to ${user.email}.` });
    } catch {
      setEditActionFeedback({ type: "error", message: "Failed to send reset link." });
    } finally {
      setEditActionLoading(null);
    }
  }

  function handleImpersonate(user: Employee) {
    setEditUser(null);
    startImpersonation(user.id, user.name);
  }

  function openAssignRole(roleName: RoleName) {
    const roleEntry = rolesData.find((r) => r.name === roleName);
    const currentUserIds = new Set(roleEntry?.userIds ?? []);
    setAssignSelected(new Set(employees.filter((e) => currentUserIds.has(e.id)).map((e) => e.id)));
    setAssignSearch("");
    setAssignError(null);
    setAssignRoleTarget(roleName);
  }

  async function submitAssignRole() {
    if (!assignRoleTarget) return;
    const roleEntry = rolesData.find((r) => r.name === assignRoleTarget);
    if (!roleEntry) return;

    setAssignLoading(true);
    setAssignError(null);

    try {
      const res = await fetch(`/api/organization/roles/${roleEntry.id}/users`, {
        body: JSON.stringify({ userIds: Array.from(assignSelected) }),
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        method: "PUT",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setAssignError((data as { message?: string }).message ?? "Failed to update role assignments.");
        return;
      }

      setRolesData((prev) =>
        prev.map((r) => r.id === roleEntry.id ? { ...r, userIds: Array.from(assignSelected) } : r)
      );
      setAssignRoleTarget(null);
    } catch {
      setAssignError("Failed to update role assignments.");
    } finally {
      setAssignLoading(false);
    }
  }

  function openInviteModal() {
    setInviteEmail("");
    setInviteRole("Member");
    setInviteSent(false);
    setInviteError(null);
    setShowInviteModal(true);
  }

  async function handleInviteSubmit() {
    const email = inviteEmail.trim().toLowerCase();
    if (!email) return;

    setInviteLoading(true);
    setInviteError(null);

    try {
      const res = await fetch("/api/organization/users", {
        body: JSON.stringify({ email, role: inviteRole }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setInviteError((data as { message?: string }).message ?? "Failed to invite user. Please try again.");
        return;
      }

      const nameFromEmail = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      setEmployees((prev) => [
        {
          id: (data as { user?: { id?: string } }).user?.id ?? `u${Date.now()}`,
          name: nameFromEmail,
          email,
          role: inviteRole,
          status: "Active",
        },
        ...prev,
      ]);
      setInviteSent(true);
    } catch {
      setInviteError("Failed to invite user. Please try again.");
    } finally {
      setInviteLoading(false);
    }
  }

  const assignFiltered = employees.filter(
    (u) => !assignSearch || u.name.toLowerCase().includes(assignSearch.toLowerCase())
  );

  return (
    <WorkspaceShell
      activeHref="/organization"
      eyebrow="Admin workspace"
      roles={roles}
      title="Users and roles"
    >
      <section className="command-panel">
        <div>
          <p className="eyebrow">Management</p>
          <h2>Manage users and roles for the workspace.</h2>
          <p>
            Configure user accounts and assign roles with granular permissions.
          </p>
        </div>
        <div className="action-cluster">
          <button className="button button-primary" type="button" onClick={openInviteModal}>
            Invite user
          </button>
          <button className="button button-secondary" type="button" onClick={() => setActiveTab("roles")}>
            Manage roles
          </button>
        </div>
      </section>

      <nav className="tab-nav" aria-label="Organization settings tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? "active" : undefined}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* ── Users ───────────────────────────────────────────────── */}
      {activeTab === "users" && (
        <div className="tab-content">
          <section className="workspace-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Enterprise employees</p>
                <h2>Access directory</h2>
              </div>
              <div className="search-input-wrapper">
                <input
                  aria-label="Search users by name"
                  placeholder="Search by name…"
                  type="search"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            {usersLoading ? (
              <div className="org-user-table" role="table" aria-label="Loading employees" aria-busy="true">
                <div className="org-user-table-head" role="row">
                  <span>Name</span>
                  <span>Email</span>
                  <span>Status</span>
                  <span />
                </div>
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <div className="org-user-table-row org-user-table-row--skeleton" key={i} role="row">
                    <div className="skeleton-block skeleton-name" />
                    <div className="skeleton-block skeleton-email" />
                    <div className="skeleton-block skeleton-badge" />
                    <div className="skeleton-block skeleton-btn" />
                  </div>
                ))}
              </div>
            ) : usersError ? (
              <div className="users-error-state" role="alert">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                  <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M18 11v8M18 23.5h.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
                <h4>Failed to load users</h4>
                <p>{usersError}</p>
                <button
                  className="button button-secondary"
                  type="button"
                  style={{ marginTop: "4px", fontSize: "0.84rem", minHeight: "34px", padding: "0 16px" }}
                  onClick={() => accessToken && fetchUsers(accessToken)}
                >
                  Try again
                </button>
              </div>
            ) : (
              <>
                <div className="org-user-table" role="table" aria-label="Employee directory">
                  <div className="org-user-table-head" role="row">
                    <span>Name</span>
                    <span>Email</span>
                    <span>Status</span>
                    <span />
                  </div>
                  {pagedEmployees.map((user) => (
                    <div className="org-user-table-row" key={user.id} role="row">
                      <strong>{user.name}</strong>
                      <span className="cell-muted">{user.email}</span>
                      <span>
                        <em className={`status-badge status-badge--${user.status.toLowerCase()}`}>
                          {user.status}
                        </em>
                      </span>
                      <button
                        className="org-edit-btn"
                        type="button"
                        aria-label={`Edit ${user.name}`}
                        onClick={() => setEditUser(user)}
                      >
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <path d="M11.5 2.5a1.414 1.414 0 0 1 2 2L5 13H3v-2L11.5 2.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                {filteredEmployees.length === 0 && (
                  <p className="empty-state">No users match your search.</p>
                )}
              </>
            )}

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  disabled={currentPage === 1}
                  type="button"
                  onClick={() => setPage((p) => p - 1)}
                >
                  ← Prev
                </button>
                <span className="pagination-info">
                  {currentPage} / {totalPages}
                </span>
                <button
                  className="pagination-btn"
                  disabled={currentPage === totalPages}
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </section>
        </div>
      )}

      {/* ── Roles & Permissions ─────────────────────────────────── */}
      {activeTab === "roles" && (
        <div className="tab-content">
          <section className="workspace-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Access control</p>
                <h2>Role definitions &amp; permissions</h2>
              </div>
            </div>

            <div className="roles-perm-grid">
              <div className="roles-perm-header">
                <span>Role</span>
                {ALL_PERMISSIONS.map((p) => (
                  <span key={p}>{p}</span>
                ))}
              </div>
              {ROLES.map((r) => (
                <div className="roles-perm-row" key={r.name}>
                  <span>
                    <strong>{r.name}</strong>
                    <small>{r.description}</small>
                  </span>
                  {ALL_PERMISSIONS.map((p) => (
                    <div key={p} className="roles-perm-cell">
                      {r.permissions.includes(p) ? (
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-label="Allowed">
                          <circle cx="9" cy="9" r="8" fill="#eefbf4" stroke="#bbf7d0" />
                          <path d="M5.5 9l2.5 2.5 4.5-5" stroke="#047857" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <span className="roles-perm-dash">—</span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>

          <section className="workspace-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Current assignments</p>
                <h2>Users per role</h2>
              </div>
            </div>
            <div className="policy-list" aria-busy={rolesLoading}>
              {ROLES.map((r) => {
                const count = rolesData.find((rd) => rd.name === r.name)?.userIds.length ?? 0;
                return (
                  <article className="policy-row" key={r.name}>
                    <div>
                      <strong>{r.name}</strong>
                      <span>{r.description}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {rolesLoading ? (
                        <div className="skeleton-block" style={{ borderRadius: "999px", height: "28px", width: "58px" }} />
                      ) : (
                        <em style={{ background: "var(--app-success-bg)", color: "var(--app-success)", borderRadius: "999px", fontSize: "0.78rem", fontStyle: "normal", fontWeight: 750, padding: "6px 10px", whiteSpace: "nowrap" }}>
                          {count} {count === 1 ? "user" : "users"}
                        </em>
                      )}
                      {rolesLoading ? (
                        <div className="skeleton-block" style={{ borderRadius: "6px", height: "34px", width: "96px" }} />
                      ) : (
                        <button
                          className="button button-secondary"
                          type="button"
                          style={{ fontSize: "0.82rem", minHeight: "34px", padding: "0 12px" }}
                          onClick={() => openAssignRole(r.name)}
                        >
                          Assign users
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* ── Invite User Modal ───────────────────────────────────── */}
      {showInviteModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Invite user" onClick={() => setShowInviteModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p className="eyebrow">User onboarding</p>
                <h3 style={{ margin: "2px 0 0" }}>Invite a new user</h3>
              </div>
              <button className="modal-close" type="button" aria-label="Close" onClick={() => setShowInviteModal(false)}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="modal-body">
              {inviteSent ? (
                <div className="invite-success">
                  <div className="invite-success-icon">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="16" r="14" fill="#eefbf4" stroke="#bbf7d0" strokeWidth="1.5" />
                      <path d="M9 16.5l4.5 4.5 9-10" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h4>Invitation sent!</h4>
                  <p>An invite email has been sent to <strong>{inviteEmail}</strong>. They&apos;ll be added as <strong>{inviteRole}</strong> once they accept.</p>
                  <div className="action-cluster" style={{ justifyContent: "center", marginTop: "8px" }}>
                    <button className="button button-secondary" type="button" onClick={() => { setInviteSent(false); setInviteEmail(""); setInviteRole("Member"); setInviteError(null); }}>
                      Invite another
                    </button>
                    <button className="button button-primary" type="button" onClick={() => setShowInviteModal(false)}>
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="invite-form-intro">
                    <div className="modal-action-icon modal-action-icon--blue" style={{ flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M17 10.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        <path d="M3 6l7 5 7-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="15.5" cy="15.5" r="3" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M15.5 14v1.5l1 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                      </svg>
                    </div>
                    <p style={{ color: "var(--app-muted)", fontSize: "0.88rem", margin: 0 }}>
                      Enter the email address of the person you want to invite. They&apos;ll receive a link to join this workspace.
                    </p>
                  </div>

                  <div style={{ display: "grid", gap: "16px", marginTop: "20px" }}>
                    <label className="form-field-label">
                      Email address
                      <input
                        autoFocus
                        className="form-field-input"
                        placeholder="colleague@company.com"
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && !inviteLoading) handleInviteSubmit(); }}
                      />
                    </label>

                    <label className="form-field-label">
                      Assign role
                      <select
                        className="form-field-input"
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value as RoleName)}
                      >
                        {ROLES.map((r) => (
                          <option key={r.name} value={r.name}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="invite-role-hint">
                    <strong>{inviteRole}</strong>
                    <span>{ROLES.find((r) => r.name === inviteRole)?.permissions.join(", ")}</span>
                  </div>

                  {inviteError && (
                    <div className="form-error" role="alert" style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginTop: "16px" }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: "2px" }}>
                        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                      <span style={{ fontSize: "0.86rem" }}>{inviteError}</span>
                    </div>
                  )}

                  <div className="action-cluster" style={{ marginTop: "20px", justifyContent: "flex-end" }}>
                    <button className="button button-secondary" type="button" disabled={inviteLoading} onClick={() => setShowInviteModal(false)}>
                      Cancel
                    </button>
                    <button
                      className="button button-primary"
                      type="button"
                      disabled={!inviteEmail.trim() || inviteLoading}
                      onClick={handleInviteSubmit}
                    >
                      {inviteLoading ? "Sending…" : "Send invitation"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Edit User Modal ──────────────────────────────────────── */}
      {editUser && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Edit user" onClick={() => { setEditUser(null); setEditActionFeedback(null); }}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p className="eyebrow">User management</p>
                <h3 style={{ margin: "2px 0 4px" }}>{editUser.name}</h3>
                <span className="cell-muted">{editUser.email}</span>
              </div>
              <button className="modal-close" type="button" aria-label="Close" onClick={() => { setEditUser(null); setEditActionFeedback(null); }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-user-info">
                <div className="modal-avatar">{editUser.name.charAt(0)}</div>
                <div style={{ display: "grid", gap: "4px" }}>
                  <strong style={{ fontSize: "1rem" }}>{editUser.name}</strong>
                  <span className="cell-muted">{editUser.email}</span>
                  <em className={`status-badge status-badge--${editUser.status.toLowerCase()}`} style={{ width: "fit-content", marginTop: "2px" }}>
                    {editUser.status}
                  </em>
                </div>
              </div>

              {editActionFeedback && (
                <div
                  role="alert"
                  style={{
                    alignItems: "center",
                    background: editActionFeedback.type === "success" ? "var(--app-success-bg, #eefbf4)" : "var(--app-error-bg, #fff5f5)",
                    border: `1px solid ${editActionFeedback.type === "success" ? "#bbf7d0" : "#fecaca"}`,
                    borderRadius: "8px",
                    color: editActionFeedback.type === "success" ? "#047857" : "#b91c1c",
                    display: "flex",
                    fontSize: "0.86rem",
                    gap: "8px",
                    marginTop: "12px",
                    padding: "10px 14px",
                  }}
                >
                  {editActionFeedback.type === "success" ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  )}
                  {editActionFeedback.message}
                </div>
              )}

              <div className="modal-actions-grid">
                <div className="modal-action-card">
                  <div className="modal-action-icon modal-action-icon--blue">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <rect x="3" y="9" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
                      <path d="M7 9V6a3 3 0 0 1 6 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div style={{ flex: 1, display: "grid", gap: "4px" }}>
                    <strong>Reset Password</strong>
                    <p style={{ color: "var(--app-muted)", fontSize: "0.86rem", margin: 0 }}>
                      Send a password reset link to the user&apos;s email address.
                    </p>
                  </div>
                  <button
                    className="button button-secondary"
                    type="button"
                    disabled={editActionLoading !== null}
                    style={{ fontSize: "0.82rem", minHeight: "34px", padding: "0 14px", whiteSpace: "nowrap" }}
                    onClick={() => handleSendResetLink(editUser)}
                  >
                    {editActionLoading === "reset" ? "Sending…" : "Send reset link"}
                  </button>
                </div>

                <div className="modal-action-card">
                  <div className={`modal-action-icon ${editUser.status === "Active" ? "modal-action-icon--warning" : "modal-action-icon--green"}`}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      {editUser.status === "Active" ? (
                        <>
                          <rect x="4" y="11" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.6" />
                          <path d="M7 11V7a3 3 0 0 1 6 0v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </>
                      ) : (
                        <>
                          <rect x="4" y="11" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.6" />
                          <path d="M7 11V7c0-1.657 1.343-3 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                          <path d="M13 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </>
                      )}
                    </svg>
                  </div>
                  <div style={{ flex: 1, display: "grid", gap: "4px" }}>
                    <strong>{editUser.status === "Active" ? "Lock Account" : "Unlock Account"}</strong>
                    <p style={{ color: "var(--app-muted)", fontSize: "0.86rem", margin: 0 }}>
                      {editUser.status === "Active"
                        ? "Temporarily suspend access for this user."
                        : "Restore access for this locked account."}
                    </p>
                  </div>
                  <button
                    className={`button ${editUser.status === "Active" ? "modal-btn-warning" : "button-secondary"}`}
                    type="button"
                    disabled={editActionLoading !== null}
                    style={{ fontSize: "0.82rem", minHeight: "34px", padding: "0 14px", whiteSpace: "nowrap" }}
                    onClick={() => handleToggleStatus(editUser)}
                  >
                    {editActionLoading === "lock"
                      ? (editUser.status === "Active" ? "Locking…" : "Unlocking…")
                      : (editUser.status === "Active" ? "Lock account" : "Unlock account")}
                  </button>
                </div>

                {false && editUser?.status === "Active" && (
                  <div className="modal-action-card">
                    <div className="modal-action-icon modal-action-icon--purple">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="1.6" />
                        <path d="M3 18c0-4 3.134-7 7-7s7 3 7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div style={{ flex: 1, display: "grid", gap: "4px" }}>
                      <strong>Impersonate</strong>
                      <p style={{ color: "var(--app-muted)", fontSize: "0.86rem", margin: 0 }}>
                        Act as this user to troubleshoot issues or provide support.
                      </p>
                    </div>
                    <button
                      className="button button-impersonate"
                      type="button"
                      style={{ fontSize: "0.82rem", minHeight: "34px", padding: "0 14px", whiteSpace: "nowrap" }}
                      onClick={() => editUser && handleImpersonate(editUser)}
                    >
                      Start session
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Assign Role Modal ────────────────────────────────────── */}
      {assignRoleTarget && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Assign role" onClick={() => setAssignRoleTarget(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p className="eyebrow">Role assignment</p>
                <h3 style={{ margin: "2px 0 0" }}>Assign users — {assignRoleTarget}</h3>
              </div>
              <button className="modal-close" type="button" aria-label="Close" onClick={() => setAssignRoleTarget(null)}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="search-input-wrapper" style={{ marginBottom: "12px" }}>
                <input
                  aria-label="Search users"
                  placeholder="Search users…"
                  type="search"
                  value={assignSearch}
                  onChange={(e) => setAssignSearch(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="assign-user-list">
                {assignFiltered.map((u) => (
                  <label key={u.id} className="assign-user-row">
                    <input
                      type="checkbox"
                      checked={assignSelected.has(u.id)}
                      onChange={(e) => {
                        setAssignSelected((prev) => {
                          const next = new Set(prev);
                          if (e.target.checked) next.add(u.id);
                          else next.delete(u.id);
                          return next;
                        });
                      }}
                    />
                    <div className="assign-user-avatar">{u.name.charAt(0)}</div>
                    <div style={{ flex: 1, display: "grid", gap: "1px" }}>
                      <strong style={{ fontSize: "0.92rem" }}>{u.name}</strong>
                      <span className="cell-muted">{u.email}</span>
                    </div>
                    <em className={`status-badge status-badge--${u.status.toLowerCase()}`}>{u.status}</em>
                  </label>
                ))}
                {assignFiltered.length === 0 && (
                  <p className="empty-state">No users match your search.</p>
                )}
              </div>
              {assignError && (
                <div className="form-error" role="alert" style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginTop: "12px" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: "2px" }}>
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  <span style={{ fontSize: "0.86rem" }}>{assignError}</span>
                </div>
              )}
              <div className="action-cluster" style={{ marginTop: "16px", justifyContent: "flex-end" }}>
                <button className="button button-secondary" type="button" disabled={assignLoading} onClick={() => setAssignRoleTarget(null)}>
                  Cancel
                </button>
                <button className="button button-primary" type="button" disabled={assignLoading} onClick={submitAssignRole}>
                  {assignLoading ? "Saving…" : `Save (${assignSelected.size} selected)`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </WorkspaceShell>
  );
}
