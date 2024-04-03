# B2B PetVet Sample Application Setup Guide

## Prerequisites:
1. Install Ballerina 2201.5.0 https://dist.ballerina.io/downloads/2201.5.0/ballerina-2201.5.0-swan-lake-macos-arm-x64.pkg
2. Install Node 16 LTS (Tested in v16.13.0).
3. Clone https://github.com/wso2/samples-is and the sample will be in the petcare-sample directory.

## Deploy API Services
1. Navigate to <PROJECT_HOME>/petcare-sample/b2b/web-app/petvet/apis/ballerina/channel-service and start the channel 
   service by executing the following command in the terminal.
    ```
    bal run
    ```
2. Navigate to <PROJECT_HOME/>petcare-sample/b2b/web-app/petvet/apis/ballerina/pet-management-service and start the 
   pet management service by executing the following command in the terminal.
    ```
    bal run
    ```
3. Navigate to <PROJECT_HOME>/petcare-sample/b2b/web-app/petvet/apis/ballerina/personalization-service and start 
   the personalization service by executing the following command in the terminal.
    ```
    bal run
    ```

> [!NOTE]
> By default, the services store the data in memory. They can be connected to a MySQL databases. Create a `Config.toml` file in the root folder of each service component and add the relevant DB configurations to the `Config.toml` files. Create tables for MYSQL databases using the schemas located in `<PROJECT_HOME>/petcare-sample/b2b/web-app/petvet/dbscripts` directory.

```
dbHost = "<DB_HOST>" 
dbUsername = "<DB_USERNAME>" 
dbPassword = "<DB_USER_PASSWORD>" 
dbDatabase = "<DB_NAME>" 
dbPort = "<DB_PORT>"
```

## Create Organization in WSO2 Identity Server
1. Sign in to WSO2 Identity Server Console of the primary organization.
2. Create a sub-organization named `City Vet Hospital` from the `Organizations` section and switch to the sub-organization.
3. Add a new user. You can use ‘admin@cityvet.com’ as the username of the user.

## Configure Branding in the sub-organization
1. In the sub organization, navigate to the `Styles & Text` section under the `Branding` section.
2. Set the following properties. 
   1. Navigate to `Design` Tab, expand the `Images` and add the following URL as the Logo URL.
      ```
      https://user-images.githubusercontent.com/35829027/241967420-9358bd5c-636e-48a1-a2d8-27b2aa310ebf.png
      ```
   2. Add the `Logo Alt Text` as `Pet Care App Logo`.
   3. Add the `Favicon URL` as 
      ```
      https://user-images.githubusercontent.com/1329596/242288450-b511d3dd-5e02-434f-9924-3399990fa011.png
      ```
   4. Expand the `Color Palette` and add `#4f40ee` as the `Primary Color`.

## Create API Resources
1. Switch back to the primary organization and navigate to the API Resources section.
2. Create the Channel Service API resource by clicking the New API Resources.
   1. Identifier - http://localhost:9091
   2. Display Name - Channel Service
   3. Permissions
      1. list_doctors
      2. create_doctor
      3. view_doctor
      4. update_doctor 
      5. delete_doctor
      6. list_bookings 
      7. view_appointment 
      8. view_profile 
      9. create_bookings 
      10. view_booking 
      11. update_booking 
      12. delete_booking 
      13. view_org_info 
      14. update_org_info
3. Create the Pet Management Service API resource.
   1. Identifier - http://localhost:9092
   2. Display Name - Pet Management Service
   3. Permissions
      1. list_pets 
      2. create_pet 
      3. view_pet 
      4. update_pet 
      5. delete_pet 
      6. view_user_settings 
      7. update_user_settings
4. Create the Personalization Service API resource.
   1. Identifier - http://localhost:9093
   2. Display Name - Personalization Service
   3. Permissions
      1. create_branding
      2. update_branding
      3. delete_branding

## Create an Application in WSO2 Identity Server
1. Create an OIDC standard based application named `Pet Care App` in primary organization.
2. Share it with the created sub-organization named as `City Vet Hospital`.
3. Navigate to the `Protocol` tab and do the followings.
4. Select the following allowed grant types.
   1. Refresh token 
   2. Code 
   3. Organization switch
5. Add the following Authorized Redirect URLs
   1. http://localhost:3002
   2. http://localhost:3002/api/auth/callback/wso2isAdmin
