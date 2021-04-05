# Custom Claim Provider

### Purpose
This sample OSGI service can be used to add new claims to ID token in OpenID Connect protocol in Identity Server. 
According to the current implementation, there is no any way to insert claims into ID Token from outside.
This ClaimProvider OSGi service can be plugged in, if you want to add claims into ID Token in our own way, 
rather than changing the existing code base, this service can be used. So this service can be plugged in and can be 
used to inject claims into ID Token.

### How to write custom claim provider

1. Implement the service interface

    [ClaimProvider interface](https://github.com/wso2-extensions/identity-inbound-auth-oauth/blob/master/components/org.wso2.carbon.identity.oauth/src/main/java/org/wso2/carbon/identity/openidconnect/ClaimProvider.java) 
    has two methods. So anyone can implement this interface and publish the service as in this sample Claim Provider.
    
    First methods can be used when the ID Token request comes from Authorize endpoint and second method can be used when 
    ID Token request comes from the token endpoint.
    
    ClaimProvider service can be implemented in a way that can inject new claims to ID token in Identity Server. 
    This is a convenient way to insert new claims without doing any change in the code base of DefaultIDTokenBuilder.
    As done in this Custom Claim Provider, you need to simply return a Map which has claim name and value pair.

2. Publish the service.

    After implementing the ClaimProvider service, you need to publish the service. Then only OAuth component in IS can 
    find your service and consume it. To publish the service, You can use a Service component.

### Deploy the Sample

1. Run the below maven command from custom-claim-provider directory,

    `mvn clean install`
    
2. Navigate to <custom-claim-provider>/target directory and copy `custom-claim-provider-1.0.0.jar` and paste it in the 
<IS_SERVER_HOME>/repository/components/dropins directory.

3. Restart WSO2 Identity Server.

### Test the Sample

Now , by using this service, without changing the existing code, sid claim can be inserted into ID Token. Sample ID 
token payload which can be generated after deploying the custom-claim-provider is as follows. 
There we can observe that the injected `sid` claim has been added to the ID token.

```
{
  "at_hash": "0W6NbbJyCy3_NMGbcWDlYA",
  "aud": "_O8Sfj0YU2lBpCDVt99x8qsE5hsa",
  "sub": "admin",
  "nbf": 1606837150,
  "azp": "_O8Sfj0YU2lBpCDVt99x8qsE5hsa",
  "amr": [
    "password"
  ],
  "iss": "https://localhost:9443/oauth2/token",
  "exp": 1606840750,
  "iat": 1606837150,
  "sid": "123-1bc-879-uk3"
}
```
Similarly, there can be so many instances which need to inject new claims for some specific purposes. 
In that case, this OSGi service can be modified and used.
