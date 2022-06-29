This user store is compatible with IS 5.10.0 and have the custom unique user id jdbc user store implementation.

# Steps


1. Build this using `mvn clean install` command 
2. Copy the `org.wso2.custom.user.store-1.0.0.jar` file to `<IS-HOME>\repository\components\dropins` folder
3. Configure your deployment.toml file with the following configurations

- If you are using IS 5.11.0
  
Here, you need to configure the custom user store manager including the existing user store managers.
```
[user_store_mgt]
allowed_user_stores=["org.wso2.carbon.user.core.jdbc.UniqueIDJDBCUserStoreManager", "org.wso2.carbon.user.core.ldap.UniqueIDActiveDirectoryUserStoreManager","org.wso2.carbon.user.core.ldap.UniqueIDReadOnlyLDAPUserStoreManager","org.wso2.carbon.user.core.ldap.UniqueIDReadWriteLDAPUserStoreManager","org.wso2.custom.user.store.CustomUserStoreManager"]
```

- If you are using IS 6.0.0

Here, you just need to configure the custom user store manager.
```
[user_store_mgt]
custom_user_stores=["org.wso2.custom.user.store.CustomUserStoreManager"]
```



4. Restart the Identity Server.