# WSO2 IAM - Quick Start Guide #

This Quick Start Guide(QSG) is used to demonstrate key features of WSO2
Identity server(IS) using scenarios given below.

    1 - Configuring Single-Sign-On with SAML2
    2 - Configuring Single-Sign-On with OIDC
    3 - Configuring Multi-Factor Authentication
    4 - Configuring Twitter as a Federated Authenticator
    5 - Setting up Self-Signup
    6 - Creating a workflow
       
## Table of contents

- [Getting started](#getting-started)
- [Building the distribution from source](#building-the-distribution-from-source)

## Getting started

### Prerequisites

Make sure you have following installed/available in your system,

* [WSO2 Identity Server](https://wso2.com/identity-and-access-management)
* [cURL](https://curl.haxx.se/download.html)

cURL is required to run QSG only. It is not a requirement for WSO2 IS.

### Running samples

1. Download and unzip the WSO2 IS QSG [distribution](https://github.com/wso2/samples-is/releases/latest).
   Distribution is named `is-samples-<version>.zip`
   
   In the following instructions, `<IS_SAMPLE_DISTRO>` is the directory which contains the downloaded distribution.
2. Start your WSO2 IS.
3. Start applications by running `sh app-server.sh` or `app-server.bat` command from `<IS_SAMPLE_DISTRO>/IS-QSG/bin` folder
4. Start QSG by running `sh qsg.sh` or `qsg.bat` from `<IS_SAMPLE_DISTRO>/IS-QSG/bin` folder

## Building the distribution from source

Alternatively, you can build the QSG from the source code using the following instructions.

### Prerequisites

* [Maven](https://maven.apache.org/download.cgi)
* [Java](http://www.oracle.com/technetwork/java/javase/downloads)

### Building from source

1. Get a clone or download source of [WSO2 sample-is repository](https://github.com/wso2/samples-is).
   We will refer this directory as `<IS_SAMPLE_REPO>` here onwards.
2. Run the Maven command `mvn clean install` from `<IS_SAMPLE_REPO>` directory.

    Distribution can be found at `<IS_SAMPLE_REPO>/distribution/target/` directory. You can use this distribution to follow
[Getting started](#getting-started) guide.
