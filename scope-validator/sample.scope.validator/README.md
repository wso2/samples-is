# wso2-custom-scope-validator

This sample scope validator is checking if there is any scope in the token or authorization request that starts with 
`test` prefix. If so, it will remove those scope from the request.

*Steps to deploy*
- Build the sample using maven `mvn clean install`
- Copy the `sample.scope.validator-1.0.0.jar` binary file from `target` directory into
  `<IS_HOME>/repository/components/dropins` directory
- Restart WSO2 IS
