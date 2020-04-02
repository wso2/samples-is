#!/bin/sh

# ----------------------------------------------------------------------------
#  Copyright 2018 WSO2, Inc. http://www.wso2.org
#
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.

configure_sso_saml2 () {

is_host=$1
is_port=$2
server_host=$3
server_port=$4

# Add users in wso2-is.
add_user admin admin Common ${is_host} ${is_port}

# Add service providers in wso2-is
add_service_provider dispatch Common urn:createApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz ${is_host} ${is_port}
add_service_provider manager Common urn:createApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz ${is_host} ${is_port}

# Configure SAML for the service providers   
configure_saml dispatch 02 urn:addRPServiceProvider https://${is_host}:${is_port}/services/IdentitySAMLSSOConfigService.IdentitySAMLSSOConfigServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz ${is_host} ${is_port} ${server_host} ${server_port}
configure_saml manager 02 urn:addRPServiceProvider https://${is_host}:${is_port}/services/IdentitySAMLSSOConfigService.IdentitySAMLSSOConfigServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz ${is_host} ${is_port} ${server_host} ${server_port}

create_updateapp_saml dispatch Y2FtZXJvbjpjYW1lcm9uMTIz ${is_host} ${is_port} ${server_host} ${server_port}
create_updateapp_saml manager Y2FtZXJvbjpjYW1lcm9uMTIz ${is_host} ${is_port} ${server_host} ${server_port}
	
update_application_saml dispatch 02 urn:updateApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz ${is_host} ${is_port}
update_application_saml manager 02 urn:updateApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz ${is_host} ${is_port}

return 0;
}

configure_sso_oidc() {

is_host=$1
is_port=$2
server_host=$3
server_port=$4

# Add users in the wso2-is.
add_user admin admin Common ${is_host} ${is_port}

# Add service providers in the wso2-is 
add_service_provider dispatch Common urn:createApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz ${is_host} ${is_port}
add_service_provider manager Common urn:createApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz ${is_host} ${is_port}

# Configure OIDC for the Service Providers
configure_oidc dispatch 03 urn:registerOAuthApplicationData https://${is_host}:${is_port}/services/OAuthAdminService.OAuthAdminServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz ${is_host} ${is_port} ${server_host} ${server_port}
configure_oidc manager 03 urn:registerOAuthApplicationData https://${is_host}:${is_port}/services/OAuthAdminService.OAuthAdminServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz ${is_host} ${is_port} ${server_host} ${server_port}

create_updateapp_oidc dispatch Y2FtZXJvbjpjYW1lcm9uMTIz ZGlzcGF0Y2g= ZGlzcGF0Y2gxMjM0 ${is_host} ${is_port}
create_updateapp_oidc manager Y2FtZXJvbjpjYW1lcm9uMTIz c3dpZnRhcHA= c3dpZnRhcHAxMjM= ${is_host} ${is_port}

update_application_oidc dispatch 03 urn:updateApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz ${is_host} ${is_port}
update_application_oidc manager 03 urn:updateApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz ${is_host} ${is_port}

return 0;
}

configure_federated_auth() {

is_host=$1
is_port=$2
server_host=$3
server_port=$4

echo
echo "-----------------------------------------------------------------------"
echo "|                                                                      |"
echo "|  To configure Google as a federated authenticator you should         |"
echo "|                                                                      |"
echo "|  Register OAuth 2.0 Application in Google                            |"
echo "|                                                                      |"
echo "|                                                                      |"
echo "|           To register OAuth 2.0 application in Google                |"
echo "|     *** Please press ctrl button and click on the link ***           |"
echo "|  https://is.docs.wso2.com/en/latest/get-started/quick-start-guide/   |"
echo "| and go to the Register OAuth 2.0 Application in the Google section.  |"
echo "|         Note down the API key and secret for later use.              |"
echo "|                                                                      |"
echo "|  Continue the script when this is completed.                         |"
echo "|                                                                      |"
echo "|  Do you want to continue?                                            |"
echo "|                                                                      |"
echo "|  Press y - YES                                                       |"
echo "|  Press n - NO                                                        |"
echo "|                                                                      |"
echo "------------------------------------------------------------------------"
echo
read user

case ${user} in
    [Yy]* )

    add_identity_provider admin admin 05 ${is_host} ${is_port}

    configure_sso_saml2 ${is_host} ${is_port} ${server_host} ${server_port}

    create_updateapp_fed_auth dispatch Y2FtZXJvbjpjYW1lcm9uMTIz ${is_host} ${is_port}
    create_updateapp_fed_auth manager Y2FtZXJvbjpjYW1lcm9uMTIz ${is_host} ${is_port}

    update_application_saml dispatch 05 urn:updateApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz ${is_host} ${is_port}
    update_application_saml manager 05 urn:updateApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz ${is_host} ${is_port}

    ;;
    [Nn]* ) return -1;;
        * ) echo "Please answer yes or no.";;
    esac

return 0;
}

configure_self_signup (){

is_host=$1
is_port=$2
server_host=$3
server_port=$4

echo
echo "-----------------------------------------------------------------------"
echo "|                                                                     |"
echo "|  You can configure self signup in WSO2 IS in two different ways.    |"
echo "|  So choose your desired approach from the list below to enable the  |"
echo "|  required settings.                                                 |"
echo "|                                                                     |"
echo "|    Press 1 - Enable Self User Registration(without any config.)     |"
echo "|               [ This will enable self signup in the IS without any  |"
echo "|               other configuration changes.]                         |"
echo "|                                                                     |"
echo "|    Press 2 - Enable Account Lock On Creation                        |"
echo "|               [ This will lock the user account during user         |"
echo "|               registration. You can only log into the app after     |"
echo "|               after clicking the verification link sent to the      |"
echo "|               email address you provided.]                          |"
echo "|                                                                     |"
echo "|                                                                     |"
echo "-----------------------------------------------------------------------"
echo
echo "Please enter the number you selected... "
echo
read user

case ${user} in
     1)
     update_idp_selfsignup urn:updateResidentIdP https://${is_host}:${is_port}/services/IdentityProviderMgtService.IdentityProviderMgtServiceHttpsSoap11Endpoint/ YWRtaW46YWRtaW4= 06 selfsignup ${is_host} ${is_port}
     ;;

     2)
     echo
     echo "-----------------------------------------------------------------------"
     echo "|                                                                     |"
     echo "|  Please do the following before trying self signup with account     |"
     echo "|  lock on creation enabled.                                          |"
     echo "|                                                                     |"
     echo "|  1. Open the file: deployment.toml in the path,                     |"
     echo "|     (Your WSO2-IS)/repository/conf.                                 |"
     echo "|     Ex: wso2is-5.10.0/repository/conf/deployment.toml.               |"
     echo "|                                                                     |"
     echo "|  2. Find the adapter configuration for emails and change the        |"
     echo "|     email address, username, password values.                       |"
     echo "|                                                                     |"
     echo "|  3. Finally, restart the server.                                    |"
     echo "|                                                                     |"
     echo "-----------------------------------------------------------------------"
     echo
     echo "Have you made the above mentioned configurations?"
     echo
     echo    "Press y - YES"
     echo    "Press n - NO"
     echo
     read input
     case ${input} in
        [Yy]* )
        update_idp_selfsignup urn:updateResidentIdP https://${is_host}:${is_port}/services/IdentityProviderMgtService.IdentityProviderMgtServiceHttpsSoap11Endpoint/ YWRtaW46YWRtaW4= 06 lockon ${is_host} ${is_port}
        ;;

        [Nn]* )
        echo "Please make the necessary configurations and restart the script."
        echo
        return -1;;

        * )
        echo "Please answer yes or no.";;
     esac
     ;;

	*)
	echo "Sorry, that's not an option."
	;;
esac

# Add a service provider in wso2-is
add_service_provider dispatch Common urn:createApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ YWRtaW46YWRtaW4= ${is_host} ${is_port}

# Configure OIDC for the Service Providers
configure_oidc dispatch 03 urn:registerOAuthApplicationData https://${is_host}:${is_port}/services/OAuthAdminService.OAuthAdminServiceHttpsSoap11Endpoint/ YWRtaW46YWRtaW4= ${is_host} ${is_port} ${server_host} ${server_port}

create_updateapp_oidc dispatch YWRtaW46YWRtaW4= ZGlzcGF0Y2g= ZGlzcGF0Y2gxMjM0 ${is_host} ${is_port}
update_application_oidc dispatch 03 urn:updateApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ YWRtaW46YWRtaW4= ${is_host} ${is_port}

echo
echo "---------------------------------------------------------------------------------"
echo "|                                                                               |"
echo "|  To tryout self registration please log into the sample                       |"
echo "|  app below.                                                                   |"
echo "|  *** Please press ctrl button and click on the link ***                       |"
echo "|                                                                               |"
echo "|  pickup-dispatch - http://${server_host}:${server_port}/pickup-dispatch/      |"
echo "|                                                                               |"
echo "|  Click on the ** Create Account ** button in the login page.                  |"
echo "|  Fill in the user details form and create an account.                         |"
echo "|                                                                               |"
echo "|  You can now use the username and password you provided, to                   |"
echo "|  log into pickup-dispatch.                                                    |"
echo "|                                                                               |"
echo "---------------------------------------------------------------------------------"
echo
echo "If you have finished trying out the sample web apps, you can clean the process now."
echo "Do you want to clean up the setup?"
echo
echo "Press y - YES"
echo "Press n - NO"
echo
read clean

case ${clean} in
        [Yy]* )
        delete_sp dispatch Common urn:deleteApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ YWRtaW46YWRtaW4=
	     ;;
        [Nn]* ) exit;;
        * ) echo "Please answer yes or no.";;
    esac

return 0;
}

