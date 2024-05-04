# Pet Management Application User Guide

The Pet Management Application is a B2C (Business-to-Consumer) application that allows users to easily register and manage their pets. Users can enter vital information such as their pets' basic information and vaccination records into the app. They can then set up email alerts for their pets' upcoming vaccination dates. 

There are two ways that you can run this sample application

- [Using Cloud Deployment](#using-cloud-deployment)
- [Run Locally](#run-locally)

# Using Cloud Deployment

This guide will show you how to use [Asgardeo](https://wso2.com/asgardeo/), WSO2's SaaS Customer IAM (CIAM) solution to secure user authentication to the web application and add CIAM features to your web application. Also to use [Choreo](https://wso2.com/choreo/) to expose a service endpoint as a REST API and safely consume the API from a web application.
&nbsp;<br>

---
&nbsp;<br>
# Step 1: Configure Asgardeo

## Step 1.1: Configure Asgardeo to integrate with your web application

1. Access **Asgardeo** at https://console.asgardeo.io/ and log in. 
2. Click **Applications** in the left navigation menu.
3. You can see the application you have created before.
4. Click the `New Application` and select `Single-Page Application`. Provide the name and Authorized redirect URLs as follows.
&nbsp;<br>
Name: `Pet Management App` &nbsp;<br>
Authorized redirect URLs: https://localhost:3000 (This will be updated with the App hosted URL in a future step)&nbsp;<br>
5. Click the **Protocol** tab.
6. Scroll down to the **Allowed grant types** and tick **Refresh Token** and **Code**.
7. Tick **Public client** on the next section.
8. Use **Web App URL** in the step 3.3 as the **Authorized redirect URLs** and **Allowed origins**.
9. Keep the rest of the default configurations and click **Update**.
10. Go to the **User Attributes** tab.
11. Tick on the **Email** section.
12. Expand the **Profile** section.
13. Add a tick on the Requested Column for the **Full Name** and click **Update**.
14. Then go to the **Sign-In Method** tab.
15. Configure **Google login** as described in https://wso2.com/asgardeo/docs/guides/authentication/social-login/add-google-login/
16. As shown in the below, add **Username & Password** as an **Authentication** step.

![Alt text](readme-resources/sign-in-methods.png?raw=true "Sign In Methods")

## Step 1.2: Enable features in Asgardeo

1. [Branding and theming](https://wso2.com/asgardeo/docs/guides/branding/configure-ui-branding/)
    - On the **Asgardeo Console**, click **Branding** > **Styles & Text** in the left navigation menu.
    - Go to **General** tab and enter the **site title** as `Pet Management App`.
    - You can provide values to **Copyright Text** and **Contact Email**.
    - Go to the **Design** tab and choose layout as **Centered**.
    - Choose the **Light** theme.
    - Go to **Theme preferences > Images** and enter logo url https://github.com/wso2/samples-is/assets/27746285/9b37d814-dcb8-4838-8435-603ef9ee88ed
    - Enter **Favicon url** https://github.com/wso2/samples-is/assets/27746285/b11e7c0e-64b5-4028-a884-2d24fe4a6ed2
    - Go to **Color Pallet** and choose primary color as **#69a2f4**
    - Keep other options as default
    - Click **Save**.
    
2. [Configure password recovery](https://wso2.com/asgardeo/docs/guides/user-accounts/password-recovery/)
    - On the **Asgardeo Console**, click **Account Recovery** in the left navigation menu.
    - Go to **Password Recovery**.
    - Click **Configure** to open the Password Recovery page.
    - Turn on **Enabled** to enable this configuration.
    
3. [Self registration](https://wso2.com/asgardeo/docs/guides/user-accounts/configure-self-registration)
    - On the **Asgardeo Console**, click **Self Registration** in the left navigation menu.
    - Click **Configure**.
    - **Enable** self registration toggle.
    - Tick **Account verification** and then click the **Update** button.
    
4. [Configure login-attempts security](https://wso2.com/asgardeo/docs/guides/user-accounts/account-security/login-attempts-security/#enable-login-attempts-security)    
    - On the **Asgardeo Console**, click **Account Security** in the left navigation menu.
    - Click **Configure** to open the **Login Attempts** page.
    - Turn on **Enabled** to enable this configuration.
    
&nbsp;<br>

# Step 2: Deploy the Pet Management Web application

## Step 2.1: Configure the front-end application

In this step, you are going to deploy the pet management front-end application in Choreo.

1. Navigate to **Choreo Console**. (Use the same organization that was used for Asgardeo)
2. Navigate to the **Components** section from the left navigation menu.
3. Click on the **Create** button.
4. Click on the **Create** button in the **Web Application** Card.
5. Enter a unique name and a description for the Web Application. For example you can provide the following sample values.

    | Field | Value |
    | -------- | -------- |
    | Name | Pet Management Web App |
    | Description | Web application for managing your pets. |

6. Click on the **Next** button.
7. To allow Choreo to connect to your **GitHub** account, click **Authorize with GitHub**.
8. In the Connect Repository dialog box, enter the following information:

    | Field | Value |
    | -------- | -------- |
    | GitHub Account | Your account |
    | GitHub Repository | samples-is |
    | Branch | main |
    | Build Preset | Click **React SPA** since the frontend is a React application built with Vite |
    | Build Context Path | /petcare-sample/b2c/web-app/petdesk/web/react |
    | Build Command | npm install && npm run build|
    | Build Output |/build|
    | Node Version |18|

10. Click on the **Create** button.
11. The Web Application opens on a separate page where you can see its overview.

## Step 2.2: Build the front-end application

1. Navigate to **Build** section on the left navigation menu.
2. Click **Build Latest** to build the application.
3. Check whether the web application build is successful.

## Step 2.3: Deploy the front-end application

1. Navigate to **Deploy** section on the left navigation menu.
2. Click **Configure & Deploy** on the **Build Area**. (Use the dropdown next to Build button to view the **Configure & Deploy** option)
3. Add the configurations to the right side panel as shown below

Configuration File Name: config.js

```
window.config = {
    baseUrl: "https://api.asgardeo.io/t/<your-org-name>",
    clientID: "<asgardeo-client-id>",
    signInRedirectURL: "<web-app-url>",
    signOutRedirectURL: "<web-app-url>",
    petManagementServiceURL: "<pet-management-service-url>",
    billingServerURL: "<billing-service-url>",
    salesforceServerURL: "<sales-force-service-url>",
    scope: ["openid", "email", "profile"]
    myAccountAppURL: "<MY_ACCOUNT_URL>",
    enableOIDCSessionManagement: true
    };
   ```

4. Click **Next**
5. Keep the other configurations as default.
6. Click **Deploy**
7. When the application is deployed successfully you will get an url in the section **Web App URL**. Copy the **Web App URL**.
8. Click the **Manage Configs & Secrets** on the bottom of the deployment card.
9. On the Config-file you created, click the **edit icon** on the right side corner.
9. Copy and paste the **Web App URL** as the **signInRedirectURL** and **signOutRedirectURL** in the config.js.
10. Click **Save**.
11. Add the same **Web App URL** in the Asgardeo application


## Step 2.4: Update the configurations of the front-end application

Update the following configurations in the config.js file.

1. Navigate to Asgardeo
2. Click Applications on the left side panel
3. Open the **Pet Management Web App** application from the application list
4. Navigate to the **Quick Start** tab 

    - baseUrl
        - Open the **application**(`Pet Management App`) you created previously via **Developer Portal**.
        - Click **Production** Keys in the left navigation menu.
        - Go to the **Endpoints** section.
        - Copy and paste the **Token Endpoint** value and remove `/oauth2/token` part from the url. eg: https://api.asgardeo.io/t/{organization_name}

    - clientID
        - Open the **application**(`Pet Management App`) you created previously via **Developer Portal**.
        - Click **Production** Keys in the left navigation menu.
        - Copy and paste the value of the **Consumer Key**.

5. Update the **petManagementServiceURL**, **billingServerURL** and **salesforceServerURL** API resource URLs. (This will be updated in a future step)

&nbsp;<br>

# Step 4: Create and publish a Service

In this step, you will play the role of the API developer. You will create and publish the Service that the web application needs to consume. Before you proceed, sign in to [**Choreo Console**](https://console.choreo.dev/).

## Step 4.1: Create the Service

Let's create your first Service.
1. On the **Home** page, click on the project you created.
2. To add a new component, select **Components** from the left-side menu and click **Create**.
3. Click **Create** in the **Service** card.
4. Enter a unique name and a description for the Service. For example, you can enter the name and the description given below:

    | Field | Value |
    | -------- | -------- |
    | Name | Pet Management Service |
    | Description | Manage your pets |

5. To allow Choreo to connect to your GitHub account, click **Authorize with GitHub**.
6. If you have not already connected your GitHub repository to Choreo, enter your GitHub credentials, and select the repository you created by forking https://github.com/wso2/samples-is to install the Choreo GitHub App.
7. In the Connect Repository dialog box, enter the following information:

    | Field | Value |
    | -------- | -------- |
    | GitHub Account | Your account |
    | GitHub Repository | samples-is|
    | Branch | master |
    | Build Preset | Click **Ballerina** because you are creating the REST API from a Ballerina project and Choreo needs to run a Ballerina build to build it. |
    | Path | /petcare-sample/b2c/web-app/petdesk/apis/ballerina/pet-management-service |

8. Click **Create** to initialize a Service with the implementation from your GitHub repository.

The Service opens on a separate page where you can see its overview.

## Step 4.2: Deploy the Service

For the Service to be invokable, you need to deploy it. To deploy the Service, follow the steps given below:
1. Navigate to the **Choreo Console**. 
You will be viewing an overview of the Pet Management Service.
2. Navigate to the **Build** section from left menu and click **Build Latest**.
2. In the left pane, click **Deploy**, and then click **Configure & Deploy**.
3. In the **Configure & Deploy** pane, you will be asking to enter values for the **Defaultable Configurables**.
    - You can setup a **Mysql database** to store the service's data. This is **optional**, and if you do not specify database values, the service will save the data in memory. 

      <details><summary>If you are setting up <b>Mysql Database</b> click here</summary>
      <p>
      
      - Create a Mysql Database using the following database schema.
      
          ```sql
          CREATE DATABASE IF NOT EXISTS PET_DB;

          CREATE TABLE PET_DB.Pet (
              id VARCHAR(255) PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              breed VARCHAR(255) NOT NULL,
              dateOfBirth VARCHAR(255) NOT NULL,
              owner VARCHAR(255) NOT NULL
          );

          CREATE TABLE PET_DB.Vaccination (
              id INT AUTO_INCREMENT PRIMARY KEY,
              petId VARCHAR(255) NOT NULL,
              name VARCHAR(255) NOT NULL,
              lastVaccinationDate VARCHAR(255) NOT NULL,
              nextVaccinationDate VARCHAR(255),
              enableAlerts BOOLEAN NOT NULL DEFAULT 0,
              FOREIGN KEY (petId) REFERENCES Pet(id) ON DELETE CASCADE
          );

          CREATE TABLE PET_DB.Thumbnail (
              id INT AUTO_INCREMENT PRIMARY KEY,
              fileName VARCHAR(255) NOT NULL,
              content MEDIUMBLOB NOT NULL,
              petId VARCHAR(255) NOT NULL,
              FOREIGN KEY (petId) REFERENCES Pet(id) ON DELETE CASCADE
          );

          CREATE TABLE PET_DB.Settings (
              owner VARCHAR(255) NOT NULL,
              notifications_enabled BOOLEAN NOT NULL,
              notifications_emailAddress VARCHAR(255),
              PRIMARY KEY (owner)
          );
          ```
        
      - Make sure your database is publicly accessible and that your database service allows Choreo IP addresses. Please refer the guide [Connect with Protected Third Party Applications](https://wso2.com/choreo/docs/reference/connect-with-protected-third-party-applications/#connect-with-protected-third-party-applications) for more information.

      - Configure the following **Defaultable Configurables** after setting up the database.   

        | Field      |  Value |
        | ---------- | -------- |
        | dbHost     | Database Host. eg: mysql–instance1.123456789012.us-east-1.rds.amazonaws.com  |
        | dbUsername | Database username |
        | dbPassword | Database password |
        | dbDatabase | Database name. eg: PET_DB  |
        | dbPort     | Database port. eg: 3306|

      </p>
      </details>

    &nbsp;<br>
    - The Pet Management Service sends email to the users. This is **optional**, and if you specify email configurations here, it will use to send emails to the users. 

      <details><summary>If you are setting up <b>email</b> click here</summary>
      <p>
            
      - In order to send emails to the users, you need to create a client for the SMTP server. Here is a guide for setting up a SMTP client for the **GMail**.
        - You can generate a password for the email username using [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
        - Configure the following **Defaultable Configurables** for the email configuration.   

          | Field      |  Value |
          | ---------- | -------- |
          | emailHost     | SMTP Host. eg: smtp.gmail.com  |
          | emailUsername | Email address |
          | emailPassword | Email password (The app password generated in the above.) |
      
      </p>
      </details>

    &nbsp;<br>
4. Click **Next** on the **Defaultable Configurables** to deploy the service.
5. Click **Deploy**.

## Step 4.3: Update runtime settings

If you are not connecting the service to a MySQL database and storing the service's data in memory, then you must follow the steps below to ensure that only one container is running for the service.

1. Navigate to the **DevOps** section in the component and click **Runtime**.
2. Make the Min replicas and Max replicas count to **1** and click **Update**.
3. Click **Redeploy Release** button.

## Step 4.4: Update API settings

1. Navigate to the **Deploy** section in the component.
2. Go to the Set Up card and click **Endpoint Configurations**. This opens the Endpoint Configurations pane.
3. Select the **Pass Security Context To Backend** checkbox.
4. Optionally, specify an appropriate audience claim value for the backend service.
Click Apply.
5. To redeploy the component with the applied setting, go to the Set Up card and click Deploy.

## Step 4.5: Test the Service

Let's test the Pet Management Service via Choreo's Console by following the steps given below:
1. Navigate to the **Test** section in the component and click **Console**. This will open up the definition of the service.
2. Expand the **POST** method and click **Try it out**.
3. Update the request body as below:
    ``` 
    {
      "breed": "Golden Retriever",
      "dateOfBirth": "03/02/2020",
      "name": "Cooper",
      "vaccinations": [
        {
          "enableAlerts": true,
          "lastVaccinationDate": "03/01/2023",
          "name": "vaccine_1",
          "nextVaccinationDate": "07/17/2023"
        }
      ]
    }
    ```

4. Click **Execute**.
5. Check the Server Response section. On successful invocation, you will receive the **201** HTTP code.
Similarly, you can expand and try out the other methods.

## Step 4.6: Publish the Service

Now that yourService is tested, let's publish it and make it available for applications to consume.

1. Navigate to the **Manage** section of the channel service and click **Lifecycle**.
2. Click **Publish** to publish the Service to the **Developer Portal**. External applications can subscribe to the API via the Developer Portal.
3. To access the Developer Portal, click **Go to DevPortal** in the top right corner.
4. The Pet Management Service will open in the Developer Portal.

&nbsp;<br>
# Step 5: Generate the keys and Create Connection between Web App and Service

## Step 5.1: Add Asgardeo as an Identity Provider in Choreo

1. Navigate to the **Pet Management App** in the Choreo console.
2. Click **Settings** in the bottom of the side panel.
3. Select **Asgardeo org** as the Identity Provider.
4. Add the **client ID** of the **Pet Management App** application created in Asgardeo console. (Refer step 2.4 to obtain the client id)
5. Click **Add Keys**

Now you have generated keys for the application.

## Step 5.2: Create a connection between the web application and the deployed service

1. In the left navigation menu, click **Dependencies** and then click **Connections**.
2. Click **+ Create**.
3. In the Create Connection pane, click **Pet Management Service** REST Endpoint.
4. Provide a preferable Name and description
5. Click **Next**. This displays the service URL of the connection for each environment the service is deployed in. You will see the service URL for the Development environment here.
6. Click **Finish**. This opens the detailed view of the connection you created.
7. You can copy the**Service URL** displayed here and update in the config.js file of the web application.

&nbsp;<br>

# Step 6: Consume the Pet Management Application
    
1. Use **Web App URL** in **step 3.3** to access the Pet Management web application. 

![Alt text](readme-resources/landing-page.png?raw=true "Landing Page")

2. Click on the **Get Started** button.
3. You will get a **Sign In** prompt.
4. You can create an **account** by giving an email address or use a **Google** account to login into the Pet Management application. After login successfully you will redirect to the home page:

![Alt text](readme-resources/home-page.png?raw=true "Home Page")

5. To add a new pet, Click on the **+** button next to `My Pets` in the home page.
6. Provide a name, breed and date of birth.
7. Then click on the **Save** button.
8. Click on the created card and you can see an **overview** of the pet.
9. Click on the **edit** button to update details of the pet. You will get an Update view for the pet.
10. In there you can edit the name, breed and date of birth of the pet.
11. Furthermore, you can add **vaccination details** for your pet.
    - Go to the Vaccination Details section.
    - Give the vaccination name, last vaccination date and next vaccination date.
    - Click on the + button.
    - You can check the enable alerts checkbox if you wish to receive alerts for the next vaccination date.
    - Click on the **Save** button.
    &nbsp;<br>

12. You can update the **image** of your pet in the update details prompt.
    - Click on the Choose a file button.
    - Select a photo from your local device.
    - Click on the **Update** button.
13. Also you can **enable/disable** alerts from the **settings**.
    - Click on the user menu on the top right corner in the home page.
    - Click **Settings**.
    - Toggle the switch to **enable alerts**.
    - Provide an email address.
    - Click **Save**.

# Run Locally

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
2. Add the `Authorized redirect URLs` as `http://localhost:3000`.
3. Go to the `Protocol` tab and copy the `Client ID`.
4. Select `Access token` type as `JWT`.

## Deploy the Front End Application
1. Navigate to <PROJECT_HOME>/petcare-sample/b2c/web-app/petdesk/web/react/public and update the configuration file 
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
