# GDPR Demo Samples

The Global Data Protection Regulation(GDPR) which was formed in EU will be effective from May 2018.
WSO2 Identity Server's architecture was reviewed and a set of new features like full consent lifecycle management and 
privacy toolkit was introduced to make sure that not only its latest releases but also the older versions can be used 
to build any GDPR compliant solution.

The following consent management concepts will be demonstrated by these samples.

    1. Purpose registration and granting consent
    2. Individual right
    3. Consent based data sharing
    4. Partner application integration
    5. Portability of personal data
    6. Forget me 

## Table of contents

- [Getting started](#getting-started)
- [Building the distribution from source](#building-the-distribution-from-source)

## Getting started

* [WSO2 Identity Server](https://wso2.com/identity-and-access-management)
* [Apache Tomcat server](https://tomcat.apache.org/download-80.cgi)
* [cURL](https://curl.haxx.se/download.html)

cURL is required to run QSG only. It is not a requirement for WSO2 IS.

### Running samples

1. Download and unzip the WSO2 IS QSG [distribution](https://github.com/wso2/samples-is/releases/latest).
   Distribution is named `is-samples-<version>.zip`
   
   In the following instructions, `<IS_SAMPLE_DISTRO>` is the directory which contains the downloaded distribution.
2. Start your WSO2 IS.
3. Start your Tomcat server.
4. Deploy the sample web apps on Apache Tomcat server.

   Sample webb apps can be found at `<IS_SAMPLE_DISTRO>/GDPR-QSG/sample-apps` directory.
5. Run `sh gdpr.sh` or `gdpr.bat` from `<IS_SAMPLE_DISTRO>/GDPR-QSG/resources` directory.

## Building the distribution from source

Alternatively, you can build the distribution from the source code using following instructions.

### Prerequisites

* [Maven](https://maven.apache.org/download.cgi)
* [Java](http://www.oracle.com/technetwork/java/javase/downloads)

### Building from source

1. Get a clone or download source of [WSO2 sample-is repository](https://github.com/wso2/samples-is).
   We will refer this directory as `<IS_SAMPLE_REPO>` here onwards.
2. Run the Maven command `mvn clean install` from `<IS_SAMPLE_REPO>` directory.

    Distribution can be found at `<IS_SAMPLE_REPO>/distribution/target/` directory. You can use this distribution to follow
[Getting started](#getting-started) guide.