create_workflow() {
is_host=$1
is_port=$2
server_host=$3
server_port=$4

# Add users and the relevant roles in wso2-is.
add_users_workflow admin admin 07 ${is_host} ${is_port}

# Create the workflow definition
add_workflow_definition 07 YWRtaW46YWRtaW4= ${is_host} ${is_port}

# Create a workflow association
add_workflow_association 07 YWRtaW46YWRtaW4= ${is_host} ${is_port}

# Update resident IDP
update_idp_selfsignup urn:updateResidentIdP https://${is_host}:${is_port}/services/IdentityProviderMgtService.IdentityProviderMgtServiceHttpsSoap11Endpoint/ YWRtaW46YWRtaW4= 06 selfsignup ${is_host} ${is_port}

# Add a service provider in wso2-is
add_service_provider dispatch Common urn:createApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ YWRtaW46YWRtaW4= ${is_host} ${is_port}

# Configure OIDC for the Service Providers
configure_oidc dispatch 03 urn:registerOAuthApplicationData https://${is_host}:${is_port}/services/OAuthAdminService.OAuthAdminServiceHttpsSoap11Endpoint/ YWRtaW46YWRtaW4= ${is_host} ${is_port} ${server_host} ${server_port}

create_updateapp_oidc dispatch YWRtaW46YWRtaW4= ZGlzcGF0Y2g= ZGlzcGF0Y2gxMjM0 ${is_host} ${is_port}
update_application_oidc dispatch 03 urn:updateApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ YWRtaW46YWRtaW4= ${is_host} ${is_port}

echo
echo
echo "--------------------------------------------------------------------------------------"
echo "|                                                                                    |"
echo "|    The workflow feature enables you to add more control and                        |"
echo "|    constraints to the tasks executed within it.                                    |"
echo "|                                                                                    |"
echo "|    Here we are going to try out a workflow which defines an                        |"
echo "|    approval process for new user additions.                                        |"
echo "|                                                                                    |"
echo "|    Use case: Senior manager and junior manager has to                              |"
echo "|    approve each new user addition.                                                 |"
echo "|                                                                                    |"
echo "|    To tryout the workflow please log into the sample                               |"
echo "|    app below.                                                                      |"
echo "|    *** Please press ctrl button and click on the link ***                          |"
echo "|                                                                                    |"
echo "|    pickup-dispatch - http://${server_host}:${server_port}/pickup-dispatch/         |"
echo "|                                                                                    |"
echo "|    Click on the ** Create Account ** button in the login page                      |"
echo "|    Fill in the user details form and create an account.                            |"
echo "|                                                                                    |"
echo "|    The new user you created will be disabled.                                      |"
echo "|    To enable the user please log into the WSO2 User Portal                         |"
echo "|    using the following credentials and approve the pending                         |"
echo "|    workflow requests.                                                              |"
echo "|                                                                                    |"
echo "|    WSO2 User Portal: https://${is_host}:${is_port}/user-portal/                    |"
echo "|                                                                                    |"
echo "|    First, login with Junior Manager                                                |"
echo "|      Username: alex                                                                |"
echo "|      Password: alex123                                                             |"
echo "|                                                                                    |"
echo "|    Secondly, login with Senior Manager                                             |"
echo "|      Username: cameron                                                             |"
echo "|      Password: cameron123                                                          |"
echo "|                                                                                    |"
echo "|    Now you can use your new user credentials to log into                           |"
echo "|    the app pickup-dispatch:                                                        |"
echo "|        http://${server_host}:${server_port}/pickup-dispatch/                       |"
echo "|                                                                                    |"
echo "--------------------------------------------------------------------------------------"
echo

echo "If you have finished trying out the workflow, you can clean the process now."
echo "Do you want to clean up the setup?"
echo
echo "Press y - YES"
echo "Press n - NO"
echo
read input

case ${input} in
        [Yy]* )
        delete_users_workflow ${is_host} ${is_port}
        delete_workflow_definition 07 YWRtaW46YWRtaW4= ${is_host} ${is_port}
        delete_workflow_association 07 YWRtaW46YWRtaW4= ${is_host} ${is_port}
        delete_sp dispatch Common urn:deleteApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ YWRtaW46YWRtaW4=
        ;;
        [Nn]* ) exit;;
         * ) echo "Please answer yes or no.";;
         esac

return 0;
}

update_idp_selfsignup() {

soap_action=$1
endpoint=$2
auth=$3
scenario=$4
config=$5
is_host=$6
is_port=$7
selfsignup="selfsignup"
lockon="lockon"

# Update the sso-config xml file with correct host names and port values
if [ -f "${SCENARIO_DIR}/${scenario}/update-idp-${config}.xml" ]
then
   rm -r ${SCENARIO_DIR}/${scenario}/update-idp-${config}.xml
fi
touch ${SCENARIO_DIR}/${scenario}/update-idp-${config}.xml

if [ "$config" = "$selfsignup" ];
then
echo " <soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:mgt=\"http://mgt.idp.carbon.wso2.org\"
                  xmlns:xsd=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
    <soapenv:Header/>
    <soapenv:Body>
        <mgt:updateResidentIdP>
            <!--Optional:-->
            <mgt:identityProvider>
                <!--Zero or more repetitions:-->
                <xsd:federatedAuthenticatorConfigs>
                    <!--Optional:-->
                    <xsd:name>samlsso</xsd:name>
                    <!--Zero or more repetitions:-->
                    <xsd:properties>
                        <!--Optional:-->
                        <xsd:name>IdpEntityId</xsd:name>
                        <!--Optional:-->
                        <xsd:value>localhost</xsd:value>
                    </xsd:properties>
                    <xsd:properties>
                        <xsd:name>DestinationURI.1</xsd:name>
                        <xsd:value>https://${is_host}:${is_port}/samlsso</xsd:value>
                    </xsd:properties>
                </xsd:federatedAuthenticatorConfigs>
                <xsd:federatedAuthenticatorConfigs xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>passivests</xsd:name>
                    <xsd:properties>
                        <xsd:name>IdPEntityId</xsd:name>
                        <xsd:value>localhost</xsd:value>
                    </xsd:properties>
                </xsd:federatedAuthenticatorConfigs>
                <xsd:federatedAuthenticatorConfigs xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>openidconnect</xsd:name>
                    <xsd:properties>
                        <xsd:name>IdPEntityId</xsd:name>
                        <xsd:value>https://${is_host}:${is_port}/oauth2/token</xsd:value>
                    </xsd:properties>
                </xsd:federatedAuthenticatorConfigs>
                <!--Optional:-->
                <xsd:homeRealmId>localhost</xsd:homeRealmId>
                <!--Optional:-->
                <xsd:identityProviderName>LOCAL</xsd:identityProviderName>
                <!--Zero or more repetitions:-->
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>passwordHistory.enable</xsd:name>
                    <xsd:value>false</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>passwordHistory.count</xsd:name>
                    <xsd:value>5</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>passwordPolicy.enable</xsd:name>
                    <xsd:value>false</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>passwordPolicy.min.length</xsd:name>
                    <xsd:value>6</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>passwordPolicy.max.length</xsd:name>
                    <xsd:value>12</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>passwordPolicy.pattern</xsd:name>
                    <xsd:value>^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&amp;*])).{0,100}$</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>passwordPolicy.errorMsg</xsd:name>
                    <xsd:value>'Password pattern policy violated. Password should contain a digit[0-9], a lower case
                        letter[a-z], an upper case letter[A-Z], one of !@#$%&amp;* characters'
                    </xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>sso.login.recaptcha.enable</xsd:name>
                    <xsd:value>false</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>sso.login.recaptcha.on.max.failed.attempts</xsd:name>
                    <xsd:value>3</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>account.lock.handler.enable</xsd:name>
                    <xsd:value>false</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>account.lock.handler.On.Failure.Max.Attempts</xsd:name>
                    <xsd:value>5</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>account.lock.handler.Time</xsd:name>
                    <xsd:value>5</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>account.lock.handler.login.fail.timeout.ratio</xsd:name>
                    <xsd:value>2</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>account.lock.handler.notification.manageInternally</xsd:name>
                    <xsd:value>true</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>account.disable.handler.enable</xsd:name>
                    <xsd:value>false</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>account.disable.handler.notification.manageInternally</xsd:name>
                    <xsd:value>true</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>suspension.notification.enable</xsd:name>
                    <xsd:value>false</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>suspension.notification.account.disable.delay</xsd:name>
                    <xsd:value>90</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>suspension.notification.delays</xsd:name>
                    <xsd:value>30,45,60,75</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>Recovery.Notification.Password.Enable</xsd:name>
                    <xsd:value>false</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>Recovery.Question.Password.Enable</xsd:name>
                    <xsd:value>false</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>Recovery.Question.Password.MinAnswers</xsd:name>
                    <xsd:value>2</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>Recovery.Question.Password.ReCaptcha.Enable</xsd:name>
                    <xsd:value>true</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>Recovery.Question.Password.ReCaptcha.MaxFailedAttempts</xsd:name>
                    <xsd:value>2</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>Recovery.Notification.Username.Enable</xsd:name>
                    <xsd:value>false</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>Recovery.Notification.InternallyManage</xsd:name>
                    <xsd:value>true</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>Recovery.NotifySuccess</xsd:name>
                    <xsd:value>false</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>Recovery.Question.Password.NotifyStart</xsd:name>
                    <xsd:value>false</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>Recovery.ExpiryTime</xsd:name>
                    <xsd:value>1440</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>SelfRegistration.Enable</xsd:name>
                    <xsd:value>true</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>SelfRegistration.LockOnCreation</xsd:name>
                    <xsd:value>false</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>SelfRegistration.Notification.InternallyManage</xsd:name>
                    <xsd:value>false</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>SelfRegistration.ReCaptcha</xsd:name>
                    <xsd:value>false</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>SelfRegistration.VerificationCode.ExpiryTime</xsd:name>
                    <xsd:value>1440</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>EmailVerification.Enable</xsd:name>
                    <xsd:value>false</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>EmailVerification.LockOnCreation</xsd:name>
                    <xsd:value>true</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>EmailVerification.Notification.InternallyManage</xsd:name>
                    <xsd:value>true</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>EmailVerification.ExpiryTime</xsd:name>
                    <xsd:value>1440</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>EmailVerification.AskPassword.ExpiryTime</xsd:name>
                    <xsd:value>1440</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>EmailVerification.AskPassword.PasswordGenerator</xsd:name>
                    <xsd:value>org.wso2.carbon.user.mgt.common.DefaultPasswordGenerator</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>Recovery.AdminPasswordReset.RecoveryLink</xsd:name>
                    <xsd:value>false</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>Recovery.AdminPasswordReset.OTP</xsd:name>
                    <xsd:value>false</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>Recovery.AdminPasswordReset.Offline</xsd:name>
                    <xsd:value>false</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>SessionIdleTimeout</xsd:name>
                    <xsd:value>15</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>RememberMeTimeout</xsd:name>
                    <xsd:value>20160</xsd:value>
                </xsd:idpProperties>
                <!--Optional:-->
                <xsd:primary>true</xsd:primary>
            </mgt:identityProvider>
        </mgt:updateResidentIdP>
    </soapenv:Body>
</soapenv:Envelope>" >> ${SCENARIO_DIR}/${scenario}/update-idp-${config}.xml
fi

