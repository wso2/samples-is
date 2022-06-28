# Identity Event Handler extension.

Steps 

1. Build the source using mvn clean install command.
2. Copy org.wso2.carbon.identity.customhandler-1.0.0.jar file into <IS_HOME>/repository/components/dropins/ folder.
3. Add following configurations to <IS_HOME>/repository/conf/deployement.toml file
4. Restart the server. 
```

[[event_handler]]
name= "customUserRegistration"
subscriptions =["PRE_ADD_USER, POST_ADD_USER"]

```
