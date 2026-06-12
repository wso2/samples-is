CREATE TABLE IF NOT EXISTS flights (
  id             TEXT    PRIMARY KEY,
  from_city      TEXT    NOT NULL,
  to_city        TEXT    NOT NULL,
  airline        TEXT    NOT NULL,
  departure_time TEXT    NOT NULL,
  arrival_time   TEXT    NOT NULL,
  duration       TEXT    NOT NULL,
  stops          INTEGER NOT NULL DEFAULT 0,
  price          REAL    NOT NULL,
  currency       TEXT    NOT NULL DEFAULT 'USD',
  cabin          TEXT    NOT NULL DEFAULT 'Economy',
  dates          TEXT    NOT NULL,
  tags           TEXT    NOT NULL DEFAULT '[]',
  created_at     TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS org_bookings (
  id                  TEXT    PRIMARY KEY,
  org_id              TEXT    NOT NULL,
  booking_reference   TEXT    NOT NULL,
  booked_for_user_id  TEXT,
  booked_for_name     TEXT,
  booked_by_sub       TEXT    NOT NULL,
  booked_by_name      TEXT    NOT NULL,
  flight_id           TEXT    NOT NULL,
  travelers           INTEGER NOT NULL DEFAULT 1,
  booking_price       REAL,
  status              TEXT    NOT NULL DEFAULT 'confirmed',
  created_at          TEXT    NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (flight_id) REFERENCES flights(id)
);

CREATE TABLE IF NOT EXISTS travel_policies (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  org_id            TEXT    NOT NULL UNIQUE,
  domestic_cabin    TEXT    NOT NULL DEFAULT 'Economy',
  max_flight_price  INTEGER NOT NULL DEFAULT 500,
  price_cap_percent INTEGER NOT NULL DEFAULT 20,
  updated_at        TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS enterprise_idps (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  org_id     TEXT    NOT NULL UNIQUE,
  idp_id     TEXT    NOT NULL,
  idp_name   TEXT    NOT NULL,
  updated_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS org_tiers (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  org_id     TEXT    NOT NULL UNIQUE,
  tier       TEXT    NOT NULL DEFAULT 'FREE',
  updated_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS branding_preferences (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  org_id             TEXT    NOT NULL UNIQUE,
  primary_color      TEXT    NOT NULL DEFAULT '#2563EB',
  secondary_color    TEXT    NOT NULL DEFAULT '#FBBF24',
  logo_url           TEXT    NOT NULL DEFAULT '',
  favicon_url        TEXT    NOT NULL DEFAULT '',
  font_family        TEXT    NOT NULL DEFAULT 'Inter',
  font_import_url    TEXT    NOT NULL DEFAULT 'https://fonts.googleapis.com/css?family=Inter',
  text_primary_color TEXT    NOT NULL DEFAULT '#111827',
  display_name       TEXT    NOT NULL DEFAULT '',
  support_email      TEXT    NOT NULL DEFAULT '',
  updated_at         TEXT    NOT NULL DEFAULT (datetime('now'))
);
