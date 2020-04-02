# Custom Basic Authenticator for attribute based authentication

This component was developed to allow users to use a user attribute (eg: email, phone number) as username when logging in
 with basic authentication instead of the immutable username which [WSO2 Identity Server](https://wso2.com/identity-and-access-management/) has by default.
 
 This component has been tested with WSO2 IS versions from 5.5.0 to 5.9.0.

### Steps to deploy
- Build the component by running "mvn clean install"
- Copy following jar file which can be found in target directory into <IS_HOME>/repository/components/dropins/
org.wso2.sample.authenticator.attribute.based-1.0.0.jar
- Configure the customer authenticator as below.
  * For WSO2 IS 5.8.0 and earlier versions, add following block under `<AuthenticatorConfigs>` in `<IS_HOME>/repository/conf/identity/application-authentication.xml` 
    ```
    <AuthenticatorConfig name="AttributeBasedAuthenticator" enabled="true">
        <Parameter name="AuthenticatingUsernameClaimUri">http://wso2.org/claims/emailaddress</Parameter>
        <Parameter name="AuthMechanism">basic</Parameter>
    </AuthenticatorConfig>
    ``` 
  * For WSO2 IS 5.9.0, add following in deployment.toml
    ```
    [authentication.custom_authenticator.attribute-based-authenticator]
    name = "AttributeBasedAuthenticator"
    enable = "true"
    
    [authentication.custom_authenticator.attribute-based-authenticator.parameters]
    AuthenticatingUsernameClaimUri = "http://wso2.org/claims/emailaddress"
    AuthMechanism = "basic"
    ```
    
- If you are going to use email address as the `AuthenticatingUsernameClaimUri`
  * For WSO2 IS 5.8.0 and earlier versions, please uncomment following line from <IS_HOME>/repository/conf/carbon.xml
    ```
    <EnableEmailUserName>true</EnableEmailUserName>
    ```

  * For WSO2 IS 5.9.0, add following in deployment.toml
    ```
    [tenant_mgt]
    enable_email_domain = "true"
    ```

- If you want to use this authenticator for all the service providers
  * update the following properties in the <IS_HOME>/repository/conf/identity/service-providers/default.xml file.
    ```
    <LocalAuthenticatorConfig>
        <Name>AttributeBasedAuthenticator</Name>
        <DisplayName>attribute-based-authenticator</DisplayName>
    ```
  * Also  update the following variable in <IS_HOME>/repository/deployment/server/webapps/authenticationendpoint/login.jsp
    ```
    private static final String BASIC_AUTHENTICATOR = "AttributeBasedAuthenticator";
    ```
- To use this only for one/few service providers
  * Restart the Identity Server
  * Configure "attribute-based-authenticator" in authentication steps in Local and Outbound authentication config of the
 service providers instead of "basic".
  * Open <IS_HOME>/repository/deployment/server/webapps/authenticationendpoint/login.jsp
  * Add a new variable `ATTRIBUTE_BASED_AUTHENTICATOR` near the `BASIC_AUTHENTICATOR` as below.
    ```
    private static final String BASIC_AUTHENTICATOR = "BasicAuthenticator";
    private static final String ATTRIBUTE_BASED_AUTHENTICATOR = "AttributeBasedAuthenticator";
    ```
  * Update all the place which has `localAuthenticatorNames.contains(BASIC_AUTHENTICATOR)` as following.
    ```
    localAuthenticatorNames.contains(BASIC_AUTHENTICATOR) || localAuthenticatorNames.contains(ATTRIBUTE_BASED_AUTHENTICATOR)
    ```
- To use this authenticator for WSO2 IS user dashboard, update the following properties in 
<IS_HOME>/repository/conf/identity/service-providers/sp_dashboard.xml and restart the Identity Server.
    ```
    <LocalAuthenticatorConfig>
        <Name>AttributeBasedAuthenticator</Name>
        <DisplayName>attribute-based-authenticator</DisplayName>
    ```

### Explanation of the configuration parameters of the authenticator
- `AuthenticatingUsernameClaimUri` : This is the claim URI of the user attribute which users can use as the username when
 logging in with basic authentication. The uniqueness of the user attribute is required for this to work properly. If
 this parameter is not defined, "http://wso2.org/claims/emailaddress" will be used by default.
- `AuthMechanism`: This is to tell identity server to consider this authenticator also using the "basic" auth mechanism.
 This is useful if you are trying to SSO with other service providers which are using default basic authenticator.