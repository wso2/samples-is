#!/bin/sh

# ----------------------------------------------------------------------------
#  Copyright 2017 WSO2, Inc. http://www.wso2.org
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

# Add users in the wso2-is.
add_user admin admin Common

# Add service providers in the wso2-is 
add_service_provider dispatch Common urn:createApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
add_service_provider swift Common urn:createApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz

# Configure SAML for the service providers   
configure_saml dispatch 02 urn:addRPServiceProvider https://localhost:9443/services/IdentitySAMLSSOConfigService.IdentitySAMLSSOConfigServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
configure_saml swift 02 urn:addRPServiceProvider https://localhost:9443/services/IdentitySAMLSSOConfigService.IdentitySAMLSSOConfigServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz

create_updateapp_saml dispatch Y2FtZXJvbjpjYW1lcm9uMTIz
create_updateapp_saml swift Y2FtZXJvbjpjYW1lcm9uMTIz	
	
update_application_saml dispatch 02 urn:updateApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
update_application_saml swift 02 urn:updateApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz

return 0;
}

configure_sso_oidc() {

# Add users in the wso2-is.
add_user admin admin Common

# Add service providers in the wso2-is 
add_service_provider dispatch Common urn:createApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
add_service_provider swift Common urn:createApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz

# Configure OIDC for the Service Providers
configure_oidc dispatch 03 urn:registerOAuthApplicationData https://localhost:9443/services/OAuthAdminService.OAuthAdminServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
configure_oidc swift 03 urn:registerOAuthApplicationData https://localhost:9443/services/OAuthAdminService.OAuthAdminServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz

create_updateapp_oidc dispatch Y2FtZXJvbjpjYW1lcm9uMTIz ZGlzcGF0Y2g= ZGlzcGF0Y2gxMjM0
create_updateapp_oidc swift Y2FtZXJvbjpjYW1lcm9uMTIz c3dpZnRhcHA= c3dpZnRhcHAxMjM=

update_application_oidc dispatch 03 urn:updateApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
update_application_oidc swift 03 urn:updateApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz

return 0;
}

configure_federated_auth() {
echo
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
echo
read user

case ${user} in
    [Yy]* )

    add_identity_provider admin admin 05

    configure_sso_saml2

    create_updateapp_fed_auth dispatch Y2FtZXJvbjpjYW1lcm9uMTIz
    create_updateapp_fed_auth swift Y2FtZXJvbjpjYW1lcm9uMTIz

    update_application_saml dispatch 05 urn:updateApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
    update_application_saml swift 05 urn:updateApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz

    break;;
    [Nn]* ) return -1;;
        * ) echo "Please answer yes or no.";;
    esac

return 0;
}

end_message() {

dispatch_url=$1
swift_url=$2

echo
echo "------------------------------------------------------------------"
echo "|                                                                |"
echo "|  You can find the sample web apps on the following URLs.       |"
echo "|  *** Please press ctrl button and click on the links ***       |"              
echo "|                                                                |"
echo "|  Dispatch - http://localhost:8080/${dispatch_url}/  |"
echo "|  Swift - http://localhost:8080/${swift_url}/        |"
echo "|                                                                |"  
echo "------------------------------------------------------------------"
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
	    delete_sp dispatch Common urn:deleteApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/
        delete_sp swift Common urn:deleteApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/
        delete_user
	break;;
        [Nn]* ) exit;;
        * ) echo "Please answer yes or no.";;
    esac
return 0;
}

