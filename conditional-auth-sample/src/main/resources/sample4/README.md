# Sending Email Notification if Login Occurs Outside the Corporate IP List

This sample demonstrates a scenario where user will be notified with an email if the user logged in from an IP address 
outside a given address range.

### Use Case

'PickUp.com' has a set of IP addresses as their corporate IP addresses and if a user logged in from an ip address which
is outside the allowed set of ip addresses, login review notification is send to the user.

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
   
4. Enable email notifications of the identity server by following the [documentation](https://docs.wso2.com/display/IS560/Enabling+Notifications+for+User+Operation). 
   
5. Copy the `.war` files inside the `SAML2-APPS` directory and deploy in tomcat server.

6. Start WSO2 Identity Server and Apache Tomcat Server
   
7. Create a user in the WSO2 Identity Server and fill the User Profile information with a correct email address and 
   first and the last name.
   
### Running the Sample

Navigate to `<SAMPLE_HOME>/ConditionalAuthSamples/sample4` in terminal and execute the configuration script 
`sh configure_sample4.sh`

***NOTE:*** *You will be required to provide the allowed ip range in the format of ip subnet and mask 
(e.g. 192.168.8.0/22).*

The script will,
- Create service providers for dispatch and swift web applications and configure them.
- Configure Basic Authentication
- Configure the conditional authentication script.


### Trying Out the Sample

Try to login to any of the dispatch or swift applications from the user created in the [Prerequisites](#prerequisites)
section. Please note that you may have to log in to the system from a device which is not belong to the ip range you 
have provided as the input.

Dispatch - [http://localhost:8080/saml2-web-app-dispatch.com/](http://localhost:8080/saml2-web-app-dispatch.com/)

Swift - [http://localhost:8080/saml2-web-app-swift.com/](http://localhost:8080/saml2-web-app-swift.com/)

## Conditional Authentication Script

Following script is used to check and decide whether to authenticate or not based on the date of birth attribute. 

```javascript
function onInitialRequest(context) {
    executeStep({
        id: '1',
        on: {
            success: function (context) {
                // Allowed user ip range should be given as subnet with mask. E.g. 192.168.8.0/22
                var allowedRange = '${ALLOWED_IP_RANGE}';
                // Extracting authenticated subject
                var user = context.steps[1].subject;
                // Extracting the origin IP of the request
                var loginIp = context.request.ip;

                Log.info("User: " + user.username + " logged in from IP: " + loginIp);
                
                // Checking if the IP is within the allowed range                
                if (!isAllowedIp(loginIp, allowedRange)) {
                    // Parameters to fill in the placeholders in the email template
                    var emailAttributes = {
                        'display-name': user.localClaims['http://wso2.org/claims/givenname'],
                        'ip-addr': loginIp,
                        'user-agent': context.request.headers["user-agent"]
                    };

                    if (sendEmail(user, 'LoginWarning', emailAttributes)) {
                        Log.info("Sending email to user with the login details- User: " + subject.username + " IP: " + loginIp);
                    } else {
                        Log.info("Error occurred while trying to send an email");
                    }
                }
            }
        }
    });
}

// Vanilla javascript function to convert ip address string to long value
function convertIpToLong(ip) {
    var components = ip.split('.');
    if (components) {
        var ipAddr = 0, pow = 1;
        for (var i = 3; i >= 0; i -= 1) {
            ipAddr += pow * parseInt(components[i]);
            pow *= 256;
        }
        return ipAddr;
    } else {
        return -1;
    }
}

// Vanilla javascript function to check if the ip address is within the given subnet
function isAllowedIp(ip, subnet) {
    var components = subnet.split('/');
    var minHost = convertIpToLong(components[0]);
    var ipAddr = convertIpToLong(ip);
    var mask = components[1];
    if (components && minHost >= 0) {
        var numHosts = Math.pow(2, 32 - parseInt(mask));
        return (ipAddr >= minHost) && (ipAddr <= minHost + numHosts - 1);
    } else {
        return false;
    }
}
```
