# Disclaimer Post Authentication Handler

Post authentication handlers are a set of handlers which executes upon successful authentication through WSO2
authentication framework. ie If you do an SSO your applicaion through an IS instance or any WSO2 product which supports
SSO authentication then upon successful authentication these handlers will get executed.

An important fact you need to keep in mind is even though you successfully finished your authenticaion steps (basic,
totp etc) you will still not be an authenticated person until you pass the post authentication flow. Existing post
authenticators are AuthorizationHandler and missing mandatory claim handler which are getting executed upon successful
authentication.

This sample will act as a post authenticator which will request for your consent for retrieving user information from IS
to Service provider, upon successfully passing authentication steps. The behaviour of this post authentication handler
is

 1) A consent page will be popped up upon successfully passing authentication steps.
 2) If you click on approve, then you will be redirected to your application with successful login
 3) If you deny the consent, authentication will be failed and you will be shown an error message on the screen.

## Table of contents

- [Download and install](#download-and-install)
- [Getting started](#getting-started)

## Download and install

### Install from source

#### Prerequisites

* [Maven](https://maven.apache.org/download.cgi)
* [Java](http://www.oracle.com/technetwork/java/javase/downloads)

1. Get a clone or download source from this repository
2. Run the Maven command mvn clean install from within the sample-post-authentication-handler directory.

## Getting started

1. Clone the sample-post-authentication-handler from this git repo.
2. Navigate to directory sample-post-authentication-hanlder and build it using below command

    ```bash
    mvn clean install
    ```
    
3. Get the jar upon building which is in the target directory with name org.wso2.carbon.identity.post.authn.handler
.disclaimer-1.0-SNAPSHOT.jar and place it in the <IS_HOME>/repository/components/dropins directory.

4. Copy the disclaimer.jsp file inside resources folder of this project into
<IS_HOME>/repository/deployment/server/webapps/authenticationendpoint/ directory.

5. Start the Identity server.

6. Create a service provider for travelocity and try to login to travelocity.

Upon successful authentication you will be prompted a consent page giving the below message

"Your information will be accessed by $NAME_OF_THE_APPLICATION once agreed. The application policies will decide with
whom the applicationis sharing information with."
