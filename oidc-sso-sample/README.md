# Openid Connect SSO Samples

Openid Connect is an identity layer which is built on top of Oauth 2.0. It enables the clients to identity their users depending on the authentication carried out by an identity server, also it allows them to obtain basic profile information about the users.

Single sign-on (SSO) occurs when a user logs in to one client and is then signed in to other clients automatically.

In the context of the OIDC-conformant authentication pipeline, SSO must happen at the authorization server (i.e. Auth0) and not client applications. This means that for SSO to happen, you must employ universal login and redirect users to the login page. These applications demonstrates oidc sso with WSO2 server. 

## Table of contents

- [Download and install](#download-and-install)
- [Getting started](#getting-started)

## Download and install

### Install from source

#### Prerequisites

* [Maven](https://maven.apache.org/download.cgi)
* [Java](http://www.oracle.com/technetwork/java/javase/downloads)

1. Get a clone or download source from this repository
2. Run the Maven command mvn clean install from within the distribution directory.

## Getting started

In order to check sigle sign on using OIDC, please follow the steps

1. Start the wso2 identity server.
2. Create two service provider(dispatch, swift) with oidc as the inbound protocol using management console.
3. clone the project oidc-sso-sample
4. Copy the client id and client secret of each application got from step2 to the appropriate property files.(For example you can find the dispatch property file in oidc-sso-sample/Dispatch/src/main/resources/dispatch.properties)
5. Build the project using "mvn clean install" (you can build from the parent pom or child poms)
6. Copy the war files (Dispatch.war and Swift.war) to the <CATALINA_HOME>/webapps folder.
7. Start the tomcat server.
8. Try out single sign on flow.

Note:-Please add the host names used for the applications to your etc/hosts file. You can find the needed host names through the property files. Addition to that, use the call back urls in the property files when configuring inbound protocols for each service providers

 