if [ "$config" = "$lockon" ];
then
echo " <soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:mgt=\"http://mgt.idp.carbon.wso2.org\"
                  xmlns:xsd=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
    <soapenv:Header/>
    <soapenv:Body>
        <mgt:updateResidentIdP>
            <!--Optional:-->
            <mgt:identityProvider>
                <!--Zero or more repetitions:-->
                <xsd:federatedAuthenticatorConfigs>
                    <!--Optional:-->
                    <xsd:name>samlsso</xsd:name>
                    <!--Zero or more repetitions:-->
                    <xsd:properties>
                        <!--Optional:-->
                        <xsd:name>IdpEntityId</xsd:name>
                        <!--Optional:-->
                        <xsd:value>localhost</xsd:value>
                    </xsd:properties>
                    <xsd:properties>
                        <xsd:name>DestinationURI.1</xsd:name>
                        <xsd:value>https://${is_host}:${is_port}/samlsso</xsd:value>
                    </xsd:properties>
                </xsd:federatedAuthenticatorConfigs>
                <xsd:federatedAuthenticatorConfigs xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>passivests</xsd:name>
                    <xsd:properties>
                        <xsd:name>IdPEntityId</xsd:name>
                        <xsd:value>localhost</xsd:value>
                    </xsd:properties>
                </xsd:federatedAuthenticatorConfigs>
                <xsd:federatedAuthenticatorConfigs xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>openidconnect</xsd:name>
                    <xsd:properties>
                        <xsd:name>IdPEntityId</xsd:name>
                        <xsd:value>https://${is_host}:${is_port}/oauth2/token</xsd:value>
                    </xsd:properties>
                </xsd:federatedAuthenticatorConfigs>
                <!--Optional:-->
                <xsd:homeRealmId>localhost</xsd:homeRealmId>
                <!--Optional:-->
                <xsd:identityProviderName>LOCAL</xsd:identityProviderName>
                <!--Zero or more repetitions:-->
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>passwordHistory.enable</xsd:name>
                    <xsd:value>false</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>passwordHistory.count</xsd:name>
                    <xsd:value>5</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>passwordPolicy.enable</xsd:name>
                    <xsd:value>false</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>passwordPolicy.min.length</xsd:name>
                    <xsd:value>6</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>passwordPolicy.max.length</xsd:name>
                    <xsd:value>12</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>passwordPolicy.pattern</xsd:name>
                    <xsd:value>^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&amp;*])).{0,100}$</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>passwordPolicy.errorMsg</xsd:name>
                    <xsd:value>'Password pattern policy violated. Password should contain a digit[0-9], a lower case
                        letter[a-z], an upper case letter[A-Z], one of !@#$%&amp;* characters'
                    </xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>sso.login.recaptcha.enable</xsd:name>
                    <xsd:value>false</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>sso.login.recaptcha.on.max.failed.attempts</xsd:name>
                    <xsd:value>3</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>account.lock.handler.enable</xsd:name>
                    <xsd:value>false</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>account.lock.handler.On.Failure.Max.Attempts</xsd:name>
                    <xsd:value>5</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>account.lock.handler.Time</xsd:name>
                    <xsd:value>5</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>account.lock.handler.login.fail.timeout.ratio</xsd:name>
                    <xsd:value>2</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>account.lock.handler.notification.manageInternally</xsd:name>
                    <xsd:value>true</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>account.disable.handler.enable</xsd:name>
                    <xsd:value>false</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>account.disable.handler.notification.manageInternally</xsd:name>
                    <xsd:value>true</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>suspension.notification.enable</xsd:name>
                    <xsd:value>false</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>suspension.notification.account.disable.delay</xsd:name>
                    <xsd:value>90</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>suspension.notification.delays</xsd:name>
                    <xsd:value>30,45,60,75</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>Recovery.Notification.Password.Enable</xsd:name>
                    <xsd:value>false</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>Recovery.Question.Password.Enable</xsd:name>
                    <xsd:value>false</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>Recovery.Question.Password.MinAnswers</xsd:name>
                    <xsd:value>2</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>Recovery.Question.Password.ReCaptcha.Enable</xsd:name>
                    <xsd:value>true</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>Recovery.Question.Password.ReCaptcha.MaxFailedAttempts</xsd:name>
                    <xsd:value>2</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>Recovery.Notification.Username.Enable</xsd:name>
                    <xsd:value>false</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>Recovery.Notification.InternallyManage</xsd:name>
                    <xsd:value>true</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>Recovery.NotifySuccess</xsd:name>
                    <xsd:value>false</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>Recovery.Question.Password.NotifyStart</xsd:name>
                    <xsd:value>false</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>Recovery.ExpiryTime</xsd:name>
                    <xsd:value>1440</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>SelfRegistration.Enable</xsd:name>
                    <xsd:value>true</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>SelfRegistration.LockOnCreation</xsd:name>
                    <xsd:value>true</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>SelfRegistration.Notification.InternallyManage</xsd:name>
                    <xsd:value>true</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>SelfRegistration.ReCaptcha</xsd:name>
                    <xsd:value>false</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>SelfRegistration.VerificationCode.ExpiryTime</xsd:name>
                    <xsd:value>1440</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>EmailVerification.Enable</xsd:name>
                    <xsd:value>false</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>EmailVerification.LockOnCreation</xsd:name>
                    <xsd:value>true</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>EmailVerification.Notification.InternallyManage</xsd:name>
                    <xsd:value>true</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>EmailVerification.ExpiryTime</xsd:name>
                    <xsd:value>1440</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>EmailVerification.AskPassword.ExpiryTime</xsd:name>
                    <xsd:value>1440</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>EmailVerification.AskPassword.PasswordGenerator</xsd:name>
                    <xsd:value>org.wso2.carbon.user.mgt.common.DefaultPasswordGenerator</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>Recovery.AdminPasswordReset.RecoveryLink</xsd:name>
                    <xsd:value>false</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>Recovery.AdminPasswordReset.OTP</xsd:name>
                    <xsd:value>false</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>Recovery.AdminPasswordReset.Offline</xsd:name>
                    <xsd:value>false</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>SessionIdleTimeout</xsd:name>
                    <xsd:value>15</xsd:value>
                </xsd:idpProperties>
                <xsd:idpProperties xmlns=\"http://model.common.application.identity.carbon.wso2.org/xsd\">
                    <xsd:name>RememberMeTimeout</xsd:name>
                    <xsd:value>20160</xsd:value>
                </xsd:idpProperties>
                <!--Optional:-->
                <xsd:primary>true</xsd:primary>
            </mgt:identityProvider>
        </mgt:updateResidentIdP>
    </soapenv:Body>
</soapenv:Envelope>" >> ${SCENARIO_DIR}/${scenario}/update-idp-${config}.xml
fi

request_data="${SCENARIO_DIR}/${scenario}/update-idp-${config}.xml"

if [ ! -d "${SCENARIO_DIR}/${scenario}" ]
  then
    echo "${SCENARIO_DIR}/${scenario} Directory does not exists."
    return -1
  fi

  if [ ! -f "$request_data" ]
   then
    echo "$request_data File does not exists."
    return -1
  fi

curl -s -k -d @$request_data -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" -H "SOAPAction: ${soap_action}" -o /dev/null $endpoint
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while updating the identity provider. !!"
  echo
  return -1
 fi

echo "** Identity Provider successfully updated. **"
echo
return 0;
}

end_message() {

dispatch_url=$1
manager_url=$2

echo
echo "---------------------------------------------------------------------------------------"
echo "|                                                                                     |"
echo "|    You can find the sample web apps on the following URLs.                          |"
echo "|    *** Please press ctrl button and click on the links ***                          |"
echo "|                                                                                     |"
echo "|    pickup-dispatch -                                                                |"
echo "|        http://${server_host}:${server_port}/${dispatch_url}/                        |"
echo "|    pick-manager -                                                                   |"
echo "|        http://${server_host}:${server_port}/${manager_url}/                         |"
echo "|                                                                                     |"
echo "|    Please use one of the following user credentials to log in.                      |"
echo "|                                                                                     |"
echo "|    Junior Manager                                                                   |"
echo "|      Username: alex                                                                 |"
echo "|      Password: alex123                                                              |"
echo "|                                                                                     |"
echo "|    Senior Manager                                                                   |"
echo "|      Username: cameron                                                              |"
echo "|      Password: cameron123                                                           |"
echo "---------------------------------------------------------------------------------------"
echo
echo "If you have finished trying out the sample web apps, you can clean the process now."
echo "Do you want to clean up the setup?"
echo
echo "Press y - YES"
echo "Press n - NO"
echo
read clean

 case ${clean} in
        [Yy]* )
        delete_sp dispatch Common urn:deleteApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
        delete_sp manager Common urn:deleteApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
        delete_user ${is_host} ${is_port}
	;;
        [Nn]* ) exit;;
        * ) echo "Please answer yes or no.";;
    esac
return 0;
}

create_multifactor_auth() {

is_host=$1
is_port=$2
server_host=$3
server_port=$4

echo
echo "-------------------------------------------------------------------------------------"
echo "|                                                                                   |"
echo "|  To configure Hardware key as a second authentication factor,                     |"
echo "|  Please make sure you have put the                                                |"
echo "|                                                                                   |"
echo "|  org.wso2.carbon.identity.sample.extension.authenticators-<product-version>.jar   |"
echo "|  into the  <IS_HOME>/repository/components/dropins directory                      |"
echo "|                                                                                   |"
echo "|  and  sample-auth.war                                                             |"
echo "|  into <IS_HOME>/repository/deployment/server/webapps folder                       |"
echo "|  to continue the script.                                                          |"
echo "|  Restart the IS server when done.                                                 |"
echo "|                                                                                   |"
echo "|  Do you want to continue?                                                         |"
echo "|                                                                                   |"
echo "|  Press y - YES                                                                    |"
echo "|  Press n - NO                                                                     |"
echo "|                                                                                   |"
echo "-------------------------------------------------------------------------------------"
echo
read user

case ${user} in
    [Yy]* )

    configure_sso_saml2 ${is_host} ${is_port} ${server_host} ${server_port}

    create_updateapp_multi dispatch Y2FtZXJvbjpjYW1lcm9uMTIz ${is_host} ${is_port}
    create_updateapp_multi manager Y2FtZXJvbjpjYW1lcm9uMTIz ${is_host} ${is_port}

    update_application_saml dispatch 04 urn:updateApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz ${is_host} ${is_port}
    update_application_saml manager 04 urn:updateApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz ${is_host} ${is_port}

   ;;
    [Nn]* ) return -1;;
        * ) echo "Please answer yes or no.";;
    esac

return 0;
}

