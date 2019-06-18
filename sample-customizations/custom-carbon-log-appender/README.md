## Custom Carbon Log Appender.
### Introduction / Use case.
This is a custom designed log appender that can be used to intercept logs in WSO2 Identity Server. The exact use case is as follows. 

The focus of this particular example is to replace CRLF characters in carbon logs. **C**arriage **R**eturn (ASCII 13, \r) **L**ine **F**eed (ASCII 10, \n) characters in logs represent new lines and therefore can be used to change the logs or add fake entries by attackers. For example, see the below log entry in the code and the output they produce.

Code

```
log.info("TEST LOG =============");
log.info("TEST LOG \n some string \r some other string \n John Doe");
log.info("TEST LOG =============");
```

Output

```
[2018-09-04 20:39:00,661]  INFO {org.wso2.carbon.user.core.ldap.ReadOnlyLDAPUserStoreManager} -  TEST LOG =============
[2018-09-04 20:39:00,663]  INFO {org.wso2.carbon.user.core.ldap.ReadOnlyLDAPUserStoreManager} -  TEST LOG 
 some string
 some other string 
 John Doe
[2018-09-04 20:39:00,663]  INFO {org.wso2.carbon.user.core.ldap.ReadOnlyLDAPUserStoreManager} -  TEST LOG =============
```


This is a popular security vulnerability known as [CRLF Injection](https://www.owasp.org/index.php/CRLF_Injection). Our simple solution to this problem is to is intercept all logs before appending to the log file and replace CRLF characters with a special character. Also, we're adding an additional text, **(Sanitized)** to the end of such entries so that we can find those easily for audit purposes.

### Applicable product versions.
Originally designed for WSO2 Identity Server 5.1.0

### How to use.
Follow below steps to use this log appender.
1. Build the project.
2. Copy the JAR file into **<IS_HOME>/repository/components/dropins** directory.
3. Open the file **<IS_HOME>/repository/conf/log4j.properties** file in a text editor and change the line,
  ```log4j.appender.CARBON_LOGFILE=org.wso2.carbon.utils.logging.appenders.CarbonDailyRollingFileAppender```
  to
  ```log4j.appender.CARBON_LOGFILE=org.wso2.carbon.custom.utils.logging.appenders.CarbonDailyRollingSanitizedFileAppender```
4. Restart the server. 

### Testing the project.
We can add above test log entry to any suitable module and patch it to see the output. I added above test log to the constructor of [ReadOnlyLDAPUserStoreManager](https://github.com/wso2/carbon-kernel/blob/v4.4.3/core/org.wso2.carbon.user.core/src/main/java/org/wso2/carbon/user/core/ldap/ReadOnlyLDAPUserStoreManager.java#L131) file accordingly. 

Once the server is restarted, you can see the modified logs are appending into **<IS_HOME>/repository/logs/wso2carbon.log** file. Modified log for above log entry is as follows.

```
TID: [-1234] [] [2018-09-04 20:39:00,661]  INFO {org.wso2.carbon.user.core.ldap.ReadOnlyLDAPUserStoreManager} -  TEST LOG ============= 
TID: [-1234] [] [2018-09-04 20:39:00,663]  INFO {org.wso2.carbon.user.core.ldap.ReadOnlyLDAPUserStoreManager} -  TEST LOG _ some string _ some other string _ John Doe (Sanitized) 
TID: [-1234] [] [2018-09-04 20:39:00,663]  INFO {org.wso2.carbon.user.core.ldap.ReadOnlyLDAPUserStoreManager} -  TEST LOG ============= 
```
