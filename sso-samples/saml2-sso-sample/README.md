# SAML2 SSO Samples

SAML stands for Security Assertion Markup Language which is a XML based standard for exchanging authentication
and authorization data between an identity provider and a service provider. The single most important requirement
that SAML addresses is web browser Single Sign On(SSO). These sample applications demonstrates SAML2
SSO with WSO2 Identity Server(IS).

## Table of contents

- [Download and build](#download-and-build)
- [Running sample applications](#running-sample-applications)

## Download and build

### Prerequisites

* [Maven](https://maven.apache.org/download.cgi)
* [Java](http://www.oracle.com/technetwork/java/javase/downloads)

### Building from source

1. Get a clone or download source of [WSO2 sample-is repository](https://github.com/wso2/samples-is).

   We will refer this directory as `<IS_SAMPLE_HOME>` here onwards.
2. Run the Maven command `mvn clean install` from the `<IS_SAMPLE_HOME>/saml2-sso-sample` directory.

You can find SSO sample applications in `target` directory of `<IS_SAMPLE_HOME>/saml2-sso-sample/saml2-web-app-pickup-dispatch`
and `<IS_SAMPLE_HOME>/saml2-sso-sample/saml2-web-app-pickup-manager` directories.
Application distributions are named `saml2-web-app-pickup-dispatch.com.war` and `saml2-web-app-pickup-manager.com.war` respectively.

## Running sample applications
 
In order to check SSO using SAML2, please follow these steps 
 
1. Start the WSO2 IS. 
2. Access WSO2 IS management console and create two service providers (ex:- dispatch and manager)
   
   For each service provider, configure SAML2 Web SSO under Inbound Authentication Configuration. In this configuration,
   use following parameters and options,
   
   For dispatch application
     
       Issuer - saml2-web-app-pickup-dispatch.com  
       Assertion Consumer URLs - http://localhost.com:8080/saml2-web-app-pickup-dispatch.com/home.jsp 

   For manager application
   
       Issuer - saml2-web-app-pickup-manager.com  
       Assertion Consumer URLs - http://localhost.com:8080/saml2-web-app-pickup-manager.com/home.jsp 

   Please deselect `Enable Signature Validation in Authentication Requests and Logout Requests` option in both service providers.
   Keep other default settings as it is and save the configuration.
3. Build the source code by following build commands in [Building from source](#building-from-source)
4. Deploy applications, `saml2-web-app-pickup-dispatch.com.war` and `saml2-web-app-pickup-manager.com.war` using Apache Tomcat.
5. Try out SSO behavior by log in to one application and visiting the other application.

   By default, these application runs on url http://localhost.com:8080/saml2-web-app-pickup-dispatch.com/
   and http://localhost.com:8080/saml2-web-app-pickup-manager.com
 
**NOTE:** Some browsers do not support cookie creation for naked host names (ex:- localhost). SSO functionality require cookies 
in the browser. This is the reason to use `localhost.com` host name for sample applications. You will require to add this entry 
to `hosts` file. For windows this file locations is at `<Windows-Installation-Drive>\Windows\System32\drivers\etc\hosts`.
For Linux/Mac OS, this file location is at `/etc/hosts`