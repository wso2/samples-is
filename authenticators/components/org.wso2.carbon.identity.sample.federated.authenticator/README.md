# Writing a Custom Federated Authenticator

A custom federated authenticator can be written to authenticate a user with an external system. 
So the external system can be any Identity provider such as Facebook, Twitter, Google and Yahoo. In 
this guide another Identity Server has been used as a federated authenticator, which is called as partner 
identity server throughout this guide. It is possible to use the extension points available in the WSO2 
Identity Server to create custom federated authenticators. This custom federated authenticator sample is implemented 
and tested with WSO2 Identity Server 5.11.0.

![federated-sample](https://user-images.githubusercontent.com/25496816/113800593-d924cc00-9774-11eb-9651-c24eff5018ec.png)

### Writing a custom federated authenticator

1. First create a maven project for the custom federated authenticator. Refer the [pom.xml](https://github.com/GANGANI/custom-federated-authenticator/blob/main/pom.xml) 
   file used for the sample custom federated authenticator.
2. Refer the [service component class](https://github.com/GANGANI/custom-federated-authenticator/blob/main/src/main/java/org/wso2/carbon/identity/custom/federated/authenticator/internal/CustomFederatedAuthenticatorServiceComponent.java) 
   as well since the authenticator is written as an OSGI service to deploy in the WSO2 Identity Server and register 
   it as a federated authenticator
3. The [custom federated authenticator](https://github.com/GANGANI/custom-federated-authenticator/blob/main/src/main/java/org/wso2/carbon/identity/custom/federated/authenticator/CustomFederatedAuthenticator.java) 
   should be written by extending the [AbstractApplicationAuthenticator](https://github.com/wso2/carbon-identity-framework/blob/v5.18.187/components/authentication-framework/org.wso2.carbon.identity.application.authentication.framework/src/main/java/org/wso2/carbon/identity/application/authentication/framework/AbstractApplicationAuthenticator.java) class and implementing the [FederatedApplicationAuthenticator](https://github.com/wso2/carbon-identity-framework/blob/master/components/authentication-framework/org.wso2.carbon.identity.application.authentication.framework/src/main/java/org/wso2/carbon/identity/application/authentication/framework/FederatedApplicationAuthenticator.java) class.
4. You can find a custom federated authenticator from here for your reference

The important methods in the AbstractApplicationAuthenticator class, and the FederatedApplicationAuthenticator interface are listed as follows.

*   **[public String getName()](https://github.com/GANGANI/custom-federated-authenticator/blob/main/src/main/java/org/wso2/carbon/identity/custom/federated/authenticator/CustomFederatedAuthenticator.java#L72-L76)**

Return the name of the authenticator

*   **[public String getFriendlyName()](https://github.com/GANGANI/custom-federated-authenticator/blob/main/src/main/java/org/wso2/carbon/identity/custom/federated/authenticator/CustomFederatedAuthenticator.java#L66-L70)**

Returns the display name for the custom federated authenticator. In this sample we are using custom-federated-authenticator

*   **[public String getContextIdentifier(HttpServletRequest request)](https://github.com/GANGANI/custom-federated-authenticator/blob/main/src/main/java/org/wso2/carbon/identity/custom/federated/authenticator/CustomFederatedAuthenticator.java#L209-L218)**

Returns a unique identifier that will map the authentication request and the response. The value returned by the invocation of authentication request and the response should be the same.

*   **[public boolean canHandle(HttpServletRequest request)](https://github.com/GANGANI/custom-federated-authenticator/blob/main/src/main/java/org/wso2/carbon/identity/custom/federated/authenticator/CustomFederatedAuthenticator.java#L60-L64)** -

Specifies whether this authenticator can handle the authentication response.

*   **[protected void initiateAuthenticationRequest(HttpServletRequest request,HttpServletResponse response, AuthenticationContext context)](https://github.com/GANGANI/custom-federated-authenticator/blob/main/src/main/java/org/wso2/carbon/identity/custom/federated/authenticator/CustomFederatedAuthenticator.java#L134-L163)**

Redirects the user to the login page in order to authenticate and in this sample, the user is redirected to the login page of the application which is configured in the partner identity server which acts as the external service.

*   **[protected void processAuthenticationResponse(HttpServletRequest request,HttpServletResponse response, AuthenticationContext context)](https://github.com/GANGANI/custom-federated-authenticator/blob/main/src/main/java/org/wso2/carbon/identity/custom/federated/authenticator/CustomFederatedAuthenticator.java#L166)**

Implements the logic of the custom federated authenticator.

### Deploy the custom federated authenticator in WSO2 IS

1. Once the implementation is done, navigate to the root of your project and run the following command to compile the service
2. Copy the compiled jar file insider _<Custom-federated-authenticator>/target._
3. Copy the jar file **org.wso2.carbon.identity.custom.federated.authenticator-1.0.0.jar** file to the _<IS_HOME>/repository/components/dropins._

### Configure the partner identity server

In this sample the partner identity server acts as the external system. 
Therefore, that partner identity server will be running on the same machine in a different port 
by adding the following config to the deployment.toml file.

```
[server]
offset=1
```

After starting that partner identity server, it will run on [localhost:9444](https://localhost:9444/carbon).

1. Access the Management console of the partner identity server.
2. Then go to the Service Providers under the main tab. 
   Then add Service Provider Name and register it. 
   Let’s use the playground app and refer to [this](https://is.docs.wso2.com/en/latest/learn/deploying-the-sample-app/#deploying-the-playground2-webapp) to configure the playground app.
3. Then List the Service Providers and edit the service provider by navigation to the
   **OAuth/OpenID Configuration** under **Inbound Authentication Configuration** and add 
   [https://localhost:9443/commonauth](https://localhost:9443/commonauth) as the callback URL.
4. Create a user **Alex** in the partner identity server.

### Configure Federated Authenticator

To configure the federated authenticator, click the add button under **Identity Providers** and add an IDP name as 
**Partner-Identity-Server** and register the new IDP.

Click on the **Federated Authenticators **and expand the **custom-federated-authenticator configurations** 
and configure it as follows.

Here, the Client Id and Client Secret are the values of external service provider from the Partner-Identity-Server.

*   _Enable / Default - You can **enable** and set to **default**_
*   _Authorization Endpoint URL - [https://localhost:9444/oauth2/authorize/](https://localhost:9444/oauth2/authorize/)_
*   _Token Endpoint URL - [https://localhost:9444/oauth2/token/](https://localhost:9444/oauth2/token/)_
*   _Client Id - The value generated by the service provider of the partner IS_
*   _Client Secret - The value generated by the service provider of the partner IS_

### Configure an application with the custom federated authenticator

1. Start the server and log in to the WSO2 IS Management Console.

2. Then go to the Service Providers under the main tab. Then add Service Provider Name as follows and Register it. Let’s use the playground app and refer this to configure playground app.

3. Then List the Service Providers and edit the service provider as follows by navigation to the** OAuth/OpenID Configuration** under **Inbound Authentication Configuration **as explained above.

4. Then click Configure and add[ http://localhost:8080/playground2/oauth2client](http://localhost:8080/playground2/oauth2client) as the call back URL. Click Update.

5. Navigate to **Local & Outbound Authentication Configuration** as follows, and you can find Authentication Type. 
   Select **Federated Authentication** and select the configured federated authenticator and update to save the changed 
   configurations.

### Try the scenario

1. Access the playground app by using [http://localhost:8080/playground2](http://localhost:8080/playground2). 

2. Then it will redirect to the login page of the application which is configured in the partner identity server which acts as the external service.

3. Give Alex's username and password (The user was created, in the partner identity server).

4. Then the federated authentication can be experienced since the Alex is authenticated from the partner Identity Server.

Similarly, you can write a federated authenticator to authenticate the users using an external system.

