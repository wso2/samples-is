"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import WorkspaceShell from "../WorkspaceShell";
import { useAuth } from "../lib/auth/client";
import { UserRole } from "../lib/auth/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TravelPolicy {
  domestic_cabin: string;
  max_flight_price: number;
  price_cap_percent: number;
}

interface Flight {
  id: string;
  from_city: string;
  to_city: string;
  airline: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  stops: number;
  price: number;
  currency: string;
  cabin: string;
  dates: string;
  tags: string[];
}

interface Booking {
  id: string;
  booking_reference: string;
  booked_for_name: string | null;
  booked_by_name: string;
  flight_id: string;
  from_city: string;
  to_city: string;
  airline: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  cabin: string;
  dates: string;
  travelers: number;
  booking_price: number | null;
  status: string;
  created_at: string;
}

interface OrgUser {
  id: string;
  name: string;
  email: string;
}

type PolicyStatus = "in-policy" | "approval-required" | "out-of-policy";

interface PolicyResult {
  status: PolicyStatus;
  violations: string[];
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

// Returns "YYYY-MM-DD" parsed from the departure half of a dates string like "Jun 12 - Jun 18".
function parseDepartureDate(dates: string): string | null {
  const match = dates.match(/^([A-Za-z]+ \d+)/);
  if (!match) return null;
  const d = new Date(`${match[1]} 2026`);
  if (isNaN(d.getTime())) return null;
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `2026-${mm}-${dd}`;
}

// ─── Policy helpers ───────────────────────────────────────────────────────────

const CABIN_RANK: Record<string, number> = {
  "Economy": 0,
  "Premium Economy": 1,
  "Business": 2,
  "First Class": 3,
};

function evaluatePolicy(flight: Flight, policy: TravelPolicy | null): PolicyResult {
  if (!policy) return { status: "in-policy", violations: [] };

  const violations: string[] = [];
  const priceCap = policy.max_flight_price;
  const approvalCap = priceCap * (1 + policy.price_cap_percent / 100);
  const allowedCabinRank = CABIN_RANK[policy.domestic_cabin] ?? 0;
  const flightCabinRank = CABIN_RANK[flight.cabin] ?? 0;

  const priceOver = flight.price > priceCap;
  const priceWayOver = flight.price > approvalCap;
  const cabinOver = flightCabinRank > allowedCabinRank;
  const cabinWayOver = flightCabinRank > allowedCabinRank + 1;

  if (priceWayOver) violations.push(`Price $${flight.price} exceeds $${approvalCap.toFixed(0)} limit`);
  else if (priceOver) violations.push(`Price $${flight.price} exceeds $${priceCap} cap`);

  if (cabinWayOver) violations.push(`${flight.cabin} class not allowed (policy: ${policy.domestic_cabin})`);
  else if (cabinOver) violations.push(`${flight.cabin} class above allowed ${policy.domestic_cabin}`);

  if (priceWayOver || cabinWayOver) return { status: "out-of-policy", violations };
  if (priceOver || cabinOver) return { status: "approval-required", violations };
  return { status: "in-policy", violations: [] };
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

const POLICY_LABEL: Record<PolicyStatus, string> = {
  "in-policy": "Under policy",
  "approval-required": "Approval required",
  "out-of-policy": "Out of policy",
};

function PolicyBadge({ status }: { status: PolicyStatus }) {
  const cls =
    status === "in-policy"
      ? "flight-policy-badge flight-policy-badge--ok"
      : status === "approval-required"
      ? "flight-policy-badge flight-policy-badge--warn"
      : "flight-policy-badge flight-policy-badge--bad";
  return <em className={cls}>{POLICY_LABEL[status]}</em>;
}

function FlightCard({
  flight,
  policyResult,
  isMember,
  onBook,
  booking,
  isBooking,
}: {
  flight: Flight;
  policyResult: PolicyResult;
  isMember: boolean;
  onBook: (flight: Flight) => void;
  booking?: Booking;
  isBooking: boolean;
}) {
  const isOutOfPolicy = policyResult.status === "out-of-policy";
  const disabled = isBooking || (isMember && isOutOfPolicy) || !!booking;

  return (
    <article className={`flight-card${isOutOfPolicy && isMember ? " flight-card--blocked" : ""}`}>
      <div className="flight-card-header">
        <div className="flight-card-route">
          <span className="flight-card-city">{flight.from_city}</span>
          <span className="flight-card-arrow">→</span>
          <span className="flight-card-city">{flight.to_city}</span>
        </div>
        <PolicyBadge status={policyResult.status} />
      </div>

      <div className="flight-card-meta">
        <div className="flight-card-times">
          <span className="flight-time">{flight.departure_time}</span>
          <span className="flight-duration">{flight.duration}</span>
          <span className="flight-time">{flight.arrival_time}</span>
        </div>
        <div className="flight-card-details">
          <span className="flight-airline">{flight.airline}</span>
          <span className="flight-cabin-tag">{flight.cabin}</span>
          {flight.stops === 0 && <span className="flight-nonstop">Nonstop</span>}
          {flight.stops > 0 && <span className="flight-stops">{flight.stops} stop{flight.stops > 1 ? "s" : ""}</span>}
        </div>
      </div>

      {flight.tags.length > 0 && (
        <div className="flight-tags">
          {flight.tags.map((tag) => (
            <span key={tag} className="flight-tag">{tag}</span>
          ))}
        </div>
      )}

      {policyResult.violations.length > 0 && (
        <div className="flight-violations">
          {policyResult.violations.map((v) => (
            <span key={v} className="violation-item">⚠ {v}</span>
          ))}
        </div>
      )}

      <div className="flight-card-footer">
        <div>
          <span className="flight-price">${flight.price.toLocaleString()}</span>
          <span className="flight-price-label">&nbsp;/ person</span>
        </div>
        <div className="flight-card-actions">
          <span className="flight-dates-small">{flight.dates}</span>
          {booking ? (
            <span className="flight-booked-badge">Booked · {booking.booking_reference}</span>
          ) : isMember && isOutOfPolicy ? (
            <button className="button button-ghost" disabled title={policyResult.violations.join("; ")}>
              Not available
            </button>
          ) : (
            <button
              className="button button-primary"
              disabled={disabled}
              onClick={() => onBook(flight)}
            >
              {isBooking ? "Booking…" : "Book flight"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function BookingRow({
  booking,
  onCancel,
  isCancelling,
  isAdmin,
}: {
  booking: Booking;
  onCancel: (id: string) => void;
  isCancelling: boolean;
  isAdmin?: boolean;
}) {
  const isConfirmed = booking.status === "confirmed";
  const canCancel = isAdmin || booking.booked_for_name === null;

  return (
    <article className="booking-row">
      <div className="booking-row-info">
        <div className="booking-row-route">
          <strong>{booking.from_city} → {booking.to_city}</strong>
          <span className="booking-ref">#{booking.booking_reference}</span>
        </div>
        <div className="booking-row-meta">
          <span>{booking.airline}</span>
          <span>·</span>
          <span>{booking.cabin}</span>
          <span>·</span>
          <span>{booking.dates}</span>
          {isAdmin && (
            <>
              <span>·</span>
              <span>Booked by: {booking.booked_by_name}</span>
            </>
          )}
          {booking.booked_for_name && (
            <>
              <span>·</span>
              <span>For: {booking.booked_for_name}</span>
            </>
          )}
        </div>
      </div>
      <div className="booking-row-right">
        {booking.booking_price != null && (
          <strong className="booking-price">${booking.booking_price.toLocaleString()}</strong>
        )}
        <em className={isConfirmed ? "success-pill" : "booking-cancelled-pill"}>
          {isConfirmed ? "Confirmed" : "Cancelled"}
        </em>
        {isConfirmed && (
          canCancel ? (
            <button
              className="button button-ghost booking-cancel-btn"
              disabled={isCancelling}
              onClick={() => onCancel(booking.id)}
            >
              {isCancelling ? "Cancelling…" : "Cancel"}
            </button>
          ) : (
            <span
              className="booking-cancel-tooltip-wrap"
              data-tooltip={`Booked by ${booking.booked_by_name} — only they can cancel`}
            >
              <button className="button button-ghost booking-cancel-btn" disabled>
                Cancel
              </button>
            </span>
          )
        )}
      </div>
    </article>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function BookingsDashboard({ roles }: { roles: UserRole[] }) {
  const { accessToken, user } = useAuth();
  const isAdmin = roles.includes(UserRole.ADMIN);
  const isMember = !isAdmin;

  // ── State ────────────────────────────────────────────────────────────────
  const [policy, setPolicy] = useState<TravelPolicy | null>(null);
  const [policyLoading, setPolicyLoading] = useState(true);

  const [flights, setFlights] = useState<Flight[]>([]);
  const [flightsLoading, setFlightsLoading] = useState(false);
  const [flightsError, setFlightsError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  const [orgUsers, setOrgUsers] = useState<OrgUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedUserName, setSelectedUserName] = useState<string>("");

  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [cabinFilter, setCabinFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [bookingFlight, setBookingFlight] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Data loading ─────────────────────────────────────────────────────────

  const loadPolicy = useCallback(() => {
    if (!accessToken) return;
    fetch("/api/travel-policies", { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { policy?: TravelPolicy | null }) => { if (d.policy) setPolicy(d.policy); })
      .catch(() => {})
      .finally(() => setPolicyLoading(false));
  }, [accessToken]);

  const loadBookings = useCallback(() => {
    if (!accessToken) return;
    const url = isAdmin ? "/api/bookings?all=true" : "/api/bookings";
    fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { bookings?: Booking[] }) => { setBookings(d.bookings ?? []); })
      .catch(() => {})
      .finally(() => setBookingsLoading(false));
  }, [accessToken, isAdmin]);

  const loadOrgUsers = useCallback(() => {
    if (!accessToken || !isAdmin) return;
    fetch("/api/organization/users", { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { users?: OrgUser[] }) => {
        const users = d.users ?? [];
        setOrgUsers(users);
        if (users.length > 0) {
          setSelectedUserId(users[0].id);
          setSelectedUserName(users[0].name || users[0].email);
        }
      })
      .catch(() => {});
  }, [accessToken, isAdmin]);

  useEffect(() => {
    loadPolicy();
    loadBookings();
    loadOrgUsers();
  }, [loadPolicy, loadBookings, loadOrgUsers]);

  // ── Search ───────────────────────────────────────────────────────────────

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken) return;

    setFlightsLoading(true);
    setFlightsError(null);
    setSearched(true);
    setBookingError(null);

    const params = new URLSearchParams();
    if (fromCity) params.set("from", fromCity);
    if (toCity) params.set("to", toCity);
    if (cabinFilter !== "All") params.set("cabin", cabinFilter);

    fetch(`/api/flights?${params}`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((d: { flights?: Flight[] }) => setFlights(d.flights ?? []))
      .catch(() => setFlightsError("Failed to load flights. Please try again."))
      .finally(() => setFlightsLoading(false));
  }

  // ── Booking ──────────────────────────────────────────────────────────────

  function handleBook(flight: Flight) {
    if (!accessToken || bookingFlight) return;
    setBookingFlight(flight.id);
    setBookingError(null);
    setBookingSuccess(null);

    const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.email || "User";

    const body: Record<string, unknown> = {
      flightId: flight.id,
      travelers: 1,
      bookedByName: displayName,
    };

    if (isAdmin && selectedUserId) {
      body.bookedForUserId = selectedUserId;
      body.bookedForName = selectedUserName;
    }

    fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(body),
    })
      .then((r) => r.json().then((d) => ({ ok: r.ok, data: d })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error ?? "Booking failed");
        setBookings((prev) => [data.booking, ...prev]);
        setBookingSuccess(`Flight ${flight.from_city} → ${flight.to_city} booked! Ref: ${data.booking.booking_reference}`);
        if (successTimer.current) clearTimeout(successTimer.current);
        successTimer.current = setTimeout(() => setBookingSuccess(null), 6000);
      })
      .catch((err: Error) => setBookingError(err.message))
      .finally(() => setBookingFlight(null));
  }

  // ── Cancel ───────────────────────────────────────────────────────────────

  function handleCancel(bookingId: string) {
    if (!accessToken || cancellingId) return;
    setCancellingId(bookingId);
    setCancelError(null);

    fetch(`/api/bookings/${bookingId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((r) => r.json().then((d) => ({ ok: r.ok, data: d })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error ?? "Cancellation failed");
        setBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, status: "cancelled" } : b));
      })
      .catch((err: Error) => setCancelError(err.message))
      .finally(() => setCancellingId(null));
  }

  // ── Derived data ─────────────────────────────────────────────────────────

  const bookingByFlightId = Object.fromEntries(
    bookings.filter((b) => b.status === "confirmed").map((b) => [b.flight_id, b])
  );

  const filteredFlights = flights.filter((f) => {
    const dep = parseDepartureDate(f.dates);
    if (dateFrom && dep && dep < dateFrom) return false;
    if (dateTo && dep && dep > dateTo) return false;
    return true;
  });

  const sortedFlights = [...filteredFlights].sort((a, b) => {
    const pa = evaluatePolicy(a, policy);
    const pb = evaluatePolicy(b, policy);
    const ORDER: Record<PolicyStatus, number> = { "in-policy": 0, "approval-required": 1, "out-of-policy": 2 };
    const statusDiff = ORDER[pa.status] - ORDER[pb.status];
    if (statusDiff !== 0) return statusDiff;
    return a.price - b.price;
  });

  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled");

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <WorkspaceShell
      activeHref="/bookings"
      eyebrow={isAdmin ? "Admin workspace" : "Member workspace"}
      roles={roles}
      title={isAdmin ? "Book flights for your team" : "Book your next flight"}
    >
      {/* ── Banners ──────────────────────────────────────────────────────── */}
      {bookingSuccess && (
        <div className="form-status" style={{ marginBottom: 16 }}>
          ✓ {bookingSuccess}
        </div>
      )}
      {bookingError && (
        <div className="form-error" style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{bookingError}</span>
          <button onClick={() => setBookingError(null)} style={{ background: "none", border: "none", cursor: "pointer" }} aria-label="Dismiss">✕</button>
        </div>
      )}
      {cancelError && (
        <div className="form-error" style={{ marginBottom: 16 }}>
          {cancelError}
        </div>
      )}

      {/* ── Policy summary (Member view) ──────────────────────────────── */}
      {isMember && !policyLoading && (
        <div className="booking-policy-banner">
          {policy ? (
            <>
              <div className="policy-banner-icon">📋</div>
              <div>
                <strong>Your travel policy</strong>
                <span>
                  Cabin up to <b>{policy.domestic_cabin}</b> · Max <b>${policy.max_flight_price}</b>/ticket
                  · Up to <b>{policy.price_cap_percent}%</b> over cap requires approval
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="policy-banner-icon">🌐</div>
              <div>
                <strong>No travel policy set</strong>
                <span>Your organization has no active travel policy. All flights are available.</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Search panel ─────────────────────────────────────────────────── */}
      <section className="booking-hero">
        <div>
          <p className="eyebrow">Flight search</p>
          <h2>
            {isAdmin
              ? "Search and book for any team member."
              : "Find flights that fit your travel policy."}
          </h2>
          <p>
            {isAdmin
              ? "All results show policy status. Book compliant options directly or override with approval."
              : "In-policy flights are highlighted. Out-of-policy options are shown but blocked."}
          </p>
        </div>

        <form className="booking-search-form" onSubmit={handleSearch}>
          {isAdmin && orgUsers.length > 0 && (
            <label className="booking-search-label">
              Book for
              <select
                className="booking-search-input"
                value={selectedUserId}
                onChange={(e) => {
                  setSelectedUserId(e.target.value);
                  const u = orgUsers.find((o) => o.id === e.target.value);
                  setSelectedUserName(u?.name || u?.email || "");
                }}
              >
                {orgUsers.map((u) => (
                  <option key={u.id} value={u.id}>{u.name || u.email}</option>
                ))}
              </select>
            </label>
          )}
          <div className="booking-search-row">
            <label className="booking-search-label">
              From
              <input
                className="booking-search-input"
                placeholder="e.g. New York"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
              />
            </label>
            <label className="booking-search-label">
              To
              <input
                className="booking-search-input"
                placeholder="e.g. Los Angeles"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
              />
            </label>
            <label className="booking-search-label">
              Cabin class
              <select
                className="booking-search-input"
                value={cabinFilter}
                onChange={(e) => setCabinFilter(e.target.value)}
              >
                <option>All</option>
                <option>Economy</option>
                <option>Premium Economy</option>
                <option>Business</option>
                <option>First Class</option>
              </select>
            </label>
          </div>
          <div className="booking-search-row">
            <label className="booking-search-label">
              Earliest departure
              <input
                type="date"
                className="booking-search-input"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </label>
            <label className="booking-search-label">
              Latest departure
              <input
                type="date"
                className="booking-search-input"
                value={dateTo}
                min={dateFrom || undefined}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </label>
          </div>
          <button className="button button-primary" type="submit" style={{ justifySelf: "start" }}>
            Search flights
          </button>
        </form>
      </section>

      {/* ── Results ──────────────────────────────────────────────────────── */}
      {searched && (
        <section className="workspace-panel" style={{ marginBottom: 18 }}>
          <div className="section-heading" style={{ marginBottom: 14 }}>
            <div>
              <p className="eyebrow">Search results</p>
              <h2>Available flights</h2>
            </div>
            <span className="flight-count-badge">
              {flightsLoading ? "…" : `${sortedFlights.length} flight${sortedFlights.length !== 1 ? "s" : ""}`}
            </span>
          </div>

          {flightsLoading && (
            <div className="flights-skeleton">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flight-card-skeleton" aria-hidden="true">
                  <div className="skeleton-block" style={{ height: 18, width: "40%", marginBottom: 10 }} />
                  <div className="skeleton-block" style={{ height: 14, width: "60%", marginBottom: 8 }} />
                  <div className="skeleton-block" style={{ height: 14, width: "30%" }} />
                </div>
              ))}
            </div>
          )}

          {!flightsLoading && flightsError && (
            <div className="form-error">{flightsError}</div>
          )}

          {!flightsLoading && !flightsError && sortedFlights.length === 0 && (
            <p className="empty-state-text">No flights found. Try different search criteria or clear the filters.</p>
          )}

          {!flightsLoading && !flightsError && sortedFlights.length > 0 && (
            <div className="flight-card-list">
              {sortedFlights.map((flight) => {
                const pr = evaluatePolicy(flight, isMember ? policy : null);
                return (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    policyResult={pr}
                    isMember={isMember}
                    onBook={handleBook}
                    booking={bookingByFlightId[flight.id]}
                    isBooking={bookingFlight === flight.id}
                  />
                );
              })}
            </div>
          )}
        </section>
      )}

      {!searched && (
        <div className="booking-empty-state">
          <div className="booking-empty-icon">✈</div>
          <p>Enter a departure and destination city above to search for available flights.</p>
        </div>
      )}

      {/* ── My bookings ───────────────────────────────────────────────────── */}
      <section className="workspace-panel">
        <div className="section-heading" style={{ marginBottom: 14 }}>
          <div>
            <p className="eyebrow">{isAdmin ? "All bookings" : "My bookings"}</p>
            <h2>Flight bookings</h2>
          </div>
          {confirmedBookings.length > 0 && (
            <span className="flight-count-badge">{confirmedBookings.length} confirmed</span>
          )}
        </div>

        {bookingsLoading && (
          <div className="flights-skeleton">
            {[1, 2].map((i) => (
              <div key={i} className="flight-card-skeleton" aria-hidden="true">
                <div className="skeleton-block" style={{ height: 16, width: "50%", marginBottom: 8 }} />
                <div className="skeleton-block" style={{ height: 12, width: "70%" }} />
              </div>
            ))}
          </div>
        )}

        {!bookingsLoading && bookings.length === 0 && (
          <p className="empty-state-text">No bookings yet. Search for flights above to make your first booking.</p>
        )}

        {!bookingsLoading && confirmedBookings.length > 0 && (
          <div className="booking-list">
            {confirmedBookings.map((b) => (
              <BookingRow
                key={b.id}
                booking={b}
                onCancel={handleCancel}
                isCancelling={cancellingId === b.id}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}

        {!bookingsLoading && cancelledBookings.length > 0 && (
          <>
            <p className="bookings-section-label">Past / cancelled</p>
            <div className="booking-list booking-list--muted">
              {cancelledBookings.map((b) => (
                <BookingRow
                  key={b.id}
                  booking={b}
                  onCancel={handleCancel}
                  isCancelling={cancellingId === b.id}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </WorkspaceShell>
  );
}
