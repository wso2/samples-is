# Enforcing Multi-factor Authentication Based On User-Agent

This sample demonstrates a scenario where authentication steps for a user is decided on the user agent used to log in to
the system. User agent is extracted from the 'User-Agent' header which includes in the authentication request.

### Use Case

'PickUp.com' company allows users to log in to the application from mobile browsers. However they want to force them to 
authenticate the users log in from mobile devices by a second factor.

## Getting Started

### Prerequisites

1. This sample requires WSO2 Identity Server 5.6.0 or a later release. Hence 
   [download and install](https://docs.wso2.com/display/IS560/Installing+on+Linux+or+OS+X) latest WSO2 Identity Server 
   release.

2. Download and install [Apache Tomcat server](https://tomcat.apache.org/download-80.cgi).

3. Download and unzip the `is-samples-<version>.zip` from the [releases](https://github.com/wso2/samples-is/releases) 
   section or build the [is-samples](https://github.com/wso2/samples-is) project and unzip the 
   `is-samples-<version>.zip` which can be found in the `distribution/target` directory. (Unzipped directory will be 
   called `<SAMPLE_HOME>` hereafter)
   
4. Copy the `.war` files inside the `SAML2-APPS` directory and deploy in tomcat server.

5. This sample requires sample authenticators for multi-factor authentication step configurations. In order to get the 
   sample authenticators follow the section: [Getting Sample Authenticators](#getting-sample-authenticators)

6. Start WSO2 Identity Server and Apache Tomcat Server.

### Getting Sample Authenticators

1. Follow the [documentation](https://docs.wso2.com/display/IS560/Downloading+a+Sample) to download samples.

2. Navigate to the `is-samples/modules/samples/authenticators` directory and build it using the following command.
   
   `mvn clean install`
   
3. Copy the `org.wso2.carbon.identity.sample.extension.authenticators-<VERSION_NUMBER>.jar`
   file found inside the `authenicators/components/org.wso2.carbon.identity.sample.extension.authenticators/target`
   directory to `<IS_HOME>/repository/components/dropins` directory.
   
4. Copy the `sample-auth.war` file found inside the
   `product-is/modules/samples/authenticators/components/org.wso2.carbon.identity.sample.extension.auth.endpoint/target`
   directory to `<IS_HOME>/repository/deployment/server/webapps` directory.
   
### Running the Sample

Navigate to `<SAMPLE_HOME>/ConditionalAuthSamples/sample2` in terminal and execute the configuration script 
`sh configure_sample2.sh`

The script will,
- Add users *cameron* and *alex*
- Create service providers for dispatch and swift web applications and configure them.
- Configure two authentication steps
  * Step 1: Basic authentication
  * Step 2: Hardware Key Authentication (One of the sample authenticators)
- Configure the conditional authentication script.

Following users are added to the system,
  
| Username | Password   |
|----------|------------|
|cameron   | cameron123 |
|alex      | alex123    |

### Trying Out the Sample

Try to login to any of the dispatch or swift applications using one of the above users. You can switch the user agent 
to a mobile agent by using a [browser plugin](https://www.google.lk/search?q=User+agent+switch+plugin+for+browsers&oq=User+agent+switch+plugin+for+browsers&aqs=chrome..69i57.10976j0j1&sourceid=chrome&ie=UTF-8).

Dispatch - [http://localhost:8080/saml2-web-app-dispatch.com/](http://localhost:8080/saml2-web-app-dispatch.com/)

Swift - [http://localhost:8080/saml2-web-app-swift.com/](http://localhost:8080/saml2-web-app-swift.com/)

## Conditional Authentication Script

Following script is used to check and enforce users to use two-factor authentication when log in from mobile user 
agents. 

```javascript
function onInitialRequest(context) {
    executeStep(1, {
        onSuccess: function(context) {
            // Extracting user agent from the request headers
            var userAgent = context.request.headers["user-agent"];
            Log.info("user-agent: " + context.request.headers["user-agent"]);

            if (isMobile(userAgent)) {
                Log.info("User has logged from a mobile device. Prompting Hardware Key Authentication");
                // Enforcing authentication step 2 for the user log in from mobile devices
                executeStep(2);
            }
        }
    });
}

// A function to test if the user agent is a mobile agent.
function isMobile(userAgent) {
    return (/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/).test(userAgent);
}
```
