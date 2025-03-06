# Pin-Based Authentication Service

This is a Node.js Express-based authentication service that provides a PIN-based authentication mechanism. The service can run locally and is designed to work in both federated and internal authentication modes, with support for second-factor authentication.

**Note:** This is a sample authentication service designed to demonstrate the **service-based custom authenticator feature** of WSO2 Identity Server. It is intended solely for testing and should not be used in production environments.

## Features

- PIN-based authentication mechanism
- Session persistence using an **in-memory map**
- Supports **federated**, **internal**, and **second-factor** authentication
- Compatible with **Vercel** and **local environments**

## Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (>=14.x)
- **npm**

## Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/wso2/samples-is.git
cd service-extensions/custom-authentication-service/express
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the project root with the following:

```env
AUTH_MODE=federated  # Options: federated, internal, second_factor
BASE_WSO2_IAM_PROVIDER_URL=https://localhost:9443
```

- `AUTH_MODE`: Defines whether the service operates as a **federated authenticator**, an authenticator for **internally managed users**, or a **second-factor authentication service**.
  - If `AUTH_MODE` is `federated` or `internal`, the authenticator prompts for **username and PIN**.
  - If `AUTH_MODE` is `second_factor`, the authenticator prompts for **PIN only**, and authenticates the user provided in the request from WSO2 Identity Server with PIN.
- `BASE_WSO2_IAM_PROVIDER_URL`: Specifies the **host origin** of the running WSO2 Identity Server instance.

### 4️⃣ Add Users for Authentication

Before running the service, define the users that need to be authenticated.

Create a `users.json` file inside the `data/` directory with the following structure:

```json
{
  "federated": [
    {
      "id": "5d009575-8962-4402-94ae-0b14ec0a8d31",
      "username": "emily",
      "pin": "1234",
      "data": {
        "id": "1234",
        "claims": [
          { "uri": "http://wso2.org/claims/emailaddress", "value": "emily@aol.com" },
          { "uri": "http://wso2.org/claims/lastname", "value": "Ellon" },
          { "uri": "http://wso2.org/claims/givenname", "value": "Emily" }
        ]
      }
    }
  ],
  "internal": [
    {
      "id": "8a2b49b5-91fa-4f3b-b2d8-d12f7f77dcaa",
      "username": "peter",
      "pin": "5678",
      "data": {
        "id": "5678",
        "claims": [
          { "uri": "http://wso2.org/claims/emailaddress", "value": "peter@aol.com" },
          { "uri": "http://wso2.org/claims/lastname", "value": "Parker" },
          { "uri": "http://wso2.org/claims/givenname", "value": "Peter" }
        ]
      }
    }
  ]
}
```

- **Internal users**: Ensure that you have users in **WSO2 Identity Server** matching the `id` and `username` fields.
- **Federated users**: External users **do not** need to be pre-registered in Identity Server.
- To authenticate, use the username and PIN specified in this file to ensure successful authentication.

### 5️⃣ Run the Service Locally

```bash
node api/index.js
```

The service will be available at: **[http://localhost:3000](http://localhost:3000)**

### 6️⃣ Verify the Service

Run a health check to ensure the service is running:

```bash
curl http://localhost:3000/api/health
```

Expected Response:

```json
{ "status": "ok", "message": "Service is running." }
```

### 7️⃣ Configure the Authenticator in WSO2 Identity Server

To integrate this authentication service with WSO2 Identity Server, follow the step-by-step guide at the [documentation](https://is.docs.wso2.com/en/next/guides/service-extensions/in-flow-extensions/custom-authentication/) to configure the authenticator.

When configuring the authenticator, consider the following:

1. Select the appropriate authenticator type based on the `AUTH_MODE` configured in the environment variables:

   - External (Federated) User Authentication
   - Internal User Authentication
   - 2FA Authentication

2. Set the authentication endpoint to your deployed service URL:
   - If running locally: http://localhost:3000/api/authenticate
   - If deployed in Vercel: https://your-vercel-app.vercel.app/api/authenticate

Configure user attributes to be shared with the application. Ensure that the attributes retrieved from the authenticator are correctly mapped to the application’s requirements.

Once configured, WSO2 Identity Server will utilize this service for PIN-based authentication.

## API Endpoints

### 🔹 **Health Check**

This endpoint is to check if the service is successfully running.

- **GET** `/api/health`
- **Response:** `{ "status": "ok", "message": "Service is running." }`

### 🔹 **Authenticate User**

This is the endpoint that will receive requests from the Identity Server for user authentication.

- **POST** `/api/authenticate`
- **Request Body:**

```json
{
  "flowId": "1234",
  "event": {
    "tenant": { "name": "example.com" },
    "user": { "id": "5678" }
  }
}
```

- **Response:**

```json
{
  "actionStatus": "INCOMPLETE",
  "operations": [{ "op": "redirect", "url": "http://localhost:3000/api/pin-entry?flowId=1234" }]
}
```

### 🔹 **PIN Entry Page**

This is a page with a form to collect username and the PIN.

- **GET** `/api/pin-entry?flowId=1234`
- **Returns:** HTML page for entering PIN.

### 🔹 **Validate PIN**

This endpoint checks if a user exists for the given username and the PIN.

- **POST** `/api/validate-pin`
- **Request Body:**

```json
{
  "flowId": "1234",
  "userId": "5678",
  "pin": "1234",
  "tenant": "example.com"
}
```

- **Response:**

```json
{
  "redirectingTo": "https://localhost:9443/t/example.com/commonauth?flowId=1234"
}
```

## Deployment

To deploy to **Vercel**, follow these steps:

```bash
vercel --prod
```

### Vercel Configuration Steps

1. **Set Environment Variables**:

   - In Vercel, go to **Project Settings → Environment Variables**.
   - Add `AUTH_MODE` with the preferred authenticator type (`federated`, `internal`, or `second_factor`).
   - Add `USER_CONFIG` by converting the `users.json` file into a compact string:
     ```bash
     cat data/users.json | jq -c
     ```
     Copy and paste the output as the value for `USER_CONFIG` in Vercel.

2. **Disable Vercel Authentication**:

   - Go to **Project Settings → Deployment Protection**.
   - Turn **off** Vercel Authentication to make the service publicly accessible.
   - This step is required so that WSO2 Identity Server can access the authentication service.

3. **Deploy to Vercel**:

    ```bash
    vercel --prod
    ```