setup_servers() {
cd ../..
QSG=`pwd`
echo "Please enter the path to your WSO2-IS pack."
echo "Example: /home/downloads/WSO2_Products/wso2is-5.4.0"
read WSO2_PATH
echo

if [ ! -d "${WSO2_PATH}" ]
  then
    echo "${WSO2_PATH} Directory does not exists. Please download and install the latest pack."
    return -1
 fi

echo "Please enter the path to your Tomcat server pack."
echo "Example: /home/downloads/apache-tomcat-8.0.49"
read TOMCAT_PATH
echo

if [ ! -d "${TOMCAT_PATH}" ]
  then
  # Ask for user permission.
  # Download Tomcat 8.
    echo "Tomcat server does not exist in the given location ${TOMCAT_PATH}."
    echo "Do you want to download Tomcat server?"
    echo
    echo "Press y - YES"
    echo "Press n - NO"
    echo
    read input

  case ${input} in
        [Yy]* )
	    echo "Downloading apache-tomcat-8.0.49..."
        wget http://www-eu.apache.org/dist/tomcat/tomcat-8/v8.0.49/bin/apache-tomcat-8.0.49.tar.gz
        tar xvzf apache-tomcat-8.0.49.tar.gz
        cd binaries
        cp saml2-web-app-dispatch.com.war ${QSG}/apache-tomcat-8.0.49/webapps
        echo "** Web application Dispatch successfully deployed. **"
        cp saml2-web-app-swift.com.war ${QSG}/apache-tomcat-8.0.49/webapps
        echo "** Web application Swift successfully deployed. **"
	    break;;
        [Nn]* )
        echo "Please install Tomcat and restart the script."
        exit;;
        * ) echo "Please answer yes or no.";;
  esac


 fi

 if [ ! -f "${TOMCAT_PATH}/webapps/saml2-web-app-dispatch.com.war" ]
  then 
   cd binaries
   cp saml2-web-app-dispatch.com.war ${TOMCAT_PATH}/webapps
   echo "** Web application Dispatch successfully deployed. **"
   cp saml2-web-app-swift.com.war ${TOMCAT_PATH}/webapps
   echo "** Web application Swift successfully deployed. **"
 fi

# pid=`(ps x | grep "${TOMCAT_PATH}" | grep -v grep | cut -d ' ' -f 1)`

# if [ ! "${pid}" ]; then
#  echo "Please start up your Tomcat server..."
#  echo "To start the server, open a new terminal in ${TOMCAT_PATH}/bin and type sh catalina.sh run."
#  echo
#  return -1
# fi

cd ..
}

add_user() {

IS_name=$1
IS_pass=$2
scenario=$3
request_data="${scenario}/add-role.xml"
echo
echo "Creating a user named cameron..."

# The following command can be used to create a user.
curl -s -k --user ${IS_name}:${IS_pass} --data '{"schemas":[],"name":{"familyName":"Smith","givenName":"Cameron"},"userName":"cameron","password":"cameron123","emails":"cameron@gmail.com","addresses":{"country":"Canada"}}' --header "Content-Type:application/json" -o /dev/null https://localhost:9443/wso2/scim/Users
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
curl -s -k --user ${IS_name}:${IS_pass} --data '{"schemas":[],"name":{"familyName":"Miller","givenName":"Alex"},"userName":"alex","password":"alex123","emails":"alex@gmail.com","addresses":{"country":"Canada"}}' --header "Content-Type:application/json" -o /dev/null https://localhost:9443/wso2/scim/Users
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating user alex. !!"
  echo
  return -1
 fi
echo "** The user alex was successfully created. **"
echo

echo "Creating a role named Manager..."

cd ~/QSG-bundle/QSG/bin
#The following command will add a role to the user.
curl -s -k --user ${IS_name}:${IS_pass} -d @$request_data -H "Content-Type: text/xml" -H "SOAPAction: urn:addRole" -o /dev/null https://localhost:9443/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating role manager. !!"
  echo
  return -1
 fi
echo "** The role Manager was successfully created. **"
echo
cd ..
}

