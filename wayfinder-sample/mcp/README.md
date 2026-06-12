# Wayfinder Enterprise MCP Server

This server exposes B2B sample app capabilities as MCP tools for the AI agent.

## Tools

- `get_travel_policy`: Reads the active organization travel policy.
- `get_current_access_context`: Reads the current authenticated subject, actor, roles, organization, and scopes from the access token.
- `update_travel_policy`: Updates selected travel policy fields.
- `list_organization_users`: Lists organization users.
- `invite_organization_user`: Invites an employee.
- `list_organization_roles`: Lists roles and user assignments.
- `search_enterprise_flights`: Searches available flight options from the Wayfinder booking database.
- `list_flight_bookings`: Lists flight bookings visible to the authenticated user.
- `create_flight_booking`: Creates a flight booking for the authenticated user.

## Local Setup

```bash
cd mcp
npm install
cp .env.example .env
npm run dev
```

The default endpoint is:

```text
http://localhost:8001/mcp
```

The AI agent forwards its Asgardeo agent token to this server. The MCP server then forwards that token to protected Next.js API routes.
