# Android Client Application Sample for WSO2 IS
Sample application to demonstrate the integration of WSO2 IS with Android Applications.
The application uses the [AppAuth for Android](https://github.com/openid/AppAuth-Android) library, which is a native app SDK for [OAuth 2.0](https://oauth.net/2/) and 
[Open ID Connect](http://openid.net/connect/), implementing modern best practices. PKCE enabled OAuth 2.0 communication flow is used and the functionalities authorization, token handling, user info endpoint invocation and logout are demonstrated through the application.

## Configuring the WSO2 Identity Server
1. Download the latest version of WSO2 Identity Server from the [official website](https://wso2.com/identity-and-access-management). Follow the [installation guide](https://docs.wso2.com/display/IS560/Installation+Guide) to install and get started.

2. Create a Service Provider in the WSO2 IS for the client application. Refer the documentation on [Adding and Configuring a Service Provider](https://docs.wso2.com/display/IS530/Adding+and+Configuring+a+Service+Provider). Essential steps required to run the sample application is given below.

    - Start the WSO2 IS by running the “wso2server.sh” script located inside the bin folder. Follow the documentation for more information on [Running the Product](https://docs.wso2.com/display/IS560/Running+the+Product).
    
    - Go to the WSO2 IS Management Console by navigating to “localhost:9443” in the browser. Login with “admin” as the username and password.
    
    - Navigate to “Service Providers => Add” in the left side bar. Under “Add New Service Provider” and register a new Service Provider for the client application with a suitable name and description. 
    
    - After being redirected to “Basic Information” page, go to “Inbound Authentication Configuration => OAuth/OpenID Connect Configuration => Configure”. Make “PCKE Mandatory”.
    
    - Add the “Callback URL” that is registered in the client application.
    
    - “OAuth Client Key” and “OAuth Client Secret” are generated under “Basic Information => Inbound Authentication Configuration => OAuth/OpenID Connect Configuration”. These should be specified in “app/res/raw/config.json” file of the sample application under the keys “client_id” and “client_secret” respectively.
    
    - Go to “Claim Configuration => Add Claim URI” and manage the claims as required. Refer the documentation on [Configuring Claims for a Service Provider](https://docs.wso2.com/display/IS530/Configuring+Claims+for+a+Service+Provider).
    
    - Add some users by navigating to “Users and Roles” in the left side bar. Refer the documentation on [Configuring Users](https://docs.wso2.com/display/IS530/Configuring+Users) to add users, assign them roles and customize their user profiles.
    
    - If an Android emulator is used for testing purposes, change the hostname of the WSO2 IS by navigating to <IS_HOME>/repository/conf/carbon.xml and changing the “HostName” and “MgtHostName” to “10.0.0.2” or the IP Address of the local machine. If the IP Address is used, it might have to be updated every time the machine connects to the internet. Else if a real Android Device is used for testing purposes, change the “HostName” and “MgtHostName” in <IS_HOME>/repository/conf/carbon.xml file to the IP Address of the local machine. Refer the documentation on [Changing the Hostname](https://docs.wso2.com/display/IS550/Changing+the+hostname) to change the hostname as required.

## Setting up the Application
1. Fork the GitHub repository and clone the project to Android Studio or a suitable IDE.

2. Navigate to “app/res/raw/config.json” and change the configuration. 

    - client_id (OAuth Client Key received when creating the Service Provider in the WSO2 IS)
    
    - client_secret (OAuth Client Secret received when creating the Service Provider in the WSO2 IS)
    
    - redirect_uri (registered Custom URL Scheme or the Claimed HTTPS Scheme URI of the client application)
    
    - https_required (could be made “false” during testing instances to trust all SSL certificates)

3. Build the project.

## Running in an Android Emulator
1. Create a suitable Android Virtual Device in the Android Studio.

2. If the WSO2 IS is hosted in the local machine, change the domain of the endpoints in the “app/res/raw/config.json” file and the hostnames specified under “HostName” and “MgtHostName” tags in the “<IS_HOME>/repository/conf/carbon.xml” file to “10.0.0.2” or the IP Address of the local machine in which the WSO2 IS is running.

3. Run the application.

4. Select the Virtual Device and test the application.

## Running in an Android Device
1. Enable USB Debugging in the Developer Options in the Android Device. Refer documentation on [Run you App](https://developer.android.com/training/basics/firstapp/running-app).

2. If the WSO2 IS is hosted in the local machine, change the domain of the endpoints in the “app/res/raw/config.json” file and the hostnames specified under “HostName” and “MgtHostName” tags in the “<IS_HOME>/repository/conf/carbon.xml” file to the IP Address of local machine. Make sure that both the Android Device and the local machine is connected to the same WIFI network.

3. Connect the Android Device to the machine through a USB cable.

4. Run the application.

5. Select the Android Device as the Deployment Target.

6. Test the application.
