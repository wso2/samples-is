# Wayfinder Enterprise — B2B App with Next.js and Asgardeo

## Introduction

**Wayfinder Enterprise** is a multi-tenant B2B travel management platform. Corporate travel agencies and organizations sign up to create their own isolated workspace — each workspace is an Asgardeo sub-organization under the root. Workspace admins manage their team members, define travel policies, book flights, configure enterprise SSO, and customize their portal branding.

The app demonstrates the following Asgardeo B2B IAM capabilities:

- Self-service organization onboarding (sub-organization creation)
- Role-based access control across organizations
- Organization Switch grant for server-side org token exchange
- Subscription tier upgrades with dynamic application role sharing
- Enterprise IdP federation (OIDC) per organization
- Branding customization per organization
- User and permission management across organizations

### Organizational hierarchy

Each company that signs up through the Wayfinder Enterprise portal becomes a sub-organization under the root Asgardeo organization. Workspace admins and members are scoped to their organization.

```
Root Organization (Wayfinder Enterprise)
├── Northstar Labs          ← sub-organization
│   ├── Admin users
│   └── Member users
├── WSO2 APAC               ← sub-organization
│   ├── Admin users
│   └── Member users
└── ...
```

## Prerequisites

- An [Asgardeo](https://wso2.com/asgardeo/) account
- Node.js 22 or later and npm
- Git and a code editor

## Project Structure

```text
wayfinder-sample/
├── README.md                  # Main tutorial guide (this file)
└── webapp/                    # Next.js B2B app (port 3000)
    ├── app/                   # Next.js App Router pages and API routes
    ├── scripts/               # Database seed and drop scripts
    └── README.md              # Webapp-specific setup instructions
```

## Asgardeo Configuration Steps

### 1. Register the Application

1. Sign in to the [Asgardeo Console](https://console.asgardeo.io).
2. Navigate to **Applications** and click **New Application**.
3. Select **Standard-Based Application**.
4. Enter **Wayfinder** as the application name and click **Create**.
5. Navigate to the **General** tab, set the **Access URL** to `http://localhost:3000`, and click **Update**.
6. On the **Shared Access** tab, select **Share with all organizations** and **Do not share roles with all organizations** (roles will be shared selectively later). Click **Save**.

Make a note of the following from the created application — you will need them later:

- **Client ID** — from the **Protocol** tab
- **Client Secret** — from the **Protocol** tab
- **Application ID** — the UUID visible in the browser URL when viewing the application in the Asgardeo Console (e.g. `.../applications/<application-id>#tab=...`)

Also note the **Organization ID** of your root organization — click the organization name dropdown next to the Asgardeo logo in the top header and use the copy button beside the organization ID.

### 2. Configure the Application Protocol

1. Open the **Protocol** tab of the application.
2. Under **Allowed Grant Types**, enable:
   - Code
   - Client Credentials
   - Organization Switch
   - Token Exchange
3. Add `http://localhost:3000` as an **Authorized Redirect URL**.
4. Add `http://localhost:3000` to **Allowed Origins**.
5. Under **Access Token**, set **Token Type** to **JWT**.
6. Under **Access Token Attributes**, add `roles` as a claim.
7. Set **Token Binding Type** to **Client Request**.
8. Click **Update**.

### 3. Configure User Attributes

1. Open the **User Attributes** tab of the application.
2. Mark **Email** as a requested attribute.
3. Under **Profile**, mark **First Name** and **Last Name** as requested attributes.
4. Click **Update**.

### 4. Create the Wayfinder Enterprise API Resource

1. Navigate to **Resources** → **API Resources** in the side panel and click **New API Resource**.
Repeat the following for each of the four API resources below.

#### Flight Booking Service

- **Identifier:** `http://localhost:3000/api/bookings`
- **Display Name:** Flight Booking Service

| Scope | Display Name |
|---|---|
| `view_booking` | View Booking |
| `create_booking` | Create Booking |
| `delete_booking` | Delete Booking |

#### Travel Policy Management Service

- **Identifier:** `http://localhost:3000/api/travel-policies`
- **Display Name:** Travel Policy Management Service

| Scope | Display Name |
|---|---|
| `view_travel_policy` | View Travel Policy |
| `create_travel_policy` | Create Travel Policy |
| `update_travel_policy` | Update Travel Policy |
| `delete_travel_policy` | Delete Travel Policy |

#### Personalization Service

- **Identifier:** `http://localhost:3000/api/organization/branding`
- **Display Name:** Personalization Service

| Scope | Display Name |
|---|---|
| `create_basic_branding` | Create Basic Branding |
| `create_advanced_branding` | Create Advanced Branding |
| `delete_branding` | Delete Branding |

#### Upgrade Service

- **Identifier:** `http://localhost:3000/api/organization/upgrade`
- **Display Name:** Upgrade Service

| Scope | Display Name |
|---|---|
| `view_upgrade` | View Upgrade |
| `create_upgrade` | Create Upgrade |
| `update_upgrade` | Update Upgrade |
| `delete_upgrade` | Delete Upgrade |

### 5. Configure API Authorization

Open the **API Authorization** tab of the application and authorize the following APIs.

#### Organization APIs

| API | Scopes |
|---|---|
| SCIM2 Users API | List User, Create User, Update User, View User, Delete User |
| SCIM2 Roles API | View Role, Create Role, Update Role, Delete Role, Update Users of Role, Update Permissions of Role, Update Groups of Role |
| Identity Provider Management API | Create Identity Provider, View Identity Provider, Update Identity Provider, Delete Identity Provider |
| Application Management API | View Application, Update Application |
| Branding Preference Management API | Update Branding Preference |
| Userstore Management API | View Userstore |

#### Management APIs

| API | Scopes |
|---|---|
| Organization Management API | Create Organization, View Organization, Update Organization, Delete Organization |
| Application Management API | View Application |
| Shared Application Management API | Create Shared Application |

#### Business APIs

| API | Scopes |
|---|---|
| Flight Booking Service | All scopes |
| Travel Policy Management Service | All scopes |
| Personalization Service | All scopes |
| Upgrade Service | All scopes |

### 6. Create Application Roles

Navigate to **User Management → Roles** and create the following application roles. These roles are scoped to the Wayfinder Enterprise application.

#### Role: `WayFinder-Admin`

The primary workspace administrator role, shared with all organizations automatically.

| API Resource | Scopes |
|---|---|
| SCIM2 Users API | List User, Create User, Update User |
| SCIM2 Roles API | View Role, Create Role, Update Role, Delete Role, Update Users of Role, Update Permissions of Role, Update Groups of Role |
| Identity Provider Management API | View Identity Provider |
| Flight Booking Service | view_booking, create_booking, delete_booking |
| Travel Policy Management Service | view_travel_policy, create_travel_policy, update_travel_policy, delete_travel_policy |
| Upgrade Service | view_upgrade, create_upgrade, update_upgrade, delete_upgrade |

#### Role: `WayFinder-Member`

Standard workspace member role, shared with all organizations automatically.

| API Resource | Scopes |
|---|---|
| Flight Booking Service | view_booking, create_booking, delete_booking |
| Travel Policy Management Service | view_travel_policy |

#### Role: `IdP-Manager`

Allows configuring enterprise SSO. Shared with an organization when the admin upgrades to the **Advanced** tier.

| API Resource | Scopes |
|---|---|
| Identity Provider Management API | Create Identity Provider, View Identity Provider, Update Identity Provider, Delete Identity Provider |
| Application Management API | View Application, Update Application |
| Upgrade Service | view_upgrade |

#### Role: `Basic-Branding-Editor`

Allows basic portal branding. Shared with an organization when the admin upgrades to the **Basic** tier or higher.

| API Resource | Scopes |
|---|---|
| Branding Preference Management API | Update Branding Preference |
| Personalization Service | create_basic_branding, delete_branding |
| Upgrade Service | view_upgrade |

#### Role: `Advanced-Branding-Editor`

Allows full portal branding including logo and font customization. Shared when the admin upgrades to the **Advanced** tier.

| API Resource | Scopes |
|---|---|
| Branding Preference Management API | Update Branding Preference |
| Personalization Service | create_basic_branding, create_advanced_branding, delete_branding |
| Upgrade Service | view_upgrade |

### 7. Configure Role Sharing

1. Open the **Shared Access** tab of the application.
2. Select **Share the application with all organizations**.
3. Enable **Share a subset of roles with all organizations**.
4. Select the **WayFinder-Admin** and **WayFinder-Member** roles as the commonly shared roles.
5. Click **Save**.

> The `IdP-Manager`, `Basic-Branding-Editor`, and `Advanced-Branding-Editor` roles are shared dynamically when an organization admin upgrades their subscription tier through the app.

### 8. Configure Root Organization Branding (Optional)

1. Navigate to **Branding → Styles & Text** in the root organization.
2. Open the **Design** tab and expand **Images**:
   - **Logo URL:** URL to your Wayfinder Enterprise logo (e.g. hosted in your repository's `assets/` folder or a CDN)
   - **Logo Alt Text:** `Wayfinder Enterprise`
   - **Favicon URL:** URL to your favicon
3. Expand **Color Palette** and set the **Primary Color** to match your brand (e.g. `#2563EB`).
4. Click **Save & Publish**.

## Set Up the Applications

### webapp

See [webapp/README.md](webapp/README.md) for full setup instructions. Fill in the following values from the Asgardeo configuration above:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_ASGARDEO_BASE_URL` | `https://api.asgardeo.io/t/<your-org-name>` |
| `NEXT_PUBLIC_ASGARDEO_CLIENT_ID` | Client ID from step 1 |
| `ASGARDEO_CLIENT_SECRET` | Client Secret from step 1 |
| `ASGARDEO_PARENT_ORGANIZATION_ID` | Organization ID from step 1 |
| `ASGARDEO_APP_ID` | Application ID from step 1 |
| `ASGARDEO_APP_DISPLAY_NAME` | `Wayfinder` |

## Using the Application

### Sign Up a New Organization

1. Visit `http://localhost:3000`.
2. Click **Get Started** and then **Sign Up** on the landing page.
3. Fill in your name, email, password, and organization name.
4. After sign-up, the app creates a sub-organization in Asgardeo and adds the first user as a workspace admin.

### Sign In to an Existing Organization

1. Visit `http://localhost:3000`.
2. Click **Sign In**.
3. Enter your organization name and click **Submit**.
4. Log in with your workspace credentials.

Alternatively, navigate directly to `http://localhost:3000/?orgId=<org-id>` to pre-populate the organization selection.

### Configure Enterprise SSO for an Organization (Optional)

Organization admins can connect their own corporate identity provider (IdP) so their team members can sign in with existing credentials. The Wayfinder Enterprise app provides a UI to create the IdP, but the following additional steps must be completed in the Asgardeo Console inside the sub-organization.

#### Create the Identity Provider

The app's **Enterprise IdP** page creates the identity provider automatically when the admin provides:

- **Name** — a display name for the IdP
- **Client ID** and **Client Secret** — from the external IdP
- **Authorization Endpoint URL**
- **Token Endpoint URL**
- **JWKS URL**
- **Logout URL**

#### Configure the IdP in the Asgardeo Console

After the IdP is created, switch to the sub-organization in the Asgardeo Console and complete the following steps.

1. Navigate to **Connections** in the side panel and open the created IdP.
2. Go to the **Settings** tab and add the following scopes to the **Requested Scopes** field:
   - `email`
   - `profile`
   - `groups`
3. Click **Save**.
4. Go to the **Advanced** tab, enable **Account Linking**, and configure the following federated-to-local attribute mapping:
   - Federated attribute: `email`
   - Local attribute: `username`
5. Click **Save**.

#### Set Up Group-Based Role Mapping

To automatically assign Wayfinder roles to federated users based on their IdP groups:

1. Go to the **Groups** tab of the IdP and create groups that correspond to the Wayfinder roles, for example:
   - `wayfinder-admins` → maps to `WayFinder-Admin`
   - `wayfinder-members` → maps to `WayFinder-Member`
2. Navigate to **User Management → Roles** in the side panel.
3. For each role, open the **Groups** tab and assign the corresponding IdP group. When a federated user logs in, Asgardeo matches their IdP group to the role automatically.

> The IdP creation and group-to-role mapping steps can also be fully automated through the Asgardeo Management APIs to provide a seamless in-app setup experience.
