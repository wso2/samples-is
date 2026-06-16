/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { getDb } from "../connection";

export interface OrgBooking {
  id: string;
  org_id: string;
  booking_reference: string;
  booked_for_user_id: string | null;
  booked_for_name: string | null;
  booked_by_sub: string;
  booked_by_name: string;
  flight_id: string;
  travelers: number;
  booking_price: number | null;
  status: string;
  created_at: string;
}

export interface OrgBookingWithFlight extends OrgBooking {
  from_city: string;
  to_city: string;
  airline: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  cabin: string;
  dates: string;
}

const SQL_WITH_FLIGHT = `
  SELECT b.*, f.from_city, f.to_city, f.airline, f.departure_time, f.arrival_time, f.duration, f.cabin, f.dates
  FROM org_bookings b
  LEFT JOIN flights f ON b.flight_id = f.id
  WHERE b.org_id = ?
`;

export function listOrgBookings(orgId: string): OrgBookingWithFlight[] {
  return getDb().prepare(`${SQL_WITH_FLIGHT} ORDER BY b.created_at DESC`).all(orgId) as OrgBookingWithFlight[];
}

export function listMyOrgBookings(orgId: string, sub: string): OrgBookingWithFlight[] {
  return getDb()
    .prepare(`${SQL_WITH_FLIGHT} AND (b.booked_by_sub = ? OR b.booked_for_user_id = ?) ORDER BY b.created_at DESC`)
    .all(orgId, sub, sub) as OrgBookingWithFlight[];
}

export function getOrgBookingById(orgId: string, bookingId: string): OrgBookingWithFlight | null {
  return getDb()
    .prepare(`${SQL_WITH_FLIGHT} AND b.id = ?`)
    .get(orgId, bookingId) as OrgBookingWithFlight | null;
}

export function findDuplicateOrgBooking(orgId: string, sub: string, flightId: string): OrgBooking | null {
  return getDb()
    .prepare(`
      SELECT * FROM org_bookings
      WHERE org_id = ? AND booked_by_sub = ? AND flight_id = ? AND status = 'confirmed'
    `)
    .get(orgId, sub, flightId) as OrgBooking | null;
}

export function createOrgBooking(data: {
  id: string;
  orgId: string;
  bookingReference: string;
  bookedForUserId: string | null;
  bookedForName: string | null;
  bookedBySub: string;
  bookedByName: string;
  flightId: string;
  travelers: number;
  bookingPrice: number | null;
}): OrgBookingWithFlight {
  const db = getDb();
  db.prepare(`
    INSERT INTO org_bookings
      (id, org_id, booking_reference, booked_for_user_id, booked_for_name, booked_by_sub, booked_by_name, flight_id, travelers, booking_price, status)
    VALUES
      (@id, @org_id, @booking_reference, @booked_for_user_id, @booked_for_name, @booked_by_sub, @booked_by_name, @flight_id, @travelers, @booking_price, 'confirmed')
  `).run({
    id: data.id,
    org_id: data.orgId,
    booking_reference: data.bookingReference,
    booked_for_user_id: data.bookedForUserId,
    booked_for_name: data.bookedForName,
    booked_by_sub: data.bookedBySub,
    booked_by_name: data.bookedByName,
    flight_id: data.flightId,
    travelers: data.travelers,
    booking_price: data.bookingPrice,
  });

  return getOrgBookingById(data.orgId, data.id)!;
}

export function cancelOrgBooking(orgId: string, bookingId: string, sub: string, isAdmin: boolean): OrgBookingWithFlight | null {
  const db = getDb();

  const existing = isAdmin
    ? db.prepare("SELECT * FROM org_bookings WHERE id = ? AND org_id = ?").get(bookingId, orgId) as OrgBooking | undefined
    : db.prepare("SELECT * FROM org_bookings WHERE id = ? AND org_id = ? AND booked_by_sub = ?").get(bookingId, orgId, sub) as OrgBooking | undefined;

  if (!existing) return null;

  db.prepare("UPDATE org_bookings SET status = 'cancelled' WHERE id = ?").run(bookingId);
  return getOrgBookingById(orgId, bookingId);
}
