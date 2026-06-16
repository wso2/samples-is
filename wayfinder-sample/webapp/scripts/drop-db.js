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

/**
 * Delete the SQLite database and its containing folder.
 *
 * Resolves the path from DB_PATH env var (same as the app and seed script),
 * falling back to data/app.db.
 *
 * Usage:
 *   node scripts/drop-db.js
 *   npm run db:drop
 */

import { existsSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const envPath = process.env.DB_PATH;
const dbPath = resolve(root, envPath ?? "data/app.db");
const dataDir = dirname(dbPath);

if (envPath) {
  console.log(`DB_PATH is set — targeting: ${dbPath}`);
} else {
  console.log(`DB_PATH not set — using default: ${dbPath}`);
}

if (!existsSync(dbPath)) {
  console.log("Database file not found — nothing to delete.");
  process.exit(0);
}

// When using the default path, remove the whole data/ folder.
// When a custom DB_PATH is set, only remove the file to avoid
// accidentally deleting an unrelated directory.
if (!envPath) {
  rmSync(dataDir, { recursive: true, force: true });
  console.log(`Deleted directory: ${dataDir}`);
} else {
  rmSync(dbPath, { force: true });
  console.log(`Deleted database file: ${dbPath}`);
}

console.log("Done. Run `npm run seed:flights` to recreate and reseed the database after starting the server.");
