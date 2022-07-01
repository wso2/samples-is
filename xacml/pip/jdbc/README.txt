
How to use JDBC PIP attribute Finder Sample
-------------------------------------------

1. Configure new data source configuration using master-datasources.xml file which can be found at <IS_HOME>/repository/conf/datasources directory

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


2. Do any changes in the sample source and  Build the Sample using maven3

	> mvn clean install

3. Run the sql script which can be found at resources/dbScript  against the database that you have created

4. Copy created org.xacmlinfo.xacml.pip.jdbc-1.0.0.jar in to IS_HOME/repository/components/lib

5. Copy JDBC driver jar file (ex- mysql-connector-java-5.1.10-bin.jar) in to IS_HOME/repository/components/lib

6. Register your PIP module  by opening the entitlement.properties file which can be found at <IS_HOME>/repository/conf/security  directory. Here is my sample configuration

PIP.AttributeDesignators.Designator.2=org.xacmlinfo.xacml.pip.jdbc.KMarketJDBCAttributeFinder
#Define JNDI datasource name as property value
org.xacmlinfo.xacml.pip.jdbc.KMarketJDBCAttributeFinder.1=DataSourceName,jdbc/KMARKETUSERDB

7. Restart the Server.
