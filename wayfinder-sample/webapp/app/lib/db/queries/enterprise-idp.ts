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

export interface EnterpriseIdpRecord {
  id: number;
  org_id: string;
  idp_id: string;
  idp_name: string;
  updated_at: string;
}

const SQL_GET = "SELECT * FROM enterprise_idps WHERE org_id = ?";

const SQL_UPSERT = `
  INSERT INTO enterprise_idps (org_id, idp_id, idp_name, updated_at)
  VALUES (@org_id, @idp_id, @idp_name, datetime('now'))
  ON CONFLICT(org_id) DO UPDATE SET
    idp_id     = excluded.idp_id,
    idp_name   = excluded.idp_name,
    updated_at = datetime('now')
`;

const SQL_DELETE = "DELETE FROM enterprise_idps WHERE org_id = ?";

export function getEnterpriseIdp(orgId: string): EnterpriseIdpRecord | null {
  return getDb().prepare(SQL_GET).get(orgId) as EnterpriseIdpRecord | null;
}

export function upsertEnterpriseIdp(orgId: string, idpId: string, idpName: string): EnterpriseIdpRecord {
  const db = getDb();
  db.prepare(SQL_UPSERT).run({ org_id: orgId, idp_id: idpId, idp_name: idpName });
  return db.prepare(SQL_GET).get(orgId) as EnterpriseIdpRecord;
}

export function deleteEnterpriseIdp(orgId: string): void {
  getDb().prepare(SQL_DELETE).run(orgId);
}
