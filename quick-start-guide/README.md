# WSO2 IAM - Quick Start Guide #

This is a Quick Start Guide is use to demonstrate the key functionalities of WSO2
Identity server using the seven scenarios given below.

       1 - Configuring Single-Sign-On with SAML2
       2 - Configuring Single-Sign-On with OIDC
       3 - Configuring Multi-Factor Authentication
       4 - Configuring Twitter as a Federated Authenticator
       5 - Setting up Self-Signup
       6 - Creating a workflow
       
## Table of contents

- [Getting started](#getting-started)
- [Download and install](#download-and-install)
- [License](#license)
- [SAML2 sso sample](https://github.com/wso2/samples-is/tree/master/saml2-sso-sample)
- [OIDC sso sample](https://github.com/wso2/samples-is/tree/master/oidc-sso-sample)

## Getting started

1. Download and unzip the is-samples-1.0.0.zip
2. Deploy the sample web apps on the tomcat server.
3. Start your WSO2 Identity server.
4. Start your Tomcat server.
5. Run sh qsg.sh/qsg.bat from the QSG-bundle/QSG/bin.

## Download and install

### Download the binary

You can download the IAM Quick Start Guide binaries at link.

### Install from source

Alternatively, you can install the Quick Start Guide from the source using the following instructions.

#### Prerequisites

* [Maven](https://maven.apache.org/download.cgi)
* [Java](http://www.oracle.com/technetwork/java/javase/downloads)
* [WSO2 Identity Server](https://wso2.com/identity-and-access-management)
* [Apache Tomcat server](https://tomcat.apache.org/download-80.cgi)

#### Building the source

1. Get a clone or download source from this repository
2. Run the Maven command mvn clean install from within the distribution directory.
3. Unzip the is-samples-1.0.0.zip
4. Deploy the sample web apps on the tomcat server.
5. Start your WSO2 Identity server.
6. Start your Tomcat server.
7. Run sh qsg.sh/qsg.bat from the QSG-bundle/QSG/bin.
