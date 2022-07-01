How to Setup Sample
==================

1. Download WSO2 Identity Server 4.5.0 and unzip it.

2. Configure MySQL database as "Kmarket" user store. You can find the database script from following blog post

http://xacmlinfo.org/2011/12/18/writing-jdbc-pip-module/

3. Configure new data source configuration using master-datasources.xml file which can be found at <IS_HOME>/repository/conf/datasources directory

   Sample configuration would be as follows

           <datasource>
               <name>KMARKET_USER_DB</name>
               <description>The datasource used for registry and user manager</description>
               <jndiConfig>
                   <name>jdbc/KMARKETUSERDB</name>
               </jndiConfig>
               <definition type="RDBMS">
                   <configuration>
                       <url>jdbc:mysql://localhost:3306/kmarketdb</url>
                       <username>root</username>
                       <password>asela</password>
                       <driverClassName>com.mysql.jdbc.Driver</driverClassName>
                       <maxActive>50</maxActive>
                       <maxWait>60000</maxWait>
                       <testOnBorrow>true</testOnBorrow>
                       <validationQuery>SELECT 1</validationQuery>
                       <validationInterval>30000</validationInterval>
                   </configuration>
               </definition>
           </datasource>


4. Copy org.xacmlinfo.xacml.pip.jdbc-1.0.0.jar which can be found at resources/lib  in to <IS_HOME>/repository/components/lib

5. Copy JDBC driver jar file (ex- mysql-connector-java-5.1.10-bin.jar which can be found at resources/lib)  in to <IS_HOME>/repository/components/lib

6. Register your PIP module  by opening the entitlement.properties file which can be found at <IS_HOME>/repository/conf/security  directory. Here is my sample configuration

PIP.AttributeDesignators.Designator.2=org.xacmlinfo.xacml.pip.jdbc.KMarketJDBCAttributeFinder
#Define JNDI datasource name as property value
org.xacmlinfo.xacml.pip.jdbc.KMarketJDBCAttributeFinder.1=DataSourceName,jdbc/KMARKETUSERDB

7. Start server by running  wso2server script file which can be found at <IS_HOME>/bin

8. Login to management console and import policies which can be found in  resources directory.

9. Promote policies to PDP and enable them to make them in avaliable for PDP run time.

10. Run the sample using  run script file  (If you need to configure identity server data,  you can use config.properties file which can be found at src/main/resources directory)