create_updateapp_multi() {

sp_name=$1
auth=$2
is_host=$3
is_port=$4
scenario=04

request_data="${SCENARIO_DIR}/${scenario}/get-app-${sp_name}.xml"

 if [ ! -f "$request_data" ]
  then
    echo "$request_data File does not exist."
    return -1
  fi

 if [ -f "${SCENARIO_DIR}/${scenario}/response_unformatted.xml" ]
  then
   rm -r ${SCENARIO_DIR}/${scenario}/response_unformatted.xml
 fi

touch ${SCENARIO_DIR}/${scenario}/response_unformatted.xml
curl -s -k -d @$request_data -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" -H "SOAPAction: urn:getApplication" https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ > response_unformatted.xml
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while getting application details for ${sp_name}.... !!"
  echo
  delete_sp dispatch Common urn:deleteApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  delete_sp manager Common urn:deleteApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  delete_user ${is_host} ${is_port}
  echo
  return -1
 fi

app_id=`java -jar ${SCENARIO_DIR}/${scenario}/QSG-*.jar`

 if [ -f "${SCENARIO_DIR}/${scenario}/update-app-${sp_name}.xml" ]
  then
   rm -r ${SCENARIO_DIR}/${scenario}/update-app-${sp_name}.xml
 fi

touch ${SCENARIO_DIR}/${scenario}/update-app-${sp_name}.xml
echo "<soapenv:Envelope xmlns:soapenv="\"http://schemas.xmlsoap.org/soap/envelope/"\" xmlns:xsd="\"http://org.apache.axis2/xsd"\" xmlns:xsd1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">
   <soapenv:Header/>
   <soapenv:Body>
      <ns3:updateApplication xmlns:ns3="\"http://org.apache.axis2/xsd"\">
  <ns3:serviceProvider>
    <ns1:applicationID xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">${app_id}</ns1:applicationID>
    <ns1:applicationName xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">${sp_name}</ns1:applicationName>
    <claimConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">
      <alwaysSendMappedLocalSubjectId>false</alwaysSendMappedLocalSubjectId>
      <localClaimDialect>true</localClaimDialect>
      <roleClaimURI/>
    </claimConfig>
    <ns1:description xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">sample service provider</ns1:description>
    <inboundAuthenticationConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">
      <inboundAuthenticationRequestConfigs>
        <inboundAuthKey>saml2-web-app-pickup-${sp_name}.com</inboundAuthKey>
        <inboundAuthType>samlsso</inboundAuthType>
        <properties>
          <name>attrConsumServiceIndex</name>
          <value>1223160755</value>
        </properties>
      </inboundAuthenticationRequestConfigs>
      <inboundAuthenticationRequestConfigs>
        <inboundAuthKey/>
        <inboundAuthType>passivests</inboundAuthType>
      </inboundAuthenticationRequestConfigs>
      <inboundAuthenticationRequestConfigs>
        <inboundAuthKey/>
        <inboundAuthType>openid</inboundAuthType>
      </inboundAuthenticationRequestConfigs>
    </inboundAuthenticationConfig>
    <inboundProvisioningConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">
      <dumbMode>false</dumbMode>
      <provisioningUserStore>PRIMARY</provisioningUserStore>
    </inboundProvisioningConfig>
    <localAndOutBoundAuthenticationConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">
      <alwaysSendBackAuthenticatedListOfIdPs>false</alwaysSendBackAuthenticatedListOfIdPs>
      <authenticationScriptConfig>
        <ns2:content xmlns:ns2="\"http://script.model.common.application.identity.carbon.wso2.org/xsd"\"/>
        <ns2:enabled xmlns:ns2="\"http://script.model.common.application.identity.carbon.wso2.org/xsd"\">false</ns2:enabled>
      </authenticationScriptConfig>
      <authenticationStepForAttributes xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/>
      <authenticationStepForSubject xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/>
      <authenticationSteps>
        <attributeStep>true</attributeStep>
        <localAuthenticatorConfigs>
          <displayName>basic</displayName>
          <name>BasicAuthenticator</name>
        </localAuthenticatorConfigs>
        <stepOrder>1</stepOrder>
        <subjectStep>true</subjectStep>
      </authenticationSteps>
      <authenticationSteps>
        <attributeStep>false</attributeStep>
        <localAuthenticatorConfigs>
          <displayName>Demo HardwareKey Authenticator</displayName>
          <name>DemoHardwareKeyAuthenticator</name>
        </localAuthenticatorConfigs>
        <stepOrder>2</stepOrder>
        <subjectStep>true</subjectStep>
      </authenticationSteps>
      <authenticationType>flow</authenticationType>
      <enableAuthorization>false</enableAuthorization>
      <subjectClaimUri xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/>
      <useTenantDomainInLocalSubjectIdentifier>false</useTenantDomainInLocalSubjectIdentifier>
      <useUserstoreDomainInLocalSubjectIdentifier>false</useUserstoreDomainInLocalSubjectIdentifier>
    </localAndOutBoundAuthenticationConfig>
    <outboundProvisioningConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"/>
    <owner xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">
      <tenantDomain>carbon.super</tenantDomain>
      <userName>cameron</userName>
      <userStoreDomain>PRIMARY</userStoreDomain>
    </owner>
    <permissionAndRoleConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"/>
    <ns1:requestPathAuthenticatorConfigs xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\" xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/>
    <ns1:saasApp xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">false</ns1:saasApp>
  </ns3:serviceProvider>
</ns3:updateApplication>
   </soapenv:Body>
</soapenv:Envelope>" >> ${SCENARIO_DIR}/${scenario}/update-app-${sp_name}.xml

return 0;
}

getProperty() {
   PROP_KEY=$1
   PROP_VALUE=`cat $PROPERTY_FILE | grep "$PROP_KEY" | cut -d'=' -f2`
   echo $PROP_VALUE
}

add_users_workflow() {

IS_name=$1
IS_pass=$2
scenario=$3
is_host=$4
is_port=$5
request_data1="${SCENARIO_DIR}/${scenario}/add-role-senior.xml"
request_data2="${SCENARIO_DIR}/${scenario}/add-role-junior.xml"

if [ ! -d "${SCENARIO_DIR}/${scenario}" ]
  then
    echo "${SCENARIO_DIR}/${scenario} Directory does not exist."
    return -1
  fi

  if [ ! -f "$request_data1" ]
   then
    echo "$request_data1 File does not exist."
    return -1
  fi

  if [ ! -f "$request_data2" ]
   then
    echo "$request_data2 File does not exist."
    return -1
  fi

echo
echo "Creating a user named cameron..."

# The following command can be used to create a user.
curl -s -k --user ${IS_name}:${IS_pass} --data '{"schemas":[],"name":{"familyName":"Smith","givenName":"Cameron"},"userName":"cameron","password":"cameron123","emails":"cameron@gmail.com","addresses":{"country":"Canada"}}' --header "Content-Type:application/json" -o /dev/null https://${is_host}:${is_port}/wso2/scim/Users
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating user cameron. !!"
  echo
  return -1
 fi
echo "** The user cameron was successfully created. **"
echo

echo "Creating a user named alex..."

# The following command can be used to create a user.
curl -s -k --user ${IS_name}:${IS_pass} --data '{"schemas":[],"name":{"familyName":"Miller","givenName":"Alex"},"userName":"alex","password":"alex123","emails":"alex@gmail.com","addresses":{"country":"Canada"}}' --header "Content-Type:application/json" -o /dev/null https://${is_host}:${is_port}/wso2/scim/Users
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating user alex. !!"
  echo
  delete_user ${is_host} ${is_port}
  echo
  return -1
 fi
echo "** The user alex was successfully created. **"
echo

echo "Creating a role named senior_manager..."

#The following command will add a role to the user.
curl -s -k --user ${IS_name}:${IS_pass} -d @$request_data1 -H "Content-Type: text/xml" -H "SOAPAction: urn:addRole" -o /dev/null https://${is_host}:${is_port}/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating role senior_manager. !!"
  echo
  delete_user ${is_host} ${is_port}
  echo
  return -1
 fi
echo "** The role senior_manager was successfully created. **"
echo

echo "Creating a role named junior_manager..."

#The following command will add a role to the user.
curl -s -k --user ${IS_name}:${IS_pass} -d @$request_data2 -H "Content-Type: text/xml" -H "SOAPAction: urn:addRole" -o /dev/null https://${is_host}:${is_port}/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating role junior_manager. !!"
  echo
  delete_user ${is_host} ${is_port}
  echo
  return -1
 fi
echo "** The role junior_manager was successfully created. **"
echo

return 0;
}

delete_users_workflow() {

is_host=$1
is_port=$2
request_data1="${SCENARIO_DIR}/Common/delete-cameron.xml"
request_data2="${SCENARIO_DIR}/Common/delete-alex.xml"
request_data3="${SCENARIO_DIR}/07/delete-role-senior.xml"
request_data4="${SCENARIO_DIR}/07/delete-role-junior.xml"

echo
echo "Deleting the user named cameron..."

# Send the SOAP request to delete the user.
curl -s -k -d @$request_data1 -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o /dev/null https://${is_host}:${is_port}/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while deleting the user cameron. !!"
  echo
  return -1
 fi
echo "** The user cameron was successfully deleted. **"
echo
echo "Deleting the user named alex..."

# Send the SOAP request to delete the user.
curl -s -k -d @$request_data2 -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o /dev/null https://${is_host}:${is_port}/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while deleting the user alex. !!"
  echo
  return -1
 fi
echo "** The user alex was successfully deleted. **"
echo

echo "Deleting the role named senior-manager"
# Send the SOAP request to delete the role.
curl -s -k -d @$request_data3 -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteRole" -o /dev/null https://${is_host}:${is_port}/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while deleting the role senior-manager. !!"
  echo
  return -1
 fi
echo "** The role senior-manager was successfully deleted. **"
echo
echo "Deleting the role named junior-manager"
# Send the SOAP request to delete the role.
curl -s -k -d @$request_data4 -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteRole" -o /dev/null https://${is_host}:${is_port}/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while deleting the role junior-manager. !!"
  echo
  return -1
 fi
echo "** The role junior-manager was successfully deleted. **"
echo

return 0;
}

add_workflow_definition() {

scenario=$1
auth=$2
is_host=$3
is_port=$4
request_data="${SCENARIO_DIR}/${scenario}/add-definition.xml"

if [ ! -d "${SCENARIO_DIR}/${scenario}" ]
  then
    echo "${SCENARIO_DIR}/${scenario} Directory does not exists."
    return -1
  fi

  if [ ! -f "$request_data" ]
   then
    echo "$request_data File does not exist."
    return -1
  fi

curl -s -k -d @$request_data -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" -H "SOAPAction: urn:addWorkflow" -o /dev/null https://${is_host}:${is_port}/services/WorkflowAdminService.WorkflowAdminServiceHttpsSoap11Endpoint/
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating the workflow definition. !!"
  echo
  delete_users_workflow ${is_host} ${is_port}
  echo
  return -1
 fi
echo "** The workflow definition was successfully created. **"
echo

return 0;
}

delete_workflow_definition() {

scenario=$1
auth=$2
is_host=$3
is_port=$4
request_data="${SCENARIO_DIR}/${scenario}/delete-definition.xml"

if [ ! -d "${SCENARIO_DIR}/${scenario}" ]
  then
    echo "${SCENARIO_DIR}/${scenario} Directory does not exist."
    return -1
  fi

  if [ ! -f "$request_data" ]
   then
    echo "$request_data File does not exist."
    return -1
  fi

curl -s -k -d @$request_data -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" -H "SOAPAction: urn:removeWorkflow" -o /dev/null https://${is_host}:${is_port}/services/WorkflowAdminService.WorkflowAdminServiceHttpsSoap11Endpoint/
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while deleting the workflow definition. !!"
  echo
  return -1
 fi
echo "** The workflow definition was successfully deleted. **"
echo

return 0;
}

add_workflow_association() {

scenario=$1
auth=$2
is_host=$3
is_port=$4
request_data="${SCENARIO_DIR}/${scenario}/add-association.xml"

if [ ! -d "${SCENARIO_DIR}/${scenario}" ]
  then
    echo "${SCENARIO_DIR}/${scenario} Directory does not exist."
    return -1
  fi

  if [ ! -f "$request_data" ]
   then
    echo "$request_data File does not exist."
    return -1
  fi

curl -s -k -d @$request_data -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" -H "SOAPAction: urn:addAssociation" -o /dev/null https://${is_host}:${is_port}/services/WorkflowAdminService.WorkflowAdminServiceHttpsSoap11Endpoint/
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating the workflow association. !!"
  echo
  delete_users_workflow ${is_host} ${is_port}
  delete_workflow_definition 07 YWRtaW46YWRtaW4= ${is_host} ${is_port}
  echo
  return -1
 fi
echo "** The workflow association was successfully created. **"
echo

return 0;
}

