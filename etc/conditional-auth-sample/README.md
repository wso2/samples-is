# Conditional Authentication Samples

Conditional Authentication feature, allows configuring dynamic sequences based on runtime parameters such as the user’s 
IP address, user role, etc. To define a dynamic sequence, you can change the authentication flow based on conditions in 
JavaScript. JavaScript can control the authentication step selection, change user attributes, etc. This allows 
developers to easily inject new functions to support dynamic sequences with runtime parameters. The JS editor available 
in the WSO2 IS management console can be used to introduce new conditional flows and engage the script to the service 
provider’s authentication step configuration.

This set of samples demonstrate some of the capabilities which can be done using conditional authentication.

- [Sample 1: Authentication steps based on the tenant domain](https://github.com/wso2/samples-is/tree/master/conditional-auth-sample/src/main/resources/sample1)
- [Sample 2: Enforcing Multi-factor Authentication Based On User-Agent](https://github.com/wso2/samples-is/tree/master/conditional-auth-sample/src/main/resources/sample2)
- [Sample 3: Deny Authentication Based On User Attribute/Claim](https://github.com/wso2/samples-is/tree/master/conditional-auth-sample/src/main/resources/sample3)
- [Sample 4: Sending Email Notification if Login Occurs Outside the Corporate IP List](https://github.com/wso2/samples-is/tree/master/conditional-auth-sample/src/main/resources/sample4)

## Getting Started
1. Download and unzip the `is-samples-<version>.zip` from the [releases](https://github.com/wso2/samples-is/releases) 
section.
2. Deploy the sample web apps on the tomcat server.
3. Start your WSO2 Identity server.
4. Start your Tomcat server.
5. Navigate to `<SAMPLE_HOME>/ConditionalAuthSamples/sample<n>/` and run `sh configure_sample<n>.sh`

***NOTE:*** *Each sample may require additional prerequisite configurations and other steps. Please read through the
sample documentation before running each sample.*

## Download and install

### Download the binary

You can download the `is-samples-\<version\>.zip` from the [releases](https://github.com/wso2/samples-is/releases) 
section.

### Install from source

Alternatively, you can install the Identity Server Samples from the source using the following instructions.

#### Prerequisites

- [Maven](https://maven.apache.org/download.cgi)
- [Java](http://www.oracle.com/technetwork/java/javase/downloads)
- [WSO2 Identity Server](https://wso2.com/identity-and-access-management)
- [Apache Tomcat server](https://tomcat.apache.org/download-80.cgi)

#### Building from the source

1. Get a clone or download source from this repository
2. Navigate to `distribution` directory and run command `mvn clean install` 
3. Unzip the `target/is-samples-1.0.0.zip`
4. Deploy the sample web apps on the tomcat server.
5. Start your WSO2 Identity server.
6. Start your Tomcat server.
7. Navigate to `<SAMPLE_HOME>/ConditionalAuthSamples/sample<n>/` and run `sh configure_sample<n>.sh`
