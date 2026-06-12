import { getDb } from "../connection";

export interface OrgTierRecord {
  id: number;
  org_id: string;
  tier: string;
  updated_at: string;
}

const SQL_GET = "SELECT * FROM org_tiers WHERE org_id = ?";

const SQL_UPSERT = `
  INSERT INTO org_tiers (org_id, tier, updated_at)
  VALUES (@org_id, @tier, datetime('now'))
  ON CONFLICT(org_id) DO UPDATE SET
    tier       = excluded.tier,
    updated_at = datetime('now')
`;

export function getOrgTier(orgId: string): OrgTierRecord | null {
  return getDb().prepare(SQL_GET).get(orgId) as OrgTierRecord | null;
}

export function upsertOrgTier(orgId: string, tier: string): OrgTierRecord {
  const db = getDb();
  db.prepare(SQL_UPSERT).run({ org_id: orgId, tier });
  return db.prepare(SQL_GET).get(orgId) as OrgTierRecord;
}
