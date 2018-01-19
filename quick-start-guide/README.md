#SAML2 sso demonstration using two applications Dispatch and Swift. 
In order to check sigle sign on using SAML2, please follow the steps 
 
Start the wso2 identity server. 
Create two service providers(dispatch, swift) with SAML as the inbound protocol using management console. 

Service provider names - saml2-web-app-dispatch.com & saml2-web-app-dispatch.com 

Under Inbound Authentication Configuration, create a new SAML2 Web SSO configuration.

   Issuer - saml2-web-app-dispatch.com
   
   Assertion Consumer URLs - http://localhost.com:8080/saml2-web-app-dispatch.com/consumer 

Keep the other default settings as it is and save the configuration.

clone the project quick-start-guide 

Build the project using "mvn clean install" (you can build from the parent pom or child poms)
  
Copy the war files (saml2-web-app-dispatch.com.war and saml2-web-app-swift.com.war) to the <CATALINA_HOME>/webapps folder. 

Start the tomcat server. 

Try out single sign on with SAML flow.
 
Note:-Please add the host names used for the applications to your etc/hosts file. You can find the needed host names through the property files. Addition to that, use the call back urls in the property files when configuring inbound protocols for each service providers


