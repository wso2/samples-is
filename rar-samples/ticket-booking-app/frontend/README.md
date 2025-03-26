# Sample Application for Rich Authorization Requests (RAR) - Frontend

This sample demonstrates the basic usage of Rich Authorization Requests (RAR). The following configuration guide will help you set up the sample application's frontend.

## Table of Contents
 1. [Add a New Attribute `accountType` to the OIDC `profile` Scope](#add-a-new-attribute-accounttype-to-the-oidc-profile-scope)
 2. [Create a Single Page Application (SPA)](#create-a-single-page-application-spa)
 3. [Update `src/config.json` File](#update-srcconfigjson-file)

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
1. Navigate to the root directory.
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
