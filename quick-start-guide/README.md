# WSO2 IAM - Quick Start Guide #

This Quick Start Guide(QSG) is used to demonstrate key features of WSO2
Identity server using scenarios given below.

       1 - Configuring Single-Sign-On with SAML2
       2 - Configuring Single-Sign-On with OIDC
       3 - Configuring Multi-Factor Authentication
       4 - Configuring Twitter as a Federated Authenticator
       5 - Setting up Self-Signup
       6 - Creating a workflow
       
## Table of contents

- [Getting started](#getting-started)
- [Download the distribution](#Download-the-distribution)
- [SAML2 sso sample](https://github.com/wso2/samples-is/tree/master/saml2-sso-sample)
- [OIDC sso sample](https://github.com/wso2/samples-is/tree/master/oidc-sso-sample)

## Getting started

1. Download and unzip the [distribution](https://github.com/wso2/samples-is/releases/latest) is-samples-*.zip
2. Start your WSO2 Identity Server.
3. Start applications by running `sh appStarter.sh`or `appStarter.bat` command from IS-QSG/bin folder
4. Start QSG by running `sh qsg.sh` or `qsg.bat` from IS-QSG/bin folder

### Download the distribution

You can download the IAM Quick Start Guide binaries at [link](https://github.com/wso2/samples-is/releases/latest) .

### Install from source

Alternatively, you can build the Quick Start Guide from the source using the following instructions.

#### Prerequisites

* [Maven](https://maven.apache.org/download.cgi)
* [Java](http://www.oracle.com/technetwork/java/javase/downloads)
* [WSO2 Identity Server](https://wso2.com/identity-and-access-management)
* [cURL](https://curl.haxx.se/download.html)

#### Building from source

1. Get a clone or download source of [WSO2 sample-is repository](https://github.com/wso2/samples-is). We will refer this directory as <IS_SAMPLE_HOME> here onwards.
2. Run the Maven command `mvn clean install` from <IS_SAMPLE_HOME> directory.

Distribution can be found at <IS_SAMPLE_HOME>/distribution/target/ directory. You can use this distribution to follow
[Getting started](#getting-started) guide.