add_service_provider() {
cd ~/QSG-bundle/QSG/bin
sp_name=$1
scenario=$2
soap_action=$3
endpoint=$4
auth=$5
request_data="${scenario}/create-sp-${sp_name}.xml"
  
 if [ ! -d "$scenario" ]
  then
    echo "$scenario Directory not exists."
    return -1
  fi

  if [ ! -f "$request_data" ]
   then
    echo "$request_data File does not exists."
    return -1
  fi

echo "Creating Service Provider $sp_name..."

# Send the SOAP request to create the new SP.
curl -s -k -d @$request_data -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" -H "SOAPAction: ${soap_action}" -o /dev/null $endpoint
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating the service provider. !!"
  echo
  return -1
 fi
echo "** Service Provider $sp_name successfully created. **"
echo
cd ..
return 0;
}

delete_user() {
cd ~/QSG-bundle/QSG/bin
request_data1="Common/delete-cameron.xml"
request_data2="Common/delete-alex.xml"
request_data3="Common/delete-role.xml"
echo
echo "Deleting the user named cameron..."

# Send the SOAP request to delete the user.
curl -s -k -d @$request_data1 -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o /dev/null https://localhost:9443/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
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
curl -s -k -d @$request_data2 -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o /dev/null https://localhost:9443/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
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
curl -s -k -d @$request_data3 -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteRole" -o /dev/null https://localhost:9443/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while deleting the role Manager. !!"
  echo
  return -1
 fi
echo "** The role Manager was successfully deleted. **"
echo
cd ..
}

delete_sp() {
cd ~/QSG-bundle/QSG/bin
sp_name=$1
scenario=$2
soap_action=$3
endpoint=$4
request_data="${scenario}/delete-sp-${sp_name}.xml"
  
 if [ ! -d "$scenario" ]
  then
    echo "$scenario Directory not exists."
    return -1
  fi

  if [ ! -f "$request_data" ]
   then
    echo "$request_data File does not exists."
    return -1
  fi
echo
echo "Deleting Service Provider $sp_name..."

# Send the SOAP request to delete a SP.
curl -s -k -d @$request_data -H "Authorization: Basic Y2FtZXJvbjpjYW1lcm9uMTIz" -H "Content-Type: text/xml" -H "SOAPAction: ${soap_action}" -o /dev/null $endpoint
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while deleting the service provider. !!"
  echo
  return -1
 fi
echo "** Service Provider $sp_name successfully deleted. **"
cd ..
return 0;
}

delete_idp() {
cd ~/QSG-bundle/QSG/bin
scenario=$1
soap_action=$2
endpoint=$3
request_data="${scenario}/delete-idp-twitter.xml"

 if [ ! -d "$scenario" ]
  then
    echo "$scenario Directory not exists."
    return -1
  fi

echo
echo "Deleting Identity Provider IDP-twitter..."

# Send the SOAP request to delete a SP.
curl -s -k -d @$request_data -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: ${soap_action}" -o /dev/null $endpoint
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while deleting the service provider. !!"
  echo
  return -1
 fi
echo "** Identity Provider IDP-twitter successfully deleted. **"
cd ..
return 0;
}

configure_saml() {

cd ~/QSG-bundle/QSG/bin
sp_name=$1
scenario=$2
soap_action=$3
endpoint=$4
auth=$5
request_data="${scenario}/sso-config-${sp_name}.xml"

 if [ ! -d "$scenario" ]
  then
    echo "$scenario Directory does not exists."
    return -1
  fi

  if [ ! -f "$request_data" ]
   then
    echo "$request_data File does not exists."
    return -1
  fi

echo "Configuring SAML2 web SSO for ${sp_name}..."

# Send the SOAP request for Confuring SAML2 web SSO.
curl -s -k -d @$request_data -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" -H "SOAPAction: ${soap_action}" -o /dev/null $endpoint
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while configuring SAML2 web SSO for ${sp_name}.... !!"
  echo
  return -1
 fi
echo "** Successfully configured SAML. **"
echo
return 0;
}

