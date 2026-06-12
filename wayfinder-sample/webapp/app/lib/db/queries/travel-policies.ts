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
