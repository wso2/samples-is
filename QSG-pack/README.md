# WSO2 IAM - Quick Start Guide #

This is a Quick Start Guide is use to demonstrate the key functionalities of WSO2
Identity server using the seven scenarios given below.

       1 - Configuring Single-Sign-On with SAML2
       2 - Configuring Single-Sign-On with OIDC
       3 - Configuring Multi-Factor Authentication
       4 - Configuring Twitter as a Federated Authenticator
       5 - Setting up Self-Signup
       6 - Creating a workflow
       
## Building from source ##

1. Download and install JDK 8.
2. Download the latest WSO2 Identity server pack from [here](https://wso2.com/identity-and-access-management).
3. Download Tomcat 8 server.
4. Get a clone or download source from this repository
5. Run the Maven command mvn clean install from within the distribution directory.
6. Unzip the IS-samples-1.0.0.zip
7. Deploy the sample web apps on the tomcat server.
8. Start your WSO2 Identity server.
9. Start your Tomcat server.
10. Run sh qsg.sh/qsg.bat from the QSG-bundle/QSG/bin.