configure_oidc() {
cd ~/QSG-bundle/QSG/bin
sp_name=$1
scenario=$2
soap_action=$3
endpoint=$4
auth=$5
request_data="${scenario}/sso-config-${sp_name}.xml"

 if [ ! -d "$scenario" ]
  then
   echo "$scenario Directory does not exists."
   return -1
 fi

 if [ ! -f "$request_data" ]
  then
   echo "$request_data File does not exists."
   return -1
 fi

echo "Configuring OIDC web SSO for ${sp_name}..."

# Configure OIDC for the created SPs.
curl -s -k -d @$request_data -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" -H "SOAPAction: ${soap_action}" -o /dev/null $endpoint
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while configuring OIDC web SSO for ${sp_name}.... !!"
  echo
  return -1
 fi
echo "** OIDC successfully configured for the Service Provider $sp_name. **"
echo
return 0;
}

create_updateapp_saml() {
cd ${QSG}/QSG/bin/02
sp_name=$1
request_data="get-app-${sp_name}.xml"
auth=$2
 
 if [ ! -f "$request_data" ]
  then
    echo "$request_data File does not exists."
    return -1
  fi

 if [ -f "response_unformatted.xml" ] 
  then
   rm -r response_unformatted.xml
 fi

touch response_unformatted.xml
curl -s -k -d @$request_data -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" -H "SOAPAction: urn:getApplication" https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ > response_unformatted.xml
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while getting application details for ${sp_name}.... !!"
  echo
  return -1
 fi

app_id=`java -jar QSG-1.0.jar`

 if [ -f "update-app-${sp_name}.xml" ]
  then 
   rm -r update-app-${sp_name}.xml
 fi
   
touch update-app-${sp_name}.xml
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
                </xsd1:claimConfig>
                <!--Optional:-->
                <xsd1:description>sample service provider</xsd1:description>
                <!--Optional:-->
                <xsd1:inboundAuthenticationConfig>
                    <!--Zero or more repetitions:-->
                    <xsd1:inboundAuthenticationRequestConfigs>
                        <!--Optional:-->
                        <xsd1:inboundAuthKey>saml2-web-app-dispatch.com</xsd1:inboundAuthKey>
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
</soapenv:Envelope>" >> update-app-${sp_name}.xml
cd .. 
}

create_updateapp_oidc() {
cd ${QSG}/QSG/bin/03
sp_name=$1
request_data="get-app-${sp_name}.xml"
auth=$2
key=$3
secret=$4
 
 if [ ! -f "$request_data" ]
  then
    echo "$request_data File does not exists."
    return -1
  fi

 if [ -f "response_unformatted.xml" ] 
  then
   rm -r response_unformatted.xml
 fi

touch response_unformatted.xml

curl -s -k -d @$request_data -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" -H "SOAPAction: urn:getApplication" https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ > response_unformatted.xml
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while getting application details for ${sp_name}.... !!"
  echo
  return -1
 fi

app_id=`java -jar QSG-1.0.jar`

 if [ -f "update-app-${sp_name}.xml" ]
  then 
   rm -r update-app-${sp_name}.xml
 fi
   
touch update-app-${sp_name}.xml
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
</soapenv:Envelope>" >> update-app-${sp_name}.xml
}

create_updateapp_fed_auth() {
cd ${QSG}/QSG/bin/05
sp_name=$1
request_data="get-app-${sp_name}.xml"
auth=$2

 if [ ! -f "$request_data" ]
  then
    echo "$request_data File does not exists."
    return -1
  fi

 if [ -f "response_unformatted.xml" ]
  then
   rm -r response_unformatted.xml
 fi

touch response_unformatted.xml
curl -s -k -d @$request_data -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" -H "SOAPAction: urn:getApplication" https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ > response_unformatted.xml
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while getting application details for ${sp_name}.... !!"
  echo
  return -1
 fi

app_id=`java -jar QSG-1.0.jar`

 if [ -f "update-app-${sp_name}.xml" ]
  then
   rm -r update-app-${sp_name}.xml
 fi

touch update-app-${sp_name}.xml
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
        <inboundAuthKey>saml2-web-app-dispatch.com</inboundAuthKey>
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
          <identityProviderName>IDP-twitter</identityProviderName>
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
</soapenv:Envelope>" >> update-app-${sp_name}.xml
}