6. Add the following Allowed Origins
   1. http://localhost:3002
7. Enable app as a public client.
8. Select Access token type as JWT.
9. Click on Update.
10. Navigate to `User Attributes` tab of the created application and mark Email, First Name, Last Name and Roles as 
    requested attributes.
11. Click on Update.
12. Navigate to `API Authorization` tab and authorize the following API resources for the application with all the 
    scopes. When subscribing / authorizing to APIs make sure to subscribe to Organizational APIs. 
    Not the Management APIs (https://is.docs.wso2.com/en/latest/apis/)
    1. SCIM2 Users API - /o/scim/Users 
    2. SCIM2 Roles API - /o/scim2/Roles 
    3. SCIM2 Groups API - /o/scim2/Groups 
    4. Identity Provider Management API - /o/api/server/v1/identity-providers 
    5. Application Management API - /o/api/server/v1/applications 
    6. Claim Management API - /o/api/server/v1/claim-dialects 
    7. Branding Preference Management API - /o/api/server/v1/branding-preference 
    8. Channel Service 
    9. Pet Management Service 
    10. Personalization Service
13. In the `Roles` tab, change role audience to Application.
14. Navigate to the `Login Flow` tab and add the following conditional authentication script.
    ```dtd
    var onLoginRequest = function(context) {
       executeStep(1, {
           authenticationOptions: [{
               idp: (context.request.params.orgId && !context.steps[1].idp) ? "SSO" : context.steps[1].idp
           }]
       }, {
           onSuccess: function(context) {
               Log.info("User successfully completed initial with IDP : " + context.steps[1].idp);
           }
       });
    };
    ```

## Create Roles
1. Navigate to Roles section under User Management and create 3 application roles for admin, doctor and pet owner 
   with the following details.
   1. Role name: pet-care-admin
      1. SCIM2 Users API - All Scopes
      2. SCIM2 Roles API - All Scopes
      3. SCIM2 Groups API - All Scopes
      4. Identity Provider Management API - All Scopes
      5. Application Management API - All Scopes
      6. Claim Management API - All Scopes
      7. Branding Preference Management API - All Scopes
      8. Channel Service
         1. list_doctors
         2. view_org_info
         3. update_org_info
         4. create_doctor
      9. Personalization Service
         1. create_branding
         2. update_branding
         3. delete_branding
   2. Role name: pet-care-doctor
      1. Channel Service
         1. view_profile 
         2. list_bookings 
         3. view_doctor 
         4. update_doctor
      2. Pet Management Service
         1. List_pets
   3. Role name: pet-care-pet-owner
      1. Channel Service
         1. list_bookings 
         2. list_doctors 
         3. view_doctor 
         4. create_bookings 
      2. Pet Management Service
         1. create_pet 
         2. view_pet 
         3. list_pets
2. Add the admin user created (`admin@cityvet.com`) in the sub-organization to the pet-care-admin role by 
   switching to the sub-organization.

## Deploy the Front End Application
1. Navigate to <PROJECT_HOME>/petcare-sample/b2b/web-app/petvet/web/nextjs/apps/business-admin-app, create a `.env` 
   file and add the followings to the `.env` file.
   ```dtd
   NEXTAUTH_URL=http://localhost:3002
   BASE_URL=https://localhost:9443
   BASE_ORG_URL=https://localhost:9443/t/<PRIMARY_ORG_NAME>
   CHANNELLING_SERVICE_URL=http://localhost:9091
   PET_MANAGEMENT_SERVICE_URL=http://localhost:9092
   PERSONALIZATION_SERVICE_URL=http://localhost:9093
   HOSTED_URL=http://localhost:3002
   SHARED_APP_NAME="Pet Care App"
   CLIENT_ID=<CLIENT_ID_OF_PET_CARE_APP>
   CLIENT_SECRET=<CLIENT_SECRET_OF_PET_CARE_APP>
   NODE_TLS_REJECT_UNAUTHORIZED=0
   ```
   
2. Start the application from <PROJECT_HOME>/petcare-sample/b2b/web-app/petvet/web/nextjs
    ```dtd
    npm install
    npx nx serve business-admin-app
    ```
   
3. Visit the sample application at http://localhost:3002. 
4. Optionally, visit the http://localhost:3002?orgId=<suborg_Id> to directly visit the sub-organization login.
