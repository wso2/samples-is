@echo off
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

REM ===============script starts here ===============================================
SET CONF_DIR=..\conf
SET APP_DIR=..\webapps
SET LIB_DIR=..\lib
SET SCENARIO_DIR=..\scenarios

REM This is used to navigate back and forth between executables
SET REL_ROOT=%cd%

echo "Before running samples make sure the following                                "
echo "  * Added correct details to the server.properties                            "
echo "  * Your WSO2 IS and sample applications are running.                         "
echo "                                                                              "
echo " If okay to continue, Please press 'Y' else press 'N'                         "
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

FOR /F "eol=; tokens=6,2 delims==" %%i IN ('findstr "wso2is.host.domain" %CONF_DIR%\server.properties') DO SET IS_DOMAIN_NEW=%%i
REM echo %IS_DOMAIN_NEW%

FOR /F "eol=; tokens=6,2 delims==" %%i IN ('findstr "wso2is.host.port" %CONF_DIR%\server.properties') DO SET IS_PORT=%%i
REM echo %IS_PORT%

FOR /F "eol=; tokens=6,2 delims==" %%i IN ('findstr "server.host.domain" %CONF_DIR%\server.properties') DO SET SERVER_DOMAIN_NEW=%%i
REM echo %SERVER_DOMAIN_NEW%

FOR /F "eol=; tokens=6,2 delims==" %%i IN ('findstr "server.host.port" %CONF_DIR%\server.properties') DO SET SERVER_PORT=%%i
REM echo %SERVER_PORT%

IF "%IS_DOMAIN_NEW%"=="localhost.com" (
 set IS_DOMAIN=127.0.0.1
 )
REM echo %IS_DOMAIN%

IF "%SERVER_DOMAIN_NEW%"=="localhost.com" (
 set SERVER_DOMAIN=127.0.0.1
)
REM echo %SERVER_DOMAIN%

echo "Please pick a scenario from the following."
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
    	CALL :configure_sso_saml2 %IS_DOMAIN% %IS_PORT% %SERVER_DOMAIN% %SERVER_PORT%
    	CALL :end_message saml2-web-app-pickup-dispatch.com saml2-web-app-pickup-manager.com %IS_DOMAIN% %IS_PORT% %SERVER_DOMAIN% %SERVER_PORT%
    	EXIT 0
    )

	IF "%scenario%"=="2" (
        CALL :configure_sso_oidc %IS_DOMAIN% %IS_PORT% %SERVER_DOMAIN% %SERVER_PORT%
        CALL :end_message pickup-dispatch pickup-manager %IS_DOMAIN% %IS_PORT% %SERVER_DOMAIN% %SERVER_PORT%
        EXIT 0
    )

	IF "%scenario%"=="3" (
        CALL :create_multifactor_auth %IS_DOMAIN% %IS_PORT% %SERVER_DOMAIN% %SERVER_PORT%
        CALL :end_message saml2-web-app-pickup-dispatch.com saml2-web-app-pickup-manager.com %IS_DOMAIN% %IS_PORT% %SERVER_DOMAIN% %SERVER_PORT%
        CALL :delete_idp 05 urn:deleteIdP https://%IS_DOMAIN%:%IS_PORT%/services/IdentityProviderMgtService.IdentityProviderMgtServiceHttpsSoap11Endpoint/
        EXIT 0
	)

	IF "%scenario%"=="4" (
        CALL :configure_federated_auth %IS_DOMAIN% %IS_PORT% %SERVER_DOMAIN% %SERVER_PORT%
        CALL :end_message saml2-web-app-pickup-dispatch.com saml2-web-app-pickup-manager.com %IS_DOMAIN% %IS_PORT% %SERVER_DOMAIN% %SERVER_PORT%
        CALL :delete_idp 05 urn:deleteIdP https://%IS_DOMAIN%:%IS_PORT%/services/IdentityProviderMgtService.IdentityProviderMgtServiceHttpsSoap11Endpoint/
        EXIT 0
    )

	IF "%scenario%"=="5" (
        CALL :configure_self_signup %IS_DOMAIN% %IS_PORT% %SERVER_DOMAIN% %SERVER_PORT%
        EXIT 0
	)

	IF "%scenario%"=="6" (
        CALL :create_workflow %IS_DOMAIN% %IS_PORT% %SERVER_DOMAIN% %SERVER_PORT%
        EXIT 0
	)

:jump_to_location
cd %~1

EXIT /B

:jump_to_relative_root
cd %REL_ROOT%

EXIT /B

REM Configure OIDC for OIDC samples
:configure_sso_oidc

set is_domain=%~1
set is_port=%~2
set server_domain=%~3
set server_port=%~4

REM Add users in the wso2-is.
CALL :add_user admin admin Common %is_domain% %is_port%

REM Add service providers in wso2-is
CALL :add_service_provider dispatch Common urn:createApplication https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz %is_domain% %is_port%
CALL :add_service_provider manager Common urn:createApplication https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz %is_domain% %is_port%

REM Configure OIDC for the Service Providers
CALL :configure_oidc "manager" "03" "urn:registerOAuthApplicationData" "https://%is_domain%:%is_port%/services/OAuthAdminService.OAuthAdminServiceHttpsSoap11Endpoint/" "Y2FtZXJvbjpjYW1lcm9uMTIz" %is_domain% %is_port% %server_domain% %server_port%
CALL :configure_oidc "dispatch" "03" "urn:registerOAuthApplicationData" "https://%is_domain%:%is_port%/services/OAuthAdminService.OAuthAdminServiceHttpsSoap11Endpoint/" "Y2FtZXJvbjpjYW1lcm9uMTIz" %is_domain% %is_port% %server_domain% %server_port%

CALL :update_application_oidc "dispatch" "Y2FtZXJvbjpjYW1lcm9uMTIz" "ZGlzcGF0Y2g=" "ZGlzcGF0Y2gxMjM0" "urn:updateApplication" "https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/" %is_domain% %is_port%
CALL :update_application_oidc "manager" "Y2FtZXJvbjpjYW1lcm9uMTIz" "c3dpZnRhcHA=" "c3dpZnRhcHAxMjM=" "urn:updateApplication" "https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/" %is_domain% %is_port%

EXIT /B

REM Configure SAML for SAML samples
:configure_sso_saml2

set is_domain=%~1
set is_port=%~2
set server_domain=%~3
set server_port=%~4

REM Add users in wso2-is.
CALL :add_user admin admin Common %is_domain% %is_port%

REM Add service providers in wso2-is for the user cameron
CALL :add_service_provider dispatch Common urn:createApplication https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz %is_domain% %is_port%
CALL :add_service_provider manager Common urn:createApplication https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz %is_domain% %is_port%

REM Configure SAML for the service providers in the cameron account
CALL :configure_saml dispatch 02 urn:addRPServiceProvider https://%is_domain%:%is_port%/services/IdentitySAMLSSOConfigService.IdentitySAMLSSOConfigServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz %is_domain% %is_port% %server_domain% %server_port%
CALL :configure_saml manager 02 urn:addRPServiceProvider  https://%is_domain%:%is_port%/services/IdentitySAMLSSOConfigService.IdentitySAMLSSOConfigServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz %is_domain% %is_port% %server_domain% %server_port%

CALL :update_application_saml dispatch Y2FtZXJvbjpjYW1lcm9uMTIz urn:updateApplication https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ %is_domain% %is_port% %server_domain% %server_port%
CALL :update_application_saml manager Y2FtZXJvbjpjYW1lcm9uMTIz urn:updateApplication https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ %is_domain% %is_port% %server_domain% %server_port%

EXIT /B

REM Configure Multifactor auth with basic and twitter
:create_multifactor_auth
set is_domain=%~1
set is_port=%~2
set server_domain=%~3
set server_port=%~4
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
        CALL :configure_sso_saml2 %is_domain% %is_port% %server_domain% %server_port%
        CALL :add_identity_provider admin admin %is_domain% %is_port%
        CALL :updateapp_multi "dispatch" "Y2FtZXJvbjpjYW1lcm9uMTIz" "urn:updateApplication" "https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/" %is_domain% %is_port% %server_domain% %server_port%
        CALL :updateapp_multi "manager" "Y2FtZXJvbjpjYW1lcm9uMTIz" "urn:updateApplication" "https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/" %is_domain% %is_port% %server_domain% %server_port%
     )
     IF "%result%" == "false" (
        echo Please register a Twitter application and restart the script.
        exit -1
     )
EXIT /B

REM Configure Federated auth for sample SAML apps
:configure_federated_auth

set is_domain=%~1
set is_port=%~2
set server_domain=%~3
set server_port=%~4

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
    CALL :configure_sso_saml2 %is_domain% %is_port% %server_domain% %server_port%
    CALL :add_identity_provider admin admin %is_domain% %is_port%
    CALL :updateapp_fed_auth dispatch Y2FtZXJvbjpjYW1lcm9uMTIz urn:updateApplication https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ %is_domain% %is_port% %server_domain% %server_port%
    CALL :updateapp_fed_auth manager Y2FtZXJvbjpjYW1lcm9uMTIz urn:updateApplication https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ %is_domain% %is_port% %server_domain% %server_port%
)

IF "%result%" == "false" (
    echo Please register a Twitter application and restart the script.
    exit -1
)
EXIT /B

:configure_self_signup

set is_domain=%~1
set is_port=%~2
set server_domain=%~3
set server_port=%~4

