# Sample Step Handler

Post authentication handlers are a set of handlers which executes upon successful authentication through WSO2 Identity Server (IS)
authentication framework. For example, if you do a Single Sign On(SSO) your application through an IS instance or any WSO2 
product which supports SSO authentication then upon successful authentication these handlers will get executed.

An important fact you need to keep in mind is even though you successfully finished your authentication steps (basic,
totp etc) you will still not be an authenticated person until you pass the post authentication flow. Existing post
authenticators are AuthorizationHandler and missing mandatory claim handler which are getting executed upon successful
authentication.

This sample step handler is responsible for orchestrating invocation of authenticators based on the availability of
the IWAKerberosAuthenticator/Basic authenticator in the authenticator list. If the authenticated user is from an
internal network range and if both IWA and Basic Authenticators are available as options in the same step
configuration this step handler will modify the list to include only the IWAKerberosAuthenticator. Upon IWA failure
it will fallback to basic authentication for IWA users. If user is found to be from external network, it will modify
the list to include Basic Authenticator. It enhances the user experience for internal/external network users avoiding
 the multi-option login page.

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
2. Run the Maven command `mvn clean install` from `<IS_SAMPLE_REPO>/etc/sample-step-handler` directory
3. Get the jar which can be found at 
`<IS_SAMPLE_REPO>/etc/sample-step-handler/target/org.wso2.carbon.identity.handler.step-<VERSION>.jar`
and place it in the `<IS_HOME>/repository/components/lib` directory.

4. Copy the `internal_ip_addresses.txt` file inside resources folder of this project into
`<IS_HOME>/repository/conf/identity/` directory. Configure this file with your internal network IP ranges.
5. Download `commons-net-3.6.jar` file from [here](https://mvnrepository.com/artifact/commons-net/commons-net/3.6) and
copy it into `<IS_HOME>/repository/components/lib/` directory.

6. Start WSO2 IS.

7. Create a service provider for `travelocity` application and configure Basic authenticator and IWA Kerberos
Authenticator as multi-options for the first step in advanced authentication configuration.

8. Try to login to travelocity application. If your IP address belongs to configured internal IP ranges, you will be
automatically logged in. Else you will be prompted the login page.
