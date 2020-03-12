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

echo Please start from step 1:.
echo "----------------------------------------------------------------"
echo "| This is the Quick Start Guide for GDPR demonstrations.        |"
echo "| =====================================================         |"
echo "Before Run: Make sure the following -                                         "
echo "  * Added server details to the server.properties file in the QSG/bin folder  "
echo "  * Your WSO2 IS and Tomcat is running.                                       "
echo "  * Configure the running domains/ips and ports in server.properties file     "
echo "   in the QSG/bin folder.                                                     "
echo " Next, Try the below steps in order                                           "
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

echo "Reading server paths from %PROPERTY_FILE%"

FOR /F "eol=; tokens=6,2 delims==" %%i IN ('findstr "wso2is.host.domain" server.properties') DO SET IS_HOST_NEW=%%i
REM echo %IS_HOST_NEW%

FOR /F "eol=; tokens=6,2 delims==" %%i IN ('findstr "wso2is.host.port" server.properties') DO SET IS_PORT=%%i
REM echo %IS_PORT%

FOR /F "eol=; tokens=6,2 delims==" %%i IN ('findstr "tomcat.host.domain" server.properties') DO SET TOMCAT_HOST_NEW=%%i
REM echo %TOMCAT_HOST_NEW%

FOR /F "eol=; tokens=6,2 delims==" %%i IN ('findstr "tomcat.host.port" server.properties') DO SET TOMCAT_PORT=%%i
REM echo %TOMCAT_PORT%

IF "%IS_HOST_NEW%"=="localhost" (
 set IS_HOST=127.0.0.1
 )
REM echo %IS_HOST%

IF "%TOMCAT_HOST_NEW%"=="localhost" (
 set TOMCAT_HOST=127.0.0.1
)
REM echo %TOMCAT_HOST%


echo "----------------------------------------------------------------"
echo "| GDPR QSG is based on two scenarios.                           |"
echo "|     Scenario 1: Provide consent during self-sign up           |"
echo "|     Scenario 2: Provide consent for JIT provisioning in a     |"
echo "|          federated scenario                                   |"
echo "|                                                               |"
echo "| Activity 1:                                                   |"
echo "|                                                               |"
echo "|  Step 1 - Add an admin user and Configure service providers.  |"
echo "|                                                               |"
echo "|   Once you finish step 1, Try out the below scenarios         |"
echo "|     Scenario 1: Admin add consent purposes for                |"
echo "|                 self-registration                             |"
echo "|     Scenario 2: Granting consent during Self registration     |"
echo "|     Scenario 3: View consents provided via the user portal    |"
echo "|     Scenario 4: Use of consent for access resources           |"
echo "|                                                               |"
echo "|                                                               |"
echo "|  Step 2 - Add multiple users with consents.                   |"
echo "|     Scenario 5: Admin user view users who has provided consent|"
echo "|                 for promotion via notification app in order to|"
echo "|                 send promotions via email or mobile           |"
echo "|                                                               |"
echo "| Activity 2:                                                   |"
echo "|  Step 3 - Add an admin user, a Twitter IDP and Configure      |"
echo "|  service providers.                                           |"
echo "|                                                               |"
echo "|   Once you finish step 3, Try out the below scenarios         |"
echo "|     Scenario 6: Admin add consent purposes for                |"
echo "|                JIT provisioning for user-on-boarding          |"
echo "|     Scenario 7: Granting consent during Federated user login  |"
echo "|     Scenario 8: View consents provided via the user portal    |"
echo "----------------------------------------------------------------"
echo "Please enter the Activity you want to try : "
set /p scenario=Enter the step number you selected.

    IF "%scenario%"=="1" (

        CALL :run_step01 %IS_HOST% %IS_PORT% %TOMCAT_HOST% %TOMCAT_PORT%
        echo "Now you can try out the scenarios 1 to 4 !"
        echo "Once you finish please type any key to start step 2:"
        set /p nextStep1=Enter the step 2 you selected.
        CALL :next_step_02

   	) ELSE (

        IF "%scenario%"=="2" (
           echo "You are now configuring pickup as a Service Provider and configure twitter as the federated IDP"
           CALL :run_fed_step01 %IS_HOST% %IS_PORT% %TOMCAT_HOST% %TOMCAT_PORT%
           echo "Now you can try out the scenario 6,7,8 !"
           echo "Once you finish, press 'q' to delete the set-up"
           set /p nextStep3=Enter q to delete the set up.
              IF "%nextStep3%"=="q" (
                   CALL :delete_setup %IS_HOST% %IS_PORT%
                   CALL :delete_idp urn:deleteIdP https://%IS_HOST%:%IS_PORT%/services/IdentityProviderMgtService.IdentityProviderMgtServiceHttpsSoap11Endpoint/
              ) ELSE (
                   echo Set up is not deleted. Please delete the set-up manually.
              )

        ) ELSE (
            echo Please enter the correct step. It should be Step1.
            CALL :delete_setup %IS_HOST% %IS_PORT%
            EXIT 0
        )
    )

REM Add a Federated authenticator support
:run_fed_step01

set is_host=%~1
set is_port=%~2
set tomcat_domain=%~3
set tomcat_port=%~4

CALL :add_user admin admin %is_host% %is_port%
CALL :add_identity_provider admin admin %is_host% %is_port%
CALL :add_service_provider "pickup" "urn:createApplication" "https://%is_host%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/" "Y2FtZXJvbjpjYW1lcm9uMTIz" %is_host% %is_port% %tomcat_host% %tomcat_port%
CALL :configure_oidc "pickup" "urn:registerOAuthApplicationData" "https://%is_host%:%is_port%/services/OAuthAdminService.OAuthAdminServiceHttpsSoap11Endpoint/" "Y2FtZXJvbjpjYW1lcm9uMTIz"
CALL :update_application_oidc "pickup" "Y2FtZXJvbjpjYW1lcm9uMTIz" "ZGlzcGF0Y2g=" "ZGlzcGF0Y2gxMjM0" "urn:updateApplication" "https://%is_host%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/"

EXIT /B

REM Add a Twitter Identity Provider
:add_identity_provider

set IS_name=%~1
set IS_pass=%~2
set is_host=%~3
set is_port=%~4

