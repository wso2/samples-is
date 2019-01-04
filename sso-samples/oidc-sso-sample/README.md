# Openid Connect SSO Samples

OpenID Connect(OIDC) is an identity layer built on top of the OAuth 2.0 authorization framework.
OpenID Connect allows clients to verify the identity of the users thus providing authentication capability.
It also allows the client to obtain profile information (claims) of users.

Single Sign On(SSO) provide seamless log in experience to user on multiple applications.
With SSO, users enter their credentials only once. Consequent log in will be skipped, enhancing user experience.

According to the OpenID Connect session management specification, a relying party can monitor the login status of an end user
using two hidden iframes. One at the relying party(client), and the other at the OpenID Connect provider.
The relying party iframe can continuously poll the hidden OpenID Connect provider iframe so that the relying party
gets notified when the session state of the user changes.


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
2. Run the Maven command `mvn clean install` from the `<IS_SAMPLE_HOME>/oidc-sso-sample` directory.

You can find SSO sample applications in `target` directory of `<IS_SAMPLE_HOME>/oidc-sso-sample/pickup-dispatch`
and `<IS_SAMPLE_HOME>/oidc-sso-sample/pickup-manager` directories. Application distributions are named `pickup-dispatch.war` 
and `pickup-manager.war` respectively.

## Running sample applications

To run samples, you require to alter parameters found in application property file. These property files are embedded in
sample application codes. For example you can find the `pickup-dispatch` property file in 
`<IS_SAMPLE_HOME>/oidc-sso-sample/pickup-dispatch/src/main/resources/dispatch.properties`

In order to check SSO using OIDC, please follow these steps

1. Start WSO2 Identity Server(IS).
2. Access WSO2 IS management console and create two service providers (ex:- dispatch and manager)
   
   For each service provider, configure OIDC under Inbound Authentication Configuration. Callback URL dedicated
   to each application can be obtained at relevant application's property file.
3. Obtain the source code by following instructions in [Building from source](#building-from-source). 

   Note - Follow step 4 before building the source.
4. Copy the client key and client secret values of each application obtained from step 2.

   To obtain these values, you can visit your service provider and expand Inbound Authentication Configuration section.
   There expand OIDC configuration section to reveal the values. Copy and replace these values in the appropriate property
   file of the sample application.
5. Build the source code by following build commands in [Building from source](#building-from-source)
6. Deploy applications, `pickup-dispatch.war` and `pickup-manager.war` using Apache Tomcat.
7. Try out SSO behavior by log in to one application and visiting the other application.

   By default, these application runs on url [http://localhost:8080/pickup-dispatch/](http://localhost:8080/pickup-dispatch/)
   and [http://localhost:8080/pickup-manager/](http://localhost:8080/pickup-manager/)

**NOTE:** Some browsers do not support cookie creation for naked host names (ex:- localhost). SSO functionality require cookies 
in the browser. This is the reason to use `localhost.com` host name for sample applications. You will require to add this entry 
to `hosts` file. For windows this file locations is at `<Windows-Installation-Drive>\Windows\System32\drivers\etc\hosts`.
For Linux/Mac OS, this file location is at `/etc/hosts`