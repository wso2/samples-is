# Disclaimer Post Authentication Handler

Post authentication handlers are a set of handlers which executes upon successful authentication through WSO2 Identity Server (IS)
authentication framework. For example, if you do a Single Sign On(SSO) your application through an IS instance or any WSO2 
product which supports SSO authentication then upon successful authentication these handlers will get executed.

An important fact you need to keep in mind is even though you successfully finished your authentication steps (basic,
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

In the following instructions, WSO2 IS installation directory will be referred as `<IS_HOME>`

1. Get a clone or download source of [WSO2 sample-is repository](https://github.com/wso2/samples-is).
   
   We will refer this directory as `<IS_SAMPLE_REPO>` here onwards
2. Run the Maven command `mvn clean install` from `<IS_SAMPLE_REPO>/etc/sample-post-authentication-hanlder` directory
3. Get the jar which can be found at 
`<IS_SAMPLE_REPO>/etc/sample-post-authentication-hanlder/target/org.wso2.carbon.identity.post.authn.handler.disclaimer-1.0-SNAPSHOT.jar` 
and place it in the `<IS_HOME>/repository/components/dropins` directory.

4. Copy the `disclaimer.jsp` file inside resources folder of this project into
`<IS_HOME>/repository/deployment/server/webapps/authenticationendpoint/` directory.

5. Start WSO2 IS.

6. Create a service provider for `travelocity` application and try to login to `travelocity`.

Upon successful authentication you will be prompted a consent page giving the below message

"Your information will be accessed by $NAME_OF_THE_APPLICATION once agreed. The application policies will decide with
whom the applicationis sharing information with."
