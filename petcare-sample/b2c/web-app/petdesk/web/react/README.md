# B2C PetDesk Sample Application Setup Guide

## Prerequisites:
1. Install Ballerina 2201.5.0 https://dist.ballerina.io/downloads/2201.5.0/ballerina-2201.5.0-swan-lake-macos-arm-x64.pkg
2. Install Node 16 LTS (Tested in v16.13.0).
3. Clone https://github.com/wso2/samples-is and the sample will be in the petcare-sample/b2c directory.

## Deploy API Services
1. Navigate to <PROJECT_HOME>/petcare-sample/b2c/web-app/petdesk/apis/ballerina/pet-management-service and start the 
   pet management service by executing the following command in the terminal.
    ```
    bal run
    ```
2. Navigate to <PROJECT_HOME>/petcare-sample/b2c/web-app/petdesk/apis/ballerina/billing-management-service and start the 
   pet management service by executing the following command in the terminal.
    ```
    bal run
    ```
    
    
> [!NOTE]
> By default, the service stores the data in memory. It can be connected to a MySQL database. Create a `Config.toml` file in the root folder of the service component and add the relevant DB configurations to the `Config.toml` files. Create MySQL database tables using the schemas located in `<PROJECT_HOME>/petcare-sample/b2c/web-app/petdesk/dbscripts directory`.

```
dbHost = "<DB_HOST>" 
dbUsername = "<DB_USERNAME>" 
dbPassword = "<DB_USER_PASSWORD>" 
dbDatabase = "<DB_NAME>" 
dbPort = "<DB_PORT>"
```

## Create an Application in WSO2 Identity Server
1. Create a Single-Page Application named `Pet Desk App` in root organization.
2. Add the `Authorized redirect URLs` as `http://localhost:5173`.
3. Go to the `Protocol` tab and copy the `Client ID`.
4. Select `Access token` type as `JWT`.

## Deploy the Front End Application
1. Navigate to <PROJECT_HOME>/petcare-sample/b2c/web-app/petdesk/web/react and update the configuration file 
   `config.js` with the registered app details.
   
   ```
    baseUrl: "https://localhost:9443",
    clientID: "<CONFIGURED_SPA_CLIENT_ID>",
    signInRedirectURL: "http://localhost:3000",
    signOutRedirectURL: "http://localhost:3000",
    petManagementServiceURL: "http://localhost:9090",
    billingServerURL: "http://localhost:9091",
    salesforceServerURL: "http://localhost:9092",
    scope: ["openid", "email", "profile"]
    myAccountAppURL: "<MY_ACCOUNT_URL>",
    enableOIDCSessionManagement: true
   ```
2. Run the application by executing the following command in the terminal.
    ```
    npm install
    npm start
    ```
3. Visit the sample application at http://localhost:3000. 