update_application_saml() {
cd ~/QSG-bundle/QSG/bin
sp_name=$1
scenario=$2
soap_action=$3
endpoint=$4
auth=$5
request_data="${scenario}/update-app-${sp_name}.xml"

 if [ ! -d "$scenario" ]
  then
    echo "$scenario Directory does not exists."
    return -1
  fi

  if [ ! -f "$request_data" ]
   then
    echo "$request_data File does not exists."
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
  return -1
 fi
echo "** Successfully updated the application ${sp_name}. **"
cd ..
return 0;
}

update_application_oidc() {
cd ~/QSG-bundle/QSG/bin
sp_name=$1
scenario=$2
soap_action=$3
endpoint=$4
auth=$5
request_data="${scenario}/update-app-${sp_name}.xml"

 if [ ! -d "$scenario" ]
  then
   echo "$scenario Directory does not exists."
   return -1
 fi

 if [ ! -f "$request_data" ]
  then
   echo "$request_data File does not exists."
   return -1
 fi

# Send the SOAP request to Update the Application. 
curl -s -k -d @$request_data -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" -H "SOAPAction: ${soap_action}" -o /dev/null $endpoint
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while updating application ${sp_name}.... !!"
  echo
  return -1
 fi
echo "** Successfully updated the application ${sp_name}. **"
return 0;
}

add_identity_provider() {
cd ~/QSG-bundle/QSG/bin
IS_name=$1
IS_pass=$2
scenario=$3
request_data="${scenario}/create-idp.xml"

 if [ ! -d "$scenario" ]
  then
   echo "$scenario Directory does not exists."
   return -1
 fi

 if [ ! -f "$request_data" ]
  then
   echo "$request_data File does not exists."
   return -1
 fi

cd 05
echo
echo "Please enter your API key"
echo "(This can be found in the Keys and Access token section in the Application settings)"
echo
read key
echo
echo "Please enter your API secret"
echo "(This can be found in the Keys and Access token section in the Application settings)"
echo
read secret
echo

 if [ -f "create-idp.xml" ]
  then
   rm -r create-idp.xml
 fi

echo "Creating Identity Provider..."
touch create-idp.xml
echo "<soapenv:Envelope xmlns:soapenv="\"http://schemas.xmlsoap.org/soap/envelope/"\" xmlns:mgt="\"http://mgt.idp.carbon.wso2.org"\" xmlns:xsd="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">
   <soapenv:Header/>
   <soapenv:Body>
      <ns4:addIdP xmlns:ns4="\"http://mgt.idp.carbon.wso2.org"\">
  <ns4:identityProvider>
    <ns1:alias xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">https://localhost:9443/oauth2/token</ns1:alias>
    <ns1:certificate xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\" xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/>
    <claimConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">
      <localClaimDialect>true</localClaimDialect>
      <roleClaimURI>http://wso2.org/claims/role</roleClaimURI>
      <userClaimURI xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/>
    </claimConfig>
    <defaultAuthenticatorConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">
      <displayName>twitterIDP</displayName>
      <enabled>true</enabled>
      <name>TwitterAuthenticator</name>
      <properties>
        <name>APIKey</name>
        <value>STxf3PlNjDXvvUmWr0dbC1rVV</value>
      </properties>
      <properties>
        <name>APISecret</name>
        <value>QaHwXLGe6s7ImFcJ3RjmDQCfrvufS3JqoVm2p30hSqEACbvhgU</value>
      </properties>
      <properties>
        <name>callbackUrl</name>
        <value>https://localhost:9443/commonauth</value>
      </properties>
    </defaultAuthenticatorConfig>
    <ns1:displayName xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\" xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/>
    <ns1:enable xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">false</ns1:enable>
    <federatedAuthenticatorConfigs xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">
      <displayName>twitter</displayName>
      <enabled>true</enabled>
      <name>TwitterAuthenticator</name>
      <properties>
        <name>APIKey</name>
        <value>STxf3PlNjDXvvUmWr0dbC1rVV</value>
      </properties>
      <properties>
        <name>APISecret</name>
        <value>QaHwXLGe6s7ImFcJ3RjmDQCfrvufS3JqoVm2p30hSqEACbvhgU</value>
      </properties>
      <properties>
        <name>callbackUrl</name>
        <value>https://localhost:9443/commonauth</value>
      </properties>
    </federatedAuthenticatorConfigs>
    <ns1:federationHub xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">false</ns1:federationHub>
    <ns1:homeRealmId xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\" xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/>
    <ns1:identityProviderDescription xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\" xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/>
    <ns1:identityProviderName xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">IDP-twitter</ns1:identityProviderName>
    <permissionAndRoleConfig xmlns="\"http://model.common.application.identity.carbon.wso2.org/xsd"\"/>
    <ns1:provisioningRole xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\" xmlns:xsi="\"http://www.w3.org/2001/XMLSchema-instance"\" xsi:nil="\"1"\"/>
  </ns4:identityProvider>
</ns4:addIdP>
</soapenv:Body>
</soapenv:Envelope>" >> create-idp.xml
cd ..
curl -s -k --user ${IS_name}:${IS_pass} -d @$request_data -H "Content-Type: text/xml" -H "SOAPAction: urn:addIdP" -o /dev/null https://localhost:9443/services/IdentityProviderMgtService.IdentityProviderMgtServiceHttpsSoap11Endpoint/
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating the identity provider. !!"
  echo
  return -1
 fi
echo "** The identity provider was successfully created. **"
echo
cd ..
return 0;
}

