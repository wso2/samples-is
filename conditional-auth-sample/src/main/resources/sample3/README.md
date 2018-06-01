# Deny Authentication Based On User Attribute/Claim

This sample demonstrates a scenario where user will be authenticated if a pre defined condition is met regards to an
attribute of the user.

### Use Case

'PickUp.com' does not allow users which are under the age of 18 to log in to the system.

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

5. Start WSO2 Identity Server and Apache Tomcat Server.
   
### Running the Sample

Navigate to `<SAMPLE_HOME>/ConditionalAuthSamples/sample2` in terminal and execute the configuration script 
`sh configure_sample2.sh`

The script will,
- Add users *cameron*, *alex* & *jimmy*
- Create service providers for dispatch and swift web applications and configure them.
- Configure Basic Authentication
- Configure the conditional authentication script.

Following users are added to the system,
  
| Username | Password   | DoB        |
|----------|------------|------------|
| cameron  | cameron123 | 1990-09-09 |
| alex     | alex123    | 1978-12-21 |
| jimmy    | jimmy123   | 2005-05-02 |


### Trying Out the Sample

Try to login to any of the dispatch or swift applications using one of the above users. You may notice that it will 
allow *cameron* and *alex* to log in to the system but not *jimmy*.

Dispatch - [http://localhost:8080/saml2-web-app-dispatch.com/](http://localhost:8080/saml2-web-app-dispatch.com/)

Swift - [http://localhost:8080/saml2-web-app-swift.com/](http://localhost:8080/saml2-web-app-swift.com/)

## Conditional Authentication Script

Following script is used to check and decide whether to authenticate or not based on the date of birth attribute. 

```javascript
function onInitialRequest(context) {
    executeStep(1, {
        onSuccess: function(context) {
            // Extracting authenticated subject
            var subject = context.steps[1].subject;
            // Extracting claims/attributes of the subject
            var dateOfBirth = subject.localClaims['http://wso2.org/claims/dob'];
            
            if (!dateOfBirth || getAge(dateOfBirth) < 18) {
                Log.info("User: " + subject.username + " is below the allowed age limit");
                // Error page URL to redirect to. This can be a custom URL
                var errorPageURL = "/authenticationendpoint/retry.do";
                // Error message: parameters mentioned here will be passed as query params to the error page
                var errorMessage = {
                    status: "Login Restricted",
                    statusMsg: "User: " + subject.username + " is Not Allowed to login to the system."
                };
                // Redirecting to the error page
                sendError(errorPageURL, errorMessage);
            }
        }
    });
}

// Get Age from the birth date
function getAge(dateOfBirth) {
    var diff = Date.now() - new Date(dateOfBirth).getTime();
    return Math.abs(new Date(diff).getFullYear() - 1970);
}
```
