# Authentication Steps Based On Tenant Domain

This sample demonstrates a scenario where authentication steps for a user is decided on the tenant domain that the user 
belongs.

### Use Case

'PickUp.com' company has two departments 'Management' and 'Drivers' which  are registered as two tenants 
'management.pickup.com' and 'drivers.pickup.com' respectively. Users in both departments can access the dispatch and 
swift applications. Users in the drivers department are required to log in with their google credentials when accessing 
the system while the users from the management department are only required to log in using the username and the 
password.

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
   
4. [Register OAuth 2.0 Application](https://docs.wso2.com/display/IS560/Configuring+Google) in your Google account. 
   
5. Copy the `.war` files inside the `SAML2-APPS` directory and deploy in tomcat server.

6. Start WSO2 Identity Server and Apache Tomcat Server.

### Running the Sample

Navigate to `<SAMPLE_HOME>/ConditionalAuthSamples/sample1` in terminal and execute the configuration script 
`sh configure_sample1.sh`

***NOTE:*** *You will be required to provide the Client Id and the Secret of the registered OAuth 2.0 application in
order to configure the federated identity provider.*

The script will,
- Create two tenants 'management.pickup.com' and 'drivers.pickup.com'
- Add users in each tenant
- Create identity provider with google as the federated identity provider.
- Create service providers for dispatch and swift web applications and configure them.
- Configure two authentication steps
  * Step 1: Basic authentication
  * Step 2: Federated Google authentication
- Configure the conditional authentication script.

Following users are added to the system,
  
| Username                     | Password   |
|------------------------------|------------|
|cameron@management.pickup.com | cameron123 |
|john@management.pickup.com    | john123    |
|alex@drivers.pickup.com       | alex123    |
|tiger@drivers.pickup.com      | tiger123   |
|garrett@drivers.pickup.com    | garrett123 |

### Trying Out the Sample

Try to login to any of the dispatch or swift applications using one of the above users. For the users belong to the
drivers department will be prompted to log in using the Google credentials in order to access the system.

Dispatch - [http://localhost:8080/saml2-web-app-dispatch.com/](http://localhost:8080/saml2-web-app-dispatch.com/)

Swift - [http://localhost:8080/saml2-web-app-swift.com/](http://localhost:8080/saml2-web-app-swift.com/)

## Conditional Authentication Script

Following script is used to check and enforce users in the drivers department to login with Google credentials.

```javascript
function onInitialRequest(context) {
    executeStep(1, {
        onSuccess: function(context) {
            // Extracting authenticated subject from the authenticated step 1.
            var user = context.steps[1].subject;
            // Extracting tenant domain of the subject.
            var tenantDomain = user.tenantDomain;

            if (tenantDomain === "drivers.pickup.com") {
                Log.info("User: " + user.username + " is from the drivers.pickup.com tenant.");
                    executeStep(2);
            }
        }
    });
}
```