echo "Please pick a scenario from the following."
echo "-----------------------------------------------------------------------------"
echo "|  Scenario 1 - Getting Started with WSO2 IS                                |"
echo "|  Scenario 2 - Configuring Single-Sign-On with SAML2                       |"
echo "|  Scenario 3 - Configuring Single-Sign-On with OIDC                        |"
echo "|  Scenario 4 - Configuring Multi-Factor Authentication                     |"
echo "|  Scenario 5 - Configuring Twitter as a Federated Authenticator            |"
echo "|  Scenario 6 - Setting up Self-Signup                                      |"
echo "|  Scenario 7 - Creating a workflow                                         |"  
echo "-----------------------------------------------------------------------------"
echo "Enter the scenario number you selected."

	read scenario
	case $scenario in
		1)
		echo "Not yet implemented."
		;;
		
		2)
		# Check whether the wso2-is and tomcat servers exits and if they don't download and install them.
        setup_servers
		configure_sso_saml2
		end_message saml2-web-app-dispatch.com saml2-web-app-swift.com
		if [ "$?" -ne "0" ]; then
  		  echo "Sorry, we had a problem there!"
		fi
		break ;;

		3)
        # Check whether the wso2-is and tomcat servers exits and if they don't download and install them.
        setup_servers
		configure_sso_oidc
		end_message Dispatch Swift
		if [ "$?" -ne "0" ]; then
  		  echo "Sorry, we had a problem there!"
		fi
		break ;;
		
		4)
		echo "Configuring Multi-Factor Authentication"
		echo
		echo "Not yet implemented."
		break ;;

		5)
		# Check whether the wso2-is and tomcat servers exits and if they don't download and install them.
        setup_servers
	    configure_federated_auth
	    end_message saml2-web-app-dispatch.com saml2-web-app-swift.com
	    delete_idp 05 urn:deleteIdP https://localhost:9443/services/IdentityProviderMgtService.IdentityProviderMgtServiceHttpsSoap11Endpoint/
	    if [ "$?" -ne "0" ]; then
  		  echo "Sorry, we had a problem there!"
		fi
		break ;;

		6)
		echo "Setting up Self-Signup"
		echo
		echo "Not yet implemented."
		break ;;
		
		7)
		echo "Creating a workflow"
		echo
		echo "Not yet implemented."
		break ;;

		*)
		echo "Sorry, that's not an option."
		;;
	esac	
echo
