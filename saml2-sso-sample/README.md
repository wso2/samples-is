# SAML2 SSO Samples

SAML stands for Security Assertion Markup Language which is a XML based data format for exchanging authentication and authorization data between an identity provider and a service provider. The single most important requirement that SAML addresses is web browser single sign-on (SSO). These sample applications demonstrates SAML2 sso with WSO2 identity server.

## Table of contents

- [Download and install](#download-and-install)
- [Getting started](#getting-started)

## Download and install

### Install from source

#### Prerequisites

* [Maven](https://maven.apache.org/download.cgi)
* [Java](http://www.oracle.com/technetwork/java/javase/downloads)

1. Get a clone or download source from this repository
2. Run the Maven command mvn clean install from within the saml2-sso-sample directory.

## Getting started
 
In order to check sigle sign on using SAML2, please follow the steps 
 
1. Start the wso2 identity server. 
2. Create two service providers(dispatch, swift) with SAML as the inbound protocol using management console. 
     Service provider names - saml2-web-app-dispatch.com & saml2-web-app-dispatch.com 
  
3. Under Inbound Authentication Configuration, create a new SAML2 Web SSO configuration.
     Issuer - saml2-web-app-dispatch.com  
     Assertion Consumer URLs - http://localhost.com:8080/saml2-web-app-dispatch.com/consumer 

(Keep the other default settings as it is and save the configuration.)

4. clone the project saml2-sso-sample
5. Build the project using "mvn clean install" (you can build from the parent pom or child poms)  
6. Copy the war files (saml2-web-app-dispatch.com.war and saml2-web-app-swift.com.war) to the <CATALINA_HOME>/webapps folder.
7. Start the tomcat server. 
8. Try out single sign on with SAML flow.
 
Note:-Please add the host names used for the applications to your etc/hosts file. You can find the needed host names through the property files. Addition to that, use the call back urls in the property files when configuring inbound protocols for each service providers
