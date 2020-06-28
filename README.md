# samples-is

samples-is a repository containing applications and guides that demonstrate capabilities of
[WSO2 Identity Sever](https://wso2.com/library/articles/2017/08/what-is-wso2-identity-server/). 

## Table of contents

- [Getting started](#getting-started)
- [Download and install](#download-and-install)
- [License](#license)

## Getting started

* [Quick Start Guide](https://github.com/wso2/samples-is/tree/master/quick-start-guide)
* [SAML2 SSO sample application](https://github.com/wso2/samples-is/tree/master/sso-samples/saml2-sso-sample)
* [OIDC SSO sample application](https://github.com/wso2/samples-is/tree/master/sso-samples/oidc-sso-sample)
* [Sample post authentication handler](https://github.com/wso2/samples-is/tree/master/etc/sample-post-authentication-handler)
* [Oauth sample client authenticator](https://github.com/wso2/samples-is/tree/master/etc/oauth-sample-client-authenticator)
* [Conditional authentication sample](https://github.com/wso2/samples-is/tree/master/etc/conditional-auth-sample)
* [Bulk User Import sample client]

## Download and install

### Download the binary

You can download the samples-is distribution from this [link](https://github.com/wso2/samples-is/releases/latest).
Distribution is named `is-samples-<version>.zip`

### Install from source

Alternatively, you can build the distribution from the source code using the following instructions.

#### Prerequisites

* [Maven](https://maven.apache.org/download.cgi)
* [Java](http://www.oracle.com/technetwork/java/javase/downloads)

#### Building the source

1. Get a clone or download source of this repository
2. Run the Maven command `mvn clean install` from source directory

### Directory tree of Samples

```bash
SAMPLES_HOME
├── analytics-extensions
│   ├── accountrecoveryendpoint
│   └── authenticationendpoint
├── authenticators
│   └── components
│       ├── org.wso2.carbon.identity.sample.extension.auth.endpoint
│       └── org.wso2.carbon.identity.sample.extension.authenticators
├── bulk-user-export-tool
│   └── scim-bulk-user-export-tool
├── bulk-user-import-sample
│   └── BulkUserImport
├── client-samples
│   ├── dotnet
│   │   ├── dotnet-agent-oidc-sso
│   │   └── dotnet-agent-saml-sso
│   └── oidc-client-app-samples
│       ├── android-client-app-sample
│       ├── browser-client-app-sample
│       ├── cordova-client-app-sample
│       └── ios-client-app-sample
├── distribution
├── etc
│   ├── backend-service
│   ├── claim-manager
│   ├── conditional-auth-sample
│   ├── consent-mgt
│   ├── entitlement
│   ├── gdpr-samples
│   ├── identity-mgt
│   ├── oauth-sample-client-authenticator
│   ├── pickup-sample-app
│   ├── resources
│   ├── sample-post-authentication-handler
│   └── sample-step-handler
├── helloworld
│   └── is-helloworld-app
├── host-endpoints-externally
├── identity-mgt
│   └── info-recovery-sample
├── microprofile
│   └── microprofile-jwt
├── mobile-proxy-idp
│   ├── android
│   └── ios
├── oauth
│   └── oauth10a-resource-owner-equivalent
├── oauth2
│   ├── custom-grant
│   ├── OIDC-Test-Suite
│   └── playground2
├── oidc-samples
│   ├── OIDC-SDK
│   ├── Pickup-Manager
│   └── spring-boot-app-sample
├── oidc-uma-samples
│   ├── common-resources
│   ├── jks-loader
│   ├── photo-edit
│   └── photo-view
├── openid
│   └── openid-client
├── passive-sts
│   └── passive-sts-client
│       ├── PassiveSTSFilter
│       └── PassiveSTSSampleApp
├── quick-start-guide
├── rest-api-samples
├── saml-query-profile-client
├── saml-query-profile-target
├── sample-customizations
│   └── custom-carbon-log-appender
├── sample-geovelocity
│   └── siddhi-execution-geovelocity
├── sample-ui-extensions
│   ├── accountrecoveryendpoint
│   └── authenticationendpoint
├── scim
│   └── scim-provisioning
├── scripts
├── sso
│   └── sso-agent-sample
├── sso-samples
│   ├── oidc-sso-sample
│   │   ├── oidc-jks-loader
│   │   ├── pickup-dispatch
│   │   └── pickup-manager
│   └── saml2-sso-sample
│       ├── saml2-web-app-pickup-dispatch
│       └── saml2-web-app-pickup-manager
├── sts
│   ├── lib
│   └── sts-client
├── tokenBinding
├── user-mgt
│   ├── remote-user-mgt
│   └── sample-custom-user-store-manager
├── workflow
│   ├── handler
│   │   └── service-provider
│   └── template
│       └── sample-template
└── xacml
    └── kmarket-trading-sample
```

## License

samples-is code is distributed under [Apache license 2.0](https://github.com/wso2/samples-is/blob/master/LICENSE).

