# Openid connect sso demonstration using two applications Dispatch and Swift.
In order to check sigle sign on using OIDC, please follow the steps

1) Start the wso2 identity server.
2) Create two service provider(dispatch, swift) with oidc as the inbound protocol using management console.
3) clone the project QSGDemo
4) Copy the client id and client secret of each application got from step2 to the appropriate property files.(For example you can find the dispatch property file in QSGDemo/Dispatch/src/main/resources/dispatch.properties)
5) Build the project using "mvn clean install" (you can build from the parent pom or child poms)
6) Copy the war files (Dispatch.war and Swift.war) to the <CATALINA_HOME>/webapps folder.
7) Start the tomcat server.
8) Try out single sign on flow.

Note:-Please add the host names used for the applications to your etc/hosts file. You can find the needed host names through the property files. Addition to that, use the call back urls in the property files when configuring inbound protocols for each service providers

 
