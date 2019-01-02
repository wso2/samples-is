# Openid Connect SSO Samples

OpenID Connect is an identity layer that is built on top of the OAuth 2.0 protocol. It allows clients to verify the identity of users depending on the authentication performed by an identity server, and also allows clients to obtain basic profile information of users.

Single sign-on (SSO) allows users to provide their credentials once and obtain access to multiple applications. 

According to the OpenID Connect session management specification, a relying party can monitor the login status of an end user using two hidden iframes. One at the relying party, and the other at the OpenID Connect provider. The relying party iframe can continuously poll the hidden OpenID Connect provider iframe so that the relying party gets notified when the session state of the user changes.

                                                              


## Table of contents

- [Download and install](#download-and-install)
- [Getting started](#getting-started)

## Download and install

### Install from source

#### Prerequisites

* [Maven](https://maven.apache.org/download.cgi)
* [Java](http://www.oracle.com/technetwork/java/javase/downloads)

1. Get a clone or download source from this repository
2. Run the Maven command mvn clean install from within the oidc-sso-sample directory.

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