echo "-----------------------------------------------------------------------"
echo "|                                                                     |"
echo "|  You can configure self signup in WSO2 IS in two different ways.    |"
echo "|  So choose your desired approach from the list below to enable the  |"
echo "|  required settings.                                                 |"
echo "|                                                                     |"
echo "|    Press 1 - Enable Self User Registration(without any config.)     |"
echo "|               [ This will enable self signup in the IS without any  |"
echo "|               other configuration changes.], Here you will not get  |"
echo "|               any email notification although you see the           |"
echo "|               notification.                                         |"
echo "|                                                                     |"
echo "|    Press 2 - Enable Account Lock On Creation                        |"
echo "|               [ This will lock the user account during user         |"
echo "|               registration. You can only log into the app after     |"
echo "|               after clicking the verification link sent to the      |"
echo "|               email address you provided.]                          |"
echo "|                                                                     |"
echo "-----------------------------------------------------------------------"
echo(

set /p user="Please enter the number you selected... "

IF "%user%"=="1" (
     CALL :update_idp_selfsignup "urn:updateResidentIdP" "https://%is_domain%:%is_port%/services/IdentityProviderMgtService.IdentityProviderMgtServiceHttpsSoap11Endpoint/" "YWRtaW46YWRtaW4=" "06" "selfsignup" %is_domain% %is_port% %server_domain% %server_port%
)

IF "%user%"=="2" (
    echo(
    echo "-----------------------------------------------------------------------"
    echo "|                                                                     |"
    echo "|  Please do the following before trying self signup.                 |"
    echo "|                                                                     |"
    echo "|  1. Open the file: output-event-adapters.xml in the path,           |"
    echo "|     (Your WSO2-IS)/repository/conf.                                 |"
    echo "|     Ex: WSO2IS-Home/repository/conf/output-event-adapters.xml.      |"
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
    CALL :update_idp_selfsignup "urn:updateResidentIdP" "https://%is_domain%:%is_port%/services/IdentityProviderMgtService.IdentityProviderMgtServiceHttpsSoap11Endpoint/" "YWRtaW46YWRtaW4=" "06" "lockon" %is_domain% %is_port% %server_domain% %server_port%
)

REM Add a service provider in wso2-is
CALL :add_service_provider "dispatch" "Common" "urn:createApplication" "https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/" "YWRtaW46YWRtaW4=" %is_domain% %is_port%

REM Configure OIDC for the Service Providers
CALL :configure_oidc "dispatch" "03" "urn:registerOAuthApplicationData" "https://%is_domain%:%is_port%/services/OAuthAdminService.OAuthAdminServiceHttpsSoap11Endpoint/" "YWRtaW46YWRtaW4=" %is_domain% %is_port% %server_domain% %server_port%

CALL :update_application_oidc "dispatch" "YWRtaW46YWRtaW4=" "ZGlzcGF0Y2g=" "ZGlzcGF0Y2gxMjM0" "urn:updateApplication" "https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/" %is_domain% %is_port%

echo(
echo "---------------------------------------------------------------------------------"
echo "|                                                                               |"
echo "|  To tryout self registration please log into the sample                       |"
echo "|  app below.                                                                   |"
echo "|  *** Please press ctrl button and click on the link ***                       |"
echo "|                                                                               |"
echo "|  pickup-dispatch - http://%server_domain%:%server_port%/pickup-dispatch/      |"
echo "|                                                                               |"
echo "|  Click on the ** Register now ** link in the login page.                      |"
echo "|  Fill in the user details form and create an account.                         |"
echo "|  The email will not be sent here, although you see the                        |"
echo "|  notification.                                                                |"
echo "|                                                                               |"
echo "|  You can now use the username and password you provided, to                   |"
echo "|  log into pickup-dispatch.                                                    |"
echo "|                                                                               |"
echo "---------------------------------------------------------------------------------"
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
        CALL :delete_sp "dispatch" "Common" "urn:deleteApplication" "https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/" "YWRtaW46YWRtaW4="
     )
     IF "%result%" == "false" (
        echo Please clean up the process manually.
        exit -1
     )
EXIT /B

:add_workflow_association

set scenario=%~1
set auth=%~2
set is_domain=%~3
set is_port=%~4

set request_data=%SCENARIO_DIR%\%scenario%\add-association.xml

IF NOT EXIST "%SCENARIO_DIR%\%scenario%" (
    echo "%SCENARIO_DIR%\%scenario% Directory does not exists."
    exit -1
)

IF NOT EXIST "%request_data%" (
    echo "%request_data% File does not exists."
    exit -1
)

curl -s -k -d @%request_data% -H "Authorization: Basic %auth%" -H "Content-Type: text/xml" -H "SOAPAction: urn:addAssociation" -o NUL https://%is_domain%:%is_port%/services/WorkflowAdminService.WorkflowAdminServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while creating the workflow association. !!"
  echo(
  CALL :delete_users_workflow %is_domain% %is_port%
  CALL :delete_workflow_definition "07" "YWRtaW46YWRtaW4=" %is_domain% %is_port%
  echo(
  exit -1
)
echo "** The workflow association was successfully created. **"
echo(

EXIT /B

:create_workflow

set is_domain=%~1
set is_port=%~2
set server_domain=%~3
set server_port=%~4

REM Add users and the relevant roles in wso2-is.
CALL :add_users_workflow admin admin 07 %is_domain% %is_port%

REM Create the workflow definition
CALL :add_workflow_definition "07" "YWRtaW46YWRtaW4=" %is_domain% %is_port%

REM Create a workflow association
CALL :add_workflow_association "07" "YWRtaW46YWRtaW4=" %is_domain% %is_port%

REM Update resident IDP
CALL :update_idp_selfsignup "urn:updateResidentIdP" "https://%is_domain%:%is_port%/services/IdentityProviderMgtService.IdentityProviderMgtServiceHttpsSoap11Endpoint/" "YWRtaW46YWRtaW4=" "06" "selfsignup" %is_domain% %is_port% %server_domain% %server_port%

REM Add a service provider in wso2-is
CALL :add_service_provider "dispatch" "Common" "urn:createApplication" "https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/" "YWRtaW46YWRtaW4=" %is_domain% %is_port%

REM Configure OIDC for the Service Providers
CALL :configure_oidc "dispatch" "03" "urn:registerOAuthApplicationData" "https://%is_domain%:%is_port%/services/OAuthAdminService.OAuthAdminServiceHttpsSoap11Endpoint/" "YWRtaW46YWRtaW4=" %is_domain% %is_port% %server_domain% %server_port%

CALL :update_application_oidc "dispatch" "YWRtaW46YWRtaW4=" "ZGlzcGF0Y2g=" "ZGlzcGF0Y2gxMjM0" "urn:updateApplication" "https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/" %is_domain% %is_port%

echo(
echo(
echo "-------------------------------------------------------------------------------"
echo "|                                                                             |"
echo "|    The workflow feature enables you to add more control and                 |"
echo "|    constraints to the tasks executed within it.                             |"
echo "|                                                                             |"
echo "|    Here we are going to try out a workflow which defines an                 |"
echo "|    approval process for new user additions.                                 |"
echo "|                                                                             |"
echo "|    Use case: Senior manager and junior manager has to                       |"
echo "|    approve each new user addition.                                          |"
echo "|                                                                             |"
echo "|    To tryout the workflow please log into the sample                        |"
echo "|    app below.                                                               |"
echo "|    *** Please press ctrl button and click on the link ***                   |"
echo "|                                                                             |"
echo "|    pickup-dispatch - http://127.0.0.1:8080/pickup-dispatch/                 |"
echo "|                                                                             |"
echo "|    Click on the ** Register now ** link in the login page                   |"
echo "|    Fill in the user details form and create an account.                     |"
echo "|                                                                             |"
echo "|    But the new user you created will be disabled.                           |"
echo "|    So to enable the user please log into the WSO2 dashboard                 |"
echo "|    using the following credentials and approve the pending                  |"
echo "|    workflow requests.                                                       |"
echo "|                                                                             |"
echo "|    WSO2 Dashboard: https://%is_domain%:%is_port%/dashboard                  |"
echo "|                                                                             |"
echo "|    First login with Junior Manager                                          |"
echo "|      Username: alex                                                         |"
echo "|      Password: alex123                                                      |"
echo "|                                                                             |"
echo "|    Secondly, login with Senior Manager                                      |"
echo "|      Username: cameron                                                      |"
echo "|      Password: cameron123                                                   |"
echo "|                                                                             |"
echo "|    Now you can use your new user credentials to log into                    |"
echo "|    the app pickup-dispatch:  http://127.0.0.1:8080/pickup-dispatch/         |"
echo "|                                                                             |"
echo "-------------------------------------------------------------------------------"
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
        CALL :delete_users_workflow %is_domain% %is_port%
        CALL :delete_workflow_association "07" "YWRtaW46YWRtaW4=" %is_domain% %is_port%
        CALL :delete_workflow_definition "07" "YWRtaW46YWRtaW4=" %is_domain% %is_port%
        CALL :delete_sp "dispatch" "Common" "urn:deleteApplication" "https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/" "YWRtaW46YWRtaW4="
     )
     IF "%result%" == "false" (
     echo Please clean up the process manually.
     exit -1
     )

EXIT /B

:update_idp_selfsignup

set soap_action=%~1
set endpoint=%~2
set auth=%~3
set scenario=%~4
set config=%~5
set is_domain=%~6
set is_port=%~7
set server_domain=%~8
set server_port=%~9

set file=%SCENARIO_DIR%\%scenario%\update-idp-%~5.xml
set request_data=%SCENARIO_DIR%\%scenario%\update-idp-%~5.xml

IF NOT EXIST "%SCENARIO_DIR%\%scenario%" (
    echo "%SCENARIO_DIR%\%scenario%Directory does not exists."
    exit -1
)

REM Update the update-idp-config xml file with correct host names and port values

set regexvalue="^[a-zA-Z]"


REM We can only set 8191 characters. So here we segment common and dedicated outputs so we do not run to the limit.

echo ^<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mgt="http://mgt.idp.carbon.wso2.org" xmlns:xsd="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<soapenv:Header/^> ^<soapenv:Body^> ^<mgt:updateResidentIdP^> ^<mgt:identityProvider^> ^<xsd:federatedAuthenticatorConfigs^> ^<xsd:name^>samlsso^</xsd:name^> ^<xsd:properties^> ^<xsd:name^>IdpEntityId^</xsd:name^> ^<xsd:value^>localhost^</xsd:value^> ^</xsd:properties^> ^<xsd:properties^> ^<xsd:name^>DestinationURI.1^</xsd:name^> ^<xsd:value^>https://%is_domain%:%is_port%/samlsso^</xsd:value^> ^</xsd:properties^> ^</xsd:federatedAuthenticatorConfigs^> ^<xsd:federatedAuthenticatorConfigs xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>passivests^</xsd:name^> ^<xsd:properties^> ^<xsd:name^>IdPEntityId^</xsd:name^> ^<xsd:value^>localhost^</xsd:value^> ^</xsd:properties^> ^</xsd:federatedAuthenticatorConfigs^> ^<xsd:federatedAuthenticatorConfigs xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>openidconnect^</xsd:name^> ^<xsd:properties^> ^<xsd:name^>IdPEntityId^</xsd:name^> ^<xsd:value^>https://%is_domain%:%is_port%/oauth2/token^</xsd:value^> ^</xsd:properties^> ^</xsd:federatedAuthenticatorConfigs^> > %SCENARIO_DIR%\%scenario%\update-idp-selfsignup.xml
echo ^<xsd:homeRealmId^>localhost^</xsd:homeRealmId^> ^<xsd:identityProviderName^>LOCAL^</xsd:identityProviderName^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>passwordHistory.enable^</xsd:name^> ^<xsd:value^>false^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>passwordHistory.count^</xsd:name^> ^<xsd:value^>5^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>passwordPolicy.enable^</xsd:name^> ^<xsd:value^>false^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>passwordPolicy.min.length^</xsd:name^> ^<xsd:value^>6^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>passwordPolicy.max.length^</xsd:name^> ^<xsd:value^>12^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>passwordPolicy.pattern^</xsd:name^> ^<xsd:value^>%regexvalue%^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>passwordPolicy.errorMsg^</xsd:name^> ^<xsd:value^>'Password pattern policy violated. Password should contain only letters.' ^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>sso.login.recaptcha.enable^</xsd:name^> ^<xsd:value^>false^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>sso.login.recaptcha.on.max.failed.attempts^</xsd:name^> ^<xsd:value^>3^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>account.lock.handler.enable^</xsd:name^> ^<xsd:value^>false^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>account.lock.handler.On.Failure.Max.Attempts^</xsd:name^> ^<xsd:value^>5^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>account.lock.handler.Time^</xsd:name^> ^<xsd:value^>5^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>account.lock.handler.login.fail.timeout.ratio^</xsd:name^> ^<xsd:value^>2^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>account.lock.handler.notification.manageInternally^</xsd:name^> ^<xsd:value^>true^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>account.disable.handler.enable^</xsd:name^> ^<xsd:value^>false^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>account.disable.handler.notification.manageInternally^</xsd:name^> ^<xsd:value^>true^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>suspension.notification.enable^</xsd:name^> ^<xsd:value^>false^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>suspension.notification.account.disable.delay^</xsd:name^> ^<xsd:value^>90^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>suspension.notification.delays^</xsd:name^> ^<xsd:value^>30,45,60,75^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>Recovery.Notification.Password.Enable^</xsd:name^> ^<xsd:value^>false^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>Recovery.Question.Password.Enable^</xsd:name^> ^<xsd:value^>false^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>Recovery.Question.Password.MinAnswers^</xsd:name^> ^<xsd:value^>2^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>Recovery.Question.Password.ReCaptcha.Enable^</xsd:name^> ^<xsd:value^>true^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>Recovery.Question.Password.ReCaptcha.MaxFailedAttempts^</xsd:name^> ^<xsd:value^>2^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>Recovery.Notification.Username.Enable^</xsd:name^> ^<xsd:value^>false^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>Recovery.Notification.InternallyManage^</xsd:name^> ^<xsd:value^>true^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>Recovery.NotifySuccess^</xsd:name^> ^<xsd:value^>false^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>Recovery.Question.Password.NotifyStart^</xsd:name^> ^<xsd:value^>false^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>Recovery.ExpiryTime^</xsd:name^> ^<xsd:value^>1440^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>SelfRegistration.Enable^</xsd:name^> ^<xsd:value^>true^</xsd:value^> ^</xsd:idpProperties^> >> %SCENARIO_DIR%\%scenario%\update-idp-selfsignup.xml
echo  ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>SelfRegistration.LockOnCreation^</xsd:name^> ^<xsd:value^>false^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>SelfRegistration.Notification.InternallyManage^</xsd:name^> ^<xsd:value^>false^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>SelfRegistration.ReCaptcha^</xsd:name^> ^<xsd:value^>false^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>SelfRegistration.VerificationCode.ExpiryTime^</xsd:name^> ^<xsd:value^>1440^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>EmailVerification.Enable^</xsd:name^> ^<xsd:value^>false^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>EmailVerification.LockOnCreation^</xsd:name^> ^<xsd:value^>true^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>EmailVerification.Notification.InternallyManage^</xsd:name^> ^<xsd:value^>true^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>EmailVerification.ExpiryTime^</xsd:name^> ^<xsd:value^>1440^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>EmailVerification.AskPassword.ExpiryTime^</xsd:name^> ^<xsd:value^>1440^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>EmailVerification.AskPassword.PasswordGenerator^</xsd:name^> ^<xsd:value^>org.wso2.carbon.user.mgt.common.DefaultPasswordGenerator^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>Recovery.AdminPasswordReset.RecoveryLink^</xsd:name^> ^<xsd:value^>false^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>Recovery.AdminPasswordReset.OTP^</xsd:name^> ^<xsd:value^>false^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>Recovery.AdminPasswordReset.Offline^</xsd:name^> ^<xsd:value^>false^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>SessionIdleTimeout^</xsd:name^> ^<xsd:value^>15^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>RememberMeTimeout^</xsd:name^> ^<xsd:value^>20160^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:primary^>true^</xsd:primary^> ^</mgt:identityProvider^> ^</mgt:updateResidentIdP^> ^</soapenv:Body^> ^</soapenv:Envelope^>  >> %SCENARIO_DIR%\%scenario%\update-idp-selfsignup.xml

echo ^<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mgt="http://mgt.idp.carbon.wso2.org" xmlns:xsd="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<soapenv:Header/^> ^<soapenv:Body^> ^<mgt:updateResidentIdP^> ^<mgt:identityProvider^> ^<xsd:federatedAuthenticatorConfigs^> ^<xsd:name^>samlsso^</xsd:name^> ^<xsd:properties^> ^<xsd:name^>IdpEntityId^</xsd:name^> ^<xsd:value^>localhost^</xsd:value^> ^</xsd:properties^> ^<xsd:properties^> ^<xsd:name^>DestinationURI.1^</xsd:name^> ^<xsd:value^>https://%is_domain%:%is_port%/samlsso^</xsd:value^> ^</xsd:properties^> ^</xsd:federatedAuthenticatorConfigs^> ^<xsd:federatedAuthenticatorConfigs xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>passivests^</xsd:name^> ^<xsd:properties^> ^<xsd:name^>IdPEntityId^</xsd:name^> ^<xsd:value^>localhost^</xsd:value^> ^</xsd:properties^> ^</xsd:federatedAuthenticatorConfigs^> ^<xsd:federatedAuthenticatorConfigs xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>openidconnect^</xsd:name^> ^<xsd:properties^> ^<xsd:name^>IdPEntityId^</xsd:name^> ^<xsd:value^>https://%is_domain%:%is_port%/oauth2/token^</xsd:value^> ^</xsd:properties^> ^</xsd:federatedAuthenticatorConfigs^> > %SCENARIO_DIR%\%scenario%\update-idp-lockon.xml
echo ^<xsd:homeRealmId^>localhost^</xsd:homeRealmId^> ^<xsd:identityProviderName^>LOCAL^</xsd:identityProviderName^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>passwordHistory.enable^</xsd:name^> ^<xsd:value^>false^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>passwordHistory.count^</xsd:name^> ^<xsd:value^>5^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>passwordPolicy.enable^</xsd:name^> ^<xsd:value^>false^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>passwordPolicy.min.length^</xsd:name^> ^<xsd:value^>6^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>passwordPolicy.max.length^</xsd:name^> ^<xsd:value^>12^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>passwordPolicy.pattern^</xsd:name^> ^<xsd:value^>%regexvalue%^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>passwordPolicy.errorMsg^</xsd:name^> ^<xsd:value^>'Password pattern policy violated. Password should contain only letters.' ^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>sso.login.recaptcha.enable^</xsd:name^> ^<xsd:value^>false^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>sso.login.recaptcha.on.max.failed.attempts^</xsd:name^> ^<xsd:value^>3^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>account.lock.handler.enable^</xsd:name^> ^<xsd:value^>false^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>account.lock.handler.On.Failure.Max.Attempts^</xsd:name^> ^<xsd:value^>5^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>account.lock.handler.Time^</xsd:name^> ^<xsd:value^>5^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>account.lock.handler.login.fail.timeout.ratio^</xsd:name^> ^<xsd:value^>2^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>account.lock.handler.notification.manageInternally^</xsd:name^> ^<xsd:value^>true^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>account.disable.handler.enable^</xsd:name^> ^<xsd:value^>false^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>account.disable.handler.notification.manageInternally^</xsd:name^> ^<xsd:value^>true^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>suspension.notification.enable^</xsd:name^> ^<xsd:value^>false^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>suspension.notification.account.disable.delay^</xsd:name^> ^<xsd:value^>90^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>suspension.notification.delays^</xsd:name^> ^<xsd:value^>30,45,60,75^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>Recovery.Notification.Password.Enable^</xsd:name^> ^<xsd:value^>false^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>Recovery.Question.Password.Enable^</xsd:name^> ^<xsd:value^>false^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>Recovery.Question.Password.MinAnswers^</xsd:name^> ^<xsd:value^>2^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>Recovery.Question.Password.ReCaptcha.Enable^</xsd:name^> ^<xsd:value^>true^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>Recovery.Question.Password.ReCaptcha.MaxFailedAttempts^</xsd:name^> ^<xsd:value^>2^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>Recovery.Notification.Username.Enable^</xsd:name^> ^<xsd:value^>false^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>Recovery.Notification.InternallyManage^</xsd:name^> ^<xsd:value^>true^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>Recovery.NotifySuccess^</xsd:name^> ^<xsd:value^>false^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>Recovery.Question.Password.NotifyStart^</xsd:name^> ^<xsd:value^>false^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>Recovery.ExpiryTime^</xsd:name^> ^<xsd:value^>1440^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>SelfRegistration.Enable^</xsd:name^> ^<xsd:value^>true^</xsd:value^> ^</xsd:idpProperties^> >> %SCENARIO_DIR%\%scenario%\update-idp-lockon.xml
echo ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>SelfRegistration.LockOnCreation^</xsd:name^> ^<xsd:value^>true^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>SelfRegistration.Notification.InternallyManage^</xsd:name^> ^<xsd:value^>true^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>SelfRegistration.ReCaptcha^</xsd:name^> ^<xsd:value^>false^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>SelfRegistration.VerificationCode.ExpiryTime^</xsd:name^> ^<xsd:value^>1440^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>EmailVerification.Enable^</xsd:name^> ^<xsd:value^>false^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>EmailVerification.LockOnCreation^</xsd:name^> ^<xsd:value^>true^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>EmailVerification.Notification.InternallyManage^</xsd:name^> ^<xsd:value^>true^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>EmailVerification.ExpiryTime^</xsd:name^> ^<xsd:value^>1440^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>EmailVerification.AskPassword.ExpiryTime^</xsd:name^> ^<xsd:value^>1440^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>EmailVerification.AskPassword.PasswordGenerator^</xsd:name^> ^<xsd:value^>org.wso2.carbon.user.mgt.common.DefaultPasswordGenerator^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>Recovery.AdminPasswordReset.RecoveryLink^</xsd:name^> ^<xsd:value^>false^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>Recovery.AdminPasswordReset.OTP^</xsd:name^> ^<xsd:value^>false^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>Recovery.AdminPasswordReset.Offline^</xsd:name^> ^<xsd:value^>false^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>SessionIdleTimeout^</xsd:name^> ^<xsd:value^>15^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:idpProperties xmlns="http://model.common.application.identity.carbon.wso2.org/xsd"^> ^<xsd:name^>RememberMeTimeout^</xsd:name^> ^<xsd:value^>20160^</xsd:value^> ^</xsd:idpProperties^> ^<xsd:primary^>true^</xsd:primary^> ^</mgt:identityProvider^> ^</mgt:updateResidentIdP^> ^</soapenv:Body^> ^</soapenv:Envelope^> >> %SCENARIO_DIR%\%scenario%\update-idp-lockon.xml


echo Configuring OIDC web SSO for %~1...

curl -s -k -d @%request_data% -H "Authorization: Basic %~3" -H "Content-Type: text/xml" -H "SOAPAction: %~1" -o NUL %~2

IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while updating the identity provider. !!"
  exit -1
)
echo "** Identity Provider successfully updated. **"
EXIT /B

:add_user

set is_user_name=%~1
set is_user_pass=%~2
set scenario=%~3
set is_domain=%~4
set is_port=%~5

set request_data=%SCENARIO_DIR%\%scenario%\add-role.xml

echo(
echo Creating a user named cameron...

REM The following command can be used to create a user cameron.
curl -s -k --user %is_user_name%:%is_user_pass% --data "{"schemas":[],"name":{"familyName":"Smith","givenName":"Cameron"},"userName":"cameron","password":"cameron123","emails":"cameron@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o NUL https://%is_domain%:%is_port%/wso2/scim/Users

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while creating user cameron. !!
  echo(
  exit -1
)
echo ** The user cameron was successfully created. **
echo(

echo Creating a user named alex...

REM The following command can be used to create a user alex.
curl -s -k --user %is_user_name%:%is_user_pass% --data "{"schemas":[],"name":{"familyName":"Miller","givenName":"Alex"},"userName":"alex","password":"alex123","emails":"alex@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o NUL https://%is_domain%:%is_port%/wso2/scim/Users

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while creating user alex. !!
  echo(
  CALL :delete_user %is_domain% %is_port%
  echo(
  exit -1
)
echo ** The user alex was successfully created. **
echo(

echo Creating a role named Manager...

REM The following command will add a role to the user.
curl -s -k --user %is_user_name%:%is_user_pass% -d @%request_data% -H "Content-Type: text/xml" -H "SOAPAction: urn:addRole" -o NUL https://%is_domain%:%is_port%/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while creating role manager. !!
  echo(
  CALL :delete_user %is_domain% %is_port%
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
set is_domain=%~4
set is_port=%~5

set request_data1=%SCENARIO_DIR%\%scenario%\add-role-senior.xml
set request_data2=%SCENARIO_DIR%\%scenario%\add-role-junior.xml

IF NOT EXIST "%SCENARIO_DIR%\%scenario%" (
    echo "%SCENARIO_DIR%\%scenario% Directory does not exists."
    exit -1
)

IF NOT EXIST "%request_data1%" (
    echo "%request_data1% File does not exists."
    exit -1
)

IF NOT EXIST "%request_data2%" (
    echo "%request_data2% File does not exists."
    exit -1
)

echo(
echo "Creating a user named cameron..."

REM The following command can be used to create a user.
curl -s -k --user %IS_name%:%IS_pass% --data "{"schemas":[],"name":{"familyName":"Smith","givenName":"Cameron"},"userName":"cameron","password":"cameron123","emails":"cameron@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o NUL https://%is_domain%:%is_port%/wso2/scim/Users
IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while creating user cameron. !!"
  CALL :delete_user %is_domain% %is_port%
  echo(
  exit -1
)
echo "** The user cameron was successfully created. **"
echo(

echo "Creating a user named alex..."

REM The following command can be used to create a user.
curl -s -k --user %IS_name%:%IS_pass% --data "{"schemas":[],"name":{"familyName":"Miller","givenName":"Alex"},"userName":"alex","password":"alex123","emails":"alex@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o NUL https://%is_domain%:%is_port%/wso2/scim/Users
IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while creating user alex. !!"
  CALL :delete_user %is_domain% %is_port%
  echo(
  exit -1
)
echo "** The user alex was successfully created. **"
echo(

echo "Creating a role named senior_manager..."

REM The following command will add a role to the user.
curl -s -k --user %IS_name%:%IS_pass% -d @%request_data1% -H "Content-Type: text/xml" -H "SOAPAction: urn:addRole" https://%is_domain%:%is_port%/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while creating role senior_manager. !!"
  echo(
  CALL :delete_user %is_domain% %is_port%
  echo(
  exit -1
)
echo "** The role senior_manager was successfully created. **"
echo(

echo "Creating a role named junior_manager..."

REM The following command will add a role to the user.
curl -s -k --user %IS_name%:%IS_pass% -d @%request_data2% -H "Content-Type: text/xml" -H "SOAPAction: urn:addRole" https://%is_domain%:%is_port%/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while creating role junior_manager. !!"
  echo(
  CALL :delete_user %is_domain% %is_port%
  echo(
  exit -1
)
echo "** The role junior_manager was successfully created. **"
echo(
EXIT /B

REM : Add a service provider
:add_service_provider

set sp_name=%~1
set scenario=%~2
set soap_action=%~3
set endpoint=%~4
set auth=%~5
set is_domain=%~6
set is_port=%~7

set request_data=%SCENARIO_DIR%\%scenario%\create-sp-%~1.xml

IF NOT EXIST "%SCENARIO_DIR%\%scenario%" (
    echo "%SCENARIO_DIR%\%scenario% Directory not exists."
    exit -1
)

IF NOT EXIST "%request_data%" (
    echo "%request_data% File does not exists."
    exit -1
)

echo Creating Service Provider %~1...

REM Send the SOAP request to create the new SP.
curl -s -k -d @%request_data% -H "Authorization: Basic %~5" -H "Content-Type: text/xml" -H "SOAPAction: %~3" -o NUL %~4

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while creating the service provider. !!
  echo(
  CALL :delete_sp dispatch Common urn:deleteApplication https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  CALL :delete_sp manager Common urn:deleteApplication https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  CALL :delete_user %is_domain% %is_port%
  echo(
  exit -1
)
echo ** Service Provider %~1 successfully created. **
echo(
EXIT /B

REM Add a Twitter Identity Provider
:add_identity_provider

set IS_name=%~1
set IS_pass=%~2
set is_domain=%~3
set is_port=%~4

IF "%is_domain%"=="127.0.0.1" (
 set is_host=localhost.com
)
echo(
echo "Please enter your API key"
set /p key="(This can be found in the Keys and Access token section in the Application settings)"
echo(
echo "Please enter your API secret"
set /p secret="(This can be found in the Keys and Access token section in the Application settings)"
echo(

echo "Creating Identity Provider..."

curl -s -k --user %IS_name%:%IS_pass% -H "Content-Type: text/xml" -H "SOAPAction: urn:addIdP" -o NUL https://%is_domain%:%is_port%/services/IdentityProviderMgtService.IdentityProviderMgtServiceHttpsSoap11Endpoint/ -d "<soapenv:Envelope xmlns:soapenv="\"http://schemas.xmlsoap.org/soap/envelope/"\" xmlns:mgt="\"http://mgt.idp.carbon.wso2.org"\" xmlns:xsd="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><soapenv:Header/><soapenv:Body><ns4:addIdP xmlns:ns4="\"http://mgt.idp.carbon.wso2.org"\"><ns4:identityProvider><ns1:alias xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">https://%is_domain%:%is_port%/oauth2/token</ns1:alias><ns1:certificate xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\" xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/><claimConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><localClaimDialect>true</localClaimDialect><roleClaimURI>http://wso2.org/claims/role</roleClaimURI><userClaimURI xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/></claimConfig><defaultAuthenticatorConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><displayName>twitterIDP</displayName><enabled>true</enabled><name>TwitterAuthenticator</name><properties><name>APIKey</name><value>%key%</value></properties><properties><name>APISecret</name><value>%secret%</value></properties><properties><name>callbackUrl</name><value>https://%is_host%:%is_port%/commonauth</value></properties></defaultAuthenticatorConfig><ns1:displayName xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\" xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/><ns1:enable xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">false</ns1:enable><federatedAuthenticatorConfigs xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><displayName>twitter</displayName><enabled>true</enabled><name>TwitterAuthenticator</name><properties><name>APIKey</name><value>%key%</value></properties><properties><name>APISecret</name><value>%secret%</value></properties><properties><name>callbackUrl</name><value>https://%is_domain%:%is_port%/commonauth</value></properties></federatedAuthenticatorConfigs><ns1:federationHub xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">false</ns1:federationHub><ns1:homeRealmId xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\" xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/><ns1:identityProviderDescription xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\" xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/><ns1:identityProviderName xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">IDP-twitter</ns1:identityProviderName><permissionAndRoleConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"/><ns1:provisioningRole xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\" xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/></ns4:identityProvider></ns4:addIdP></soapenv:Body></soapenv:Envelope>"
IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while creating the identity provider. !!"
  echo(
  exit -1
)
echo "** The identity provider was successfully created. **"
echo(
EXIT /B

:configure_saml

set sp_name=%~1
set scenario=%~2
set soap_action=%~3
set endpoint=%~4
set auth=%~5
set is_domain=%~6
set is_port=%~7
set server_domain=%~8
set server_port=%~9

set request_data=%SCENARIO_DIR%\%scenario%\sso-config-%~1.xml
set file=%SCENARIO_DIR%\%scenario%\sso-config-%~1.xml

IF "%server_domain%" == "127.0.0.1" (
  SET server_domain=localhost.com
)

IF NOT EXIST "%SCENARIO_DIR%\%scenario%" (
    echo %SCENARIO_DIR%\%scenario% Directory does not exists.
    exit -1
)

IF NOT EXIST "%request_data%" (
    echo "%request_data% File does not exists."
    exit -1
)

REM Update the sso-config xml file with correct host names and port values

REM touch sso-config-${sp_name}.xml
echo  ^<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://org.apache.axis2/xsd" xmlns:xsd1="http://dto.saml.sso.identity.carbon.wso2.org/xsd"^> ^<soapenv:Header/^> ^<soapenv:Body^> ^<xsd:addRPServiceProvider^> ^<xsd:spDto^> ^<xsd1:assertionConsumerUrls^>http://%server_domain%:%server_port%/saml2-web-app-pickup-%sp_name%.com/home.jsp^</xsd1:assertionConsumerUrls^> ^<xsd1:assertionQueryRequestProfileEnabled^>false^</xsd1:assertionQueryRequestProfileEnabled^> ^<xsd1:attributeConsumingServiceIndex^>1223160755^</xsd1:attributeConsumingServiceIndex^> ^<xsd1:certAlias^>wso2carbon^</xsd1:certAlias^> ^<xsd1:defaultAssertionConsumerUrl^>http://%server_domain%:%server_port%/saml2-web-app-pickup-%sp_name%.com/home.jsp^</xsd1:defaultAssertionConsumerUrl^> ^<xsd1:digestAlgorithmURI^>http://www.w3.org/2000/09/xmldsig#sha1^</xsd1:digestAlgorithmURI^> ^<xsd1:doEnableEncryptedAssertion^>false^</xsd1:doEnableEncryptedAssertion^> ^<xsd1:doSignAssertions^>true^</xsd1:doSignAssertions^> ^<xsd1:doSignResponse^>true^</xsd1:doSignResponse^> ^<xsd1:doSingleLogout^>true^</xsd1:doSingleLogout^> ^<xsd1:doValidateSignatureInRequests^>false^</xsd1:doValidateSignatureInRequests^> ^<xsd1:enableAttributeProfile^>true^</xsd1:enableAttributeProfile^> ^<xsd1:enableAttributesByDefault^>true^</xsd1:enableAttributesByDefault^> ^<xsd1:idPInitSLOEnabled^>true^</xsd1:idPInitSLOEnabled^> ^<xsd1:idPInitSSOEnabled^>true^</xsd1:idPInitSSOEnabled^> ^<xsd1:idpInitSLOReturnToURLs^>http://%server_domain%:%server_port%/saml2-web-app-pickup-%sp_name%.com/home.jsp^</xsd1:idpInitSLOReturnToURLs^> ^<xsd1:issuer^>saml2-web-app-pickup-%sp_name%.com^</xsd1:issuer^> ^<xsd1:nameIDFormat^>urn/oasis/names/tc/SAML/1.1/nameid-format/emailAddress^</xsd1:nameIDFormat^> ^<xsd1:requestedAudiences^>https://%is_domain%:%is_port%/oauth2/token^</xsd1:requestedAudiences^> ^<xsd1:requestedRecipients^>https://%is_domain%:%is_port%/oauth2/token^</xsd1:requestedRecipients^> ^<xsd1:signingAlgorithmURI^>http://www.w3.org/2000/09/xmldsig#rsa-sha1^</xsd1:signingAlgorithmURI^> ^<xsd1:sloRequestURL^>^</xsd1:sloRequestURL^> ^<xsd1:sloResponseURL^>^</xsd1:sloResponseURL^> ^</xsd:spDto^> ^</xsd:addRPServiceProvider^> ^</soapenv:Body^> ^</soapenv:Envelope^> > %file%

echo Configuring SAML2 web SSO for %~1...

REM Send the SOAP request for Confuring SAML2 web SSO.
curl -s -k -d @%request_data% -H "Authorization: Basic %~5" -H "Content-Type: text/xml" -H "SOAPAction: %~3" -o NUL %~4

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while configuring SAML2 web SSO for %~1.... !!
  echo(
  CALL :delete_sp dispatch Common urn:deleteApplication https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  CALL :delete_sp manager Common urn:deleteApplication https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  CALL :delete_user %is_domain% %is_port%
  echo(
  exit -1
)
echo ** Successfully configured SAML. **
echo(
EXIT /B

:add_workflow_definition

set scenario=%~1
set auth=%~2
set is_domain=%~3
set is_port=%~4

set request_data=%SCENARIO_DIR%\%scenario%\add-definition.xml

IF NOT EXIST "%SCENARIO_DIR%\%scenario%" (
    echo "%SCENARIO_DIR%\%scenario% Directory does not exists."
    exit -1
)

IF NOT EXIST "%request_data%" (
    echo "%request_data% File does not exists."
    exit -1
)

curl -s -k -d @%request_data% -H "Authorization: Basic %~2" -H "Content-Type: text/xml" -H "SOAPAction: urn:addWorkflow" -o NUL https://%is_domain%:%is_port%/services/WorkflowAdminService.WorkflowAdminServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while creating the workflow definition. !!"
  echo(
  CALL :delete_users_workflow %is_domain% %is_port%
  echo(
  exit -1
)
echo "** The workflow definition was successfully created. **"
echo(
EXIT /B

:update_application_saml

set sp_name=%~1
set auth=%~2
set soap_action=%~3
set endpoint=%~4
set is_domain=%~5
set is_port=%~6
set server_domain=%~7
set server_port=%~8

set request_data=%SCENARIO_DIR%\02\get-app-%~1.xml

IF NOT EXIST "%request_data%" (
    echo %request_data% File does not exists.
    exit -1
)

curl -s -k -d @%request_data% -H "Authorization: Basic %~2" -H "Content-Type: text/xml" -H "SOAPAction: urn:getApplication" https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ > %SCENARIO_DIR%\02\response_unformatted.xml

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while getting application details for %~1.... !!
  echo(
  CALL :delete_sp dispatch Common urn:deleteApplication https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  CALL :delete_sp manager Common urn:deleteApplication https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  CALL :delete_user %is_domain% %is_port%
  echo(
  exit -1
)

FOR /F "tokens=*" %%A IN ('dir /b %SCENARIO_DIR%\02\QSG-*.jar') DO SET jarname=%%A
FOR /L %%b IN (1,1,2) DO IF "!jarname:~-1!"==" " SET jarname=!jarname:~0,-1!

REM Perform jar execution from jar location
call :jump_to_location %SCENARIO_DIR%\02

FOR /F "tokens=*" %%A IN ('java -jar %jarname%') DO SET app_id=%%A
FOR /L %%b IN (1,1,2) DO IF "!app_id:~-1!"==" " SET app_id=!app_id:~0,-1!

REM Go back to relative root
call :jump_to_relative_root

echo(
echo Updating application %~1...

REM Send the SOAP request to Update the Application.
curl -s -k -H "Authorization: Basic %~2" -H "Content-Type: text/xml" -H "SOAPAction: %~3" -o NUL %~4 -d "<soapenv:Envelope xmlns:soapenv="\"http://schemas.xmlsoap.org/soap/envelope/"\" xmlns:xsd="\"http://org.apache.axis2/xsd"\" xmlns:xsd1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><soapenv:Header/><soapenv:Body><xsd:updateApplication><xsd:serviceProvider><xsd1:applicationID>%app_id%</xsd1:applicationID><xsd1:applicationName>%~1</xsd1:applicationName><xsd1:claimConfig><xsd1:alwaysSendMappedLocalSubjectId>false</xsd1:alwaysSendMappedLocalSubjectId><xsd1:localClaimDialect>true</xsd1:localClaimDialect><xsd1:claimMappings><xsd1:localClaim><xsd1:claimUri>http://wso2.org/claims/fullname</xsd1:claimUri></xsd1:localClaim><xsd1:mandatory>true</xsd1:mandatory><xsd1:remoteClaim><xsd1:claimUri>http://wso2.org/claims/fullname</xsd1:claimUri></xsd1:remoteClaim><xsd1:requested>true</xsd1:requested></xsd1:claimMappings><xsd1:claimMappings><xsd1:localClaim><xsd1:claimUri>http://wso2.org/claims/emailaddress</xsd1:claimUri></xsd1:localClaim><xsd1:mandatory>true</xsd1:mandatory><xsd1:remoteClaim><xsd1:claimUri>http://wso2.org/claims/emailaddress</xsd1:claimUri></xsd1:remoteClaim><xsd1:requested>true</xsd1:requested></xsd1:claimMappings></xsd1:claimConfig><xsd1:description>sample service provider</xsd1:description><xsd1:inboundAuthenticationConfig><xsd1:inboundAuthenticationRequestConfigs><xsd1:inboundAuthKey>saml2-web-app-pickup-%~1.com</xsd1:inboundAuthKey><xsd1:inboundAuthType>samlsso</xsd1:inboundAuthType><xsd1:properties><xsd1:name>attrConsumServiceIndex</xsd1:name><xsd1:value>1223160755</xsd1:value></xsd1:properties></xsd1:inboundAuthenticationRequestConfigs></xsd1:inboundAuthenticationConfig><xsd1:inboundProvisioningConfig><xsd1:provisioningEnabled>false</xsd1:provisioningEnabled><xsd1:provisioningUserStore>PRIMARY</xsd1:provisioningUserStore></xsd1:inboundProvisioningConfig><xsd1:localAndOutBoundAuthenticationConfig><xsd1:alwaysSendBackAuthenticatedListOfIdPs>false</xsd1:alwaysSendBackAuthenticatedListOfIdPs><xsd1:authenticationStepForAttributes></xsd1:authenticationStepForAttributes><xsd1:authenticationStepForSubject></xsd1:authenticationStepForSubject><xsd1:authenticationType>default</xsd1:authenticationType><xsd1:subjectClaimUri>http://wso2.org/claims/fullname</xsd1:subjectClaimUri></xsd1:localAndOutBoundAuthenticationConfig><xsd1:outboundProvisioningConfig><xsd1:provisionByRoleList></xsd1:provisionByRoleList></xsd1:outboundProvisioningConfig><xsd1:permissionAndRoleConfig></xsd1:permissionAndRoleConfig><xsd1:saasApp>false</xsd1:saasApp></xsd:serviceProvider></xsd:updateApplication></soapenv:Body></soapenv:Envelope>"
echo ** Successfully updated the application %~1. **

EXIT /B

REM Configure OIDC for sample apps
:configure_oidc

set sp_name=%~1
REM folder 3
set scenario=%~2
set soap_action=%~3
set endpoint=%~4
set auth=%~5
set is_domain=%~6
set is_port=%~7
set server_domain=%~8
set server_port=%~9

set request_data=%SCENARIO_DIR%\%scenario%\sso-config-%~1.xml

IF "%server_domain%" == "127.0.0.1" (
  SET server_domain=localhost.com
)

IF NOT EXIST "%SCENARIO_DIR%\%scenario%" (
    echo %SCENARIO_DIR%\%scenario% Directory does not exists.
    exit -1
)

IF NOT EXIST "%request_data%" (
    echo "%request_data% File does not exists."
    exit -1
)

REM Update the sso-config xml file with correct host names and port values

IF "%sp_name%"=="dispatch" (
 set sample_name=pickup-dispatch
 set client_id=ZGlzcGF0Y2g=
 set secret=ZGlzcGF0Y2gxMjM0
)

IF "%sp_name%"=="manager" (
 set sample_name=pickup-manager
 set client_id=c3dpZnRhcHA=
 set secret=c3dpZnRhcHAxMjM=
)

REM echo %sample_name%
REM echo %client_id%
REM echo %secret%


REM touch sso-config-${sp_name}.xml
echo ^<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://org.apache.axis2/xsd" xmlns:xsd1="http://dto.oauth.identity.carbon.wso2.org/xsd"^> ^<soapenv:Header/^> ^<soapenv:Body^> ^<xsd:registerOAuthApplicationData^> ^<xsd:application^> ^<xsd1:OAuthVersion^>OAuth-2.0^</xsd1:OAuthVersion^> ^<xsd1:applicationName^>%sp_name%^</xsd1:applicationName^> ^<xsd1:callbackUrl^>http://%server_domain%:%server_port%/%sample_name%/oauth2client^</xsd1:callbackUrl^> ^<xsd1:grantTypes^>refresh_token urn:ietf:params:oauth:grant-type:saml2-bearer implicit password client_credentials iwa:ntlm authorization_code^</xsd1:grantTypes^> ^<xsd1:oauthConsumerKey^>%client_id%^</xsd1:oauthConsumerKey^> ^<xsd1:oauthConsumerSecret^>%secret%^</xsd1:oauthConsumerSecret^> ^<xsd1:pkceMandatory^>false^</xsd1:pkceMandatory^> ^</xsd:application^> ^</xsd:registerOAuthApplicationData^> ^</soapenv:Body^> ^</soapenv:Envelope^> > %request_data%

echo Configuring OIDC web SSO for %~1...

REM Configure OIDC for the created SPs.
curl -s -k -d @%request_data% -H "Authorization: Basic %~5" -H "Content-Type: text/xml" -H "SOAPAction: %~3" -o NUL %~4

echo "** OIDC successfully configured for the Service Provider %~1. **"
echo(
EXIT /B

REM Update OIDC application
:update_application_oidc

set sp_name=%~1
set auth=%~2
set key=%~3
set secret=%~4
set soap_action=%~5
set endpoint=%~6
set is_domain=%~7
set is_port=%~8

set request_data=%SCENARIO_DIR%\03\get-app-%sp_name%.xml

IF NOT EXIST "%request_data%" (
    echo "%request_data% File does not exists."
    exit -1
)

curl -s -k -d @%request_data% -H "Authorization: Basic %auth%" -H "Content-Type: text/xml" -H "SOAPAction: urn:getApplication" https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ > %SCENARIO_DIR%\03\response_unformatted.xml

IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while getting application details for %sp_name%.... !!"
  echo(
  CALL :delete_sp dispatch Common urn:deleteApplication https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  CALL :delete_sp manager Common urn:deleteApplication https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  CALL :delete_user %is_domain% %is_port%
  echo(
  exit -1
)

FOR /F "tokens=*" %%A IN ('dir /b %SCENARIO_DIR%\03\QSG-*.jar') DO SET jarname=%%A
FOR /L %%b IN (1,1,2) DO IF "!jarname:~-1!"==" " SET jarname=!jarname:~0,-1!

REM Perform jar execution from jar location
call :jump_to_location %SCENARIO_DIR%\03

FOR /F "tokens=*" %%A IN ('java -jar %jarname%') DO SET app_id=%%A
FOR /L %%b IN (1,1,2) DO IF "!app_id:~-1!"==" " SET app_id=!app_id:~0,-1!

REM Go back to relative root
call :jump_to_relative_root

echo(
echo Updating application %~1...

REM Send the SOAP request to Update the Application.
curl -s -k -H "Authorization: Basic %auth%" -H "Content-Type: text/xml" -H "SOAPAction: %soap_action%" -o NUL %endpoint% -d "<soapenv:Envelope xmlns:soapenv="\"http://schemas.xmlsoap.org/soap/envelope/"\" xmlns:xsd="\"http://org.apache.axis2/xsd"\" xmlns:xsd1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><soapenv:Header/><soapenv:Body><xsd:updateApplication><xsd:serviceProvider><xsd1:applicationID>%app_id%</xsd1:applicationID><xsd1:applicationName>%sp_name%</xsd1:applicationName><xsd1:claimConfig><xsd1:alwaysSendMappedLocalSubjectId>false</xsd1:alwaysSendMappedLocalSubjectId><xsd1:localClaimDialect>true</xsd1:localClaimDialect><xsd1:claimMappings><xsd1:localClaim><xsd1:claimUri>http://wso2.org/claims/fullname</xsd1:claimUri></xsd1:localClaim><xsd1:mandatory>true</xsd1:mandatory><xsd1:remoteClaim><xsd1:claimUri>http://wso2.org/claims/fullname</xsd1:claimUri></xsd1:remoteClaim><xsd1:requested>true</xsd1:requested></xsd1:claimMappings><xsd1:claimMappings><xsd1:localClaim><xsd1:claimUri>http://wso2.org/claims/emailaddress</xsd1:claimUri></xsd1:localClaim><xsd1:mandatory>true</xsd1:mandatory><xsd1:remoteClaim><xsd1:claimUri>http://wso2.org/claims/emailaddress</xsd1:claimUri></xsd1:remoteClaim><xsd1:requested>true</xsd1:requested></xsd1:claimMappings></xsd1:claimConfig><xsd1:description>oauth application</xsd1:description><xsd1:inboundAuthenticationConfig><xsd1:inboundAuthenticationRequestConfigs><xsd1:inboundAuthKey>%key%</xsd1:inboundAuthKey><xsd1:inboundAuthType>oauth2</xsd1:inboundAuthType><xsd1:properties><xsd1:advanced>false</xsd1:advanced><xsd1:confidential>false</xsd1:confidential><xsd1:defaultValue></xsd1:defaultValue><xsd1:description></xsd1:description><xsd1:displayName></xsd1:displayName><xsd1:name>oauthConsumerSecret</xsd1:name><xsd1:required>false</xsd1:required><xsd1:value>%secret%</xsd1:value></xsd1:properties></xsd1:inboundAuthenticationRequestConfigs></xsd1:inboundAuthenticationConfig><xsd1:inboundProvisioningConfig><xsd1:provisioningEnabled>false</xsd1:provisioningEnabled><xsd1:provisioningUserStore>PRIMARY</xsd1:provisioningUserStore></xsd1:inboundProvisioningConfig><xsd1:localAndOutBoundAuthenticationConfig><xsd1:alwaysSendBackAuthenticatedListOfIdPs>false</xsd1:alwaysSendBackAuthenticatedListOfIdPs><xsd1:authenticationStepForAttributes></xsd1:authenticationStepForAttributes><xsd1:authenticationStepForSubject></xsd1:authenticationStepForSubject><xsd1:authenticationType>default</xsd1:authenticationType><xsd1:subjectClaimUri>http://wso2.org/claims/fullname</xsd1:subjectClaimUri></xsd1:localAndOutBoundAuthenticationConfig><xsd1:outboundProvisioningConfig><xsd1:provisionByRoleList></xsd1:provisionByRoleList></xsd1:outboundProvisioningConfig><xsd1:permissionAndRoleConfig></xsd1:permissionAndRoleConfig><xsd1:saasApp>false</xsd1:saasApp></xsd:serviceProvider></xsd:updateApplication></soapenv:Body></soapenv:Envelope>"

IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while updating application %sp_name%.... !!"
  echo(
  CALL :delete_sp dispatch Common urn:deleteApplication https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  CALL :delete_sp manager Common urn:deleteApplication https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  CALL :delete_user %is_domain% %is_port%
  echo(
  exit -1
)

echo ** Successfully updated the application %~1. **

EXIT /B

REM Update multi-step of sample apps
:updateapp_multi

set sp_name=%~1
set auth=%~2
set soap_action=%~3
set endpoint=%~4
set is_domain=%~5
set is_port=%~6
set server_domain=%~7
set server_port=%~8

set request_data=%SCENARIO_DIR%\04\get-app-%~1.xml


IF NOT EXIST %request_data% (
    echo "%request_data% File does not exists."
    exit -1
)

curl -s -k -d @%request_data% -H "Authorization: Basic %auth%" -H "Content-Type: text/xml" -H "SOAPAction: urn:getApplication" https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ > %SCENARIO_DIR%\04\response_unformatted.xml

IF %ERRORLEVEL% NEQ 0 (
  echo(
  echo "!! Problem occurred while getting application details for %sp_name%.... !!"
  echo(
  CALL :delete_sp dispatch Common urn:deleteApplication https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  CALL :delete_sp manager Common urn:deleteApplication https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  CALL :delete_user %is_domain% %is_port%
  echo(
  exit -1
)

FOR /F "tokens=*" %%A IN ('dir /b %SCENARIO_DIR%\04\QSG-*.jar') DO SET jarname=%%A
FOR /L %%b IN (1,1,2) DO IF "!jarname:~-1!"==" " SET jarname=!jarname:~0,-1!

REM Perform jar execution from jar location
call :jump_to_location %SCENARIO_DIR%\04

FOR /F "tokens=*" %%A IN ('java -jar %jarname%') DO SET app_id=%%A
FOR /L %%b IN (1,1,2) DO IF "!app_id:~-1!"==" " SET app_id=!app_id:~0,-1!

REM Go back to relative root
call :jump_to_relative_root

echo(

echo Updating application %~1...
echo app id is %app_id%

REM Send the SOAP request to Update the Application.
curl -s -k -H "Authorization: Basic %~2" -H "Content-Type: text/xml" -H "SOAPAction: %soap_action%" -o NUL %endpoint% -d "<soapenv:Envelope xmlns:soapenv="\"http://schemas.xmlsoap.org/soap/envelope/"\" xmlns:xsd="\"http://org.apache.axis2/xsd"\" xmlns:xsd1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><soapenv:Header/><soapenv:Body><ns3:updateApplication xmlns:ns3="\"http://org.apache.axis2/xsd"\"><ns3:serviceProvider><ns1:applicationID xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">%app_id%</ns1:applicationID><ns1:applicationName xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">%~1</ns1:applicationName><claimConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><alwaysSendMappedLocalSubjectId>false</alwaysSendMappedLocalSubjectId><localClaimDialect>true</localClaimDialect><roleClaimURI/></claimConfig><ns1:description xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">sample service provider</ns1:description><inboundAuthenticationConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><inboundAuthenticationRequestConfigs><inboundAuthKey>saml2-web-app-pickup-%sp_name%.com</inboundAuthKey><inboundAuthType>samlsso</inboundAuthType><properties><name>attrConsumServiceIndex</name><value>1223160755</value></properties></inboundAuthenticationRequestConfigs><inboundAuthenticationRequestConfigs><inboundAuthKey/><inboundAuthType>passivests</inboundAuthType></inboundAuthenticationRequestConfigs><inboundAuthenticationRequestConfigs><inboundAuthKey/><inboundAuthType>openid</inboundAuthType></inboundAuthenticationRequestConfigs></inboundAuthenticationConfig><inboundProvisioningConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><dumbMode>false</dumbMode><provisioningUserStore>PRIMARY</provisioningUserStore></inboundProvisioningConfig><localAndOutBoundAuthenticationConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><alwaysSendBackAuthenticatedListOfIdPs>false</alwaysSendBackAuthenticatedListOfIdPs><authenticationScriptConfig><ns2:content xmlns:ns2="\"http://script.model.common.application.identity.carbon.wso2.org/xsd"\"/><ns2:enabled xmlns:ns2="\"http://script.model.common.application.identity.carbon.wso2.org/xsd"\">false</ns2:enabled></authenticationScriptConfig><authenticationStepForAttributes xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/><authenticationStepForSubject xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/><authenticationSteps><attributeStep>true</attributeStep><localAuthenticatorConfigs><displayName>basic</displayName><name>BasicAuthenticator</name></localAuthenticatorConfigs><stepOrder>1</stepOrder><subjectStep>true</subjectStep></authenticationSteps><authenticationSteps><attributeStep>false</attributeStep><federatedIdentityProviders><defaultAuthenticatorConfig><displayName>twitter</displayName><name>TwitterAuthenticator</name></defaultAuthenticatorConfig><federatedAuthenticatorConfigs><displayName>twitter</displayName><name>TwitterAuthenticator</name></federatedAuthenticatorConfigs><identityProviderName>IDP-twitter</identityProviderName></federatedIdentityProviders><stepOrder>2</stepOrder><subjectStep>false</subjectStep></authenticationSteps><authenticationType>flow</authenticationType><enableAuthorization>false</enableAuthorization><subjectClaimUri xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/><useTenantDomainInLocalSubjectIdentifier>false</useTenantDomainInLocalSubjectIdentifier><useUserstoreDomainInLocalSubjectIdentifier>false</useUserstoreDomainInLocalSubjectIdentifier></localAndOutBoundAuthenticationConfig><outboundProvisioningConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"/><permissionAndRoleConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"/><ns1:requestPathAuthenticatorConfigs xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\" xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/><ns1:saasApp xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">false</ns1:saasApp></ns3:serviceProvider></ns3:updateApplication></soapenv:Body></soapenv:Envelope>"
echo ** Successfully updated the application %~1. **

EXIT /B

REM Update federated authentication of sample apps
:updateapp_fed_auth

set sp_name=%~1
set auth=%~2
set soap_action=%~3
set endpoint=%~4
set is_domain=%~5
set is_port=%~6
set server_domain=%~7
set server_port=%~8

set request_data=%SCENARIO_DIR%\05\get-app-%~1.xml

IF NOT EXIST "%request_data%" (
    echo "%request_data% File does not exists."
    exit -1
)

curl -s -k -d @%request_data% -H "Authorization: Basic %auth%" -H "Content-Type: text/xml" -H "SOAPAction: urn:getApplication" https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ > %SCENARIO_DIR%\05\response_unformatted.xml

IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while getting application details for %sp_name%.... !!"

  echo(
  CALL :delete_sp dispatch Common urn:deleteApplication https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  CALL :delete_sp manager Common urn:deleteApplication https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  CALL :delete_user  %is_domain% %is_port%
  echo(
  exit -1
)

FOR /F "tokens=*" %%A IN ('dir /b %SCENARIO_DIR%\05\QSG-*.jar') DO SET jarname=%%A
FOR /L %%b IN (1,1,2) DO IF "!jarname:~-1!"==" " SET jarname=!jarname:~0,-1!

REM Perform jar execution from jar location
call :jump_to_location %SCENARIO_DIR%\05

FOR /F "tokens=*" %%A IN ('java -jar %jarname%') DO SET app_id=%%A
FOR /L %%b IN (1,1,2) DO IF "!app_id:~-1!"==" " SET app_id=!app_id:~0,-1!

REM Go back to relative root
call :jump_to_relative_root

echo(

echo Updating application %~1...

REM Send the SOAP request to Update the Application.
curl -s -k -H "Authorization: Basic %~2" -H "Content-Type: text/xml" -H "SOAPAction: %~3" -o NUL %~4 -d "<soapenv:Envelope xmlns:soapenv="\"http://schemas.xmlsoap.org/soap/envelope/"\" xmlns:xsd="\"http://org.apache.axis2/xsd"\" xmlns:xsd1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><soapenv:Header/><soapenv:Body><ns3:updateApplication xmlns:ns3="\"http://org.apache.axis2/xsd"\"><ns3:serviceProvider><ns1:applicationID xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">%app_id%</ns1:applicationID><ns1:applicationName xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">%sp_name%</ns1:applicationName><claimConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><alwaysSendMappedLocalSubjectId>false</alwaysSendMappedLocalSubjectId><localClaimDialect>true</localClaimDialect><roleClaimURI/></claimConfig><ns1:description xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">sample service provider</ns1:description><inboundAuthenticationConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><inboundAuthenticationRequestConfigs><inboundAuthKey>saml2-web-app-pickup-%sp_name%.com</inboundAuthKey><inboundAuthType>samlsso</inboundAuthType><properties><name>attrConsumServiceIndex</name><value>1223160755</value></properties></inboundAuthenticationRequestConfigs><inboundAuthenticationRequestConfigs><inboundAuthKey/><inboundAuthType>passivests</inboundAuthType></inboundAuthenticationRequestConfigs><inboundAuthenticationRequestConfigs><inboundAuthKey/><inboundAuthType>openid</inboundAuthType></inboundAuthenticationRequestConfigs></inboundAuthenticationConfig><inboundProvisioningConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><dumbMode>false</dumbMode><provisioningUserStore>PRIMARY</provisioningUserStore></inboundProvisioningConfig><localAndOutBoundAuthenticationConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><alwaysSendBackAuthenticatedListOfIdPs>false</alwaysSendBackAuthenticatedListOfIdPs><authenticationStepForAttributes xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/><authenticationStepForSubject xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/><authenticationSteps><federatedIdentityProviders><identityProviderName>IDP-twitter</identityProviderName></federatedIdentityProviders></authenticationSteps><authenticationType>federated</authenticationType><enableAuthorization>false</enableAuthorization><subjectClaimUri>http://wso2.org/claims/fullname</subjectClaimUri><useTenantDomainInLocalSubjectIdentifier>false</useTenantDomainInLocalSubjectIdentifier><useUserstoreDomainInLocalSubjectIdentifier>false</useUserstoreDomainInLocalSubjectIdentifier></localAndOutBoundAuthenticationConfig><outboundProvisioningConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"/><permissionAndRoleConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"/><ns1:requestPathAuthenticatorConfigs xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\" xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/><ns1:saasApp xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">false</ns1:saasApp></ns3:serviceProvider></ns3:updateApplication></soapenv:Body></soapenv:Envelope>"
echo ** Successfully updated the application %~1. **

EXIT /B

REM delete users created.
:delete_user

set is_domain=%~1
set is_port=%~2

set request_data1=%SCENARIO_DIR%\Common\delete-cameron.xml
set request_data2=%SCENARIO_DIR%\Common\delete-alex.xml
set request_data3=%SCENARIO_DIR%\Common\delete-role.xml
echo(
echo "Deleting the user named cameron..."

REM Send the SOAP request to delete the user cameron.
curl -s -k -d @%request_data1% -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o NUL https://%is_domain%:%is_port%/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while deleting the user cameron. !!
  echo(
  exit -1
)
echo ** The user cameron was successfully deleted. **
echo(
echo Deleting the user named alex...

REM Send the SOAP request to delete the user alex.
curl -s -k -d @%request_data2% -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o NUL https://%is_domain%:%is_port%/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while deleting the user alex. !!
  echo(
  exit -1
)
echo ** The user alex was successfully deleted. **
echo(
echo "Deleting the role named Manager..."

REM Send the SOAP request to delete the role manager.
curl -s -k -d @%request_data3% -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteRole" -o NUL https://%is_domain%:%is_port%/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/

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

set request_data=%SCENARIO_DIR%\%scenario%\delete-sp-%~1.xml

IF NOT EXIST "%SCENARIO_DIR%\%scenario%" (
    echo %SCENARIO_DIR%\%scenario% Directory not exists.
    exit -1
)

IF NOT EXIST "%request_data%" (
    echo %request_data% File does not exists.
    exit -1
)
echo(
echo Deleting Service Provider %~1...

REM Send the SOAP request to delete a SP.
curl -s -k -d @%request_data% -H "Authorization: Basic %~5" -H "Content-Type: text/xml" -H "SOAPAction: %~3" -o NUL %~4

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while deleting the service provider. !!
  echo(
  exit -1
)
echo ** Service Provider %~1 successfully deleted. **
EXIT /B

:delete_users_workflow

set is_domain=%~1
set is_port=%~2
set request_data1=%SCENARIO_DIR%\Common\delete-cameron.xml
set request_data2=%SCENARIO_DIR%\Common\delete-alex.xml
set request_data3=%SCENARIO_DIR%\07\delete-role-senior.xml
set request_data4=%SCENARIO_DIR%\07\delete-role-junior.xml

echo(
echo "Deleting the user named cameron..."

REM Send the SOAP request to delete the user.
curl -s -k -d @%request_data1% -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o NUL https://%is_domain%:%is_port%/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while deleting the user cameron. !!"
  echo(
  exit -1
)
echo "** The user cameron was successfully deleted. **"
echo(
echo "Deleting the user named alex..."

REM Send the SOAP request to delete the user.
curl -s -k -d @%request_data2% -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o NUL https://%is_domain%:%is_port%/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while deleting the user alex. !!"
  echo(
  exit -1
)
echo "** The user alex was successfully deleted. **"
echo(

echo "Deleting the role named senior-manager"
REM Send the SOAP request to delete the role.
curl -s -k -d @%request_data3% -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteRole" -o NUL https://%is_domain%:%is_port%/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while deleting the role senior-manager. !!"
  echo(
  exit -1
)
echo "** The role senior-manager was successfully deleted. **"
echo(
echo "Deleting the role named junior-manager"
REM Send the SOAP request to delete the role.
curl -s -k -d @%request_data4% -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteRole" -o NUL https://%is_domain%:%is_port%/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/

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
set is_domain=%~3
set is_port=%~4

set request_data=%SCENARIO_DIR%\%scenario%\delete-definition.xml

IF NOT EXIST "%SCENARIO_DIR%\%scenario%" (
    echo %SCENARIO_DIR%\%scenario% Directory does not exists."
    exit -1
)

IF NOT EXIST "%request_data%" (
    echo "%request_data% File does not exists."
    exit -1
)

curl -s -k -d @%request_data% -H "Authorization: Basic %~2" -H "Content-Type: text/xml" -H "SOAPAction: urn:removeWorkflow" -o NUL https://%is_domain%:%is_port%/services/WorkflowAdminService.WorkflowAdminServiceHttpsSoap11Endpoint/

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
set is_domain=%~3
set is_port=%~4

set request_data=%SCENARIO_DIR%\%scenario%\delete-association.xml

IF NOT EXIST "%SCENARIO_DIR%\%scenario%" (
    echo "%scenario% Directory does not exists."
    exit -1
)

IF NOT EXIST "%request_data%" (
    echo "%request_data% File does not exists."
    exit -1
)

curl -s -k -d @%request_data% -H "Authorization: Basic %~2" -H "Content-Type: text/xml" -H "SOAPAction: urn:removeAssociation" -o NULs https://%is_domain%:%is_port%/services/WorkflowAdminService.WorkflowAdminServiceHttpsSoap11Endpoint/

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

set request_data=%SCENARIO_DIR%\%scenario%\delete-idp-twitter.xml

IF NOT EXIST "%SCENARIO_DIR%\%scenario%" (
    echo "%~1 Directory not exists."
    exit -1
)

IF NOT EXIST "%request_data%" (
    echo "%request_data% File does not exists."
    exit -1
)

echo(
echo "Deleting Identity Provider IDP-twitter..."

REM Send the SOAP request to delete twitter Idp.
curl -s -k -d @%request_data% -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: %~2" -o NUL %~3

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
set manager_url=%~2
set is_domain=%~3
set is_port=%~4
set server_domain=%~5
set server_port=%~6

echo(
echo "---------------------------------------------------------------------------------"
echo "|                                                                               |"
echo "|    You can find the sample web apps on the following URLs.                    |"
echo "|    *** Please press ctrl button and click on the links ***                    |"
echo "|                                                                               |"
echo "|    pickup-dispatch - http://%server_domain%:%server_port%/%~1/                |"
echo "|    pickup-manager - http://%server_domain%:%server_port%/%~2/                 |"
echo "|                                                                               |"
echo "|    Please use one of the following user credentials to log in.                |"
echo "|                                                                               |"
echo "|    Junior Manager                                                             |"
echo "|      Username: alex                                                           |"
echo "|      Password: alex123                                                        |"
echo "|                                                                               |"
echo "|    Senior Manager                                                             |"
echo "|      Username: cameron                                                        |"
echo "|      Password: cameron123                                                     |"
echo "---------------------------------------------------------------------------------"
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
        CALL :delete_sp dispatch Common urn:deleteApplication https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
        CALL :delete_sp manager Common urn:deleteApplication https://%is_domain%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
        CALL :delete_user %is_domain% %is_port%
	 )
     IF "%result%" == "false" (
     exit -1
     )
EXIT /B
