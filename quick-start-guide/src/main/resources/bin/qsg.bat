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

if not exist jq.exe (
    echo jq not found. Downloading jq...
    curl -L -o jq.exe https://github.com/stedolan/jq/releases/download/jq-1.6/jq-win64.exe

    if exist jq.exe (
        echo jq downloaded successfully.
    ) else (
        echo Failed to download jq.
        exit /b 1
    )
)

SET CONF_DIR=..\conf

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
echo "|  Scenario 4 - Configuring Google as a Federated Authenticator             |"
echo "|  Scenario 5 - Configuring Self-Signup                                     |"
echo "-----------------------------------------------------------------------------"
set /p scenario=Enter the scenario number you selected.
echo(

	IF "%scenario%"=="1" (
    	CALL :configure_sso_saml2
    	CALL :end_message saml2-web-app-pickup-dispatch.com saml2-web-app-pickup-manager.com
    	EXIT 0
    )

	IF "%scenario%"=="2" (
        CALL :configure_sso_oidc
        CALL :end_message pickup-dispatch pickup-manager
        EXIT 0
    )

	IF "%scenario%"=="3" (
        CALL :create_multifactor_auth
        CALL :end_message saml2-web-app-pickup-dispatch.com saml2-web-app-pickup-manager.com %IS_DOMAIN% %IS_PORT% %SERVER_DOMAIN% %SERVER_PORT%
        EXIT 0
	)

	IF "%scenario%"=="4" (
        CALL :configure_federated_auth
        CALL :end_message saml2-web-app-pickup-dispatch.com saml2-web-app-pickup-manager.com %IS_DOMAIN% %IS_PORT% %SERVER_DOMAIN% %SERVER_PORT%
        CALL :delete_idp admin admin "IDP-Google"
        EXIT 0
    )

	IF "%scenario%"=="5" (
        CALL :configure_self_signup
        EXIT 0
	)


REM Configure OIDC for OIDC samples
:configure_sso_oidc

REM Add users in the wso2-is.
CALL :add_user_data admin admin

REM Add service providers in wso2-is
CALL :add_service_provider dispatch Y2FtZXJvbjpDYW1lcm9uQDEyMw==
CALL :add_service_provider manager Y2FtZXJvbjpDYW1lcm9uQDEyMw==

REM Configure OIDC for the Service Providers
CALL :configure_oidc manager "c3dpZnRhcHA=" ZGlzcGF0Y2gxMjM0 Y2FtZXJvbjpDYW1lcm9uQDEyMw==
CALL :configure_oidc dispatch "ZGlzcGF0Y2g=" ZGlzcGF0Y2gxMjM0 Y2FtZXJvbjpDYW1lcm9uQDEyMw==

CALL :configure_sp_claims dispatch Y2FtZXJvbjpDYW1lcm9uQDEyMw==
CALL :configure_sp_claims manager Y2FtZXJvbjpDYW1lcm9uQDEyMw==

EXIT /B

REM Configure SAML for SAML samples
:configure_sso_saml2

REM Add users in wso2-is.
CALL :add_user_data admin admin

REM Add service providers in wso2-is for the user cameron
CALL :add_service_provider dispatch Y2FtZXJvbjpDYW1lcm9uQDEyMw==
CALL :add_service_provider manager Y2FtZXJvbjpDYW1lcm9uQDEyMw==

REM Configure SAML for the service providers in the cameron account
CALL :configure_saml dispatch Y2FtZXJvbjpDYW1lcm9uQDEyMw==
CALL :configure_saml manager Y2FtZXJvbjpDYW1lcm9uQDEyMw==

CALL :configure_sp_claims dispatch Y2FtZXJvbjpDYW1lcm9uQDEyMw==
CALL :configure_sp_claims manager Y2FtZXJvbjpDYW1lcm9uQDEyMw==

EXIT /B

REM Configure Multifactor auth with basic and demo hardware key
:create_multifactor_auth

echo -------------------------------------------------------------------------------------
echo ^|                                                                                   ^|
echo ^|  To configure Hardware key as a second authentication factor,                     ^|
echo ^|  Please make sure you have put the                                                ^|
echo ^|                                                                                   ^|
echo ^|  org.wso2.carbon.identity.sample.extension.authenticators-^<product-version^>.jar ^|
echo ^|  into the  ^<IS_HOME^>\repository\components\dropins directory                    ^|
echo ^|                                                                                   ^|
echo ^|  and  sample-auth.war                                                             ^|
echo ^|  into ^<IS_HOME^>\repository\deployment\server\webapps folder                     ^|
echo ^|                                                                                   ^|
echo ^|  and the below config to the ^<IS_HOME^>\repository\conf\deployment.toml          ^|
echo ^|                                                                                   ^|
echo ^|  [[resource.access_control]]                                                      ^|
echo ^|  context = "(.*)/sample-auth/(.*)"                                                ^|
echo ^|  secure = false                                                                   ^|
echo ^|  http_method = "all"                                                              ^|
echo ^|                                                                                   ^|
echo ^|  Restart the IS server when done.                                                 ^|
echo ^|                                                                                   ^|
echo ^|  Do you want to continue?                                                         ^|
echo ^|                                                                                   ^|
echo ^|  Press Y - YES                                                                    ^|
echo ^|  Press N - NO                                                                     ^|
echo -------------------------------------------------------------------------------------

set /p input=Please enter your answer...
set "input=%input:~0,1%"

IF /I "%input%"=="Y" (
    CALL :configure_sso_saml2
    CALL :configure_multi_auth dispatch Y2FtZXJvbjpDYW1lcm9uQDEyMw==
    CALL :configure_multi_auth manager Y2FtZXJvbjpDYW1lcm9uQDEyMw==
) ELSE (
    echo Please do the above configurations and re-run the script.
)

EXIT /B


REM Configure Federated auth for sample SAML apps
:configure_federated_auth

echo(
echo "---------------------------------------------------------------------------------------------"
echo "|                                                                                           |"
echo "|  To configure Google as a federated authenticator you should                              |"
echo "|                                                                                           |"
echo "|  Register OAuth 2.0 Application in Google                                                 |"
echo "|                                                                                           |"
echo "|                                                                                           |"
echo "|  To register OAuth 2.0 application in Google                                              |"
echo "|  *** Please press ctrl button and click on the link ***                                   |"
echo "|  https://is.docs.wso2.com/en/latest/guides/authentication/federated-login/                |"
echo "|  and select Google under the Create a connection application section.                     |"
echo "|  Follow the steps under Register WSO2 Identity Server on Google                           |"
echo "|  Note down the Client ID and Client Secret for later use.                                 |"
echo "|                                                                                           |"
echo "|  Continue the script when this is completed.                                              |"
echo "|                                                                                           |"
echo "|  Do you want to continue?                                                                 |"
echo "|                                                                                           |"
echo "|  Press Y - YES                                                                            |"
echo "|  Press N - NO                                                                             |"
echo "|                                                                                           |"
echo "---------------------------------------------------------------------------------------------"
echo(
set /p user=Do you want to continue?
set result=false
IF "%user%"=="y" set result=true
IF "%user%"=="Y" set result=true
IF "%result%" == "true" (
    CALL :configure_sso_saml2
    CALL :add_identity_provider admin admin
    CALL :configure_google_auth dispatch Y2FtZXJvbjpDYW1lcm9uQDEyMw==
    CALL :configure_google_auth manager Y2FtZXJvbjpDYW1lcm9uQDEyMw==
)

IF "%result%" == "false" (
    echo Please do the above configurations and re-run the script.
    exit -1
)
EXIT /B

:configure_self_signup

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
     CALL :enable_self_signup YWRtaW46YWRtaW4= false
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
            echo ""
            exit -1
        )
    echo(
    CALL :enable_self_signup YWRtaW46YWRtaW4= true
)

REM Add a service provider in wso2-is
CALL :add_service_provider dispatch YWRtaW46YWRtaW4=

REM Configure OIDC for the Service Providers
CALL :configure_oidc dispatch "ZGlzcGF0Y2g=" "ZGlzcGF0Y2gxMjM0" YWRtaW46YWRtaW4=

CALL :configure_sp_claims dispatch YWRtaW46YWRtaW4=

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
        CALL :delete_sp dispatch YWRtaW46YWRtaW4=
     )
     IF "%result%" == "false" (
        echo Please clean up the process manually.
        exit -1
     )
EXIT /B

:add_user_data

set is_user_name=%~1
set is_user_pass=%~2

call :create_user cameron Cameron Smith cameron@gmail.com Cameron@123 %is_user_name% %is_user_pass%
if errorlevel 1 exit /b 1

call :create_user alex Alex Miller alex@gmail.com Alex@123 %is_user_name% %is_user_pass%
if errorlevel 1 (
    call :delete_user_data
    exit /b 1
)

echo Creating role Manager...

curl -s -k -X GET "https://%IS_DOMAIN%:%IS_PORT%/scim2/Users?filter=userName%%20eq%%20%%22cameron%%22" ^
    -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Accept: application/json" > user_response.json

for /f "usebackq delims=" %%i in (`jq -r ".Resources[0].id" user_response.json`) do set "CAMERON_ID=%%i"

del user_response.json

if "%CAMERON_ID%"=="" (
    echo !! Failed to retrieve user ID for cameron. !!
    exit /b 1
)

(
echo {
echo   "displayName": "Manager",
echo   "schemas": ["urn:ietf:params:scim:schemas:extension:enterprise:2.0:Role"],
echo   "audience": {
echo     "value": "10084a8d-113f-4211-a0d5-efe36b082211",
echo     "type": "organization"
echo   },
echo   "users": [
echo     {
echo       "value": "%CAMERON_ID%"
echo     }
echo   ],
echo   "permissions": [
echo     { "value": "internal_application_mgt_create", "display": "Application Create" },
echo     { "value": "internal_application_mgt_view", "display": "Application View" },
echo     { "value": "internal_application_mgt_delete", "display": "Application Delete" },
echo     { "value": "internal_application_mgt_update", "display": "Application Update" }
echo   ]
echo }
) > role_payload.json

curl -s -k -X POST "https://%IS_DOMAIN%:%IS_PORT%/scim2/v2/Roles" ^
    -H "Authorization: Basic YWRtaW46YWRtaW4=" ^
    -H "Content-Type: application/scim+json" ^
    -d @role_payload.json > role_response.json

for /f "usebackq delims=" %%i in (`jq -r ".id" role_response.json`) do set "ROLE_ID=%%i"

del role_payload.json
del role_response.json

if "%ROLE_ID%"=="" (
    echo !! Problem occurred while creating role Manager. !!
    type role_response.json
    exit /b 1
)

echo ** The role Manager was successfully created. **
echo Role ID: %ROLE_ID%
echo.

exit /b 0

:create_user

set username=%~1
set given_name=%~2
set family_name=%~3
set email=%~4
set password=%~5
set is_name=%~6
set is_pass=%~7

echo.
echo Creating user %username%...

(
echo {
echo     "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
echo     "name": {
echo         "givenName": "%given_name%",
echo         "familyName": "%family_name%"
echo     },
echo     "userName": "%username%",
echo     "password": "%password%",
echo     "emails": ["%email%"],
echo     "addresses": [
echo         {
echo             "type": "home",
echo             "locality": "Toronto"
echo         }
echo     ]
echo }
) > payload.json

curl -s -k --user "%is_name%:%is_pass%" ^
    -H "Content-Type:application/json" ^
    -d @payload.json ^
    "https://%IS_DOMAIN%:%IS_PORT%/scim2/Users" > nul

if errorlevel 1 (
    echo !! Problem occurred while creating user %username%. !!
    exit /b 1
)

echo ** The user %username% was successfully created. **
echo.
exit /b 0

REM : Add a service provider
:add_service_provider

set sp_name=%~1
set auth=%~2

echo Creating Service Provider %~1...

echo { "name": "%SP_NAME%", "description": "A Quick Start Guide" } > sp_payload.json

curl -s -k -X POST "https://%IS_DOMAIN%:%IS_PORT%/api/server/v1/applications" ^
    -H "Authorization: Basic %AUTH%" ^
    -H "Content-Type: application/json" ^
    --data "@sp_payload.json" > NUL

curl -s -k -X GET "https://%IS_DOMAIN%:%IS_PORT%/api/server/v1/applications?filter=name+eq+%SP_NAME%" ^
    -H "Authorization: Basic %AUTH%" ^
    -H "Accept: application/json" > app_lookup.json

for /f "delims=" %%A in ('jq -r ".applications | if length > 0 then .[0].id else \"\" end" app_lookup.json') do (
    set "APP_ID=%%A"
)

if not defined APP_ID (
    echo !! Problem occurred: Unable to fetch Application ID for %SP_NAME%. !!
    del sp_payload.json
    del app_lookup.json
    exit /b 1
)

if "%APP_ID%"=="null" (
    echo !! Application ID is null for %SP_NAME%. !!
    del sp_payload.json
    del app_lookup.json
    exit /b 1
)

echo ** Application ID: %APP_ID% **
echo.

del sp_payload.json
del app_lookup.json

EXIT /B

REM Add a Google Identity Provider
:add_identity_provider

set IS_name=%~1
set IS_pass=%~2

IF "%IS_DOMAIN%"=="127.0.0.1" (
 set is_host=localhost.com
)

echo(
echo Please enter your CLIENT_ID (from Google API Credentials):
set /p CLIENT_ID=
echo(
echo Please enter your CLIENT_SECRET (from Google API Credentials):
set /p CLIENT_SECRET=
echo(

set "IDP_NAME=IDP-Google"
set "CALLBACK_URL=https://%IS_DOMAIN%:%IS_PORT%/commonauth"

echo Creating Identity Provider...

(
echo {
echo   "name": "%IDP_NAME%",
echo   "alias": "",
echo   "image": "assets/images/logos/google.svg",
echo   "templateId": "google-idp",
echo   "federatedAuthenticators": {
echo     "defaultAuthenticatorId": "R29vZ2xlT0lEQ0F1dGhlbnRpY2F0b3I",
echo     "authenticators": [
echo       {
echo         "authenticatorId": "R29vZ2xlT0lEQ0F1dGhlbnRpY2F0b3I",
echo         "isEnabled": true,
echo         "properties": [
echo           { "key": "ClientId", "value": "%CLIENT_ID%" },
echo           { "key": "ClientSecret", "value": "%CLIENT_SECRET%" },
echo           { "key": "callbackUrl", "value": "%CALLBACK_URL%" },
echo           { "key": "AdditionalQueryParameters", "value": "scope=email openid profile" }
echo         ]
echo       }
echo     ]
echo   },
echo   "claims": {
echo     "provisioningClaims": [],
echo     "roleClaim": { "uri": "http://wso2.org/claims/role" },
echo     "userIdClaim": {
echo       "id": "aHR0cDovL3dzbzIub3JnL2NsYWltcy91c2VybmFtZQ",
echo       "uri": "http://wso2.org/claims/username",
echo       "displayName": "Username"
echo     }
echo   }
echo }
) > idp_payload.json

powershell -noprofile -command "$Text = '%IS_name%:%IS_pass%'; [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes($Text))" > encoded_auth.txt
set /p AUTH_TOKEN=<encoded_auth.txt
del encoded_auth.txt

curl -s -k -X POST "https://%IS_DOMAIN%:%IS_PORT%/api/server/v1/identity-providers" ^
  -H "Authorization: Basic %AUTH_TOKEN%" ^
  -H "Content-Type: application/json" ^
  -d "@idp_payload.json" > nul

del idp_payload.json

echo ** The identity provider was successfully created. **
echo.

EXIT /B

:configure_saml

set sp_name=%~1
set auth=%~2

set request_data=%SCENARIO_DIR%\%scenario%\sso-config-%~1.xml
set file=%SCENARIO_DIR%\%scenario%\sso-config-%~1.xml

IF "%server_domain%" == "127.0.0.1" (
  SET server_domain=localhost.com
)

curl -s -k -X GET "https://%IS_DOMAIN%:%IS_PORT%/api/server/v1/applications?filter=name+eq+%SP_NAME%" ^
    -H "Authorization: Basic %AUTH%" ^
    -H "Accept: application/json" > app_lookup.json

for /f "delims=" %%A in ('jq -r ".applications | if length > 0 then .[0].id else \"\" end" app_lookup.json') do (
    set "APP_ID=%%A"
)

if not defined APP_ID (
    echo !! Service Provider %SP_NAME% not found. !!
    del app_lookup.json
    exit /b 1
)

if "%APP_ID%"=="null" (
    echo !! Application ID is null for %SP_NAME%. !!
    del app_lookup.json
    exit /b 1
)

del app_lookup.json

set "ISSUER=saml2-web-app-pickup-%SP_NAME%.com"
set "ACS_URL=http://%SERVER_DOMAIN%:%SERVER_PORT%/saml2-web-app-pickup-%SP_NAME%.com/home.jsp"

(
echo {
echo   "manualConfiguration": {
echo     "issuer": "%ISSUER%",
echo     "assertionConsumerUrls": [ "%ACS_URL%" ],
echo     "attributeProfile": {
echo       "enabled": true,
echo       "alwaysIncludeAttributesInResponse": true,
echo       "nameFormat": "urn:oasis:names:tc:SAML:2.0:attrname-format:basic"
echo     },
echo     "defaultAssertionConsumerUrl": "%ACS_URL%",
echo     "enableAssertionQueryProfile": false,
echo     "requestValidation": {
echo       "enableSignatureValidation": false
echo     },
echo     "responseSigning": {
echo       "enabled": true,
echo       "signingAlgorithm": "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"
echo     },
echo     "singleLogoutProfile": {
echo       "enabled": true,
echo       "idpInitiatedSingleLogout": {
echo         "enabled": true,
echo         "returnToUrls": [ "%ACS_URL%" ]
echo       },
echo       "logoutMethod": "BACKCHANNEL",
echo       "logoutRequestUrl": "",
echo       "logoutResponseUrl": ""
echo     },
echo     "singleSignOnProfile": {
echo       "assertion": {
echo         "audiences": [],
echo         "digestAlgorithm": "http://www.w3.org/2001/04/xmlenc#sha256",
echo         "encryption": {
echo           "assertionEncryptionAlgorithm": "http://www.w3.org/2001/04/xmlenc#aes256-cbc",
echo           "enabled": false,
echo           "keyEncryptionAlgorithm": "http://www.w3.org/2001/04/xmlenc#rsa-oaep-mgf1p"
echo         },
echo         "nameIdFormat": "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified",
echo         "recipients": []
echo       },
echo       "bindings": [ "HTTP_POST", "HTTP_REDIRECT" ],
echo       "enableIdpInitiatedSingleSignOn": false,
echo       "enableSignatureValidationForArtifactBinding": false
echo     }
echo   }
echo }
) > saml_payload.json

curl -s -k -X PUT "https://%IS_DOMAIN%:%IS_PORT%/api/server/v1/applications/%APP_ID%/inbound-protocols/saml" ^
    -H "Authorization: Basic %AUTH%" ^
    -H "Content-Type: application/json" ^
    --data "@saml_payload.json" > NUL

del saml_payload.json

EXIT /B

REM Configure OIDC for sample apps
:configure_oidc

set sp_name=%~1
set client_id=%~2
set client_secret=%~3
set auth=%~4

IF "%server_domain%" == "127.0.0.1" (
  SET server_domain=localhost.com
)

curl -s -k -X GET "https://%IS_DOMAIN%:%IS_PORT%/api/server/v1/applications?filter=name+eq+%SP_NAME%" ^
    -H "Authorization: Basic %AUTH%" ^
    -H "Accept: application/json" > app_lookup.json

for /f "usebackq delims=" %%A in (`jq -r ".applications | if length > 0 then .[0].id else \"\" end" app_lookup.json`) do (
    set "APP_ID=%%A"
)
del app_lookup.json

if not defined APP_ID (
    echo !! Service Provider %SP_NAME% not found. !!
    exit /b 1
)

if "%APP_ID%"=="null" (
    echo !! Application ID is null for %SP_NAME%. !!
    pause
    exit /b 1
)

set "CALLBACK_URL=http://%SERVER_DOMAIN%:%SERVER_PORT%/pickup-%SP_NAME%/oauth2client"

(
echo {
echo   "clientId": "%CLIENT_ID%",
echo   "clientSecret": "%CLIENT_SECRET%",
echo   "callbackURLs": [ "%CALLBACK_URL%" ],
echo   "grantTypes": [
echo     "refresh_token",
echo     "implicit",
echo     "password",
echo     "client_credentials",
echo     "authorization_code"
echo   ],
echo   "allowedOrigins": [],
echo   "logout": {
echo     "backChannelLogoutUrl": "%CALLBACK_URL%"
echo   }
echo }
) > oidc_payload.json


curl -s -k -X PUT "https://%IS_DOMAIN%:%IS_PORT%/api/server/v1/applications/%APP_ID%/inbound-protocols/oidc" ^
    -H "Authorization: Basic %AUTH%" ^
    -H "Content-Type: application/json" ^
    -d "@oidc_payload.json" > nul

del oidc_payload.json

EXIT /B

REM delete users created.
:delete_user_data

echo "Deleting the user named cameron..."

curl -s -k -X GET "https://%IS_DOMAIN%:%IS_PORT%/scim2/Users?filter=userName%%20eq%%20%%22cameron%%22" ^
  -H "Authorization: Basic YWRtaW46YWRtaW4=" ^
  -H "Accept: application/json" > user_cameron.json

for /f "delims=" %%A in ('jq -r ".Resources | if length > 0 then .[0].id else \"\" end" user_cameron.json') do (
  set "USER_ID_CAMERON=%%A"
)

del user_cameron.json

if not defined USER_ID_CAMERON (
  echo !! User cameron not found. !!
) else (
  if "%USER_ID_CAMERON%"=="null" (
    echo !! User cameron not found. !!
  ) else (
    curl -s -k -X DELETE "https://%IS_DOMAIN%:%IS_PORT%/scim2/Users/%USER_ID_CAMERON%" ^
      -H "Authorization: Basic YWRtaW46YWRtaW4=" ^
      -H "Content-Type: application/json" > nul
    echo ** The user cameron was successfully deleted. **
    echo.
  )
)

echo Deleting the user named alex...

curl -s -k -X GET "https://%IS_DOMAIN%:%IS_PORT%/scim2/Users?filter=userName%%20eq%%20%%22alex%%22" ^
  -H "Authorization: Basic YWRtaW46YWRtaW4=" ^
  -H "Accept: application/json" > user_alex.json

for /f "delims=" %%A in ('jq -r ".Resources | if length > 0 then .[0].id else \"\" end" user_alex.json') do (
  set "USER_ID_ALEX=%%A"
)

del user_alex.json

if not defined USER_ID_ALEX (
  echo !! User alex not found. !!
) else (
  if "%USER_ID_ALEX%"=="null" (
    echo !! User alex not found. !!
  ) else (
    curl -s -k -X DELETE "https://%IS_DOMAIN%:%IS_PORT%/scim2/Users/%USER_ID_ALEX%" ^
      -H "Authorization: Basic YWRtaW46YWRtaW4=" ^
      -H "Content-Type: application/json" > nul
    echo ** The user alex was successfully deleted. **
    echo.
  )
)

echo "Deleting the role named Manager..."

curl -s -k -X GET "https://%IS_DOMAIN%:%IS_PORT%/scim2/v2/Roles?filter=displayName%%20eq%%20%%22Manager%%22" ^
  -H "Authorization: Basic YWRtaW46YWRtaW4=" ^
  -H "Accept: application/json" > role_manager.json

for /f "delims=" %%A in ('jq -r ".Resources | if length > 0 then .[0].id else \"\" end" role_manager.json') do (
  set "ROLE_ID=%%A"
)

del role_manager.json

if not defined ROLE_ID (
  echo !! Role Manager not found. !!
  exit /b 0
)

if "%ROLE_ID%"=="null" (
  echo !! Role Manager not found. !!
  exit /b 0
)

curl -s -k -X DELETE "https://%IS_DOMAIN%:%IS_PORT%/scim2/v2/Roles/%ROLE_ID%" ^
  -H "Authorization: Basic YWRtaW46YWRtaW4=" ^
  -H "Content-Type: application/json" > role_delete.tmp

for %%I in (role_delete.tmp) do (
  if %%~zI equ 0 (
    echo ** The role Manager was successfully deleted. **
    echo.
  ) else (
    echo !! Problem occurred while deleting role Manager. !!
    type role_delete.tmp
    del role_delete.tmp
    exit /b 1
  )
)

del role_delete.tmp

EXIT /B

:delete_sp

set sp_name=%~1
set auth=%~2

curl -s -k -X GET "https://%IS_DOMAIN%:%IS_PORT%/api/server/v1/applications?filter=name+eq+%SP_NAME%" ^
    -H "Authorization: Basic %AUTH%" ^
    -H "Accept: application/json" > app_lookup.json

for /f "delims=" %%A in ('jq -r ".applications | if length > 0 then .[0].id else \"\" end" app_lookup.json') do (
    set "APP_ID=%%A"
)

del app_lookup.json

if not defined APP_ID (
    echo !! Service Provider %SP_NAME% not found. !!
    exit /b 0
)

if "%APP_ID%"=="null" (
    echo !! Service Provider %SP_NAME% not found. !!
    exit /b 0
)

echo Deleting Service Provider %~1...

curl -s -k -X DELETE "https://%IS_DOMAIN%:%IS_PORT%/api/server/v1/applications/%APP_ID%" ^
    -H "Authorization: Basic %AUTH%" ^
    -H "Content-Type: application/json" > response.tmp

for %%I in (response.tmp) do (
    if %%~zI equ 0 (
        echo ** The Service Provider %SP_NAME% was successfully deleted. **
    ) else (
        echo !! Problem occurred while deleting Service Provider %SP_NAME%. !!
        type response.tmp
        del response.tmp
        exit /b 1
    )
)

del response.tmp

EXIT /B

:delete_idp

set "IS_NAME=%~1"
set "IS_PASS=%~2"
set "IDP_NAME=%~3"

set "RAW_AUTH=%IS_NAME%:%IS_PASS%"
powershell -noprofile -command "[Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes('%RAW_AUTH%'))" > encoded_auth.txt
set /p AUTH_TOKEN=<encoded_auth.txt
del encoded_auth.txt

curl -s -k -X GET "https://%IS_DOMAIN%:%IS_PORT%/api/server/v1/identity-providers?filter=name+eq+%IDP_NAME%" ^
  -H "Authorization: Basic %AUTH_TOKEN%" ^
  -H "Accept: application/json" > idp_lookup.json

for /f "usebackq delims=" %%i in (`jq -r ".identityProviders[0].id" idp_lookup.json`) do set "IDP_ID=%%i"
del idp_lookup.json

if not defined IDP_ID (
    echo Identity Provider "%IDP_NAME%" not found.
    exit /b 1
)

if "%IDP_ID%"=="null" (
    echo Identity Provider "%IDP_NAME%" not found.
    exit /b 1
)

echo Deleting Identity Provider "%IDP_NAME%"...

curl -s -k -X DELETE "https://%IS_DOMAIN%:%IS_PORT%/api/server/v1/identity-providers/%IDP_ID%" ^
  -H "Authorization: Basic %AUTH_TOKEN%" ^
  -H "Accept: application/json" > nul

echo ** Identity Provider "%IDP_NAME%" successfully deleted. **
EXIT /B

:end_message

set dispatch_url=%~1
set manager_url=%~2

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
echo "|      Password: Alex@123                                                        |"
echo "|                                                                               |"
echo "|    Senior Manager                                                             |"
echo "|      Username: cameron                                                        |"
echo "|      Password: Cameron@123                                                     |"
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
        CALL :delete_sp dispatch Y2FtZXJvbjpDYW1lcm9uQDEyMw==
        CALL :delete_sp manager Y2FtZXJvbjpDYW1lcm9uQDEyMw==
        CALL :delete_user_data
	 )
     IF "%result%" == "false" (
     exit -1
     )
EXIT /B

:configure_sp_claims

set "SP_NAME=%~1"
set "AUTH=%~2"

curl -s -k -X GET "https://%IS_DOMAIN%:%IS_PORT%/api/server/v1/applications?filter=name+eq+%SP_NAME%" ^
    -H "Authorization: Basic %AUTH%" ^
    -H "Accept: application/json" > app_lookup.json

for /f "delims=" %%A in ('jq -r ".applications | if length > 0 then .[0].id else \"\" end" app_lookup.json') do (
    set "APP_ID=%%A"
)

if not defined APP_ID (
    echo !! Service Provider %SP_NAME% not found. !!
    del app_lookup.json
    exit /b 1
)

if "%APP_ID%"=="null" (
    echo !! Application ID is null for %SP_NAME%. !!
    del app_lookup.json
    exit /b 1
)

del app_lookup.json

> claim_payload.json (
echo {
echo   "claimConfiguration": {
echo     "dialect": "LOCAL",
echo     "claimMappings": [
echo       {
echo         "localClaim": { "uri": "http://wso2.org/claims/givenname" },
echo         "applicationClaim": "http://wso2.org/claims/givenname"
echo       },
echo       {
echo         "localClaim": { "uri": "http://wso2.org/claims/lastname" },
echo         "applicationClaim": "http://wso2.org/claims/lastname"
echo       },
echo       {
echo         "localClaim": { "uri": "http://wso2.org/claims/emailaddress" },
echo         "applicationClaim": "http://wso2.org/claims/emailaddress"
echo       }
echo     ],
echo     "requestedClaims": [
echo       { "claim": { "uri": "http://wso2.org/claims/givenname" }, "mandatory": true },
echo       { "claim": { "uri": "http://wso2.org/claims/lastname" }, "mandatory": true },
echo       { "claim": { "uri": "http://wso2.org/claims/emailaddress" }, "mandatory": true }
echo     ]
echo   },
echo   "advancedConfigurations": {
echo     "skipLoginConsent": true,
echo     "skipLogoutConsent": true
echo   }
echo }
)

curl -s -k -X PATCH "https://%IS_DOMAIN%:%IS_PORT%/api/server/v1/applications/%APP_ID%" ^
    -H "Authorization: Basic %AUTH%" ^
    -H "Content-Type: application/json" ^
    --data "@claim_payload.json" > NUL

del claim_payload.json
EXIT /B

:configure_multi_auth

set "SP_NAME=%~1"
set "AUTH=%~2"

curl -s -k -X GET "https://%IS_DOMAIN%:%IS_PORT%/api/server/v1/applications?filter=name+eq+%SP_NAME%" ^
  -H "Authorization: Basic %AUTH%" ^
  -H "Accept: application/json" > app_lookup.json

for /f "usebackq delims=" %%A in (`jq -r ".applications | if length > 0 then .[0].id else \"\" end" app_lookup.json`) do (
    set "APP_ID=%%A"
)
del app_lookup.json

if not defined APP_ID (
    echo !! Problem occurred while getting application details for %SP_NAME%... !!
    exit /b 1
)

if "%APP_ID%"=="null" (
    echo !! Application ID is null for %SP_NAME%. !!
    exit /b 1
)

(
  echo {
  echo   "claimConfiguration": {
  echo     "dialect": "LOCAL",
  echo     "subject": { "mappedLocalSubjectMandatory": false }
  echo   },
  echo   "provisioningConfigurations": {
  echo     "inboundProvisioning": {
  echo       "proxyMode": false,
  echo       "provisioningUserstoreDomain": "PRIMARY"
  echo     }
  echo   },
  echo   "authenticationSequence": {
  echo     "type": "USER_DEFINED",
  echo     "steps": [
  echo       { "id": 1, "options": [ { "authenticator": "BasicAuthenticator", "idp": "LOCAL" } ] },
  echo       { "id": 2, "options": [ { "authenticator": "DemoHardwareKeyAuthenticator", "idp": "LOCAL" } ] }
  echo     ]
  echo   },
  echo   "advancedConfigurations": {
  echo     "saas": false,
  echo     "enableAuthorization": false
  echo   }
  echo }
) > update_payload.json

curl -s -k -X PATCH "https://%IS_DOMAIN%:%IS_PORT%/api/server/v1/applications/%APP_ID%" ^
  -H "Authorization: Basic %AUTH%" ^
  -H "Content-Type: application/json" ^
  -d "@update_payload.json" > nul
del update_payload.json

set "ISSUER=saml2-web-app-pickup-%SP_NAME%.com"
set "ACS_URL=http://%SERVER_DOMAIN%:%SERVER_PORT%/saml2-web-app-pickup-%SP_NAME%.com/home.jsp"

(
echo {
echo   "manualConfiguration": {
echo     "issuer": "%ISSUER%",
echo     "assertionConsumerUrls": [ "%ACS_URL%" ],
echo     "defaultAssertionConsumerUrl": "%ACS_URL%",
echo     "responseSigning": {
echo       "enabled": true,
echo       "signingAlgorithm": "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"
echo     },
echo     "singleLogoutProfile": {
echo       "enabled": true,
echo       "logoutMethod": "BACKCHANNEL"
echo     }
echo   }
echo }
) > saml_payload.json

curl -s -k -X PUT "https://%IS_DOMAIN%:%IS_PORT%/api/server/v1/applications/%APP_ID%/inbound-protocols/saml" ^
  -H "Authorization: Basic %AUTH%" ^
  -H "Content-Type: application/json" ^
  -d "@saml_payload.json" > nul
del saml_payload.json

EXIT /B

:configure_google_auth

set "SP_NAME=%~1"
set "AUTH=%~2"

curl -s -k -X GET "https://%IS_DOMAIN%:%IS_PORT%/api/server/v1/applications?filter=name+eq+%SP_NAME%" ^
  -H "Authorization: Basic %AUTH%" ^
  -H "Accept: application/json" > app_lookup.json

for /f "delims=" %%A in ('jq -r ".applications | if length > 0 then .[0].id else \"\" end" app_lookup.json') do (
    set "APP_ID=%%A"
)

del app_lookup.json

if not defined APP_ID (
  echo !! Problem occurred while getting application details for %SP_NAME%... !!
  exit /b 1
)

if "%APP_ID%"=="null" (
  echo !! Application ID is null for %SP_NAME%. !!
  exit /b 1
)

(
echo {
echo   "authenticationSequence": {
echo     "type": "USER_DEFINED",
echo     "steps": [
echo       {
echo         "id": 1,
echo         "options": [
echo           {
echo             "authenticator": "GoogleOIDCAuthenticator",
echo             "idp": "IDP-Google"
echo           }
echo         ]
echo       }
echo     ]
echo   }
echo }
) > update_payload.json

curl -s -k -X PATCH "https://%IS_DOMAIN%:%IS_PORT%/api/server/v1/applications/%APP_ID%" ^
  -H "Authorization: Basic %AUTH%" ^
  -H "Content-Type: application/json" ^
  -d "@update_payload.json" > nul

del update_payload.json

set "ISSUER=saml2-web-app-pickup-%SP_NAME%.com"
set "ACS_URL=http://%SERVER_DOMAIN%:%SERVER_PORT%/saml2-web-app-pickup-%SP_NAME%.com/home.jsp"

(
echo {
echo   "manualConfiguration": {
echo     "issuer": "%ISSUER%",
echo     "assertionConsumerUrls": [ "%ACS_URL%" ],
echo     "defaultAssertionConsumerUrl": "%ACS_URL%",
echo     "responseSigning": {
echo       "enabled": true,
echo       "signingAlgorithm": "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"
echo     },
echo     "singleLogoutProfile": {
echo       "enabled": true,
echo       "logoutMethod": "BACKCHANNEL"
echo     }
echo   }
echo }
) > saml_payload.json

curl -s -k -X PUT "https://%IS_DOMAIN%:%IS_PORT%/api/server/v1/applications/%APP_ID%/inbound-protocols/saml" ^
  -H "Authorization: Basic %AUTH%" ^
  -H "Content-Type: application/json" ^
  -d "@saml_payload.json" > nul

del saml_payload.json

EXIT /B

:enable_self_signup

set "AUTH=%~1"
set "LOCK_ON_CREATION=%~2"

(
  echo {
  echo   "operation": "UPDATE",
  echo   "properties": [
  echo     { "name": "SelfRegistration.Enable", "value": "true" },
  echo     { "name": "SelfRegistration.LockOnCreation", "value": "%LOCK_ON_CREATION%" },
  echo     { "name": "SelfRegistration.Notification.InternallyManage", "value": "true" },
  echo     { "name": "SelfRegistration.NotifyAccountConfirmation", "value": "false" },
  echo     { "name": "SelfRegistration.SendConfirmationOnCreation", "value": "false" },
  echo     { "name": "SelfRegistration.ReCaptcha", "value": "false" },
  echo     { "name": "SelfRegistration.VerificationCode.ExpiryTime", "value": "1440" }
  echo   ]
  echo }
) > self_signup_payload.json

curl -s -k -X PATCH "https://%IS_DOMAIN%:%IS_PORT%/api/server/v1/identity-governance/VXNlciBPbmJvYXJkaW5n/connectors/c2VsZi1zaWduLXVw" ^
  -H "Authorization: Basic %AUTH%" ^
  -H "Content-Type: application/json" ^
  -d "@self_signup_payload.json" > nul

del self_signup_payload.json

echo ** Self registration is successfully enabled. **
echo.
exit /B

