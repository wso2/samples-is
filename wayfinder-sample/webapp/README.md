# Wayfinder Enterprise

A Next.js B2B sample app demonstrating WSO2 Identity Server / Asgardeo IAM integration. It includes organization onboarding, role-based access control, travel policy management, flight booking, and an optional AI agent with agent authentication.

## Prerequisites

- Node.js 22 or later
- A [WSO2 Identity Server](https://wso2.com/identity-server/) instance or an [Asgardeo](https://wso2.com/asgardeo/) account, with a root organization

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the sample environment file:

```bash
cp .env.example .env.local
```

Then open `.env.local` and fill in the values for your WSO2 Identity Server / Asgardeo workspace:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_BASE_URL` | Your IAM provider's base URL — e.g. `https://api.asgardeo.io/t/<org-name>` (Asgardeo) or `https://localhost:9443` (WSO2 Identity Server) |
| `NEXT_PUBLIC_CLIENT_ID` | Client ID of your registered application |
| `CLIENT_SECRET` | Client secret — keep this server-side only, never use the `NEXT_PUBLIC_` prefix |
| `PARENT_ORGANIZATION_ID` | The UUID of your root organization |
| `APP_ID` | The application ID from the management console |
| `APP_DISPLAY_NAME` | The display name shown to users during onboarding |
| `NEXT_PUBLIC_ENHANCED_ORGANIZATION_AUTHENTICATION` | Set to `true` if **Enhanced organization authentication** is enabled for the application (Application → Edit → **Shared Access** tab). Defaults to `false`. |
| `NEXT_PUBLIC_ORGANIZATION_HANDLE_SUPPORTED` | Set to `true` if your IAM provider supports organization handles. When enabled, the onboarding wizard collects an organization handle and sends it as `orgHandle` when creating the organization. Defaults to `false`. |

The `NEXT_PUBLIC_SCOPES` and `ROOT_SCOPES` values in `.env.example` are pre-configured with the scopes required by the app. Update them only if you change the feature set.

Optionally, set `DB_PATH` to a custom SQLite file location (defaults to `data/app.db`).

### 3. Start the development server

```bash
npm run dev
```

Or, for a faster production build:

```bash
npm run build && npm run start
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Seed the flight catalog

The app uses a SQLite database for flight data. After the server is running, seed it with the initial flight catalog:

```bash
npm run seed:flights
```

This populates the database with flights across Economy, Premium Economy, Business, and First Class cabins. Flights are shared across all organizations — only bookings are org-scoped.

To reset and re-seed (e.g. if you want a clean slate):

```bash
npm run seed:flights -- --force
```

> The seed script is safe to run multiple times without `--force` — it exits early if data already exists.

### Resetting the database

To fully delete the database and its data folder, run:

```bash
npm run db:drop
```

The script reads `DB_PATH` from your environment (same as the app). If `DB_PATH` is not set, it removes the entire `data/` folder. If `DB_PATH` points to a custom location, only that file is deleted. After dropping, re-run `npm run seed:flights` to recreate the database.
