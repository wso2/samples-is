# Cordova Client Application Sample for WSO2 IS
Sample application to demonstrate the integration of WSO2 IS with Cordova applications.
The application is implemented based on [AppAuth-JS](https://github.com/openid/AppAuth-JS) library with modern best practices. PKCE enabled OAuth 2.0 communication flow is used and the functionalities authorization and token handling are demonstrated through the application.

  <img src="https://user-images.githubusercontent.com/13478571/47021072-58268400-d178-11e8-8252-78f30567ece4.PNG" width="375" height="667" title="img_0842"> <img src="https://user-images.githubusercontent.com/13478571/47021109-6bd1ea80-d178-11e8-98f9-987eb0a8940d.PNG" width="375" height="667" title="img_0843">

## Configuring the WSO2 Identity Server
1. Download the latest version of WSO2 Identity Server from the [official website](https://wso2.com/identity-and-access-management). Follow the [installation guide](https://docs.wso2.com/display/IS570/Installation+Guide) to install and get started.

2. Create a Service Provider in the WSO2 IS for the client application. Refer the documentation on [Adding and Configuring a Service Provider](https://docs.wso2.com/display/IS570/Adding+and+Configuring+a+Service+Provider). Essential steps required to run the sample application is given below.

    - Start the WSO2 IS by running the `wso2server.sh` script located inside the bin folder. Follow the documentation for more information on [Running the Product](https://docs.wso2.com/display/IS570/Running+the+Product).
    
    - Go to the WSO2 IS Management Console by navigating to `https://localhost:9443/carbon` in the browser. Login with `admin` as the username and password.
    
    - Navigate to “Service Providers => Add” in the left side bar. Under “Add New Service Provider” and register a new Service Provider for the client application with a suitable name and description. 
    
    - After being redirected to “Basic Information” page, go to “Inbound Authentication Configuration => OAuth/OpenID Connect Configuration => Configure, Make `PCKE Mandatory` and `Allow authentication without the client secret`.
       
    - Add the `Callback URL` that is registered in the client application (`com.wso2.cordova.oidc.sample://app/callback`).
    
      <img width="594" alt="screen shot 2018-10-16 at 6 52 45 pm" src="https://user-images.githubusercontent.com/13478571/47019477-ca956500-d174-11e8-8bb1-aafe111d8542.png">
    
    - `OAuth Client Key` is generated under “Basic Information => Inbound Authentication Configuration => OAuth/OpenID Connect Configuration”. These should be specified in `www/js/config.js` file of the sample application under the keys `clientId`.
    
       <img width="1121" alt="screen shot 2018-10-16 at 6 54 46 pm" src="https://user-images.githubusercontent.com/13478571/47019565-029ca800-d175-11e8-90fd-f51b2b0d5225.png">
        
    - Add some users by navigating to “Users and Roles” in the left side bar. Refer the documentation on [Configuring Users](https://docs.wso2.com/display/IS570/Configuring+Users) to add users, assign them roles and customize their user profiles.
    
    - Change the hostname of the WSO2 IS by navigating to `<IS_HOME>/repository/conf/carbon.xml` and changing the `HostName` and `MgtHostName` to the IP Address of the local machine for testing purpose and your device needs to be connected to the same wifi network. Refer the documentation on [Changing the Hostname](https://docs.wso2.com/display/IS570/Changing+the+hostname) to change the hostname as required.

## Setting up the Application
1. Fork the GitHub repository and clone the project to the local machine.

2. Navigate to `www/js/config.js` and change the configurations according to your service provider and Identity server. 

    - `clientId` (OAuth Client Key received when creating the Service Provider in the WSO2 IS)
        
    - `redirectUri` (`com.wso2.cordova.oidc.sample://app/callback`)
    
    - `authorization_endpoint` (`https://<IS_HOST/IP>:<PORT>/oauth2/authorize`)

    - `token_endpoint` (`https://<IS_HOST/IP>:<PORT>/oauth2/token`)

### Adding required platforms
`cordova platform add ios android`

### Building the cordova project
`cordova build`

### Run the application

#### Android
`cordova run android`

#### iOS
`cordova run ios`
