@echo off
set QSG=%cd%
SetLocal EnableDelayedExpansion
REM ----------------------------------------------------------------------------
REM  Copyright 2018 WSO2, Inc. http://www.wso2.org
REM
REM  Licensed under the Apache License, Version 2.0 (the "License");
REM  you may not use this file except in compliance with the License.
REM  You may obtain a copy of the License at
REM
REM      http://www.apache.org/licenses/LICENSE-2.0
REM
REM  Unless required by applicable law or agreed to in writing, software
REM  distributed under the License is distributed on an "AS IS" BASIS,
REM  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
REM  See the License for the specific language governing permissions and
REM  limitations under the License.

echo Please pick a scenario from the following.
echo "-----------------------------------------------------------------------------"
echo "|  Scenario 1 - Configuring Single-Sign-On with SAML2                       |"
echo "|  Scenario 2 - Configuring Single-Sign-On with OIDC                        |"
echo "|  Scenario 3 - Configuring Multi-Factor Authentication                     |"
echo "|  Scenario 4 - Configuring Twitter as a Federated Authenticator            |"
echo "|  Scenario 5 - Configuring Self-Signup                                     |"
echo "|  Scenario 6 - Creating a workflow                                         |"
echo "-----------------------------------------------------------------------------"
set /p scenario=Enter the scenario number you selected.

	IF "%scenario%"=="1" (
	REM Check whether the wso2-is and tomcat servers exits and if they don't download and install them.
	CALL :setup_servers
	CALL :configure_sso_saml2
	CALL :end_message saml2-web-app-dispatch.com saml2-web-app-swift.com
	EXIT 0
   	)

	IF "%scenario%"=="2" (
	REM Check whether the wso2-is and tomcat servers exits and if they don't download and install them.
	CALL :setup_servers
	CALL :configure_sso_oidc
	CALL :end_message Dispatch Swift
	EXIT 0
    )

	IF "%scenario%"=="3" (
	REM Check whether the wso2-is and tomcat servers exits and if they don't download and install them.
	CALL :setup_servers
	CALL :create_multifactor_auth
	CALL :end_message saml2-web-app-dispatch.com saml2-web-app-swift.com
	CALL :delete_idp 05 urn:deleteIdP https://localhost:9443/services/IdentityProviderMgtService.IdentityProviderMgtServiceHttpsSoap11Endpoint/
	EXIT 0
	)

	IF "%scenario%"=="4" (
	REM Check whether the wso2-is and tomcat servers exits and if they don't download and install them.
	CALL :setup_servers
	CALL :configure_federated_auth
	CALL :end_message saml2-web-app-dispatch.com saml2-web-app-swift.com
	CALL :delete_idp 05 urn:deleteIdP https://localhost:9443/services/IdentityProviderMgtService.IdentityProviderMgtServiceHttpsSoap11Endpoint/
	EXIT 0
    )

	IF "%scenario%"=="5" (
	REM Check whether the wso2-is and tomcat servers exits and if they don't download and install them.
	CALL :setup_servers
	CALL :configure_self_signup
	EXIT 0
	)

	IF "%scenario%"=="6" (
	CALL :setup_servers
	CALL :create_workflow
	EXIT 0
	)

:setup_servers

