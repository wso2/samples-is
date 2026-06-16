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

export interface TravelPolicy {
  id: number;
  org_id: string;
  domestic_cabin: string;
  max_flight_price: number;
  price_cap_percent: number;
  updated_at: string;
}

const SQL_GET = "SELECT * FROM travel_policies WHERE org_id = ?";

const SQL_UPSERT = `
  INSERT INTO travel_policies (org_id, domestic_cabin, max_flight_price, price_cap_percent, updated_at)
  VALUES (@org_id, @domestic_cabin, @max_flight_price, @price_cap_percent, datetime('now'))
  ON CONFLICT(org_id) DO UPDATE SET
    domestic_cabin    = excluded.domestic_cabin,
    max_flight_price  = excluded.max_flight_price,
    price_cap_percent = excluded.price_cap_percent,
    updated_at        = datetime('now')
`;

const SQL_DELETE = "DELETE FROM travel_policies WHERE org_id = ?";

export function getTravelPolicy(orgId: string): TravelPolicy | null {
  return getDb().prepare(SQL_GET).get(orgId) as TravelPolicy | null;
}

export function upsertTravelPolicy(
  orgId: string,
  policy: Omit<TravelPolicy, "id" | "org_id" | "updated_at">
): TravelPolicy {
  const db = getDb();
  db.prepare(SQL_UPSERT).run({ org_id: orgId, ...policy });
  return db.prepare(SQL_GET).get(orgId) as TravelPolicy;
}

export function deleteTravelPolicy(orgId: string): void {
  getDb().prepare(SQL_DELETE).run(orgId);
}
