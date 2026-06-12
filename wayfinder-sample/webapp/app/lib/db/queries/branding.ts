import { getDb } from "../connection";

export interface BrandingRecord {
  id: number;
  org_id: string;
  primary_color: string;
  secondary_color: string;
  logo_url: string;
  favicon_url: string;
  font_family: string;
  font_import_url: string;
  text_primary_color: string;
  display_name: string;
  support_email: string;
  updated_at: string;
}

export interface BrandingData {
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  faviconUrl: string;
  fontFamily: string;
  fontImportUrl: string;
  textPrimaryColor: string;
  displayName: string;
  supportEmail: string;
}

const SQL_GET = "SELECT * FROM branding_preferences WHERE org_id = ?";

const SQL_UPSERT = `
  INSERT INTO branding_preferences (
    org_id, primary_color, secondary_color, logo_url, favicon_url,
    font_family, font_import_url, text_primary_color, display_name, support_email, updated_at
  ) VALUES (
    @org_id, @primary_color, @secondary_color, @logo_url, @favicon_url,
    @font_family, @font_import_url, @text_primary_color, @display_name, @support_email, datetime('now')
  )
  ON CONFLICT(org_id) DO UPDATE SET
    primary_color      = excluded.primary_color,
    secondary_color    = excluded.secondary_color,
    logo_url           = excluded.logo_url,
    favicon_url        = excluded.favicon_url,
    font_family        = excluded.font_family,
    font_import_url    = excluded.font_import_url,
    text_primary_color = excluded.text_primary_color,
    display_name       = excluded.display_name,
    support_email      = excluded.support_email,
    updated_at         = datetime('now')
`;

const SQL_DELETE = "DELETE FROM branding_preferences WHERE org_id = ?";

export function getBranding(orgId: string): BrandingRecord | null {
  return getDb().prepare(SQL_GET).get(orgId) as BrandingRecord | null;
}

export function upsertBranding(orgId: string, data: BrandingData): BrandingRecord {
  const db = getDb();
  db.prepare(SQL_UPSERT).run({
    org_id: orgId,
    primary_color: data.primaryColor,
    secondary_color: data.secondaryColor,
    logo_url: data.logoUrl,
    favicon_url: data.faviconUrl,
    font_family: data.fontFamily,
    font_import_url: data.fontImportUrl,
    text_primary_color: data.textPrimaryColor,
    display_name: data.displayName,
    support_email: data.supportEmail,
  });
  return db.prepare(SQL_GET).get(orgId) as BrandingRecord;
}

export function deleteBranding(orgId: string): void {
  getDb().prepare(SQL_DELETE).run(orgId);
}