IF "%is_host%"=="127.0.0.1" (
 set is_host=localhost
)
echo(
echo "Please enter your API key"
set /p key="(This can be found in the Keys and Access token section in the Application settings)"
echo(
echo "Please enter your API secret"
set /p secret="(This can be found in the Keys and Access token section in the Application settings)"
echo(

echo "Creating Identity Provider..."

curl -s -k --user %~1:%~2 -H "Content-Type: text/xml" -H "SOAPAction: urn:addIdP" -o NUL https://%is_host%:%is_port%/services/IdentityProviderMgtService.IdentityProviderMgtServiceHttpsSoap11Endpoint/ -d "<soapenv:Envelope xmlns:soapenv="\"http://schemas.xmlsoap.org/soap/envelope/"\" xmlns:mgt="\"http://mgt.idp.carbon.wso2.org"\" xmlns:xsd="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><soapenv:Header/><soapenv:Body><ns4:addIdP xmlns:ns4="\"http://mgt.idp.carbon.wso2.org"\"><ns4:identityProvider><ns1:alias xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">https://%is_host%:%is_port%/oauth2/token</ns1:alias><ns1:certificate xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\" xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/><claimConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><localClaimDialect>true</localClaimDialect><roleClaimURI>http://wso2.org/claims/role</roleClaimURI><userClaimURI xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/></claimConfig><defaultAuthenticatorConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><displayName>twitterIDP</displayName><enabled>true</enabled><name>TwitterAuthenticator</name><properties><name>APIKey</name><value>%key%</value></properties><properties><name>APISecret</name><value>%secret%</value></properties><properties><name>callbackUrl</name><value>https://%is_host%:%is_port%/commonauth</value></properties></defaultAuthenticatorConfig><ns1:displayName xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\" xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/><ns1:enable xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">false</ns1:enable><federatedAuthenticatorConfigs xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><displayName>twitter</displayName><enabled>true</enabled><name>TwitterAuthenticator</name><properties><name>APIKey</name><value>%key%</value></properties><properties><name>APISecret</name><value>%secret%</value></properties><properties><name>callbackUrl</name><value>https://%is_host%:%is_port%/commonauth</value></properties></federatedAuthenticatorConfigs><justInTimeProvisioningConfig xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\" ><provisioningEnabled>true</provisioningEnabled><provisioningUserStore>PRIMARY</provisioningUserStore><passwordProvisioningEnabled>true</passwordProvisioningEnabled><promptConsent>true</promptConsent></justInTimeProvisioningConfig><ns1:federationHub xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">false</ns1:federationHub><ns1:homeRealmId xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\" xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/><ns1:identityProviderDescription xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\" xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/><ns1:identityProviderName xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">IDP-twitter</ns1:identityProviderName><permissionAndRoleConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"/><ns1:provisioningRole xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\" xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/></ns4:identityProvider></ns4:addIdP></soapenv:Body></soapenv:Envelope>"
IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while creating the identity provider. !!"
  echo(
  exit -1
)
echo "** The identity provider was successfully created. **"
echo(
EXIT /B

:run_step01

set is_host=%~1
set is_port=%~2
set tomcat_domain=%~3
set tomcat_port=%~4

CALL :add_user admin admin %is_host% %is_port%

CALL :configure_selfsignup "urn:updateResidentIdP" "https://%is_host%:%is_port%/services/IdentityProviderMgtService.IdentityProviderMgtServiceHttpsSoap11Endpoint/" "YWRtaW46YWRtaW4=" %is_host% %is_port%

CALL :add_service_provider "pickup" "urn:createApplication" "https://%is_host%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/" "Y2FtZXJvbjpjYW1lcm9uMTIz" %is_host% %is_port% %tomcat_host% %tomcat_port%
CALL :add_service_provider "notification-center" "urn:createApplication" "https://%is_host%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/" "Y2FtZXJvbjpjYW1lcm9uMTIz" %is_host% %is_port% %tomcat_host% %tomcat_port%

CALL :configure_oidc "pickup" "urn:registerOAuthApplicationData" "https://%is_host%:%is_port%/services/OAuthAdminService.OAuthAdminServiceHttpsSoap11Endpoint/" "Y2FtZXJvbjpjYW1lcm9uMTIz"
CALL :configure_oidc "notification-center" "urn:registerOAuthApplicationData" "https://%is_host%:%is_port%/services/OAuthAdminService.OAuthAdminServiceHttpsSoap11Endpoint/" "Y2FtZXJvbjpjYW1lcm9uMTIz"

CALL :update_application_oidc "pickup" "Y2FtZXJvbjpjYW1lcm9uMTIz" "ZGlzcGF0Y2g=" "ZGlzcGF0Y2gxMjM0" "urn:updateApplication" "https://%is_host%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/"
CALL :update_application_oidc "notification-center" "Y2FtZXJvbjpjYW1lcm9uMTIz" "bm90aWZpY2F0aW9u" "bm90aWZpY2F0aW9uMTIz" "urn:updateApplication" "https://%is_host%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/"

EXIT /B

:run_step02

CALL :add_users admin admin

CALL :add_consents admin admin


EXIT /B

:next_step_02

    set is_host=%~1
    set is_port=%~1
    echo "Now multiple users will be added with consents to the system."
    CALL :run_step02
    echo "Now you can try out the scenario 5 !"
    echo "Once you finish, press 'q' to delete the set-up"
    set /p nextStep2=Enter q to delete the set up.

            IF "%nextStep2%"=="q" (
                CALL :delete_setup %is_host% %is_port%
            ) ELSE (
               echo Set up is not deleted. Please delete the set-up manually.
            )
EXIT /B


:add_user

set IS_name=%~1
set IS_pass=%~2
set is_host=%~3
set is_port=%~4
set request_data=add-role.xml

REM The following command can be used to create a user.
curl -s -k --user %~1:%~2 --data "{"schemas":[],"name":{"familyName":"Smith","givenName":"Cameron"},"userName":"cameron","password":"cameron123","emails":"cameron@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o NUL https://%is_host%:%is_port%/wso2/scim/Users

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while creating user Cameron. !!
  echo(
  exit -1
)
echo ** The user Cameron was successfully created. **
echo(

echo Creating a role named Manager...

REM The following command will add a role to the user.
curl -s -k --user %~1:%~2 -d @%request_data% -H "Content-Type: text/xml" -H "SOAPAction: urn:addRole" -o NUL https://%is_host%:%is_port%/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while creating role manager. !!
  echo(
  CALL :delete_user %is_host% %is_port%
  echo(
  exit -1
)
echo ** The role Manager was successfully created. **
echo(
EXIT /B

:add_users

set IS_name=%~1
set IS_pass=%~2

curl -s -k --user %~1:%~2 --data "{"schemas":[],"name":{"familyName":"Richards","givenName":"Alex"},"userName":"alex","password":"alex123","emails":"alex@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o NUL https://%is_host%:%is_port%/wso2/scim/Users

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while creating user Alex. !!
  echo(
  exit -1
)
echo ** The user Alex was successfully created. **
echo(

curl -s -k --user %~1:%~2 --data "{"schemas":[],"name":{"familyName":"Lively","givenName":"Blake"},"userName":"blake","password":"blake123","emails":"blake@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o NUL https://%is_host%:%is_port%/wso2/scim/Users

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while creating user Blake. !!
  echo(
  exit -1
)
echo ** The user Blake was successfully created. **
echo(

curl -s -k --user %~1:%~2 --data "{"schemas":[],"name":{"familyName":"Mathews","givenName":"Chris"},"userName":"chris","password":"chris123","emails":"chris@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o NUL https://%is_host%:%is_port%/wso2/scim/Users

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while creating user Chris. !!
  echo(
  exit -1
)
echo ** The user Chris was successfully created. **
echo(

curl -s -k --user %~1:%~2 --data "{"schemas":[],"name":{"familyName":"Garret","givenName":"Dale"},"userName":"dale","password":"dale123","emails":"dale@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o NUL https://%is_host%:%is_port%/wso2/scim/Users

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while creating user Dale. !!
  echo(
  exit -1
)
echo ** The user Dale was successfully created. **
echo(

curl -s -k --user %~1:%~2 --data "{"schemas":[],"name":{"familyName":"Simon","givenName":"Eddie"},"userName":"eddie","password":"eddie123","emails":"eddie@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o NUL https://%is_host%:%is_port%/wso2/scim/Users

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while creating user Eddie. !!
  echo(
  exit -1
)
echo ** The user Eddie was successfully created. **
echo(

curl -s -k --user %~1:%~2 --data "{"schemas":[],"name":{"familyName":"Colin","givenName":"Gray"},"userName":"gray","password":"gray123","emails":"gray@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o NUL https://%is_host%:%is_port%/wso2/scim/Users

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while creating user Gray. !!
  echo(
  exit -1
)
echo ** The user Gray was successfully created. **
echo(

curl -s -k --user %~1:%~2 --data "{"schemas":[],"name":{"familyName":"Brown","givenName":"Harper"},"userName":"harper","password":"harper123","emails":"harper@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o NUL https://%is_host%:%is_port%/wso2/scim/Users

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while creating user Harper. !!
  echo(
  exit -1
)
echo ** The user Harper was successfully created. **
echo(

curl -s -k --user %~1:%~2 --data "{"schemas":[],"name":{"familyName":"Smith","givenName":"Jean"},"userName":"jean","password":"jean123","emails":"jean@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o NUL https://%is_host%:%is_port%/wso2/scim/Users

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while creating user Jean. !!
  echo(
  exit -1
)
echo ** The user Jean was successfully created. **
echo(

curl -s -k --user %~1:%~2 --data "{"schemas":[],"name":{"familyName":"Thomas","givenName":"Kelly"},"userName":"kelly","password":"kelly123","emails":"kelly@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o NUL https://%is_host%:%is_port%/wso2/scim/Users

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while creating user Kelly. !!
  echo(
  exit -1
)
echo ** The user Kelly was successfully created. **
echo(

curl -s -k --user %~1:%~2 --data "{"schemas":[],"name":{"familyName":"Moore","givenName":"Ray"},"userName":"ray","password":"ray123","emails":"ray@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o NUL https://%is_host%:%is_port%/wso2/scim/Users

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while creating user Ray. !!
  echo(
  exit -1
)
echo ** The user Ray was successfully created. **
echo(

EXIT /B

:add_consents

echo Adding consents to the users created...
echo(

FOR /F "tokens=*" %%A IN ('dir /b GDPR-*.jar') DO SET jarname=%%A
FOR /L %%b IN (1,1,2) DO IF "!jarname:~-1!"==" " SET jarname=!jarname:~0,-1!

FOR /F "tokens=*" %%A IN ('java -cp "%jarname%;lib/httpclient-4.5.3.jar;lib/httpcore-4.4.6.jar;lib/json-20180130.jar;lib/commons-logging-1.2.jar" CategoryIdRetriever') DO SET cat_id=%%A
FOR /L %%b IN (1,1,2) DO IF "!cat_id:~-1!"==" " SET cat_id=!cat_id:~0,-1!

FOR /F "tokens=*" %%A IN ('java -cp "%jarname%;lib/httpclient-4.5.3.jar;lib/httpcore-4.4.6.jar;lib/json-20180130.jar;lib/commons-logging-1.2.jar" PurposeIdRetriever') DO SET purp_id=%%A
FOR /L %%b IN (1,1,2) DO IF "!purp_id:~-1!"==" " SET purp_id=!purp_id:~0,-1!

curl -s -k -X POST "https://%is_host%:%is_port%/api/identity/consent-mgt/v1.0/consents" -H "Authorization: Basic YWxleDphbGV4MTIz" -H "accept: application/json" -H "Content-Type: application/json" -o NUL -d "{\"services\":[{\"service\":\"127.0.0.1\",\"serviceDisplayName\": \"Resident IDP\",\"serviceDescription\": \"Resident IDP\",\"tenantDomain\":\"carbon.super\",\"purposes\":[{\"purposeId\":%purp_id%,\"purposeCategoryId\":[1],\"consentType\":\"EXPLICIT\",\"piiCategory\":[{\"piiCategoryId\":2,\"validity\":\"DATE_UNTIL:INDEFINITE\"},{\"piiCategoryId\":%cat_id%,\"validity\":\"DATE_UNTIL:INDEFINITE\"}],\"primaryPurpose\":true,\"termination\":\"DATE_UNTIL:INDEFINITE\",\"thirdPartyDisclosure\":false,\"thirdPartyName\":null}]}],\"collectionMethod\":\"Sign-Up\",\"jurisdiction\":\"CA\",\"language\":\"EN\",\"policyURL\":\"https://%is_host%:%is_port%/authenticationendpoint/privacy_policy.do\",\"properties\":[{\"key\":\"publicKey\",\"value\":\"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAluZFdW1ynitztkWLC6xKegbRWxky+5P0p4ShYEOkHs30QI2VCuR6Qo4Bz5rTgLBrky03W1GAVrZxuvKRGj9V9+PmjdGtau4CTXu9pLLcqnruaczoSdvBYA3lS9a7zgFU0+s6kMl2EhB+rk7gXluEep7lIOenzfl2f6IoTKa2fVgVd3YKiSGsyL4tztS70vmmX121qm0sTJdKWP4HxXyqK9neolXI9fYyHOYILVNZ69z/73OOVhkh/mvTmWZLM7GM6sApmyLX6OXUp8z0pkY+vT/9+zRxxQs7GurC4/C1nK3rI/0ySUgGEafO1atNjYmlFN+M3tZX6nEcA6g94IavyQIDAQAB\"}]}"

curl -s -k -X POST "https://%is_host%:%is_port%/api/identity/consent-mgt/v1.0/consents" -H "Authorization: Basic Ymxha2U6Ymxha2UxMjM=" -H "accept: application/json" -H "Content-Type: application/json" -o NUL -d "{\"services\":[{\"service\":\"127.0.0.1\",\"serviceDisplayName\": \"Resident IDP\",\"serviceDescription\": \"Resident IDP\",\"tenantDomain\":\"carbon.super\",\"purposes\":[{\"purposeId\":%purp_id%,\"purposeCategoryId\":[1],\"consentType\":\"EXPLICIT\",\"piiCategory\":[{\"piiCategoryId\":2,\"validity\":\"DATE_UNTIL:INDEFINITE\"}],\"primaryPurpose\":true,\"termination\":\"DATE_UNTIL:INDEFINITE\",\"thirdPartyDisclosure\":false,\"thirdPartyName\":null}]}],\"collectionMethod\":\"Sign-Up\",\"jurisdiction\":\"CA\",\"language\":\"EN\",\"policyURL\":\"https://%is_host%:%is_port%/authenticationendpoint/privacy_policy.do\",\"properties\":[{\"key\":\"publicKey\",\"value\":\"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAluZFdW1ynitztkWLC6xKegbRWxky+5P0p4ShYEOkHs30QI2VCuR6Qo4Bz5rTgLBrky03W1GAVrZxuvKRGj9V9+PmjdGtau4CTXu9pLLcqnruaczoSdvBYA3lS9a7zgFU0+s6kMl2EhB+rk7gXluEep7lIOenzfl2f6IoTKa2fVgVd3YKiSGsyL4tztS70vmmX121qm0sTJdKWP4HxXyqK9neolXI9fYyHOYILVNZ69z/73OOVhkh/mvTmWZLM7GM6sApmyLX6OXUp8z0pkY+vT/9+zRxxQs7GurC4/C1nK3rI/0ySUgGEafO1atNjYmlFN+M3tZX6nEcA6g94IavyQIDAQAB\"}]}"

curl -s -k -X POST "https://%is_host%:%is_port%/api/identity/consent-mgt/v1.0/consents" -H "Authorization: Basic Y2hyaXM6Y2hyaXMxMjM=" -H "accept: application/json" -H "Content-Type: application/json" -o NUL -d "{\"services\":[{\"service\":\"127.0.0.1\",\"serviceDisplayName\": \"Resident IDP\",\"serviceDescription\": \"Resident IDP\",\"tenantDomain\":\"carbon.super\",\"purposes\":[{\"purposeId\":%purp_id%,\"purposeCategoryId\":[1],\"consentType\":\"EXPLICIT\",\"piiCategory\":[{\"piiCategoryId\":2,\"validity\":\"DATE_UNTIL:INDEFINITE\"},{\"piiCategoryId\":%cat_id%,\"validity\":\"DATE_UNTIL:INDEFINITE\"}],\"primaryPurpose\":true,\"termination\":\"DATE_UNTIL:INDEFINITE\",\"thirdPartyDisclosure\":false,\"thirdPartyName\":null}]}],\"collectionMethod\":\"Sign-Up\",\"jurisdiction\":\"CA\",\"language\":\"EN\",\"policyURL\":\"https://%is_host%:%is_port%/authenticationendpoint/privacy_policy.do\",\"properties\":[{\"key\":\"publicKey\",\"value\":\"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAluZFdW1ynitztkWLC6xKegbRWxky+5P0p4ShYEOkHs30QI2VCuR6Qo4Bz5rTgLBrky03W1GAVrZxuvKRGj9V9+PmjdGtau4CTXu9pLLcqnruaczoSdvBYA3lS9a7zgFU0+s6kMl2EhB+rk7gXluEep7lIOenzfl2f6IoTKa2fVgVd3YKiSGsyL4tztS70vmmX121qm0sTJdKWP4HxXyqK9neolXI9fYyHOYILVNZ69z/73OOVhkh/mvTmWZLM7GM6sApmyLX6OXUp8z0pkY+vT/9+zRxxQs7GurC4/C1nK3rI/0ySUgGEafO1atNjYmlFN+M3tZX6nEcA6g94IavyQIDAQAB\"}]}"

curl -s -k -X POST "https://%is_host%:%is_port%/api/identity/consent-mgt/v1.0/consents" -H "Authorization: Basic ZGFsZTpkYWxlMTIz" -H "accept: application/json" -H "Content-Type: application/json" -o NUL -d "{\"services\":[{\"service\":\"127.0.0.1\",\"serviceDisplayName\": \"Resident IDP\",\"serviceDescription\": \"Resident IDP\",\"tenantDomain\":\"carbon.super\",\"purposes\":[{\"purposeId\":%purp_id%,\"purposeCategoryId\":[1],\"consentType\":\"EXPLICIT\",\"piiCategory\":[{\"piiCategoryId\":2,\"validity\":\"DATE_UNTIL:INDEFINITE\"}],\"primaryPurpose\":true,\"termination\":\"DATE_UNTIL:INDEFINITE\",\"thirdPartyDisclosure\":false,\"thirdPartyName\":null}]}],\"collectionMethod\":\"Sign-Up\",\"jurisdiction\":\"CA\",\"language\":\"EN\",\"policyURL\":\"https://%is_host%:%is_port%/authenticationendpoint/privacy_policy.do\",\"properties\":[{\"key\":\"publicKey\",\"value\":\"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAluZFdW1ynitztkWLC6xKegbRWxky+5P0p4ShYEOkHs30QI2VCuR6Qo4Bz5rTgLBrky03W1GAVrZxuvKRGj9V9+PmjdGtau4CTXu9pLLcqnruaczoSdvBYA3lS9a7zgFU0+s6kMl2EhB+rk7gXluEep7lIOenzfl2f6IoTKa2fVgVd3YKiSGsyL4tztS70vmmX121qm0sTJdKWP4HxXyqK9neolXI9fYyHOYILVNZ69z/73OOVhkh/mvTmWZLM7GM6sApmyLX6OXUp8z0pkY+vT/9+zRxxQs7GurC4/C1nK3rI/0ySUgGEafO1atNjYmlFN+M3tZX6nEcA6g94IavyQIDAQAB\"}]}"

curl -s -k -X POST "https://%is_host%:%is_port%/api/identity/consent-mgt/v1.0/consents" -H "Authorization: Basic ZWRkaWU6ZWRkaWUxMjM=" -H "accept: application/json" -H "Content-Type: application/json" -o NUL -d "{\"services\":[{\"service\":\"127.0.0.1\",\"serviceDisplayName\": \"Resident IDP\",\"serviceDescription\": \"Resident IDP\",\"tenantDomain\":\"carbon.super\",\"purposes\":[{\"purposeId\":%purp_id%,\"purposeCategoryId\":[1],\"consentType\":\"EXPLICIT\",\"piiCategory\":[{\"piiCategoryId\":2,\"validity\":\"DATE_UNTIL:INDEFINITE\"},{\"piiCategoryId\":%cat_id%,\"validity\":\"DATE_UNTIL:INDEFINITE\"}],\"primaryPurpose\":true,\"termination\":\"DATE_UNTIL:INDEFINITE\",\"thirdPartyDisclosure\":false,\"thirdPartyName\":null}]}],\"collectionMethod\":\"Sign-Up\",\"jurisdiction\":\"CA\",\"language\":\"EN\",\"policyURL\":\"https://%is_host%:%is_port%/authenticationendpoint/privacy_policy.do\",\"properties\":[{\"key\":\"publicKey\",\"value\":\"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAluZFdW1ynitztkWLC6xKegbRWxky+5P0p4ShYEOkHs30QI2VCuR6Qo4Bz5rTgLBrky03W1GAVrZxuvKRGj9V9+PmjdGtau4CTXu9pLLcqnruaczoSdvBYA3lS9a7zgFU0+s6kMl2EhB+rk7gXluEep7lIOenzfl2f6IoTKa2fVgVd3YKiSGsyL4tztS70vmmX121qm0sTJdKWP4HxXyqK9neolXI9fYyHOYILVNZ69z/73OOVhkh/mvTmWZLM7GM6sApmyLX6OXUp8z0pkY+vT/9+zRxxQs7GurC4/C1nK3rI/0ySUgGEafO1atNjYmlFN+M3tZX6nEcA6g94IavyQIDAQAB\"}]}"

curl -s -k -X POST "https://%is_host%:%is_port%/api/identity/consent-mgt/v1.0/consents" -H "Authorization: Basic Z3JheTpncmF5MTIz" -H "accept: application/json" -H "Content-Type: application/json" -o NUL -d "{\"services\":[{\"service\":\"127.0.0.1\",\"serviceDisplayName\": \"Resident IDP\",\"serviceDescription\": \"Resident IDP\",\"tenantDomain\":\"carbon.super\",\"purposes\":[{\"purposeId\":%purp_id%,\"purposeCategoryId\":[1],\"consentType\":\"EXPLICIT\",\"piiCategory\":[{\"piiCategoryId\":2,\"validity\":\"DATE_UNTIL:INDEFINITE\"}],\"primaryPurpose\":true,\"termination\":\"DATE_UNTIL:INDEFINITE\",\"thirdPartyDisclosure\":false,\"thirdPartyName\":null}]}],\"collectionMethod\":\"Sign-Up\",\"jurisdiction\":\"CA\",\"language\":\"EN\",\"policyURL\":\"https://%is_host%:%is_port%/authenticationendpoint/privacy_policy.do\",\"properties\":[{\"key\":\"publicKey\",\"value\":\"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAluZFdW1ynitztkWLC6xKegbRWxky+5P0p4ShYEOkHs30QI2VCuR6Qo4Bz5rTgLBrky03W1GAVrZxuvKRGj9V9+PmjdGtau4CTXu9pLLcqnruaczoSdvBYA3lS9a7zgFU0+s6kMl2EhB+rk7gXluEep7lIOenzfl2f6IoTKa2fVgVd3YKiSGsyL4tztS70vmmX121qm0sTJdKWP4HxXyqK9neolXI9fYyHOYILVNZ69z/73OOVhkh/mvTmWZLM7GM6sApmyLX6OXUp8z0pkY+vT/9+zRxxQs7GurC4/C1nK3rI/0ySUgGEafO1atNjYmlFN+M3tZX6nEcA6g94IavyQIDAQAB\"}]}"

curl -s -k -X POST "https://%is_host%:%is_port%/api/identity/consent-mgt/v1.0/consents" -H "Authorization: Basic aGFycGVyOmhhcnBlcjEyMw==" -H "accept: application/json" -H "Content-Type: application/json" -o NUL -d "{\"services\":[{\"service\":\"127.0.0.1\",\"serviceDisplayName\": \"Resident IDP\",\"serviceDescription\": \"Resident IDP\",\"tenantDomain\":\"carbon.super\",\"purposes\":[{\"purposeId\":%purp_id%,\"purposeCategoryId\":[1],\"consentType\":\"EXPLICIT\",\"piiCategory\":[{\"piiCategoryId\":2,\"validity\":\"DATE_UNTIL:INDEFINITE\"},{\"piiCategoryId\":%cat_id%,\"validity\":\"DATE_UNTIL:INDEFINITE\"}],\"primaryPurpose\":true,\"termination\":\"DATE_UNTIL:INDEFINITE\",\"thirdPartyDisclosure\":false,\"thirdPartyName\":null}]}],\"collectionMethod\":\"Sign-Up\",\"jurisdiction\":\"CA\",\"language\":\"EN\",\"policyURL\":\"https://%is_host%:%is_port%/authenticationendpoint/privacy_policy.do\",\"properties\":[{\"key\":\"publicKey\",\"value\":\"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAluZFdW1ynitztkWLC6xKegbRWxky+5P0p4ShYEOkHs30QI2VCuR6Qo4Bz5rTgLBrky03W1GAVrZxuvKRGj9V9+PmjdGtau4CTXu9pLLcqnruaczoSdvBYA3lS9a7zgFU0+s6kMl2EhB+rk7gXluEep7lIOenzfl2f6IoTKa2fVgVd3YKiSGsyL4tztS70vmmX121qm0sTJdKWP4HxXyqK9neolXI9fYyHOYILVNZ69z/73OOVhkh/mvTmWZLM7GM6sApmyLX6OXUp8z0pkY+vT/9+zRxxQs7GurC4/C1nK3rI/0ySUgGEafO1atNjYmlFN+M3tZX6nEcA6g94IavyQIDAQAB\"}]}"

curl -s -k -X POST "https://%is_host%:%is_port%/api/identity/consent-mgt/v1.0/consents" -H "Authorization: Basic amVhbjpqZWFuMTIz" -H "accept: application/json" -H "Content-Type: application/json" -o NUL -d "{\"services\":[{\"service\":\"127.0.0.1\",\"serviceDisplayName\": \"Resident IDP\",\"serviceDescription\": \"Resident IDP\",\"tenantDomain\":\"carbon.super\",\"purposes\":[{\"purposeId\":%purp_id%,\"purposeCategoryId\":[1],\"consentType\":\"EXPLICIT\",\"piiCategory\":[{\"piiCategoryId\":2,\"validity\":\"DATE_UNTIL:INDEFINITE\"}],\"primaryPurpose\":true,\"termination\":\"DATE_UNTIL:INDEFINITE\",\"thirdPartyDisclosure\":false,\"thirdPartyName\":null}]}],\"collectionMethod\":\"Sign-Up\",\"jurisdiction\":\"CA\",\"language\":\"EN\",\"policyURL\":\"https://%is_host%:%is_port%/authenticationendpoint/privacy_policy.do\",\"properties\":[{\"key\":\"publicKey\",\"value\":\"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAluZFdW1ynitztkWLC6xKegbRWxky+5P0p4ShYEOkHs30QI2VCuR6Qo4Bz5rTgLBrky03W1GAVrZxuvKRGj9V9+PmjdGtau4CTXu9pLLcqnruaczoSdvBYA3lS9a7zgFU0+s6kMl2EhB+rk7gXluEep7lIOenzfl2f6IoTKa2fVgVd3YKiSGsyL4tztS70vmmX121qm0sTJdKWP4HxXyqK9neolXI9fYyHOYILVNZ69z/73OOVhkh/mvTmWZLM7GM6sApmyLX6OXUp8z0pkY+vT/9+zRxxQs7GurC4/C1nK3rI/0ySUgGEafO1atNjYmlFN+M3tZX6nEcA6g94IavyQIDAQAB\"}]}"

curl -s -k -X POST "https://%is_host%:%is_port%/api/identity/consent-mgt/v1.0/consents" -H "Authorization: Basic a2VsbHk6a2VsbHkxMjM=" -H "accept: application/json" -H "Content-Type: application/json" -o NUL -d "{\"services\":[{\"service\":\"127.0.0.1\",\"serviceDisplayName\": \"Resident IDP\",\"serviceDescription\": \"Resident IDP\",\"tenantDomain\":\"carbon.super\",\"purposes\":[{\"purposeId\":%purp_id%,\"purposeCategoryId\":[1],\"consentType\":\"EXPLICIT\",\"piiCategory\":[{\"piiCategoryId\":2,\"validity\":\"DATE_UNTIL:INDEFINITE\"},{\"piiCategoryId\":%cat_id%,\"validity\":\"DATE_UNTIL:INDEFINITE\"}],\"primaryPurpose\":true,\"termination\":\"DATE_UNTIL:INDEFINITE\",\"thirdPartyDisclosure\":false,\"thirdPartyName\":null}]}],\"collectionMethod\":\"Sign-Up\",\"jurisdiction\":\"CA\",\"language\":\"EN\",\"policyURL\":\"https://%is_host%:%is_port%/authenticationendpoint/privacy_policy.do\",\"properties\":[{\"key\":\"publicKey\",\"value\":\"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAluZFdW1ynitztkWLC6xKegbRWxky+5P0p4ShYEOkHs30QI2VCuR6Qo4Bz5rTgLBrky03W1GAVrZxuvKRGj9V9+PmjdGtau4CTXu9pLLcqnruaczoSdvBYA3lS9a7zgFU0+s6kMl2EhB+rk7gXluEep7lIOenzfl2f6IoTKa2fVgVd3YKiSGsyL4tztS70vmmX121qm0sTJdKWP4HxXyqK9neolXI9fYyHOYILVNZ69z/73OOVhkh/mvTmWZLM7GM6sApmyLX6OXUp8z0pkY+vT/9+zRxxQs7GurC4/C1nK3rI/0ySUgGEafO1atNjYmlFN+M3tZX6nEcA6g94IavyQIDAQAB\"}]}"

curl -s -k -X POST "https://%is_host%:%is_port%/api/identity/consent-mgt/v1.0/consents" -H "Authorization: Basic cmF5OnJheTEyMw==" -H "accept: application/json" -H "Content-Type: application/json" -o NUL -d "{\"services\":[{\"service\":\"127.0.0.1\",\"serviceDisplayName\": \"Resident IDP\",\"serviceDescription\": \"Resident IDP\",\"tenantDomain\":\"carbon.super\",\"purposes\":[{\"purposeId\":%purp_id%,\"purposeCategoryId\":[1],\"consentType\":\"EXPLICIT\",\"piiCategory\":[{\"piiCategoryId\":2,\"validity\":\"DATE_UNTIL:INDEFINITE\"}],\"primaryPurpose\":true,\"termination\":\"DATE_UNTIL:INDEFINITE\",\"thirdPartyDisclosure\":false,\"thirdPartyName\":null}]}],\"collectionMethod\":\"Sign-Up\",\"jurisdiction\":\"CA\",\"language\":\"EN\",\"policyURL\":\"https://%is_host%:%is_port%/authenticationendpoint/privacy_policy.do\",\"properties\":[{\"key\":\"publicKey\",\"value\":\"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAluZFdW1ynitztkWLC6xKegbRWxky+5P0p4ShYEOkHs30QI2VCuR6Qo4Bz5rTgLBrky03W1GAVrZxuvKRGj9V9+PmjdGtau4CTXu9pLLcqnruaczoSdvBYA3lS9a7zgFU0+s6kMl2EhB+rk7gXluEep7lIOenzfl2f6IoTKa2fVgVd3YKiSGsyL4tztS70vmmX121qm0sTJdKWP4HxXyqK9neolXI9fYyHOYILVNZ69z/73OOVhkh/mvTmWZLM7GM6sApmyLX6OXUp8z0pkY+vT/9+zRxxQs7GurC4/C1nK3rI/0ySUgGEafO1atNjYmlFN+M3tZX6nEcA6g94IavyQIDAQAB\"}]}"

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while adding consents. !!
  echo(
  exit -1
)
echo ** The consents were successfully added. **
echo(

EXIT /B

:configure_selfsignup

set soap_action=%~1
set endpoint=%~2
set auth=%~3
set is_host=%~4
set is_port=%~5

set request_data=enable-selfsignup.xml

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

:add_service_provider

set sp_name=%~1
set soap_action=%~2
set endpoint=%~3
set auth=%~4
set request_data=create-sp-%~1.xml

IF NOT EXIST "%request_data%" (
    echo "%request_data% File does not exists."
    exit -1
)

echo Creating Service Provider %~1...

REM Send the SOAP request to create the new SP.
curl -s -k -d @%request_data% -H "Authorization: Basic %~4" -H "Content-Type: text/xml" -H "SOAPAction: %~2" -o NUL %~3

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while creating the service provider. !!
  echo(
REM CALL :delete_sp dispatch Common urn:deleteApplication https://%is_host%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
REM CALL :delete_sp swift Common urn:deleteApplication https://%is_host%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
REM CALL :delete_user
  echo(
  exit -1
)
echo ** Service Provider %~1 successfully created. **
echo(
EXIT /B

:configure_oidc

set sp_name=%~1
set soap_action=%~2
set endpoint=%~3
set auth=%~4
set request_data=oidc-config-%~1.xml

echo Configuring OIDC web SSO for %~1...

REM Configure OIDC for the created SPs.
curl -s -k -d @%request_data% -H "Authorization: Basic %~4" -H "Content-Type: text/xml" -H "SOAPAction: %~2" -o NUL %~3

echo "** OIDC successfully configured for the Service Provider %~1. **"
echo(
EXIT /B

:update_application_oidc

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

curl -s -k -d @%request_data% -H "Authorization: Basic %~2" -H "Content-Type: text/xml" -H "SOAPAction: urn:getApplication" https://%is_host%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ > response_unformatted.xml

IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while getting application details for %sp_name%.... !!"
  echo(
REM CALL :delete_sp dispatch Common urn:deleteApplication https://%is_host%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
REM CALL :delete_sp swift Common urn:deleteApplication https://%is_host%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
REM CALL :delete_user
  echo(
  exit -1
)

FOR /F "tokens=*" %%A IN ('dir /b QSG-*.jar') DO SET jarname=%%A
FOR /L %%b IN (1,1,2) DO IF "!jarname:~-1!"==" " SET jarname=!jarname:~0,-1!

FOR /F "tokens=*" %%A IN ('java -jar %jarname%') DO SET app_id=%%A
FOR /L %%b IN (1,1,2) DO IF "!app_id:~-1!"==" " SET app_id=!app_id:~0,-1!
echo(
echo Updating application %~1...

REM Send the SOAP request to Update the Application.
curl -s -k -H "Authorization: Basic %~2" -H "Content-Type: text/xml" -H "SOAPAction: %~5" -o NUL %~6 -d "<soapenv:Envelope xmlns:soapenv="\"http://schemas.xmlsoap.org/soap/envelope/"\" xmlns:xsd="\"http://org.apache.axis2/xsd"\" xmlns:xsd1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"><soapenv:Header/><soapenv:Body><xsd:updateApplication><xsd:serviceProvider><xsd1:applicationID>%app_id%</xsd1:applicationID><xsd1:applicationName>%~1</xsd1:applicationName><xsd1:claimConfig><xsd1:alwaysSendMappedLocalSubjectId>false</xsd1:alwaysSendMappedLocalSubjectId><xsd1:localClaimDialect>true</xsd1:localClaimDialect></xsd1:claimConfig><xsd1:description>oauth application</xsd1:description><xsd1:inboundAuthenticationConfig><xsd1:inboundAuthenticationRequestConfigs><xsd1:inboundAuthKey>%~3</xsd1:inboundAuthKey><xsd1:inboundAuthType>oauth2</xsd1:inboundAuthType><xsd1:properties><xsd1:advanced>false</xsd1:advanced><xsd1:confidential>false</xsd1:confidential><xsd1:defaultValue></xsd1:defaultValue><xsd1:description></xsd1:description><xsd1:displayName></xsd1:displayName><xsd1:name>oauthConsumerSecret</xsd1:name><xsd1:required>false</xsd1:required><xsd1:value>%~4</xsd1:value></xsd1:properties></xsd1:inboundAuthenticationRequestConfigs></xsd1:inboundAuthenticationConfig><xsd1:inboundProvisioningConfig><xsd1:provisioningEnabled>false</xsd1:provisioningEnabled><xsd1:provisioningUserStore>PRIMARY</xsd1:provisioningUserStore></xsd1:inboundProvisioningConfig><xsd1:localAndOutBoundAuthenticationConfig><xsd1:alwaysSendBackAuthenticatedListOfIdPs>false</xsd1:alwaysSendBackAuthenticatedListOfIdPs><xsd1:authenticationStepForAttributes></xsd1:authenticationStepForAttributes><xsd1:authenticationStepForSubject></xsd1:authenticationStepForSubject><xsd1:authenticationType>default</xsd1:authenticationType><xsd1:subjectClaimUri>http://wso2.org/claims/fullname</xsd1:subjectClaimUri></xsd1:localAndOutBoundAuthenticationConfig><xsd1:outboundProvisioningConfig><xsd1:provisionByRoleList></xsd1:provisionByRoleList></xsd1:outboundProvisioningConfig><xsd1:permissionAndRoleConfig></xsd1:permissionAndRoleConfig><xsd1:saasApp>false</xsd1:saasApp><xsd1:owner><xsd1:tenantDomain>carbon.super</xsd1:tenantDomain> <xsd1:userName>admin</xsd1:userName><xsd1:userStoreDomain>PRIMARY</xsd1:userStoreDomain></xsd1:owner></xsd:serviceProvider></xsd:updateApplication></soapenv:Body></soapenv:Envelope>"

IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while updating application %sp_name%.... !!"
  echo(
REM CALL :delete_sp dispatch Common urn:deleteApplication https://%is_host%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
REM CALL :delete_sp swift Common urn:deleteApplication https://%is_host%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
REM CALL :delete_user
  echo(
  exit -1
)

echo ** Successfully updated the application %~1. **

EXIT /B

:delete_setup

set is_host=%~1
set is_port=%~2
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
        CALL :delete_sp "pickup" "urn:deleteApplication" "https://%is_host%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/" "Y2FtZXJvbjpjYW1lcm9uMTIz"
        CALL :delete_sp "notification-center" "urn:deleteApplication" "https://%is_host%:%is_port%/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/" "Y2FtZXJvbjpjYW1lcm9uMTIz"
        CALL :delete_user %is_host% %is_port%
        CALL :delete_users %is_host% %is_port%
	 )
     IF "%result%" == "false" (
     exit -1
     )

EXIT /B

:delete_user
set is_host=%~1
set is_port=%~2
set request_data1=delete-cameron.xml
set request_data2=delete-role.xml

echo(
echo "Deleting the user named cameron..."

REM Send the SOAP request to delete the user.
curl -s -k -d @%QSG%\%request_data1% -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o NUL https://%is_host%:%is_port%/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while deleting the user cameron. !!
  echo(
  exit -1
)
echo ** The user cameron was successfully deleted. **
echo(

echo "Deleting the role named Manager..."

REM Send the SOAP request to delete the role.
curl -s -k -d @%QSG%\%request_data2% -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteRole" -o NUL https://%is_host%:%is_port%/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while deleting the role Manager. !!
  echo(
  exit -1
)
echo ** The role Manager was successfully deleted. **
echo(
EXIT /B

:delete_users
set is_host=%~1
set is_port=%~2
set request_data1=delete-alex.xml
set request_data2=delete-blake.xml
set request_data3=delete-chris.xml
set request_data4=delete-dale.xml
set request_data5=delete-eddie.xml
set request_data6=delete-gray.xml
set request_data7=delete-harper.xml
set request_data8=delete-jean.xml
set request_data9=delete-kelly.xml
set request_data10=delete-ray.xml

echo(
echo "Deleting the user named Alex..."

REM Send the SOAP request to delete the user.
curl -s -k -d @%QSG%\%request_data1% -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o NUL https://%is_host%:%is_port%/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while deleting the user Alex. !!
  echo(
  exit -1
)
echo ** The user Alex was successfully deleted. **
echo(

echo(
echo "Deleting the user named Blake..."

REM Send the SOAP request to delete the user.
curl -s -k -d @%QSG%\%request_data2% -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o NUL https://%is_host%:%is_port%/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while deleting the user Blake. !!
  echo(
  exit -1
)
echo ** The user Blake was successfully deleted. **
echo(

echo(
echo "Deleting the user named Chris..."

REM Send the SOAP request to delete the user.
curl -s -k -d @%QSG%\%request_data3% -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o NUL https://%is_host%:%is_port%/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while deleting the user Chris. !!
  echo(
  exit -1
)
echo ** The user Chris was successfully deleted. **
echo(

echo(
echo "Deleting the user named Dale..."

REM Send the SOAP request to delete the user.
curl -s -k -d @%QSG%\%request_data4% -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o NUL https://%is_host%:%is_port%/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while deleting the user Dale. !!
  echo(
  exit -1
)
echo ** The user Dale was successfully deleted. **
echo(

echo(
echo "Deleting the user named Eddie..."

REM Send the SOAP request to delete the user.
curl -s -k -d @%QSG%\%request_data5% -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o NUL https://%is_host%:%is_port%/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while deleting the user Eddie. !!
  echo(
  exit -1
)
echo ** The user Eddie was successfully deleted. **
echo(

echo(
echo "Deleting the user named Gray..."

REM Send the SOAP request to delete the user.
curl -s -k -d @%QSG%\%request_data6% -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o NUL https://%is_host%:%is_port%/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while deleting the user Gray. !!
  echo(
  exit -1
)
echo ** The user Gray was successfully deleted. **
echo(

echo(
echo "Deleting the user named Harper..."

REM Send the SOAP request to delete the user.
curl -s -k -d @%QSG%\%request_data7% -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o NUL https://%is_host%:%is_port%/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while deleting the user Harper. !!
  echo(
  exit -1
)
echo ** The user Harper was successfully deleted. **
echo(

echo(
echo "Deleting the user named Jean..."

REM Send the SOAP request to delete the user.
curl -s -k -d @%QSG%\%request_data8% -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o NUL https://%is_host%:%is_port%/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while deleting the user Jean. !!
  echo(
  exit -1
)
echo ** The user Jean was successfully deleted. **
echo(

echo(
echo "Deleting the user named Kelly..."

REM Send the SOAP request to delete the user.
curl -s -k -d @%QSG%\%request_data9% -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o NUL https://%is_host%:%is_port%/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while deleting the user Kelly. !!
  echo(
  exit -1
)
echo ** The user Kelly was successfully deleted. **
echo(

echo(
echo "Deleting the user named Ray..."

REM Send the SOAP request to delete the user.
curl -s -k -d @%QSG%\%request_data10% -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o NUL https://%is_host%:%is_port%/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while deleting the user Ray. !!
  echo(
  exit -1
)
echo ** The user Ray was successfully deleted. **
echo(

EXIT /B

:delete_sp

set sp_name=%~1
set soap_action=%~2
set endpoint=%~3
set auth=%~4
set request_data=delete-sp-%~1.xml

IF NOT EXIST "%request_data%" (
    echo %request_data% File does not exists.
    exit -1
)
echo(
echo Deleting Service Provider %~1...

REM Send the SOAP request to delete a SP.
curl -s -k -d @%request_data% -H "Authorization: Basic %~4" -H "Content-Type: text/xml" -H "SOAPAction: %~2" -o NUL %~3

IF %ERRORLEVEL% NEQ 0 (
  echo !! Problem occurred while deleting the service provider. !!
  echo(
  exit -1
)
echo ** Service Provider %~1 successfully deleted. **
EXIT /B

:delete_idp

set soap_action=%~1
set endpoint=%~2
set request_data=delete-idp-twitter.xml

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

REM Send the SOAP request to delete twitter Idp.
curl -s -k -d @%QSG%\%request_data% -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: %~2" -o NUL %~3

IF %ERRORLEVEL% NEQ 0 (
  echo "!! Problem occurred while deleting the service provider. !!"
  echo(
  exit -1
)
echo "** Identity Provider IDP-twitter successfully deleted. **"
echo(
EXIT /B

