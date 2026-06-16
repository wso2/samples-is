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
