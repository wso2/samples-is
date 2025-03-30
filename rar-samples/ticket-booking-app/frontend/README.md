# Sample Application for Rich Authorization Requests (RAR) - Frontend

This sample demonstrates the basic usage of Rich Authorization Requests (RAR). The following configuration guide will help you set up the sample application's frontend.

## Table of Contents
 1. [Add a New Attribute `accountType` to the OIDC `profile` Scope](#add-a-new-attribute-accounttype-to-the-oidc-profile-scope)
 2. [Create a Single Page Application (SPA)](#create-a-single-page-application-spa)
 3. [Update `src/config.json` File](#update-srcconfigjson-file)
 3. [Run the Application](#run-the-application)

## Add a New Attribute `accountType` to the OIDC `profile` Scope

Follow these steps to create a new attribute `accountType` in WSO2 Identity Server and add it to the OIDC profile scope using the new console:

### Step 1: Create the `accountType` Attribute
1. Log in to the WSO2 Identity Server Management Console (`https://<IS_HOST>:<PORT>/console`).
2. Go to **User Attributes & Stores** > **Attributes** > **Attributes**.
3. Click **New Attribute**.
4. Fill in the following details:
    - **Attribute Name**: `accountType`
    - **Display Name**: `Account Type`
5. Click **Finish** to create the new attribute.
6. Scroll to the bottom of the **General** tab. Under the **Attribute Configurations** section, enable the checkbox labeled **Display** to make the attribute visible in the **Administrator Console**.
7. Click **Update** to persist the configurations.

### Step 2: Add `accountType` to the OIDC `profile` Scope
1. Navigate to **User Attributes & Stores** > **Attributes** > **OpenID Connect** > **Scopes** > **Profile**.
2. Click **New Attribute** and select **accountType** from the attribute list.
6. Click **Save Changes** to update the scope.

## Create a Single Page Application (SPA)

Follow these steps to create a Single Page Application (SPA) in WSO2 Identity Server and configure it to request the `accountType` claim:

### Register the SPA
1. Log in to the WSO2 Identity Server Management Console (`https://<IS_HOST>:<PORT>/console`).
2. Go to **Applications** > **New Application**.
3. Select **Single Page Application** as the application type.
4. Fill in the following details:
    - **Name**: Provide a name for your application (e.g., `RAR Sample App Frontend`).
    - **Authorized redirect URLs**: Add the redirect URL(s) for your application (e.g., `https://localhost:3000`).
5. Click **Create** to create the application.

### Configure Requested User Claims
1. After registering the application, navigate to the **User Attributes** tab of the application.
2. Under the **Profile** section, ensure the `accountType` scope is selected as requested.
5. Click **Update** to update the application configuration.

### Register the API Resources

Follow these steps to register the `booking_creation` authorization details for the API resource and associate it with your application:

#### Step 1: Create the API Resource
Use the following `curl` command to create an API resource for the `Ticket Booking API`:

```bash
curl --location 'https://localhost:9443/api/server/v1/api-resources' \
--header 'Content-Type: application/json' \
--header 'Authorization: Basic YWRtaW46YWRtaW4=' \
--data '{
    "name": "Ticket Booking API",
    "identifier": "booking_api",
    "description": "Payments API representation",
    "requiresAuthorization": true,
    "authorizationDetailsTypes": [
        {
            "type": "booking_creation",
            "name": "Booking Creation Type",
            "description": "Booking creation authorization details type",
            "schema": {
                "type": "object",
                "required": [
                    "type",
                    "bookingType"
                ],
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": [
                            "booking_creation"
                        ]
                    },
                    "bookingType": {
                        "type": "string",
                        "enum": [
                            "film",
                            "concert"
                        ]
                    },
                    "allowedAmount": {
                        "type": "object",
                        "properties": {
                            "currency": {
                                "type": "string",
                                "minLength": 3
                            },
                            "limit": {
                                "type": "number"
                            }
                        }
                    }
                }
            }
        }
    ]
}'
```

#### Step 2: Retrieve the API Resource ID
After creating the API resource, note down the `id` of the newly created resource from the response.

#### Step 3: Retrieve the Application ID
Run the following `curl` command to retrieve the application ID. Replace `<URL_ENCODED_APP_NAME>` with the URL-encoded name of your application (e.g., `RAR%20Sample%20App%20Frontend`):

```bash
curl --location 'https://localhost:9443/api/server/v1/applications?filter=name+eq+<URL_ENCODED_APP_NAME>' \
--header 'Authorization: Basic YWRtaW46YWRtaW4='
```

From the response, copy the `id` of your application.

#### Step 4: Authorize the API Resource for the Application
Use the following `curl` command to authorize the created API resource for your application. Replace `<APPLICATION_ID>` with the application ID and `<API_RESOURCE_ID>` with the API resource ID retrieved earlier:

```bash
curl --location 'https://localhost:9443/api/server/v1/applications/<APPLICATION_ID>/authorized-apis' \
--header 'Content-Type: application/json' \
--header 'Authorization: Basic YWRtaW46YWRtaW4=' \
--data '{
    "id": "<API_RESOURCE_ID>",
    "policyIdentifier": "RBAC",
    "authorizationDetailsTypes": [
        "booking_creation"
    ]
}'
```

By completing these steps, the `Ticket Booking API` will be registered and authorized for your application with the `booking_creation` authorization details type.

## Update `src/config.json` File

Follow these steps to update the `src/config.json` file with the necessary configuration details:

1. Open the `src/config.json` file in your project directory.
2. Update the file with the following key-value pairs:

```json
{
    "clientId": "<CLIENT_ID>",
    "baseUrl": "https://<IS_HOST>:<PORT>/t/<TENANT_DOMAIN>",
    "signInRedirectUrl": "https://<YOUR_APP_HOST>:<PORT>/callback",
    "signOutRedirectUrl": "https://<YOUR_APP_HOST>:<PORT>",
    "scope": "openid profile",
    "resourceServerUrls": [
        "https://<RESOURCE_SERVER_HOST>:<PORT>/api/resource1",
        "https://<RESOURCE_SERVER_HOST>:<PORT>/api/resource2"
    ]
}
```

3. Replace the placeholders with your actual values:
     - `<CLIENT_ID>`: The client ID of your SPA registered in WSO2 Identity Server.
     - `<IS_HOST>`, `<PORT>`, and `<TENANT_DOMAIN>`: The hostname, port and tenant domain of your WSO2 Identity Server.
     - `<YOUR_APP_HOST>` and `<PORT>`: The hostname and port of your frontend application.
     - `<RESOURCE_SERVER_HOST>` and `<PORT>`: The hostname and port of your resource server, followed by the specific API paths.

4. Save the changes to the `src/config.json` file.

## Run the Application

Follow these steps to install dependencies, start the server, and access the frontend application:

### Step 1: Install Dependencies
1. Navigate to the `samples-is/rar-samples/ticket-booking-app/frontend` directory.
2. Install the required dependencies using `npm`:
    ```bash
    npm install
    ```

### Step 2: Start the Development Server
1. Start the development server:
    ```bash
    npm start
    ```
2. The application will be served at `http://localhost:3000` by default.

### Step 3: Access the Application
1. Open a web browser and navigate to:
    ```
    http://localhost:3000
    ```
2. You should now see the frontend application running.