echo "Please enter the path to your WSO2-IS pack."
echo(
set /p WSO2_PATH="Example: C:\Downloads\WSO2_Products\wso2is-5.5.0"
echo(

IF NOT EXIST %WSO2_PATH% (
    echo "%WSO2_PATH% Directory does not exists. Please download and install the latest pack."
    exit -1
)

echo "Please enter the path to your Tomcat server pack."
echo(
set /p TOMCAT_PATH="Example: C:\Downloads\apache-tomcat-8.0.49"
echo(

IF NOT EXIST %TOMCAT_PATH% (
    echo Tomcat server does not exist in the given location %TOMCAT_PATH%.
    echo Please download and install the latest pack.
    exit -1
)

IF NOT EXIST "%TOMCAT_PATH%/webapps/saml2-web-app-dispatch.com.war" (
   echo Please deploy the sample webapps on the tomcat server.
   exit -1
)

EXIT /B

:configure_sso_saml2

REM Add users in wso2-is.
CALL :add_user admin admin Common

REM Add service providers in wso2-is
CALL :add_service_provider dispatch Common urn:createApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
CALL :add_service_provider swift Common urn:createApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz

REM Configure SAML for the service providers
CALL :configure_saml dispatch 02 urn:addRPServiceProvider https://localhost:9443/services/IdentitySAMLSSOConfigService.IdentitySAMLSSOConfigServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
CALL :configure_saml swift 02 urn:addRPServiceProvider https://localhost:9443/services/IdentitySAMLSSOConfigService.IdentitySAMLSSOConfigServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz

CALL :update_application_saml dispatch Y2FtZXJvbjpjYW1lcm9uMTIz urn:updateApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/
CALL :update_application_saml swift Y2FtZXJvbjpjYW1lcm9uMTIz urn:updateApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/

EXIT /B

:configure_sso_oidc

REM Add users in the wso2-is.
CALL :add_user admin admin Common

REM Add service providers in wso2-is
CALL :add_service_provider dispatch Common urn:createApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
CALL :add_service_provider swift Common urn:createApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz

REM Configure OIDC for the Service Providers
CALL :configure_oidc dispatch 03 urn:registerOAuthApplicationData https://localhost:9443/services/OAuthAdminService.OAuthAdminServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
CALL :configure_oidc swift 03 urn:registerOAuthApplicationData https://localhost:9443/services/OAuthAdminService.OAuthAdminServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz

CALL :update_application_oidc "dispatch" "Y2FtZXJvbjpjYW1lcm9uMTIz" "ZGlzcGF0Y2g=" "ZGlzcGF0Y2gxMjM0" "urn:updateApplication" "https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/"
CALL :update_application_oidc "swift" "Y2FtZXJvbjpjYW1lcm9uMTIz" "c3dpZnRhcHA=" "c3dpZnRhcHAxMjM=" "urn:updateApplication" "https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/"

EXIT /B

:create_multifactor_auth
echo(
echo "-------------------------------------------------------------------"
echo "|                                                                 |"
echo "|  We are configuring Twitter as the second authentication        |"
echo "|  factor. Therefore, you have to register an application         |"
echo "|  in https://apps.twitter.com/                                   |"
echo "|                                                                 |"
echo "|  So please make sure you have registered an application before  |"
echo "|  continuing the script.                                         |"
echo "|                                                                 |"
echo "|  Do you want to continue?                                       |"
echo "|                                                                 |"
echo "|  Press y - YES                                                  |"
echo "|  Press n - NO                                                   |"
echo "|                                                                 |"
echo "-------------------------------------------------------------------"
echo(
set /p input="Please enter your answer..."
     set result=false
     IF "%input%"=="y" set result=true
     IF "%input%"=="Y" set result=true
     IF "%result%" == "true" (
        CALL :configure_sso_saml2
        CALL :add_identity_provider admin admin
        CALL :updateapp_multi dispatch Y2FtZXJvbjpjYW1lcm9uMTIz urn:updateApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/
        CALL :updateapp_multi swift Y2FtZXJvbjpjYW1lcm9uMTIz urn:updateApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/
     )
     IF "%result%" == "false" (
        echo Please register a Twitter application and restart the script.
        exit -1
     )
EXIT /B

:configure_federated_auth
echo(
echo "-------------------------------------------------------------------"
echo "|                                                                 |"
echo "|  To configure Twitter as a federated authenticator you          |"
echo "|  have to register an application in https://apps.twitter.com/   |"
echo "|                                                                 |"
echo "|  So please make sure you have registered an application before  |"
echo "|  continuing the script.                                         |"
echo "|                                                                 |"
echo "|  Do you want to continue?                                       |"
echo "|                                                                 |"
echo "|  Press y - YES                                                  |"
echo "|  Press n - NO                                                   |"
echo "|                                                                 |"
echo "-------------------------------------------------------------------"
echo(
set /p user=Do you want to continue?
set result=false
IF "%user%"=="y" set result=true
IF "%user%"=="Y" set result=true
IF "%result%" == "true" (
    CALL :configure_sso_saml2
    CALL :add_identity_provider admin admin 05
    CALL :updateapp_fed_auth dispatch Y2FtZXJvbjpjYW1lcm9uMTIz urn:updateApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/
    CALL :updateapp_fed_auth swift Y2FtZXJvbjpjYW1lcm9uMTIz urn:updateApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/
)

IF "%result%" == "false" (
    echo Please register a Twitter application and restart the script.
    exit -1
)
EXIT /B

:configure_self_signup

echo(
echo "-----------------------------------------------------------------------"
echo "|                                                                     |"
echo "|  Please do the following before trying self signup.                 |"
echo "|                                                                     |"
echo "|  1. Open the file: output-event-adapters.xml in the path,           |"
echo "|     (Your WSO2-IS)/repository/conf.                                 |"
echo "|     Ex: wso2is-5.4.1/repository/conf/output-event-adapters.xml.     |"
echo "|                                                                     |"
echo "|  2. Find the adapter configuration for emails and change the        |"
echo "|     email address, username, password values.                       |"
echo "|                                                                     |"
echo "|  3. Finally, restart the server.                                    |"
echo "|                                                                     |"
echo "-----------------------------------------------------------------------"
echo(
echo "Have you make the above mentioned configurations?"
echo(
echo    "Press y - YES"
echo    "Press n - NO"
echo(
set /p input="Please enter your answer..."
    set result=false
    IF "%input%"=="n" ( set result=true )
    IF "%input%"=="N" ( set result=true )
    IF "%result%" == "true" (
        echo "Please make the necessary configurations and restart the script."
        echo(
        exit -1
    )

echo(
echo "-----------------------------------------------------------------------"
echo "|                                                                     |"
echo "|  You can configure self signup in WSO2 IS in three different ways.  |"
echo "|  So choose your desired approach from the list below to enable the  |"
echo "|  required settings.                                                 |"
echo "|                                                                     |"
echo "|    Press 1 - Enable Self User Registration(without any config.)     |"
echo "|               [ This will enable self signup in the IS without any  |"
echo "|               other configuration changes.]                         |"
echo "|                                                                     |"
echo "|    Press 2 - Enable account lock on creation                        |"
echo "|               [ This will lock the user account during user         |"
echo "|               registration. You can only log into the app after     |"
echo "|               after clicking the verification link sent to the      |"
echo "|               email address you provided.]                          |"
echo "|                                                                     |"
echo "|    Press 3 - Enable Notification Internally Management              |"
echo "|               [ Notify user on the account creation.]               |"
echo "|                                                                     |"
echo "-----------------------------------------------------------------------"
echo(

set /p user="Please enter the number you selected... "

IF "%user%"=="1" (
     CALL :update_idp_selfsignup "urn:updateResidentIdP" "https://localhost:9443/services/IdentityProviderMgtService.IdentityProviderMgtServiceHttpsSoap11Endpoint/" "YWRtaW46YWRtaW4=" "06" "selfsignup"
)

IF "%user%"=="2" (
    CALL :update_idp_selfsignup "urn:updateResidentIdP" "https://localhost:9443/services/IdentityProviderMgtService.IdentityProviderMgtServiceHttpsSoap11Endpoint/" "YWRtaW46YWRtaW4=" "06" "lockon"
)

IF "%user%"=="3" (
    CALL :update_idp_selfsignup "urn:updateResidentIdP" "https://localhost:9443/services/IdentityProviderMgtService.IdentityProviderMgtServiceHttpsSoap11Endpoint/" "YWRtaW46YWRtaW4=" "06" "notify"
)

REM Add a service provider in wso2-is
CALL :add_service_provider "dispatch" "Common" "urn:createApplication" "https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/" "YWRtaW46YWRtaW4="

REM Configure OIDC for the Service Providers
CALL :configure_oidc "dispatch" "03" "urn:registerOAuthApplicationData" "https://localhost:9443/services/OAuthAdminService.OAuthAdminServiceHttpsSoap11Endpoint/" "YWRtaW46YWRtaW4="

CALL :update_application_oidc "dispatch" "YWRtaW46YWRtaW4=" "ZGlzcGF0Y2g=" "ZGlzcGF0Y2gxMjM0" "urn:updateApplication" "https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/"

echo(
echo "-------------------------------------------------------------------"
echo "|                                                                 |"
echo "|  To tryout self registration please log into the sample         |"
echo "|  app below.                                                     |"
echo "|  *** Please press ctrl button and click on the link ***         |"
echo "|                                                                 |"
echo "|  Dispatch - http://localhost:8080/Dispatch/                     |"
echo "|                                                                 |"
echo "|  Click on the ** Register now ** link in the login page.        |"
echo "|  Fill in the user details form and create an account.           |"
echo "|                                                                 |"
echo "|  You can now use the username and password you provided, to     |"
echo "|  log into Dispatch.                                             |"
echo "|                                                                 |"
echo "-------------------------------------------------------------------"
echo(
echo "If you have finished trying out the sample web apps, you can clean the process now."
echo "Do you want to clean up the setup?"
echo(
echo "Press y - YES"
echo "Press n - NO"
echo(
set /p clean="Please enter the response... "
set result=false
     IF "%clean%"=="y" set result=true
     IF "%clean%"=="Y" set result=true
     IF "%result%" == "true" (
        CALL :delete_sp "dispatch" "Common" "urn:deleteApplication" "https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/" "YWRtaW46YWRtaW4="
     )
     IF "%result%" == "false" (
        echo Please clean up the process manually.
        exit -1
     )
EXIT /B

:create_workflow

REM Add users and the relevant roles in wso2-is.
CALL :add_users_workflow admin admin 07

REM Create the workflow definition
CALL :add_workflow_definition "07" "YWRtaW46YWRtaW4="

REM Create a workflow association
CALL :add_workflow_association "07" "YWRtaW46YWRtaW4="

REM Update resident IDP
CALL :update_idp_selfsignup "urn:updateResidentIdP" "https://localhost:9443/services/IdentityProviderMgtService.IdentityProviderMgtServiceHttpsSoap11Endpoint/" "YWRtaW46YWRtaW4=" "06" "selfsignup"

REM Add a service provider in wso2-is
CALL :add_service_provider "dispatch" "Common" "urn:createApplication" "https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/" "YWRtaW46YWRtaW4="

REM Configure OIDC for the Service Providers
CALL :configure_oidc "dispatch" "03" "urn:registerOAuthApplicationData" "https://localhost:9443/services/OAuthAdminService.OAuthAdminServiceHttpsSoap11Endpoint/" "YWRtaW46YWRtaW4="

CALL :update_application_oidc "dispatch" "YWRtaW46YWRtaW4=" "ZGlzcGF0Y2g=" "ZGlzcGF0Y2gxMjM0" "urn:updateApplication" "https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/"

echo(
echo(
echo "------------------------------------------------------------------"
echo "|                                                                |"
echo "|    The workflow feature enables you to add more control and    |"
echo "|    constraints to the tasks executed within it.                |"
echo "|                                                                |"
echo "|    Here we are going to try out a workflow which defines an    |"
echo "|    approval process for new user additions.                    |"
echo "|                                                                |"
echo "|    Use case: Senior manager and junior manager has to          |"
echo "|    approve each new user addition.                             |"
echo "|                                                                |"
echo "|    To tryout the workflow please log into the sample           |"
echo "|    app below.                                                  |"
echo "|    *** Please press ctrl button and click on the link ***      |"
echo "|                                                                |"
echo "|    Dispatch - http://localhost:8080/Dispatch/                  |"
echo "|                                                                |"
echo "|    Click on the ** Register now ** link in the login page      |"
echo "|    Fill in the user details form and create an account.        |"
echo "|                                                                |"
echo "|    But the new user you created will be disabled.              |"
echo "|    So to enable the user please log into the WSO2 dashboard    |"
echo "|    using the following credentials and approve the pending     |"
echo "|    workflow requests.                                          |"
echo "|                                                                |"
echo "|    WSO2 Dashboard: https://localhost:9443/dashboard            |"
echo "|                                                                |"
echo "|    First login with Junior Manager                             |"
echo "|      Username: alex                                            |"
echo "|      Password: alex123                                         |"
echo "|                                                                |"
echo "|    Secondly, login with Senior Manager                         |"
echo "|      Username: cameron                                         |"
echo "|      Password: cameron123                                      |"
echo "|                                                                |"
echo "|    Now you can use your new user credentials to log into       |"
echo "|    the app Dispatch:  http://localhost:8080/Dispatch/          |"
echo "|                                                                |"
echo "------------------------------------------------------------------"
echo(

echo "If you have finished trying out the workflow, you can clean the process now."
echo "Do you want to clean up the setup?"
echo(
echo "Press y - YES"
echo "Press n - NO"
echo(
set /p input="Please enter the response... "
set result=false
     IF "%input%"=="y" set result=true
     IF "%input%"=="Y" set result=true
     IF "%result%" == "true" (
        CALL :delete_users_workflow
        CALL :delete_workflow_association "07" "YWRtaW46YWRtaW4="
        CALL :delete_workflow_definition "07" "YWRtaW46YWRtaW4="
        CALL :delete_sp "dispatch" "Common" "urn:deleteApplication" "https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/" "YWRtaW46YWRtaW4="
     )
     IF "%result%" == "false" (
     echo Please clean up the process manually.
     exit -1
     )

EXIT /B

:add_workflow_association

set scenario=%~1
set auth=%~2
set request_data=%~1\add-association.xml

IF NOT EXIST "%QSG%\%~1" (
    echo "%~1 Directory does not exists."
    exit -1
)

IF NOT EXIST "%QSG%\%request_data%" (
    echo "%request_data% File does not exists."
    exit -1
)

curl -s -k -d @%QSG%\%request_data% -H "Authorization: Basic %auth%" -H "Content-Type: text/xml" -H "SOAPAction: urn:addAssociation" -o NUL https://localhost:9443/services/WorkflowAdminService.WorkflowAdminServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while creating the workflow association. !!"
  echo(
  CALL :delete_users_workflow
  CALL :delete_workflow_definition "07" "YWRtaW46YWRtaW4="
  echo(
  exit -1
)
echo "** The workflow association was successfully created. **"
echo(

EXIT /B

:update_idp_selfsignup

set soap_action=%~1
set endpoint=%~2
set auth=%~3
set scenario=%~4
set config=%~5

set request_data=%~4/update-idp-%~5.xml

IF NOT EXIST "%~4" (
    echo "%~4 Directory does not exists."
    exit -1
)

IF NOT EXIST "%request_data%" (
    echo "%request_data% File does not exists."
    exit -1
)

curl -s -k -d @%request_data% -H "Authorization: Basic %~3" -H "Content-Type: text/xml" -H "SOAPAction: %~1" -o NUL %~2
IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while updating the identity provider. !!"
  echo(
  exit -1
)
echo "** Identity Provider successfully updated. **"
echo(
EXIT /B

:add_user

set IS_name=%~1
set IS_pass=%~2
set scenario=%~3
set request_data=%~3\add-role.xml
echo(
echo Creating a user named cameron...

REM The following command can be used to create a user.
curl -s -k --user %~1:%~2 --data "{"schemas":[],"name":{"familyName":"Smith","givenName":"Cameron"},"userName":"cameron","password":"cameron123","emails":"cameron@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o NUL https://localhost:9443/wso2/scim/Users

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while creating user cameron. !!
  echo(
  exit -1
)
echo ** The user cameron was successfully created. **
echo(

echo Creating a user named alex...

REM The following command can be used to create a user.
curl -s -k --user %~1:%~2 --data "{"schemas":[],"name":{"familyName":"Miller","givenName":"Alex"},"userName":"alex","password":"alex123","emails":"alex@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o NUL https://localhost:9443/wso2/scim/Users

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while creating user alex. !!
  echo(
  CALL :delete_user
  echo(
  exit -1
)
echo ** The user alex was successfully created. **
echo(

echo Creating a role named Manager...

REM The following command will add a role to the user.
curl -s -k --user %~1:%~2 -d @%QSG%\%request_data% -H "Content-Type: text/xml" -H "SOAPAction: urn:addRole" -o NUL https://localhost:9443/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while creating role manager. !!
  echo(
  CALL :delete_user
  echo(
  exit -1
)
echo ** The role Manager was successfully created. **
echo(
EXIT /B

:add_users_workflow

set IS_name=%~1
set IS_pass=%~2
set scenario=%~3
set request_data1=%~3/add-role-senior.xml
set request_data2=%~3/add-role-junior.xml

IF NOT EXIST "%QSG%\%~3" (
    echo "%~3 Directory does not exists."
    exit -1
)

IF NOT EXIST "%QSG%\%request_data1%" (
    echo "%request_data1% File does not exists."
    exit -1
)

IF NOT EXIST "%QSG%\%request_data2%" (
    echo "%request_data2% File does not exists."
    exit -1
)

echo(
echo "Creating a user named cameron..."

REM The following command can be used to create a user.
curl -s -k --user %~1:%~2 --data "{"schemas":[],"name":{"familyName":"Smith","givenName":"Cameron"},"userName":"cameron","password":"cameron123","emails":"cameron@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o NUL https://localhost:9443/wso2/scim/Users
IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while creating user cameron. !!"
  echo(
  exit -1
)
echo "** The user cameron was successfully created. **"
echo(

echo "Creating a user named alex..."

REM The following command can be used to create a user.
curl -s -k --user %~1:%~2 --data "{"schemas":[],"name":{"familyName":"Miller","givenName":"Alex"},"userName":"alex","password":"alex123","emails":"alex@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o NUL https://localhost:9443/wso2/scim/Users

IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while creating user alex. !!"
  echo(
  CALL :delete_user
  echo(
  exit -1
)
echo "** The user alex was successfully created. **"
echo(

echo "Creating a role named senior_manager..."

REM The following command will add a role to the user.
curl -s -k --user %~1:%~2 -d @%QSG%\%request_data1% -H "Content-Type: text/xml" -H "SOAPAction: urn:addRole" https://localhost:9443/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while creating role senior_manager. !!"
  echo(
  CALL :delete_user
  echo(
  exit -1
)
echo "** The role senior_manager was successfully created. **"
echo(

echo "Creating a role named junior_manager..."

REM The following command will add a role to the user.
curl -s -k --user %~1:%~2 -d @%QSG%\%request_data2% -H "Content-Type: text/xml" -H "SOAPAction: urn:addRole" https://localhost:9443/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while creating role junior_manager. !!"
  echo(
  CALL :delete_user
  echo(
  exit -1
)
echo "** The role junior_manager was successfully created. **"
echo(
EXIT /B

:add_service_provider

set sp_name=%~1
set scenario=%~2
set soap_action=%~3
set endpoint=%~4
set auth=%~5
set request_data=%~2\create-sp-%~1.xml

IF NOT EXIST "%QSG%\%~2" (
    echo "%~2 Directory not exists."
    exit -1
)

IF NOT EXIST "%QSG%\%request_data%" (
    echo "%request_data% File does not exists."
    exit -1
)

echo Creating Service Provider %~1...

REM Send the SOAP request to create the new SP.
curl -s -k -d @%QSG%\%request_data% -H "Authorization: Basic %~5" -H "Content-Type: text/xml" -H "SOAPAction: %~3" -o NUL %~4

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while creating the service provider. !!
  echo(
  CALL :delete_sp dispatch Common urn:deleteApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  CALL :delete_sp swift Common urn:deleteApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  CALL :delete_user
  echo(
  exit -1
)
echo ** Service Provider %~1 successfully created. **
echo(
EXIT /B

:add_identity_provider

set IS_name=%~1
set IS_pass=%~2

echo(
echo "Please enter your API key"
set /p key="(This can be found in the Keys and Access token section in the Application settings)"
echo(
echo "Please enter your API secret"
set /p secret="(This can be found in the Keys and Access token section in the Application settings)"
echo(

echo "Creating Identity Provider..."
cd ..
curl -s -k --user %~1:%~2 -H "Content-Type: text/xml" -H "SOAPAction: urn:addIdP" -o NUL https://localhost:9443/services/IdentityProviderMgtService.IdentityProviderMgtServiceHttpsSoap11Endpoint/ -d "<soapenv:Envelope xmlns:soapenv="\"http://schemas.xmlsoap.org/soap/envelope/"\" xmlns:mgt="\"http://mgt.idp.carbon.wso2.org"\" xmlns:xsd="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><soapenv:Header/><soapenv:Body><ns4:addIdP xmlns:ns4="\"http://mgt.idp.carbon.wso2.org"\"><ns4:identityProvider><ns1:alias xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">https://localhost:9443/oauth2/token</ns1:alias><ns1:certificate xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\" xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/><claimConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><localClaimDialect>true</localClaimDialect><roleClaimURI>http://wso2.org/claims/role</roleClaimURI><userClaimURI xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/></claimConfig><defaultAuthenticatorConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><displayName>twitterIDP</displayName><enabled>true</enabled><name>TwitterAuthenticator</name><properties><name>APIKey</name><value>%key%</value></properties><properties><name>APISecret</name><value>%secret%</value></properties><properties><name>callbackUrl</name><value>https://localhost:9443/commonauth</value></properties></defaultAuthenticatorConfig><ns1:displayName xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\" xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/><ns1:enable xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">false</ns1:enable><federatedAuthenticatorConfigs xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><displayName>twitter</displayName><enabled>true</enabled><name>TwitterAuthenticator</name><properties><name>APIKey</name><value>%key%</value></properties><properties><name>APISecret</name><value>%secret%</value></properties><properties><name>callbackUrl</name><value>https://localhost:9443/commonauth</value></properties></federatedAuthenticatorConfigs><ns1:federationHub xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">false</ns1:federationHub><ns1:homeRealmId xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\" xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/><ns1:identityProviderDescription xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\" xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/><ns1:identityProviderName xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">IDP-twitter</ns1:identityProviderName><permissionAndRoleConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"/><ns1:provisioningRole xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\" xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/></ns4:identityProvider></ns4:addIdP></soapenv:Body></soapenv:Envelope>"
IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while creating the identity provider. !!"
  echo(
  exit -1
)
echo "** The identity provider was successfully created. **"
echo(
EXIT /B

:add_workflow_definition

set scenario=%~1
set auth=%~2
set request_data=%~1\add-definition.xml

IF NOT EXIST "%QSG%\%~1" (
    echo "%~1 Directory does not exists."
    exit -1
)

IF NOT EXIST "%QSG%\%request_data%" (
    echo "%request_data% File does not exists."
    exit -1
)

curl -s -k -d @%QSG%\%request_data% -H "Authorization: Basic %~2" -H "Content-Type: text/xml" -H "SOAPAction: urn:addWorkflow" -o NUL https://localhost:9443/services/WorkflowAdminService.WorkflowAdminServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while creating the workflow definition. !!"
  echo(
  CALL :delete_users_workflow
  echo(
  exit -1
)
echo "** The workflow definition was successfully created. **"
echo(
EXIT /B

:configure_saml

set sp_name=%~1
set scenario=%~2
set soap_action=%~3
set endpoint=%~4
set auth=%~5
set request_data=%~2\sso-config-%~1.xml

IF NOT EXIST "%QSG%\%~2" (
    echo %~2 Directory does not exists.
    exit -1
)

IF NOT EXIST "%QSG%\%request_data%" (
    echo "%request_data% File does not exists."
    exit -1
)

echo Configuring SAML2 web SSO for %~1...

REM Send the SOAP request for Confuring SAML2 web SSO.
curl -s -k -d @%request_data% -H "Authorization: Basic %~5" -H "Content-Type: text/xml" -H "SOAPAction: %~3" -o NUL %~4

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while configuring SAML2 web SSO for %~1.... !!
  echo(
  CALL :delete_sp dispatch Common urn:deleteApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  CALL :delete_sp swift Common urn:deleteApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  CALL :delete_user
  echo(
  exit -1
)
echo ** Successfully configured SAML. **
echo(
EXIT /B

:update_application_saml
cd %QSG%\02
set sp_name=%~1
set request_data=get-app-%~1.xml
set auth=%~2
set soap_action=%~3
set endpoint=%~4

IF NOT EXIST "%request_data%" (
    echo %request_data% File does not exists.
    exit -1
)

IF EXIST "response_unformatted.xml" (
   DEL response_unformatted.xml
)

curl -s -k -d @%request_data% -H "Authorization: Basic %~2" -H "Content-Type: text/xml" -H "SOAPAction: urn:getApplication" https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ > response_unformatted.xml

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while getting application details for %~1.... !!
  echo(
  CALL :delete_sp dispatch Common urn:deleteApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  CALL :delete_sp swift Common urn:deleteApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  CALL :delete_user
  echo(
  exit -1
)

FOR /F "tokens=*" %%A IN ('java -jar QSG-1.0.jar') DO SET app_id=%%A
FOR /L %%b IN (1,1,2) DO IF "!app_id:~-1!"==" " SET app_id=!app_id:~0,-1!
echo(
echo Updating application %~1...

REM Send the SOAP request to Update the Application.
curl -s -k -H "Authorization: Basic %~2" -H "Content-Type: text/xml" -H "SOAPAction: %~3" -o NUL %~4 -d "<soapenv:Envelope xmlns:soapenv="\"http://schemas.xmlsoap.org/soap/envelope/"\" xmlns:xsd="\"http://org.apache.axis2/xsd"\" xmlns:xsd1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><soapenv:Header/><soapenv:Body><xsd:updateApplication><xsd:serviceProvider><xsd1:applicationID>%app_id%</xsd1:applicationID><xsd1:applicationName>%~1</xsd1:applicationName><xsd1:claimConfig><xsd1:alwaysSendMappedLocalSubjectId>false</xsd1:alwaysSendMappedLocalSubjectId><xsd1:localClaimDialect>true</xsd1:localClaimDialect></xsd1:claimConfig><xsd1:description>sample service provider</xsd1:description><xsd1:inboundAuthenticationConfig><xsd1:inboundAuthenticationRequestConfigs><xsd1:inboundAuthKey>saml2-web-app-%~1.com</xsd1:inboundAuthKey><xsd1:inboundAuthType>samlsso</xsd1:inboundAuthType><xsd1:properties><xsd1:name>attrConsumServiceIndex</xsd1:name><xsd1:value>1223160755</xsd1:value></xsd1:properties></xsd1:inboundAuthenticationRequestConfigs></xsd1:inboundAuthenticationConfig><xsd1:inboundProvisioningConfig><xsd1:provisioningEnabled>false</xsd1:provisioningEnabled><xsd1:provisioningUserStore>PRIMARY</xsd1:provisioningUserStore></xsd1:inboundProvisioningConfig><xsd1:localAndOutBoundAuthenticationConfig><xsd1:alwaysSendBackAuthenticatedListOfIdPs>false</xsd1:alwaysSendBackAuthenticatedListOfIdPs><xsd1:authenticationStepForAttributes></xsd1:authenticationStepForAttributes><xsd1:authenticationStepForSubject></xsd1:authenticationStepForSubject><xsd1:authenticationType>default</xsd1:authenticationType><xsd1:subjectClaimUri>http://wso2.org/claims/fullname</xsd1:subjectClaimUri></xsd1:localAndOutBoundAuthenticationConfig><xsd1:outboundProvisioningConfig><xsd1:provisionByRoleList></xsd1:provisionByRoleList></xsd1:outboundProvisioningConfig><xsd1:permissionAndRoleConfig></xsd1:permissionAndRoleConfig><xsd1:saasApp>false</xsd1:saasApp></xsd:serviceProvider></xsd:updateApplication></soapenv:Body></soapenv:Envelope>"
echo ** Successfully updated the application %~1. **
cd ..
EXIT /B

:configure_oidc

set sp_name=%~1
set scenario=%~2
set soap_action=%~3
set endpoint=%~4
set auth=%~5
set request_data=%~2\sso-config-%~1.xml

echo Configuring OIDC web SSO for %~1...

REM Configure OIDC for the created SPs.
curl -s -k -d @%request_data% -H "Authorization: Basic %~5" -H "Content-Type: text/xml" -H "SOAPAction: %~3" -o NUL %~4

echo "** OIDC successfully configured for the Service Provider %~1. **"
echo(
EXIT /B

:update_application_oidc
cd %QSG%\03
set sp_name=%~1
set auth=%~2
set key=%~3
set secret=%~4
set soap_action=%~5
set endpoint=%~6
set request_data=get-app-%sp_name%.xml

IF NOT EXIST "%request_data%" (
    echo "%request_data% File does not exists."
    exit -1
)

IF EXIST "response_unformatted.xml" (
   DEL response_unformatted.xml
)

curl -s -k -d @%request_data% -H "Authorization: Basic %~2" -H "Content-Type: text/xml" -H "SOAPAction: urn:getApplication" https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ > response_unformatted.xml

IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while getting application details for %sp_name%.... !!"
  echo(
  CALL :delete_sp dispatch Common urn:deleteApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  CALL :delete_sp swift Common urn:deleteApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  CALL :delete_user
  echo(
  exit -1
)

FOR /F "tokens=*" %%A IN ('java -jar QSG-1.0.jar') DO SET app_id=%%A
FOR /L %%b IN (1,1,2) DO IF "!app_id:~-1!"==" " SET app_id=!app_id:~0,-1!
echo(
echo Updating application %~1...

REM Send the SOAP request to Update the Application.
curl -s -k -H "Authorization: Basic %~2" -H "Content-Type: text/xml" -H "SOAPAction: %~5" -o NUL %~6 -d "<soapenv:Envelope xmlns:soapenv="\"http://schemas.xmlsoap.org/soap/envelope/"\" xmlns:xsd="\"http://org.apache.axis2/xsd"\" xmlns:xsd1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><soapenv:Header/><soapenv:Body><xsd:updateApplication><xsd:serviceProvider><xsd1:applicationID>%app_id%</xsd1:applicationID><xsd1:applicationName>%~1</xsd1:applicationName><xsd1:claimConfig><xsd1:alwaysSendMappedLocalSubjectId>false</xsd1:alwaysSendMappedLocalSubjectId><xsd1:localClaimDialect>true</xsd1:localClaimDialect></xsd1:claimConfig><xsd1:description>oauth application</xsd1:description><xsd1:inboundAuthenticationConfig><xsd1:inboundAuthenticationRequestConfigs><xsd1:inboundAuthKey>%~3</xsd1:inboundAuthKey><xsd1:inboundAuthType>oauth2</xsd1:inboundAuthType><xsd1:properties><xsd1:advanced>false</xsd1:advanced><xsd1:confidential>false</xsd1:confidential><xsd1:defaultValue></xsd1:defaultValue><xsd1:description></xsd1:description><xsd1:displayName></xsd1:displayName><xsd1:name>oauthConsumerSecret</xsd1:name><xsd1:required>false</xsd1:required><xsd1:value>%~4</xsd1:value></xsd1:properties></xsd1:inboundAuthenticationRequestConfigs></xsd1:inboundAuthenticationConfig><xsd1:inboundProvisioningConfig><xsd1:provisioningEnabled>false</xsd1:provisioningEnabled><xsd1:provisioningUserStore>PRIMARY</xsd1:provisioningUserStore></xsd1:inboundProvisioningConfig><xsd1:localAndOutBoundAuthenticationConfig><xsd1:alwaysSendBackAuthenticatedListOfIdPs>false</xsd1:alwaysSendBackAuthenticatedListOfIdPs><xsd1:authenticationStepForAttributes></xsd1:authenticationStepForAttributes><xsd1:authenticationStepForSubject></xsd1:authenticationStepForSubject><xsd1:authenticationType>default</xsd1:authenticationType><xsd1:subjectClaimUri>http://wso2.org/claims/fullname</xsd1:subjectClaimUri></xsd1:localAndOutBoundAuthenticationConfig><xsd1:outboundProvisioningConfig><xsd1:provisionByRoleList></xsd1:provisionByRoleList></xsd1:outboundProvisioningConfig><xsd1:permissionAndRoleConfig></xsd1:permissionAndRoleConfig><xsd1:saasApp>false</xsd1:saasApp></xsd:serviceProvider></xsd:updateApplication></soapenv:Body></soapenv:Envelope>"

IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while updating application %sp_name%.... !!"
  echo(
  CALL :delete_sp dispatch Common urn:deleteApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  CALL :delete_sp swift Common urn:deleteApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  CALL :delete_user
  echo(
  exit -1
)

echo ** Successfully updated the application %~1. **
cd ..
EXIT /B

:updateapp_multi
cd %QSG%\04
set sp_name=%~1
set auth=%~2
set request_data=get-app-%~1.xml

IF NOT EXIST %request_data% (
    echo "%request_data% File does not exists."
    exit -1
)

IF EXIST "response_unformatted.xml" (
   DEL response_unformatted.xml
)

curl -s -k -d @%request_data% -H "Authorization: Basic %auth%" -H "Content-Type: text/xml" -H "SOAPAction: urn:getApplication" https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ > response_unformatted.xml

IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while getting application details for %sp_name%.... !!"
  echo(
  CALL :delete_sp dispatch Common urn:deleteApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  CALL :delete_sp swift Common urn:deleteApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  CALL :delete_user
  echo(
  exit -1
)

FOR /F "tokens=*" %%A IN ('java -jar QSG-1.0.jar') DO SET app_id=%%A
FOR /L %%b IN (1,1,2) DO IF "!app_id:~-1!"==" " SET app_id=!app_id:~0,-1!
echo(

echo Updating application %~1...

REM Send the SOAP request to Update the Application.
curl -s -k -H "Authorization: Basic %~2" -H "Content-Type: text/xml" -H "SOAPAction: %~3" -o NUL %~4 -d "<soapenv:Envelope xmlns:soapenv="\"http://schemas.xmlsoap.org/soap/envelope/"\" xmlns:xsd="\"http://org.apache.axis2/xsd"\" xmlns:xsd1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><soapenv:Header/><soapenv:Body><ns3:updateApplication xmlns:ns3="\"http://org.apache.axis2/xsd"\"><ns3:serviceProvider><ns1:applicationID xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">%app_id%</ns1:applicationID><ns1:applicationName xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">%~1</ns1:applicationName><claimConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><alwaysSendMappedLocalSubjectId>false</alwaysSendMappedLocalSubjectId><localClaimDialect>true</localClaimDialect><roleClaimURI/></claimConfig><ns1:description xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">sample service provider</ns1:description><inboundAuthenticationConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><inboundAuthenticationRequestConfigs><inboundAuthKey>saml2-web-app-dispatch.com</inboundAuthKey><inboundAuthType>samlsso</inboundAuthType><properties><name>attrConsumServiceIndex</name><value>1223160755</value></properties></inboundAuthenticationRequestConfigs><inboundAuthenticationRequestConfigs><inboundAuthKey/><inboundAuthType>passivests</inboundAuthType></inboundAuthenticationRequestConfigs><inboundAuthenticationRequestConfigs><inboundAuthKey/><inboundAuthType>openid</inboundAuthType></inboundAuthenticationRequestConfigs></inboundAuthenticationConfig><inboundProvisioningConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><dumbMode>false</dumbMode><provisioningUserStore>PRIMARY</provisioningUserStore></inboundProvisioningConfig><localAndOutBoundAuthenticationConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><alwaysSendBackAuthenticatedListOfIdPs>false</alwaysSendBackAuthenticatedListOfIdPs><authenticationScriptConfig><ns2:content xmlns:ns2="\"http://script.model.common.application.identity.carbon.wso2.org/xsd"\"/><ns2:enabled xmlns:ns2="\"http://script.model.common.application.identity.carbon.wso2.org/xsd"\">false</ns2:enabled></authenticationScriptConfig><authenticationStepForAttributes xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/><authenticationStepForSubject xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/><authenticationSteps><attributeStep>true</attributeStep><localAuthenticatorConfigs><displayName>basic</displayName><name>BasicAuthenticator</name></localAuthenticatorConfigs><stepOrder>1</stepOrder><subjectStep>true</subjectStep></authenticationSteps><authenticationSteps><attributeStep>false</attributeStep><federatedIdentityProviders><defaultAuthenticatorConfig><displayName>twitter</displayName><name>TwitterAuthenticator</name></defaultAuthenticatorConfig><federatedAuthenticatorConfigs><displayName>twitter</displayName><name>TwitterAuthenticator</name></federatedAuthenticatorConfigs><identityProviderName>IDP-twitter</identityProviderName></federatedIdentityProviders><stepOrder>2</stepOrder><subjectStep>false</subjectStep></authenticationSteps><authenticationType>flow</authenticationType><enableAuthorization>false</enableAuthorization><subjectClaimUri xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/><useTenantDomainInLocalSubjectIdentifier>false</useTenantDomainInLocalSubjectIdentifier><useUserstoreDomainInLocalSubjectIdentifier>false</useUserstoreDomainInLocalSubjectIdentifier></localAndOutBoundAuthenticationConfig><outboundProvisioningConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"/><owner xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><tenantDomain>carbon.super</tenantDomain><userName>cameron</userName><userStoreDomain>PRIMARY</userStoreDomain></owner><permissionAndRoleConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"/><ns1:requestPathAuthenticatorConfigs xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\" xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/><ns1:saasApp xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">false</ns1:saasApp></ns3:serviceProvider></ns3:updateApplication></soapenv:Body></soapenv:Envelope>"
echo ** Successfully updated the application %~1. **
cd ..
EXIT /B

:updateapp_fed_auth
cd %QSG%\05
set sp_name=%~1
set auth=%~2
set request_data=get-app-%~1.xml

IF NOT EXIST "%request_data%" (
    echo "%request_data% File does not exists."
    exit -1
)

IF EXIST "response_unformatted.xml" (
   DEL response_unformatted.xml
)

curl -s -k -d @%request_data% -H "Authorization: Basic %auth%" -H "Content-Type: text/xml" -H "SOAPAction: urn:getApplication" https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ > response_unformatted.xml

IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while getting application details for %sp_name%.... !!"
  echo(
  CALL :delete_sp dispatch Common urn:deleteApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  CALL :delete_sp swift Common urn:deleteApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  CALL :delete_user
  echo(
  exit -1
)

FOR /F "tokens=*" %%A IN ('java -jar QSG-1.0.jar') DO SET app_id=%%A
FOR /L %%b IN (1,1,2) DO IF "!app_id:~-1!"==" " SET app_id=!app_id:~0,-1!
echo(

echo Updating application %~1...

REM Send the SOAP request to Update the Application.
curl -s -k -H "Authorization: Basic %~2" -H "Content-Type: text/xml" -H "SOAPAction: %~3" -o NUL %~4 -d "<soapenv:Envelope xmlns:soapenv="\"http://schemas.xmlsoap.org/soap/envelope/"\" xmlns:xsd="\"http://org.apache.axis2/xsd"\" xmlns:xsd1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><soapenv:Header/><soapenv:Body><ns3:updateApplication xmlns:ns3="\"http://org.apache.axis2/xsd"\"><ns3:serviceProvider><ns1:applicationID xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">%app_id%</ns1:applicationID><ns1:applicationName xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">%sp_name%</ns1:applicationName><claimConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><alwaysSendMappedLocalSubjectId>false</alwaysSendMappedLocalSubjectId><localClaimDialect>true</localClaimDialect><roleClaimURI/></claimConfig><ns1:description xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">sample service provider</ns1:description><inboundAuthenticationConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><inboundAuthenticationRequestConfigs><inboundAuthKey>saml2-web-app-dispatch.com</inboundAuthKey><inboundAuthType>samlsso</inboundAuthType><properties><name>attrConsumServiceIndex</name><value>1223160755</value></properties></inboundAuthenticationRequestConfigs><inboundAuthenticationRequestConfigs><inboundAuthKey/><inboundAuthType>passivests</inboundAuthType></inboundAuthenticationRequestConfigs><inboundAuthenticationRequestConfigs><inboundAuthKey/><inboundAuthType>openid</inboundAuthType></inboundAuthenticationRequestConfigs></inboundAuthenticationConfig><inboundProvisioningConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><dumbMode>false</dumbMode><provisioningUserStore>PRIMARY</provisioningUserStore></inboundProvisioningConfig><localAndOutBoundAuthenticationConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><alwaysSendBackAuthenticatedListOfIdPs>false</alwaysSendBackAuthenticatedListOfIdPs><authenticationStepForAttributes xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/><authenticationStepForSubject xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/><authenticationSteps><federatedIdentityProviders><identityProviderName>IDP-twitter</identityProviderName></federatedIdentityProviders></authenticationSteps><authenticationType>federated</authenticationType><enableAuthorization>false</enableAuthorization><subjectClaimUri>http://wso2.org/claims/fullname</subjectClaimUri><useTenantDomainInLocalSubjectIdentifier>false</useTenantDomainInLocalSubjectIdentifier><useUserstoreDomainInLocalSubjectIdentifier>false</useUserstoreDomainInLocalSubjectIdentifier></localAndOutBoundAuthenticationConfig><outboundProvisioningConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"/><owner xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><tenantDomain>carbon.super</tenantDomain><userName>cameron</userName><userStoreDomain>PRIMARY</userStoreDomain></owner><permissionAndRoleConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"/><ns1:requestPathAuthenticatorConfigs xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\" xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/><ns1:saasApp xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">false</ns1:saasApp></ns3:serviceProvider></ns3:updateApplication></soapenv:Body></soapenv:Envelope>"
echo ** Successfully updated the application %~1. **
cd ..
EXIT /B

:delete_user

set request_data1=Common\delete-cameron.xml
set request_data2=Common\delete-alex.xml
set request_data3=Common\delete-role.xml
echo(
echo "Deleting the user named cameron..."

REM Send the SOAP request to delete the user.
curl -s -k -d @%QSG%\%request_data1% -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o NUL https://localhost:9443/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while deleting the user cameron. !!
  echo(
  exit -1
)
echo ** The user cameron was successfully deleted. **
echo(
echo Deleting the user named alex...

REM Send the SOAP request to delete the user.
curl -s -k -d @%QSG%\%request_data2% -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o NUL https://localhost:9443/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while deleting the user alex. !!
  echo(
  exit -1
)
echo ** The user alex was successfully deleted. **
echo(
echo "Deleting the role named Manager..."

REM Send the SOAP request to delete the role.
curl -s -k -d @%QSG%\%request_data3% -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteRole" -o NUL https://localhost:9443/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while deleting the role Manager. !!
  echo(
  exit -1
)
echo ** The role Manager was successfully deleted. **
echo(
EXIT /B

:delete_sp

set sp_name=%~1
set scenario=%~2
set soap_action=%~3
set endpoint=%~4
set auth=%~5
set request_data=%~2\delete-sp-%~1.xml

IF NOT EXIST "%~2" (
    echo %~2 Directory not exists.
    exit -1
)

IF NOT EXIST "%QSG%\%request_data%" (
    echo %request_data% File does not exists.
    exit -1
)
echo(
echo Deleting Service Provider %~1...

REM Send the SOAP request to delete a SP.
curl -s -k -d @%QSG%\%request_data% -H "Authorization: Basic %~5" -H "Content-Type: text/xml" -H "SOAPAction: %~3" -o NUL %~4

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while deleting the service provider. !!
  echo(
  exit -1
)
echo ** Service Provider %~1 successfully deleted. **
EXIT /B

:delete_users_workflow

set request_data1=Common\delete-cameron.xml
set request_data2=Common\delete-alex.xml
set request_data3=07\delete-role-senior.xml
set request_data4=07\delete-role-junior.xml

echo(
echo "Deleting the user named cameron..."

REM Send the SOAP request to delete the user.
curl -s -k -d @%QSG%\%request_data1% -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o NUL https://localhost:9443/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while deleting the user cameron. !!"
  echo(
  exit -1
)
echo "** The user cameron was successfully deleted. **"
echo(
echo "Deleting the user named alex..."

REM Send the SOAP request to delete the user.
curl -s -k -d @%QSG%\%request_data2% -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o NUL https://localhost:9443/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while deleting the user alex. !!"
  echo(
  exit -1
)
echo "** The user alex was successfully deleted. **"
echo(

echo "Deleting the role named senior-manager"
REM Send the SOAP request to delete the role.
curl -s -k -d @%QSG%\%request_data3% -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteRole" -o NUL https://localhost:9443/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while deleting the role senior-manager. !!"
  echo(
  exit -1
)
echo "** The role senior-manager was successfully deleted. **"
echo(
echo "Deleting the role named junior-manager"
REM Send the SOAP request to delete the role.
curl -s -k -d @%QSG%\%request_data4% -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteRole" -o NUL https://localhost:9443/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while deleting the role junior-manager. !!"
  echo(
  exit -1
)
echo "** The role junior-manager was successfully deleted. **"
echo(

EXIT /B

:delete_workflow_definition

set scenario=%~1
set auth=%~2
set request_data=%~1\delete-definition.xml

IF NOT EXIST "%QSG%\%~1" (
    echo "%scenario% Directory does not exists."
    exit -1
)

IF NOT EXIST "%QSG%\%request_data%" (
    echo "%request_data% File does not exists."
    exit -1
)

curl -s -k -d @%QSG%\%request_data% -H "Authorization: Basic %~2" -H "Content-Type: text/xml" -H "SOAPAction: urn:removeWorkflow" -o NUL https://localhost:9443/services/WorkflowAdminService.WorkflowAdminServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while deleting the workflow definition. !!"
  echo(
  exit -1
)
echo "** The workflow definition was successfully deleted. **"
echo(

EXIT /B

:delete_workflow_association

set scenario=%~1
set auth=%~2
set request_data=%~1\delete-association.xml

IF NOT EXIST "%QSG%\%~1" (
    echo "%scenario% Directory does not exists."
    exit -1
)

IF NOT EXIST "%QSG%\%request_data%" (
    echo "%request_data% File does not exists."
    exit -1
)

curl -s -k -d @%QSG%\%request_data% -H "Authorization: Basic %~2" -H "Content-Type: text/xml" -H "SOAPAction: urn:removeAssociation" -o NULs https://localhost:9443/services/WorkflowAdminService.WorkflowAdminServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while deleting the workflow association. !!"
  echo(
  exit -1
)
echo "** The workflow association was successfully deleted. **"
echo(

EXIT /B

:delete_idp

set scenario=%~1
set soap_action=%~2
set endpoint=%~3
set request_data=%~1/delete-idp-twitter.xml

IF NOT EXIST "%~1" (
    echo "%~1 Directory not exists."
    exit -1
)

IF NOT EXIST "%request_data%" (
    echo "%request_data% File does not exists."
    exit -1
)

echo(
echo "Deleting Identity Provider IDP-twitter..."

REM Send the SOAP request to delete a SP.
curl -s -k -d @%QSG%\%request_data% -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: %~2" -o NUL %~3

IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while deleting the service provider. !!"
  echo(
  exit -1
)
echo "** Identity Provider IDP-twitter successfully deleted. **"
echo(
EXIT /B

:end_message

set dispatch_url=%~1
set swift_url=%~2

echo(
echo "--------------------------------------------------------------------"
echo "|                                                                  |"
echo "|    You can find the sample web apps on the following URLs.       |"
echo "|    *** Please press ctrl button and click on the links ***       |"
echo "|                                                                  |"
echo "|    Dispatch - http://localhost:8080/%~1/  |"
echo "|    Swift - http://localhost:8080/%~2/        |"
echo "|                                                                  |"
echo "|    Please use the following user credentials to log in.          |"
echo "|                                                                  |"
echo "|    MANAGER                                                       |"
echo "|      Username: cameron                                           |"
echo "|      Password: cameron123                                        |"
echo "|                                                                  |"
echo "|    EMPLOYEE                                                      |"
echo "|      Username: alex                                              |"
echo "|      Password: alex123                                           |"
echo "|                                                                  |"
echo "--------------------------------------------------------------------"
echo(
echo "If you have finished trying out the sample web apps, you can clean the process now."
echo "Do you want to clean up the setup?"
echo(
echo "Press y - YES"
echo "Press n - NO"
echo(
set /p clean="Please enter the response... "
set result=false
     IF "%clean%"=="y" set result=true
     IF "%clean%"=="Y" set result=true
     IF "%result%" == "true" (
        CALL :delete_sp dispatch Common urn:deleteApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
        CALL :delete_sp swift Common urn:deleteApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
        CALL :delete_user
	 )
     IF "%result%" == "false" (
     exit -1
     )
