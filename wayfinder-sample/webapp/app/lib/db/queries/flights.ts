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

export interface Flight {
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
  tags: string;
  created_at: string;
}

export interface FlightParsed extends Omit<Flight, "tags"> {
  tags: string[];
}

function parseFlight(row: Flight): FlightParsed {
  let tags: string[] = [];
  try {
    tags = JSON.parse(row.tags);
  } catch {
    tags = [];
  }
  return { ...row, tags };
}

export function listFlights(filters?: { from?: string; to?: string; cabin?: string }): FlightParsed[] {
  let sql = "SELECT * FROM flights WHERE 1=1";
  const params: unknown[] = [];

  if (filters?.from) {
    sql += " AND lower(from_city) LIKE ?";
    params.push(`%${filters.from.toLowerCase()}%`);
  }
  if (filters?.to) {
    sql += " AND lower(to_city) LIKE ?";
    params.push(`%${filters.to.toLowerCase()}%`);
  }
  if (filters?.cabin) {
    sql += " AND cabin = ?";
    params.push(filters.cabin);
  }

  sql += " ORDER BY price ASC";
  const rows = getDb().prepare(sql).all(...params) as Flight[];
  return rows.map(parseFlight);
}

export function getFlightById(flightId: string): FlightParsed | null {
  const row = getDb()
    .prepare("SELECT * FROM flights WHERE id = ?")
    .get(flightId) as Flight | undefined;
  return row ? parseFlight(row) : null;
}

