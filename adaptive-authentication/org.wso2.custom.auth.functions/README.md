# wso2-custom-adaptive-auth-function

*Steps to deploy*
- Build the sample using maven `mvn clean install`
- Copy the `org.wso2.custom.auth.functions-1.0.0` binary file from `target` directory into 
  `<IS_HOME>/repository/components/dropins` directory
- Restart WSO2 IS

**getUsernameFromContext()**

This custom function can be used to retrieve the username from the authentication context.

Example usage.
```
var onLoginRequest = function(context) {
    executeStep(1, {
        onSuccess: function (context) {
            var userName = getUsernameFromContext(context, 1);
            Log.info("Username: " + userName);
        } 
    });
};
```
