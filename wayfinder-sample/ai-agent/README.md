# Wayfinder Enterprise AI Agent

This folder contains an AI agent that demonstrates Asgardeo agent authentication with LangChain for the B2B Next.js app.

The agent authenticates with Asgardeo using agent credentials, receives an agent access token, and can call protected B2B APIs either as itself or on behalf of the signed-in user. The chat endpoint is available only to authenticated users.

## What It Demonstrates

- Authenticating an AI agent with Asgardeo
- Requesting an agent token through `@asgardeo/javascript`
- Switching the agent token into the signed-in user's organization for read-only travel-policy access
- Requesting delegated user authorization before creating bookings on the user's behalf
- Passing bearer tokens to the MCP server for general tool-backed conversations
- Loading MCP tools with `@langchain/mcp-adapters`
- Serving a `/chat` endpoint as a conversation interface 

## Local Configuration

Install dependencies:

```bash
cd ai-agent
npm install
```

Create a local environment file from the example:

```bash
cp .env.example .env
```

Then update the values in `.env` for your local setup. The example file documents the required values.

## Run Locally

Start your MCP server first, then run the AI agent service:

```bash
cd ai-agent
npm run dev
```

The dev command watches `agent.ts` and restarts the agent after code changes. Use `npm start` when you want a non-watching process.

The chat endpoint is available at:

```text
ws://localhost:8791/chat
```

The health endpoint is available at:

```text
http://localhost:8791/health
```

## B2B Tool Flow

The Next.js workspace includes a chat widget that connects to this agent only after the user signs in. The widget sends the user's access token during the WebSocket handshake. The agent extracts the token, reads its `org_id`, and uses that organization for the current chat.

For the autonomous-agent demo, the agent exchanges its own root agent token with Asgardeo's `organization_switch` grant using the signed-in user's `org_id` and the `view_travel_policy` scope. It then calls the B2B travel-policy and flight APIs directly with the switched agent token.

The chat endpoint supports two demo modes:

- Agent acting as itself: showing travel policy and eligible flights uses the switched agent token with `view_travel_policy`.
- Agent acting on behalf of the user: booking requests return an Asgardeo authorization URL with `requested_actor` set to the agent ID and `scope=create_booking`. The user approves it, Asgardeo redirects to `/obo/callback`, and the agent exchanges the returned code before creating the booking directly with the delegated user token.

Demo prompts:

```text
Show me the current travel policy for this organization.
```

```text
Book option 1.
```

```text
Book flight-nyc-lax-01.
```

## WebSocket Protocol

Connect to `/chat` and send either a plain text message:

```text
Add 45 and 99
```

Or a JSON payload:

```json
{
  "message": "Add 45 and 99"
}
```

The WebSocket upgrade must include a signed-in user's token. Browser clients pass it as the `bearer` WebSocket subprotocol; proxy or non-browser clients can pass `Authorization: Bearer <access-token>`.

If `mode` is omitted, the agent uses autonomous access for read-only travel-policy prompts and starts delegated authorization for booking prompts.

The server responds with JSON messages. A successful agent reply has this shape:

```json
{
  "type": "response",
  "message": "144"
}
```

The server can also send:

- `ready`: Sent after the WebSocket connection is established.
- `processing`: Sent after a message is accepted and before the agent response is ready.
- `error`: Sent when the message cannot be processed.

## Notes

- The MCP server must accept `Authorization: Bearer <access-token>` for general tool-backed paths.
- The WebSocket endpoint currently accepts text frames with either plain text or JSON payloads.
- The sample is intended for local demos and development. Do not commit real agent secrets, API keys, or local `.env` files.