delete_workflow_association() {

scenario=$1
auth=$2
is_host=$3
is_port=$4
request_data="${SCENARIO_DIR}/${scenario}/delete-association.xml"

if [ ! -d "${SCENARIO_DIR}/${scenario}" ]
  then
    echo "${SCENARIO_DIR}/${scenario} Directory does not exist."
    return -1
  fi

  if [ ! -f "$request_data" ]
   then
    echo "$request_data File does not exist."
    return -1
  fi

curl -s -k -d @$request_data -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" -H "SOAPAction: urn:removeAssociation" -o /dev/null https://${is_host}:${is_port}/services/WorkflowAdminService.WorkflowAdminServiceHttpsSoap11Endpoint/
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while deleting the workflow association. !!"
  echo
  return -1
 fi
echo "** The workflow association was successfully deleted. **"
echo

return 0;
}

add_user() {

IS_name=$1
IS_pass=$2
scenario=$3
is_host=$4
is_port=$5
request_data="${SCENARIO_DIR}/${scenario}/add-role.xml"
echo
echo "Creating a user named cameron..."

# The following command can be used to create a user.
curl -s -k --user ${IS_name}:${IS_pass} --data '{"schemas":[],"name":{"familyName":"Smith","givenName":"Cameron"},"userName":"cameron","password":"cameron123","emails":"cameron@gmail.com","addresses":{"country":"Canada"}}' --header "Content-Type:application/json" -o /dev/null https://${is_host}:${is_port}/wso2/scim/Users
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating user cameron. !!"
  echo
  return -1
 fi
echo "** The user cameron was successfully created. **"
echo

echo "Creating a user named alex..."

# The following command can be used to create a user.
curl -s -k --user ${IS_name}:${IS_pass} --data '{"schemas":[],"name":{"familyName":"Miller","givenName":"Alex"},"userName":"alex","password":"alex123","emails":"alex@gmail.com","addresses":{"country":"Canada"}}' --header "Content-Type:application/json" -o /dev/null https://${is_host}:${is_port}/wso2/scim/Users
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating user alex. !!"
  echo
  delete_user ${is_host} ${is_port}
  echo
  return -1
 fi
echo "** The user alex was successfully created. **"
echo

echo "Creating a role named Manager..."

#The following command will add a role to the user.
curl -s -k --user ${IS_name}:${IS_pass} -d @$request_data -H "Content-Type: text/xml" -H "SOAPAction: urn:addRole" -o /dev/null https://${is_host}:${is_port}/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating role manager. !!"
  echo
  delete_user ${is_host} ${is_port}
  echo
  return -1
 fi
echo "** The role Manager was successfully created. **"
echo
}

add_service_provider() {
sp_name=$1
scenario=$2
soap_action=$3
endpoint=$4
auth=$5
is_host=$6
is_port=$7
request_data="${SCENARIO_DIR}/${scenario}/create-sp-${sp_name}.xml"

  if [ ! -d "${SCENARIO_DIR}/${scenario}" ]
  then
    echo "${SCENARIO_DIR}/${scenario} Directory not exist."
    return -1
  fi

  if [ ! -f "$request_data" ]
   then
    echo "$request_data File does not exist."
    return -1
  fi

echo "Creating Service Provider $sp_name..."

# Send the SOAP request to create the new SP.
curl -s -k -d @$request_data -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" -H "SOAPAction: ${soap_action}" -o /dev/null $endpoint
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating the service provider. !!"
  echo
  delete_sp dispatch Common urn:deleteApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  delete_sp manager Common urn:deleteApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  delete_user ${is_host} ${is_port}
  echo
  return -1
 fi
echo "** Service Provider $sp_name successfully created. **"
echo
return 0;
}

delete_user() {

is_host=$1
is_port=$2

request_data1="${SCENARIO_DIR}/Common/delete-cameron.xml"
request_data2="${SCENARIO_DIR}/Common/delete-alex.xml"
request_data3="${SCENARIO_DIR}/Common/delete-role.xml"
echo
echo "Deleting the user named cameron..."

# Send the SOAP request to delete the user.
curl -s -k -d @$request_data1 -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o /dev/null https://${is_host}:${is_port}/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while deleting the user cameron. !!"
  echo
  return -1
 fi
echo "** The user cameron was successfully deleted. **"
echo
echo "Deleting the user named alex..."

# Send the SOAP request to delete the user.
curl -s -k -d @$request_data2 -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o /dev/null https://${is_host}:${is_port}/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while deleting the user alex. !!"
  echo
  return -1
 fi
echo "** The user alex was successfully deleted. **"
echo
echo "Deleting the role named Manager..."

# Send the SOAP request to delete the role.
curl -s -k -d @$request_data3 -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteRole" -o /dev/null https://${is_host}:${is_port}/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while deleting the role Manager. !!"
  echo
  return -1
 fi
echo "** The role Manager was successfully deleted. **"
echo
}

delete_sp() {
sp_name=$1
scenario=$2
soap_action=$3
endpoint=$4
auth=$5
request_data="${SCENARIO_DIR}/${scenario}/delete-sp-${sp_name}.xml"

 if [ ! -d "${SCENARIO_DIR}/${scenario}" ]
  then
    echo "${SCENARIO_DIR}/${scenario} Directory not exist."
    return -1
  fi

  if [ ! -f "$request_data" ]
   then
    echo "$request_data File does not exist."
    return -1
  fi
echo
echo "Deleting Service Provider $sp_name..."

# Send the SOAP request to delete a SP.
curl -s -k -d @$request_data -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" -H "SOAPAction: ${soap_action}" -o /dev/null $endpoint
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while deleting the service provider. !!"
  echo
  return -1
 fi
echo "** Service Provider $sp_name successfully deleted. **"

return 0;
}

delete_idp() {

scenario=$1
soap_action=$2
endpoint=$3
request_data="${SCENARIO_DIR}/${scenario}/delete-idp-google.xml"

 if [ ! -d "${SCENARIO_DIR}/${scenario}" ]
  then
    echo "${SCENARIO_DIR}/${scenario} Directory not exist."
    return -1
  fi

  if [ ! -f "$request_data" ]
   then
    echo "$request_data File does not exist."
    return -1
  fi

echo
echo "Deleting Identity Provider IDP-google..."

# Send the SOAP request to delete a SP.
curl -s -k -d @$request_data -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: ${soap_action}" -o /dev/null $endpoint
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while deleting the service provider. !!"
  echo
  return -1
 fi

echo "** Identity Provider IDP-google successfully deleted. **"

return 0;
}

configure_saml() {
sp_name=$1
scenario=$2
soap_action=$3
endpoint=$4
auth=$5
is_host=$6
is_port=$7
server_host=$8
server_port=$9

# Update the sso-config xml file with correct host names and port values
if [ -f "${SCENARIO_DIR}/${scenario}/sso-config-${sp_name}.xml" ]
then
   rm -r ${SCENARIO_DIR}/${scenario}/sso-config-${sp_name}.xml
fi
touch ${SCENARIO_DIR}/${scenario}/sso-config-${sp_name}.xml
echo " <soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://org.apache.axis2/xsd\" xmlns:xsd1=\"http://dto.saml.sso.identity.carbon.wso2.org/xsd\">
   <soapenv:Header/>
   <soapenv:Body>
      <xsd:addRPServiceProvider>
         <!--Optional:-->
         <xsd:spDto>
            <!--Zero or more repetitions:-->
            <xsd1:assertionConsumerUrls>http://${server_host}:${server_port}/saml2-web-app-pickup-${sp_name}.com/home.jsp</xsd1:assertionConsumerUrls>
            <!--Optional:-->
            <xsd1:assertionQueryRequestProfileEnabled>false</xsd1:assertionQueryRequestProfileEnabled>
            <!--Optional:-->
            <xsd1:attributeConsumingServiceIndex>1223160755</xsd1:attributeConsumingServiceIndex>
            <!--Optional:-->
            <xsd1:certAlias>wso2carbon</xsd1:certAlias>
            <!--Optional:-->
            <xsd1:defaultAssertionConsumerUrl>http://${server_host}:${server_port}/saml2-web-app-pickup-${sp_name}.com/home.jsp</xsd1:defaultAssertionConsumerUrl>
            <!--Optional:-->
            <xsd1:digestAlgorithmURI>http://www.w3.org/2000/09/xmldsig#sha1</xsd1:digestAlgorithmURI>
            <!--Optional:-->
            <xsd1:doEnableEncryptedAssertion>false</xsd1:doEnableEncryptedAssertion>
            <!--Optional:-->
            <xsd1:doSignAssertions>true</xsd1:doSignAssertions>
            <!--Optional:-->
            <xsd1:doSignResponse>true</xsd1:doSignResponse>
            <!--Optional:-->
            <xsd1:doSingleLogout>true</xsd1:doSingleLogout>
            <!--Optional:-->
            <xsd1:doValidateSignatureInRequests>false</xsd1:doValidateSignatureInRequests>
            <!--Optional:-->
            <xsd1:enableAttributeProfile>true</xsd1:enableAttributeProfile>
            <!--Optional:-->
            <xsd1:enableAttributesByDefault>true</xsd1:enableAttributesByDefault>
            <!--Optional:-->
            <xsd1:idPInitSLOEnabled>true</xsd1:idPInitSLOEnabled>
            <!--Optional:-->
            <xsd1:idPInitSSOEnabled>true</xsd1:idPInitSSOEnabled>
            <!--Zero or more repetitions:-->
            <xsd1:idpInitSLOReturnToURLs>http://${server_host}:${server_port}/saml2-web-app-pickup-${sp_name}.com/home.jsp</xsd1:idpInitSLOReturnToURLs>
            <!--Optional:-->
            <xsd1:issuer>saml2-web-app-pickup-${sp_name}.com</xsd1:issuer>
            <!--Optional:-->
            <xsd1:nameIDFormat>urn/oasis/names/tc/SAML/1.1/nameid-format/emailAddress</xsd1:nameIDFormat>
            <!--Zero or more repetitions:-->
            <xsd1:requestedAudiences>https://${is_host}:${is_port}/oauth2/token</xsd1:requestedAudiences>
            <!--Zero or more repetitions:-->
            <xsd1:requestedRecipients>https://${is_host}:${is_port}/oauth2/token</xsd1:requestedRecipients>
            <!--Optional:-->
            <xsd1:signingAlgorithmURI>http://www.w3.org/2000/09/xmldsig#rsa-sha1</xsd1:signingAlgorithmURI>
            <!--Optional:-->
            <xsd1:sloRequestURL></xsd1:sloRequestURL>
            <!--Optional:-->
            <xsd1:sloResponseURL></xsd1:sloResponseURL>
         </xsd:spDto>
      </xsd:addRPServiceProvider>
   </soapenv:Body>
</soapenv:Envelope>" >> ${SCENARIO_DIR}/${scenario}/sso-config-${sp_name}.xml

# Configure sso for Service Provider
request_data="${SCENARIO_DIR}/${scenario}/sso-config-${sp_name}.xml"

 if [ ! -d "${SCENARIO_DIR}/${scenario}" ]
  then
    echo "$scenario Directory does not exist."
    return -1
  fi

  if [ ! -f "$request_data" ]
   then
    echo "$request_data File does not exist."
    return -1
  fi

echo "Configuring SAML2 web SSO for ${sp_name}..."

# Send the SOAP request for Confuring SAML2 web SSO.
curl -s -k -d @$request_data -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" -H "SOAPAction: ${soap_action}" -o /dev/null $endpoint
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while configuring SAML2 web SSO for ${sp_name}.... !!"
  echo
  delete_sp dispatch Common urn:deleteApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  delete_sp manager Common urn:deleteApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  delete_user ${is_host} ${is_port}
  echo
  return -1
 fi
echo "** Successfully configured SAML. **"
echo
return 0;
}

