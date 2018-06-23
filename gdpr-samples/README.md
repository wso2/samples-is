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

- [Download and install](#download-and-install)
- [Getting started](#getting-started)

## Getting started

1. Download and unzip the is-samples-1.0.0.zip
2. Navigate GDPR-QSG/sample-apps
3. Deploy the sample web apps on the tomcat server.
4. Start your WSO2 Identity server.
5. Start your Tomcat server.
6. Run sh gdpr.sh/gdpr.bat from GDPR-QSG/resources.

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
2. Run the Maven command mvn clean install from within the samples-is directory.
3. Unzip the is-samples-1.0.0.zip
4. Navigate to samples-is/distribution/target/is-samples-1.0.0/GDPR-QSG/sample-apps
5. Deploy the sample web apps on the tomcat server.
6. Start your WSO2 Identity server.
7. Start your Tomcat server.
8. Run sh gdpr.sh/gdpr.bat from GDPR-QSG/resources.
