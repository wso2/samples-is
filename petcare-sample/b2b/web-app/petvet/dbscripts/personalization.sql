CREATE DATABASE IF NOT EXISTS PERSONALIZATION_DB;

CREATE TABLE PERSONALIZATION_DB.Branding (
      org VARCHAR(255) PRIMARY KEY,
      logoUrl TEXT,
      logoAltText VARCHAR(255),
      faviconUrl TEXT,
      primaryColor VARCHAR(255),
      secondaryColor VARCHAR(255)
);