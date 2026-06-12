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