configure_oidc() {
sp_name=$1
scenario=$2
soap_action=$3
endpoint=$4
auth=$5
is_host=$6
is_port=$7
server_host=$8
server_port=$9
dispatch="dispatch"
manager="manager"

if [ "$sp_name" = "$dispatch" ];
then
    client_id="ZGlzcGF0Y2g="
    secret="ZGlzcGF0Y2gxMjM0"
    cap_spName="pickup-dispatch"
fi

if [ "$sp_name" = "$manager" ];
then
    client_id="c3dpZnRhcHA="
    secret="c3dpZnRhcHAxMjM="
    cap_spName="pickup-manager"
fi


if [ -f "${SCENARIO_DIR}/${scenario}/sso-config-${sp_name}.xml" ]
  then
   rm -r ${SCENARIO_DIR}/${scenario}/sso-config-${sp_name}.xml
fi
touch ${SCENARIO_DIR}/${scenario}/sso-config-${sp_name}.xml

echo "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://org.apache.axis2/xsd\" xmlns:xsd1=\"http://dto.oauth.identity.carbon.wso2.org/xsd\">
   <soapenv:Header/>
   <soapenv:Body>
      <xsd:registerOAuthApplicationData>
         <!--Optional:-->
         <xsd:application>
            <!--Optional:-->
            <xsd1:OAuthVersion>OAuth-2.0</xsd1:OAuthVersion>
            <!--Optional:-->
            <xsd1:applicationName>${sp_name}</xsd1:applicationName>
            <!--Optional:-->
            <xsd1:callbackUrl>http://${server_host}:${server_port}/${cap_spName}/oauth2client</xsd1:callbackUrl>
            <!--Optional:-->
            <xsd1:grantTypes>refresh_token urn:ietf:params:oauth:grant-type:saml2-bearer implicit password client_credentials iwa:ntlm authorization_code</xsd1:grantTypes>
            <!--Optional:-->
            <xsd1:oauthConsumerKey>${client_id}</xsd1:oauthConsumerKey>
            <!--Optional:-->
            <xsd1:oauthConsumerSecret>${secret}</xsd1:oauthConsumerSecret>
            <!--Optional:-->
            <xsd1:pkceMandatory>false</xsd1:pkceMandatory>
         </xsd:application>
      </xsd:registerOAuthApplicationData>
   </soapenv:Body>
</soapenv:Envelope>" >> ${SCENARIO_DIR}/${scenario}/sso-config-${sp_name}.xml

# Configure sso for Service Provider
request_data="${SCENARIO_DIR}/${scenario}/sso-config-${sp_name}.xml"

 if [ ! -d "${SCENARIO_DIR}/${scenario}" ]
  then
   echo "${SCENARIO_DIR}/${scenario} Directory does not exist."
   return -1
 fi

 if [ ! -f "$request_data" ]
  then
   echo "$request_data File does not exist."
   return -1
 fi

echo "Configuring OIDC web SSO for ${sp_name}..."

# Configure OIDC for the created SPs.
curl -s -k -d @$request_data -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" -H "SOAPAction: ${soap_action}" -o /dev/null $endpoint
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while configuring OIDC web SSO for ${sp_name}.... !!"
  echo
  delete_sp dispatch Common urn:deleteApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  delete_sp manager Common urn:deleteApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  delete_user ${is_host} ${is_port}
  echo
  return -1
 fi

echo "** OIDC successfully configured for the Service Provider $sp_name. **"
echo
return 0;
}

create_updateapp_saml() {
sp_name=$1
auth=$2
is_host=$3
is_port=$4
server_host=$5
server_port=$6

scenario=02
request_data="${SCENARIO_DIR}/${scenario}/get-app-${sp_name}.xml"
 
 if [ ! -f "$request_data" ]
  then
    echo "$request_data File does not exist."
    return -1
  fi

 if [ -f "${SCENARIO_DIR}/${scenario}/response_unformatted.xml" ]
  then
   rm -r ${SCENARIO_DIR}/${scenario}/response_unformatted.xml
 fi

touch ${SCENARIO_DIR}/${scenario}/response_unformatted.xml
curl -s -k -d @$request_data -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" -H "SOAPAction: urn:getApplication" https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ > response_unformatted.xml
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while getting application details for ${sp_name}.... !!"
  echo
  delete_sp dispatch Common urn:deleteApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  delete_sp manager Common urn:deleteApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  delete_user ${is_host} ${is_port}
  echo
  return -1
 fi

app_id=`java -jar ${SCENARIO_DIR}/${scenario}/QSG-*.jar`

 if [ -f "${SCENARIO_DIR}/${scenario}/update-app-${sp_name}.xml" ]
  then 
   rm -r ${SCENARIO_DIR}/${scenario}/update-app-${sp_name}.xml
 fi
   
touch ${SCENARIO_DIR}/${scenario}/update-app-${sp_name}.xml
echo "<soapenv:Envelope xmlns:soapenv="\"http://schemas.xmlsoap.org/soap/envelope/"\" xmlns:xsd="\"http://org.apache.axis2/xsd"\" xmlns:xsd1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">
    <soapenv:Header/>
    <soapenv:Body>
        <xsd:updateApplication>
            <!--Optional:-->
            <xsd:serviceProvider>
                <!--Optional:-->
                <xsd1:applicationID>${app_id}</xsd1:applicationID>
                <!--Optional:-->
                <xsd1:applicationName>${sp_name}</xsd1:applicationName>
                <!--Optional:-->
                <xsd1:claimConfig>
                    <!--Optional:-->
                    <xsd1:alwaysSendMappedLocalSubjectId>false</xsd1:alwaysSendMappedLocalSubjectId>
                    <!--Optional:-->
                    <xsd1:localClaimDialect>true</xsd1:localClaimDialect>
                     <xsd1:claimMappings>
                        <!--Optional:-->
                        <xsd1:localClaim>
                            <!--Optional:-->
                            <xsd1:claimUri>http://wso2.org/claims/fullname</xsd1:claimUri>
                        </xsd1:localClaim>
                        <!--Optional:-->
                        <xsd1:mandatory>true</xsd1:mandatory>
                        <!--Optional:-->
                        <xsd1:remoteClaim>
                            <!--Optional:-->
                            <xsd1:claimUri>http://wso2.org/claims/fullname</xsd1:claimUri>
                        </xsd1:remoteClaim>
                        <!--Optional:-->
                        <xsd1:requested>true</xsd1:requested>
                    </xsd1:claimMappings>
                    <xsd1:claimMappings>
                        <!--Optional:-->
                        <xsd1:localClaim>
                            <!--Optional:-->
                            <xsd1:claimUri>http://wso2.org/claims/emailaddress</xsd1:claimUri>
                        </xsd1:localClaim>
                        <!--Optional:-->
                        <xsd1:mandatory>true</xsd1:mandatory>
                        <!--Optional:-->
                        <xsd1:remoteClaim>
                            <!--Optional:-->
                            <xsd1:claimUri>http://wso2.org/claims/emailaddress</xsd1:claimUri>
                        </xsd1:remoteClaim>
                        <!--Optional:-->
                        <xsd1:requested>true</xsd1:requested>
                    </xsd1:claimMappings>
                </xsd1:claimConfig>
                <!--Optional:-->
                <xsd1:description>sample service provider</xsd1:description>
                <!--Optional:-->
                <xsd1:inboundAuthenticationConfig>
                    <!--Zero or more repetitions:-->
                    <xsd1:inboundAuthenticationRequestConfigs>
                        <!--Optional:-->
                        <xsd1:inboundAuthKey>saml2-web-app-pickup-${sp_name}.com</xsd1:inboundAuthKey>
                        <!--Optional:-->
                        <xsd1:inboundAuthType>samlsso</xsd1:inboundAuthType>
                        <!--Zero or more repetitions:-->
                        <xsd1:properties>
                            <!--Optional:-->
                            <xsd1:name>attrConsumServiceIndex</xsd1:name>
                            <!--Optional:-->
                            <xsd1:value>1223160755</xsd1:value>
                        </xsd1:properties>
                    </xsd1:inboundAuthenticationRequestConfigs>
                </xsd1:inboundAuthenticationConfig>
                <!--Optional:-->
                <xsd1:inboundProvisioningConfig>
                    <!--Optional:-->
                    <xsd1:provisioningEnabled>false</xsd1:provisioningEnabled>
                    <!--Optional:-->
                    <xsd1:provisioningUserStore>PRIMARY</xsd1:provisioningUserStore>
                </xsd1:inboundProvisioningConfig>
                <!--Optional:-->
                <xsd1:localAndOutBoundAuthenticationConfig>
                    <!--Optional:-->
                    <xsd1:alwaysSendBackAuthenticatedListOfIdPs>false</xsd1:alwaysSendBackAuthenticatedListOfIdPs>
                    <!--Optional:-->
                    <xsd1:authenticationStepForAttributes></xsd1:authenticationStepForAttributes>
                    <!--Optional:-->
                    <xsd1:authenticationStepForSubject></xsd1:authenticationStepForSubject>
                    <xsd1:authenticationType>default</xsd1:authenticationType>
                    <!--Optional:-->
                    <xsd1:subjectClaimUri>http://wso2.org/claims/fullname</xsd1:subjectClaimUri>
                </xsd1:localAndOutBoundAuthenticationConfig>
                <!--Optional:-->
                <xsd1:outboundProvisioningConfig>
                    <!--Zero or more repetitions:-->
                    <xsd1:provisionByRoleList></xsd1:provisionByRoleList>
                </xsd1:outboundProvisioningConfig>
                <!--Optional:-->
                <xsd1:permissionAndRoleConfig></xsd1:permissionAndRoleConfig>
                <!--Optional:-->
                <xsd1:saasApp>false</xsd1:saasApp>
            </xsd:serviceProvider>
        </xsd:updateApplication>
    </soapenv:Body>
</soapenv:Envelope>" >> ${SCENARIO_DIR}/${scenario}/update-app-${sp_name}.xml
}

create_updateapp_oidc() {
sp_name=$1
auth=$2
key=$3
secret=$4
is_host=$5
is_port=$6

scenario=03
request_data="${SCENARIO_DIR}/${scenario}/get-app-${sp_name}.xml"
 
 if [ ! -f "$request_data" ]
  then
    echo "$request_data File does not exists."
    return -1
  fi

 if [ -f "${SCENARIO_DIR}/${scenario}/response_unformatted.xml" ]
  then
   rm -r ${SCENARIO_DIR}/${scenario}/response_unformatted.xml
 fi

touch ${SCENARIO_DIR}/${scenario}/response_unformatted.xml

curl -s -k -d @$request_data -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" -H "SOAPAction: urn:getApplication" https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ > response_unformatted.xml
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while getting application details for ${sp_name}.... !!"
  echo
  delete_sp dispatch Common urn:deleteApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  delete_sp manager Common urn:deleteApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  delete_user ${is_host} ${is_port}
  echo
  return -1
 fi

app_id=`java -jar ${SCENARIO_DIR}/${scenario}/QSG-*.jar`

 if [ -f "${SCENARIO_DIR}/${scenario}/update-app-${sp_name}.xml" ]
  then 
   rm -r ${SCENARIO_DIR}/${scenario}/update-app-${sp_name}.xml
 fi
   
touch ${SCENARIO_DIR}/${scenario}/update-app-${sp_name}.xml
echo "<soapenv:Envelope xmlns:soapenv="\"http://schemas.xmlsoap.org/soap/envelope/"\" xmlns:xsd="\"http://org.apache.axis2/xsd"\" xmlns:xsd1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">
   <soapenv:Header/>
   <soapenv:Body>
      <xsd:updateApplication>
         <!--Optional:-->
         <xsd:serviceProvider>
            <!--Optional:-->
            <xsd1:applicationID>${app_id}</xsd1:applicationID>
            <!--Optional:-->
            <xsd1:applicationName>${sp_name}</xsd1:applicationName>
            <!--Optional:-->
            <xsd1:claimConfig>
               <!--Optional:-->
               <xsd1:alwaysSendMappedLocalSubjectId>false</xsd1:alwaysSendMappedLocalSubjectId>
               <!--Optional:-->
               <xsd1:localClaimDialect>true</xsd1:localClaimDialect>
               <xsd1:claimMappings>
                <!--Optional:-->
                    <xsd1:localClaim>
                        <!--Optional:-->
                        <xsd1:claimUri>http://wso2.org/claims/fullname</xsd1:claimUri>
                    </xsd1:localClaim>
                    <!--Optional:-->
                    <xsd1:mandatory>true</xsd1:mandatory>
                    <!--Optional:-->
                    <xsd1:remoteClaim>
                        <!--Optional:-->
                        <xsd1:claimUri>http://wso2.org/claims/fullname</xsd1:claimUri>
                    </xsd1:remoteClaim>
                    <!--Optional:-->
                    <xsd1:requested>true</xsd1:requested>
                </xsd1:claimMappings>
                <xsd1:claimMappings>
                    <!--Optional:-->
                    <xsd1:localClaim>
                        <!--Optional:-->
                        <xsd1:claimUri>http://wso2.org/claims/emailaddress</xsd1:claimUri>
                    </xsd1:localClaim>
                    <!--Optional:-->
                    <xsd1:mandatory>true</xsd1:mandatory>
                    <!--Optional:-->
                    <xsd1:remoteClaim>
                        <!--Optional:-->
                        <xsd1:claimUri>http://wso2.org/claims/emailaddress</xsd1:claimUri>
                    </xsd1:remoteClaim>
                    <!--Optional:-->
                    <xsd1:requested>true</xsd1:requested>
               </xsd1:claimMappings>
            </xsd1:claimConfig>
            <!--Optional:-->
            <xsd1:description>oauth application</xsd1:description>
            <!--Optional:-->
            <xsd1:inboundAuthenticationConfig>
               <!--Zero or more repetitions:-->
               <xsd1:inboundAuthenticationRequestConfigs>
                  <!--Optional:-->
                  <xsd1:inboundAuthKey>${key}</xsd1:inboundAuthKey>
                  <!--Optional:-->
                  <xsd1:inboundAuthType>oauth2</xsd1:inboundAuthType>
                  <!--Zero or more repetitions:-->
                  <xsd1:properties>
                     <!--Optional:-->
                     <xsd1:advanced>false</xsd1:advanced>
                     <!--Optional:-->
                     <xsd1:confidential>false</xsd1:confidential>
                     <!--Optional:-->
                     <xsd1:defaultValue></xsd1:defaultValue>
                     <!--Optional:-->
                     <xsd1:description></xsd1:description>
                     <!--Optional:-->
                     <xsd1:displayName></xsd1:displayName>
                     <!--Optional:-->
                     <xsd1:name>oauthConsumerSecret</xsd1:name>
                     <!--Optional:-->
                     <xsd1:required>false</xsd1:required>
                     <!--Optional:-->
                     <xsd1:value>${secret}</xsd1:value>
                  </xsd1:properties>
               </xsd1:inboundAuthenticationRequestConfigs>
            </xsd1:inboundAuthenticationConfig>
            <!--Optional:-->
            <xsd1:inboundProvisioningConfig>
               <!--Optional:-->
               <xsd1:provisioningEnabled>false</xsd1:provisioningEnabled>
               <!--Optional:-->
               <xsd1:provisioningUserStore>PRIMARY</xsd1:provisioningUserStore>
            </xsd1:inboundProvisioningConfig>
            <!--Optional:-->
            <xsd1:localAndOutBoundAuthenticationConfig>
               <!--Optional:-->
               <xsd1:alwaysSendBackAuthenticatedListOfIdPs>false</xsd1:alwaysSendBackAuthenticatedListOfIdPs>
               <!--Optional:-->
               <xsd1:authenticationStepForAttributes></xsd1:authenticationStepForAttributes>
               <!--Optional:-->
               <xsd1:authenticationStepForSubject></xsd1:authenticationStepForSubject>
               <xsd1:authenticationType>default</xsd1:authenticationType>
               <!--Optional:-->
               <xsd1:subjectClaimUri>http://wso2.org/claims/fullname</xsd1:subjectClaimUri>
            </xsd1:localAndOutBoundAuthenticationConfig>
            <!--Optional:-->
            <xsd1:outboundProvisioningConfig>
               <!--Zero or more repetitions:-->
               <xsd1:provisionByRoleList></xsd1:provisionByRoleList>
            </xsd1:outboundProvisioningConfig>
            <!--Optional:-->
            <xsd1:permissionAndRoleConfig></xsd1:permissionAndRoleConfig>
            <!--Optional:-->
            <xsd1:saasApp>false</xsd1:saasApp>
         </xsd:serviceProvider>
      </xsd:updateApplication>
   </soapenv:Body>
</soapenv:Envelope>" >> ${SCENARIO_DIR}/${scenario}/update-app-${sp_name}.xml
}

create_updateapp_fed_auth() {

sp_name=$1
auth=$2
is_host=$3
is_port=$4

scenario=05
request_data="${SCENARIO_DIR}/${scenario}/get-app-${sp_name}.xml"

 if [ ! -f "$request_data" ]
  then
    echo "$request_data File does not exist."
    return -1
  fi

 if [ -f "${SCENARIO_DIR}/${scenario}/response_unformatted.xml" ]
  then
   rm -r ${SCENARIO_DIR}/${scenario}/response_unformatted.xml
 fi

touch ${SCENARIO_DIR}/${scenario}/response_unformatted.xml
curl -s -k -d @$request_data -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" -H "SOAPAction: urn:getApplication" https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ > response_unformatted.xml
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while getting application details for ${sp_name}.... !!"
  echo
  delete_sp dispatch Common urn:deleteApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  delete_sp manager Common urn:deleteApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  delete_user ${is_host} ${is_port}
  echo
  return -1
 fi

app_id=`java -jar ${SCENARIO_DIR}/${scenario}/QSG-*.jar`

 if [ -f "${SCENARIO_DIR}/${scenario}/update-app-${sp_name}.xml" ]
  then
   rm -r ${SCENARIO_DIR}/${scenario}/update-app-${sp_name}.xml
 fi

touch ${SCENARIO_DIR}/${scenario}/update-app-${sp_name}.xml
echo "<soapenv:Envelope xmlns:soapenv="\"http://schemas.xmlsoap.org/soap/envelope/"\" xmlns:xsd="\"http://org.apache.axis2/xsd"\" xmlns:xsd1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">
   <soapenv:Header/>
   <soapenv:Body>
      <ns3:updateApplication xmlns:ns3="\"http://org.apache.axis2/xsd"\">
  <ns3:serviceProvider>
    <ns1:applicationID xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">${app_id}</ns1:applicationID>
    <ns1:applicationName xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">${sp_name}</ns1:applicationName>
    <claimConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">
      <alwaysSendMappedLocalSubjectId>false</alwaysSendMappedLocalSubjectId>
      <localClaimDialect>true</localClaimDialect>
      <roleClaimURI/>
    </claimConfig>
    <ns1:description xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">sample service provider</ns1:description>
    <inboundAuthenticationConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">
      <inboundAuthenticationRequestConfigs>
        <inboundAuthKey>saml2-web-app-pickup-${sp_name}.com</inboundAuthKey>
        <inboundAuthType>samlsso</inboundAuthType>
        <properties>
          <name>attrConsumServiceIndex</name>
          <value>1223160755</value>
        </properties>
      </inboundAuthenticationRequestConfigs>
      <inboundAuthenticationRequestConfigs>
        <inboundAuthKey/>
        <inboundAuthType>passivests</inboundAuthType>
      </inboundAuthenticationRequestConfigs>
      <inboundAuthenticationRequestConfigs>
        <inboundAuthKey/>
        <inboundAuthType>openid</inboundAuthType>
      </inboundAuthenticationRequestConfigs>
    </inboundAuthenticationConfig>
    <inboundProvisioningConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">
      <dumbMode>false</dumbMode>
      <provisioningUserStore>PRIMARY</provisioningUserStore>
    </inboundProvisioningConfig>
    <localAndOutBoundAuthenticationConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">
      <alwaysSendBackAuthenticatedListOfIdPs>false</alwaysSendBackAuthenticatedListOfIdPs>
      <authenticationStepForAttributes xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/>
      <authenticationStepForSubject xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/>
      <authenticationSteps>
        <federatedIdentityProviders>
          <identityProviderName>IDP-google</identityProviderName>
        </federatedIdentityProviders>
      </authenticationSteps>
      <authenticationType>federated</authenticationType>
      <enableAuthorization>false</enableAuthorization>
      <subjectClaimUri>http://wso2.org/claims/fullname</subjectClaimUri>
      <useTenantDomainInLocalSubjectIdentifier>false</useTenantDomainInLocalSubjectIdentifier>
      <useUserstoreDomainInLocalSubjectIdentifier>false</useUserstoreDomainInLocalSubjectIdentifier>
    </localAndOutBoundAuthenticationConfig>
    <outboundProvisioningConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"/>
    <owner xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">
      <tenantDomain>carbon.super</tenantDomain>
      <userName>cameron</userName>
      <userStoreDomain>PRIMARY</userStoreDomain>
    </owner>
    <permissionAndRoleConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"/>
    <ns1:requestPathAuthenticatorConfigs xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\" xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/>
    <ns1:saasApp xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">false</ns1:saasApp>
  </ns3:serviceProvider>
</ns3:updateApplication>
   </soapenv:Body>
</soapenv:Envelope>" >> ${SCENARIO_DIR}/${scenario}/update-app-${sp_name}.xml
}

update_application_saml() {
sp_name=$1
scenario=$2
soap_action=$3
endpoint=$4
auth=$5
is_host=$6
is_port=$7

request_data="${SCENARIO_DIR}/${scenario}/update-app-${sp_name}.xml"

 if [ ! -d "${SCENARIO_DIR}/${scenario}" ]
  then
    echo "${SCENARIO_DIR}/${scenario} Directory does not exist."
    return -1
  fi

  if [ ! -f "$request_data" ]
   then
    echo "$request_data File does not exist."
    return -1
  fi

echo
echo "Updating application ${sp_name}..."

# Send the SOAP request to Update the Application. 
curl -s -k -d @$request_data -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" -H "SOAPAction: ${soap_action}" -o /dev/null $endpoint
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while updating application ${sp_name}.... !!"
  echo
  delete_sp dispatch Common urn:deleteApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  delete_sp manager Common urn:deleteApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  delete_user ${is_host} ${is_port}
  echo
  return -1
 fi
echo "** Successfully updated the application ${sp_name}. **"

return 0;
}

update_application_oidc() {
sp_name=$1
scenario=$2
soap_action=$3
endpoint=$4
auth=$5
is_host=$6
is_port=$7

request_data="${SCENARIO_DIR}/${scenario}/update-app-${sp_name}.xml"

 if [ ! -d "${SCENARIO_DIR}/${scenario}" ]
  then
   echo "${SCENARIO_DIR}/${scenario} Directory does not exist."
   return -1
 fi

 if [ ! -f "$request_data" ]
  then
   echo "$request_data File does not exist."
   return -1
 fi

# Send the SOAP request to Update the Application. 
curl -s -k -d @$request_data -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" -H "SOAPAction: ${soap_action}" -o /dev/null $endpoint
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while updating application ${sp_name}.... !!"
  echo
  delete_sp dispatch Common urn:deleteApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  delete_sp manager Common urn:deleteApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  delete_user ${is_host} ${is_port}
  echo
  return -1
 fi

echo "** Successfully updated the application ${sp_name}. **"
return 0;
}

add_identity_provider() {

IS_name=$1
IS_pass=$2
scenario=$3
is_host=$4
is_port=$5

request_data="${SCENARIO_DIR}/${scenario}/create-idp.xml"

 if [ ! -d "${SCENARIO_DIR}/${scenario}" ]
  then
   echo "${SCENARIO_DIR}/${scenario} Directory does not exist."
   return -1
 fi

 if [ ! -f "$request_data" ]
  then
   echo "$request_data File does not exist."
   return -1
 fi

echo
echo "Please enter your CLIENT_ID"
echo "(This can be found in the Google API Credentials section)"
echo
read key
echo
echo "Please enter your CLIENT_SECRET"
echo "(This can be found in the Google API Credentials section)"
echo
read secret
echo

next_scenario=05

 if [ -f "${SCENARIO_DIR}/${next_scenario}/create-idp.xml" ]
  then
   rm -r ${SCENARIO_DIR}/${next_scenario}/create-idp.xml
 fi

echo "Creating Identity Provider..."
touch ${SCENARIO_DIR}/${next_scenario}/create-idp.xml
echo "<soapenv:Envelope xmlns:soapenv="\"http://schemas.xmlsoap.org/soap/envelope/"\" xmlns:mgt="\"http://mgt.idp.carbon.wso2.org"\" xmlns:xsd="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">
   <soapenv:Header/>
   <soapenv:Body>
      <ns4:addIdP xmlns:ns4="\"http://mgt.idp.carbon.wso2.org"\">
  <ns4:identityProvider>
    <ns1:alias xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">https://${is_host}:${is_port}/oauth2/token</ns1:alias>
    <ns1:certificate xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\" xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/>
    <claimConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">
      <localClaimDialect>true</localClaimDialect>
      <roleClaimURI>http://wso2.org/claims/role</roleClaimURI>
      <userClaimURI xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/>
    </claimConfig>
    <defaultAuthenticatorConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">
      <displayName>google</displayName>
      <enabled>true</enabled>
      <name>GoogleOIDCAuthenticator</name>
      <properties>
        <name>ClientId</name>
        <value>${key}</value>
      </properties>
      <properties>
        <name>ClientSecret</name>
        <value>${secret}</value>
      </properties>
      <properties>
        <name>callbackUrl</name>
        <value>https://${is_host}:${is_port}/commonauth</value>
      </properties>
    </defaultAuthenticatorConfig>
    <ns1:displayName xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\" xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/>
    <ns1:enable xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">false</ns1:enable>
    <federatedAuthenticatorConfigs xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">
      <displayName>google</displayName>
      <enabled>true</enabled>
      <name>GoogleOIDCAuthenticator</name>
      <properties>
        <name>ClientId</name>
        <value>${key}</value>
      </properties>
      <properties>
        <name>ClientSecret</name>
        <value>${secret}</value>
      </properties>
      <properties>
        <name>callbackUrl</name>
        <value>https://${is_host}:${is_port}/commonauth</value>
      </properties>
    </federatedAuthenticatorConfigs>
    <ns1:federationHub xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">false</ns1:federationHub>
    <ns1:homeRealmId xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\" xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/>
    <ns1:identityProviderDescription xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\" xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/>
    <ns1:identityProviderName xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">IDP-google</ns1:identityProviderName>
    <permissionAndRoleConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"/>
    <ns1:provisioningRole xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\" xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/>
  </ns4:identityProvider>
</ns4:addIdP>
</soapenv:Body>
</soapenv:Envelope>" >> ${SCENARIO_DIR}/${next_scenario}/create-idp.xml

curl -s -k --user ${IS_name}:${IS_pass} -d @$request_data -H "Content-Type: text/xml" -H "SOAPAction: urn:addIdP" -o /dev/null https://${is_host}:${is_port}/services/IdentityProviderMgtService.IdentityProviderMgtServiceHttpsSoap11Endpoint/
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating the identity provider. !!"
  echo
  return -1
 fi
echo "** The identity provider was successfully created. **"
echo

return 0;
}

start_the_flow() {
    echo "Please pick a scenario from the following."
    echo "-----------------------------------------------------------------------------"
    echo "|  Scenario 1 - Configuring Single-Sign-On with SAML2                       |"
    echo "|  Scenario 2 - Configuring Single-Sign-On with OIDC                        |"
    echo "|  Scenario 3 - Configuring Multi-Factor Authentication                     |"
    echo "|  Scenario 4 - Configuring Google as a Federated Authenticator             |"
    echo "|  Scenario 5 - Configuring Self-Signup                                     |"
    echo "|  Scenario 6 - Creating a workflow                                         |"
    echo "-----------------------------------------------------------------------------"
    echo "Enter the scenario number you selected."


    # Reading the scenarios available.
    read scenario
    case $scenario in
        1)
        configure_sso_saml2 ${IS_DOMAIN} ${IS_PORT} ${SERVER_DOMAIN} ${SERVER_PORT}
        end_message saml2-web-app-pickup-dispatch.com saml2-web-app-pickup-manager.com
        if [ "$?" -ne "0" ]; then
          echo "Sorry, we had a problem there!"
        fi
        ;;

        2)
        configure_sso_oidc ${IS_DOMAIN} ${IS_PORT} ${SERVER_DOMAIN} ${SERVER_PORT}
        end_message pickup-dispatch pickup-manager
        if [ "$?" -ne "0" ]; then
          echo "Sorry, we had a problem there!"
        fi
        ;;

        3)
        create_multifactor_auth ${IS_DOMAIN} ${IS_PORT} ${SERVER_DOMAIN} ${SERVER_PORT}
        end_message saml2-web-app-pickup-dispatch.com saml2-web-app-pickup-manager.com
        ;;

        4)
        configure_federated_auth ${IS_DOMAIN} ${IS_PORT} ${SERVER_DOMAIN} ${SERVER_PORT}
        end_message saml2-web-app-pickup-dispatch.com saml2-web-app-pickup-manager.com
        delete_idp 05 urn:deleteIdP https://${is_host}:${is_port}/services/IdentityProviderMgtService.IdentityProviderMgtServiceHttpsSoap11Endpoint/
        if [ "$?" -ne "0" ]; then
          echo "Sorry, we had a problem there!"
        fi
        ;;

        5)
        configure_self_signup ${IS_DOMAIN} ${IS_PORT} ${SERVER_DOMAIN} ${SERVER_PORT}
        ;;

        6)
        create_workflow ${IS_DOMAIN} ${IS_PORT} ${SERVER_DOMAIN} ${SERVER_PORT}
        ;;

        *)
        echo "Sorry, that's not an option."
        ;;
    esac
    echo
}

#=================The start of the script:============================================
BASE_DIR="$(cd "$(dirname "$0")"; pwd)";

CONF_DIR=${BASE_DIR}/../conf
APP_DIR=${BASE_DIR}/../webapps
LIB_DIR=${BASE_DIR}/../lib
SCENARIO_DIR=${BASE_DIR}/../scenarios

# Property file for the script
PROPERTY_FILE=${CONF_DIR}/server.properties

echo "Before running samples make sure the following                                "
echo "  * Added correct details to the server.properties                            "
echo "  * Your WSO2 IS and sample applications are running.                         "
echo "                                                                              "
echo " If okay to continue, Please press 'Y' else press 'N'                         "
read continueState
case $continueState in
      [Yy]*)

        echo "Reading server paths from $PROPERTY_FILE"
        IS_DOMAIN=$(getProperty "wso2is.host.domain")
        #echo ${IS_DOMAIN}

        if [ -z "${IS_DOMAIN}" ]
        then
            echo "IS host domain is not configured. Please configure that and Try again"
            return -1
        fi

        IS_PORT=$(getProperty "wso2is.host.port")
        #echo "is port ${IS_PORT}"

        if [ -z "${IS_PORT}" ]
        then
            echo "IS host port is not configured. Please configure that and Try again"
            return -1
        fi

        SERVER_DOMAIN=$(getProperty "server.host.domain")
        #echo "server port ${SERVER_DOMAIN}"

        if [ -z "${SERVER_DOMAIN}" ]
        then
            echo "Server host domain is not configured. Please configure that and Try again"
            return -1
        fi

        SERVER_PORT=$(getProperty "server.host.port")
        #echo "Server port ${SERVER_PORT}"
        if [ -z "${SERVER_PORT}" ]
        then
            echo "Server host port is not configured. Please configure that and Try again"
            return -1
        fi
        start_the_flow
        ;;

      [Nn]*)
         echo "Please start server and restart the script."
         exit;;
      *)
         echo "Please answer yes or no."
         ;;
esac
