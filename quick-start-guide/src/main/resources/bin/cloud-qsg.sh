#!/bin/sh

# ----------------------------------------------------------------------------
#  Copyright 2019 WSO2, Inc. http://www.wso2.org
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

is_host="${1}"
dispatch_app_server_host="${2}"
manager_app_server_host="${3}"
tenant_admin_username="${4}"
tenant_admin_password="${5}"
tenant_admin_auth="${6}"
cameron_username="${7}"
cameron_password="${8}"
cameron_auth="${9}"
alex_username="${10}"
alex_password="${11}"


# Add users in WSO2-Identity-Cloud.
add_user ${tenant_admin_username} ${tenant_admin_password} Common ${is_host} ${tenant_admin_auth} ${cameron_username} ${cameron_password} ${alex_username} ${alex_password}

# Add service providers in WSO2-Identity-Cloud.
add_service_provider dispatch Common urn:createApplication https://${is_host}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ ${tenant_admin_auth} ${is_host} ${cameron_auth} ${cameron_username} ${alex_username}
add_service_provider manager Common urn:createApplication https://${is_host}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ ${tenant_admin_auth} ${is_host} ${cameron_auth} ${cameron_username} ${alex_username}

# Configure SAML for the service providers   
configure_saml dispatch 02 urn:addRPServiceProvider https://${is_host}/services/IdentitySAMLSSOConfigService.IdentitySAMLSSOConfigServiceHttpsSoap11Endpoint/ ${tenant_admin_auth} ${is_host} ${dispatch_app_server_host} ${cameron_auth} ${cameron_username} ${alex_username}
configure_saml manager 02 urn:addRPServiceProvider https://${is_host}/services/IdentitySAMLSSOConfigService.IdentitySAMLSSOConfigServiceHttpsSoap11Endpoint/ ${tenant_admin_auth} ${is_host} ${manager_app_server_host} ${cameron_auth} ${cameron_username} ${alex_username}

create_updateapp_saml dispatch ${tenant_admin_auth} ${is_host} ${dispatch_app_server_host} ${cameron_auth} ${cameron_username} ${alex_username}
create_updateapp_saml manager ${tenant_admin_auth} ${is_host} ${manager_app_server_host} ${cameron_auth} ${cameron_username} ${alex_username}
	
update_application_saml dispatch 02 urn:updateApplication https://${is_host}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ ${tenant_admin_auth} ${is_host} ${cameron_auth} ${cameron_username} ${alex_username}
update_application_saml manager 02 urn:updateApplication https://${is_host}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ ${tenant_admin_auth} ${is_host} ${cameron_auth} ${cameron_username} ${alex_username}

return 0;
}

end_message() {

dispatch_url="${1}"
manager_url="${2}"
dispatch_server_host="${3}"
manager_server_host="${4}"
cameron_username="${5}"
cameron_password="${6}"
cameron_auth="${7}"
alex_username="${8}"
is_host="${9}"
tenant_admin_auth="${10}"

echo
echo "-----------------------------------------------------------------------------------------------------------------"
echo "|                                                                                                               |"
echo "|    You can find the sample web apps on the following URLs.                                                    |"
echo "|    *** Please press ctrl button and click on the links ***                                                    |"
echo "|                                                                                                               |"
echo "|    pickup-dispatch -                                                                                          |"
echo "|        https://${dispatch_server_host}/${dispatch_url}/                                                       |"
echo "|    pick-manager -                                                                                             |"
echo "|        https://${manager_server_host}/${manager_url}/                                                         |"
echo "|                                                                                                               |"
echo "|    Please use one of the following user credentials to log in.                                                |"
echo "|                                                                                                               |"
echo "|    Junior Manager                                                                                             |"
echo "|      Username: ${alex_username}                                                                               |"
echo "|      Password: ${alex_password}                                                                               |"
echo "|                                                                                                               |"
echo "|    Senior Manager                                                                                             |"
echo "|      Username: ${cameron_username}                                                                            |"
echo "|      Password: ${cameron_password}                                                                            |"
echo "-----------------------------------------------------------------------------------------------------------------"
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
        delete_sp dispatch Common urn:deleteApplication https://${is_host}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ ${cameron_auth}
        delete_sp manager Common urn:deleteApplication https://${is_host}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ ${cameron_auth}
        delete_user ${is_host} ${tenant_admin_auth} ${cameron_username} ${alex_username}
	;;
        [Nn]* ) exit;;
        * ) echo "Please answer yes or no.";;
    esac
return 0;
}


getProperty() {
   PROP_KEY=$1
   PROP_VALUE=`cat $PROPERTY_FILE | grep "$PROP_KEY" | cut -d: -f2`
   echo ${PROP_VALUE}

}

add_user() {

tenant_admin_username="${1}"
tenant_admin_pass="${2}"
scenario="${3}"
is_host="${4}"
tenant_admin_auth="${5}"
cameron_username="${6}"
cameron_password="${7}"
alex_username="${8}"
alex_password="${9}"

# Update the user cameron xml file with correct fully qualified username and password values
if [ -f "${SCENARIO_DIR}/${scenario}/add-cameron.xml" ]
then
   rm -r ${SCENARIO_DIR}/${scenario}/add-cameron.xml
fi
touch ${SCENARIO_DIR}/${scenario}/add-cameron.xml
echo " <soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ser=\"http://service.ws.um.carbon.wso2.org\" xmlns:xsd=\"http://common.mgt.user.carbon.wso2.org/xsd\">
    <soapenv:Header/>
    <soapenv:Body>
        <ser:addUser>
            <!--Optional:-->
            <ser:userName>${cameron_username}</ser:userName>
            <!--Optional:-->
            <ser:credential>${cameron_password}</ser:credential>
            <!--Zero or more repetitions:-->
            <ser:roleList>default</ser:roleList>
            <!--Zero or more repetitions:-->
            <ser:claims>
                <!--Optional:-->
                <xsd:claimURI>http://wso2.org/claims/emailaddress</xsd:claimURI>
                <!--Optional:-->
                <xsd:value>${cameron_username}</xsd:value>
            </ser:claims>
            <!--Optional:-->
            <ser:profileName>default</ser:profileName>
            <ser:requirePasswordChange>false</ser:requirePasswordChange>
        </ser:addUser>
    </soapenv:Body>
</soapenv:Envelope>" >> ${SCENARIO_DIR}/${scenario}/add-cameron.xml

echo "Creating a user named cameron..."

request_data1="${SCENARIO_DIR}/${scenario}/add-cameron.xml"

# The following command can be used to create a user.
curl -s -k --user ${tenant_admin_username}:${tenant_admin_pass} -d @$request_data1 -H "Content-Type: text/xml" -H "SOAPAction: urn:addUser" -o /dev/null https://${is_host}/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating user cameron. !!"
  echo
  return -1
 fi

echo "** The user cameron was successfully created. **"
echo

# Update the user alex xml file with correct fully qualified username
if [ -f "${SCENARIO_DIR}/${scenario}/add-alex.xml" ]
then
   rm -r ${SCENARIO_DIR}/${scenario}/add-alex.xml
fi
touch ${SCENARIO_DIR}/${scenario}/add-alex.xml
echo " <soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ser=\"http://service.ws.um.carbon.wso2.org\" xmlns:xsd=\"http://common.mgt.user.carbon.wso2.org/xsd\">
    <soapenv:Header/>
    <soapenv:Body>
        <ser:addUser>
            <!--Optional:-->
            <ser:userName>${alex_username}</ser:userName>
            <!--Optional:-->
            <ser:credential>${alex_password}</ser:credential>
            <!--Zero or more repetitions:-->
            <ser:roleList>default</ser:roleList>
            <!--Zero or more repetitions:-->
            <ser:claims>
                <!--Optional:-->
                <xsd:claimURI>http://wso2.org/claims/emailaddress</xsd:claimURI>
                <!--Optional:-->
                <xsd:value>${alex_username}</xsd:value>
            </ser:claims>
            <!--Optional:-->
            <ser:profileName>default</ser:profileName>
            <ser:requirePasswordChange>false</ser:requirePasswordChange>
        </ser:addUser>
    </soapenv:Body>
</soapenv:Envelope>" >> ${SCENARIO_DIR}/${scenario}/add-alex.xml

echo "Creating a user named alex..."
request_data2="${SCENARIO_DIR}/${scenario}/add-alex.xml"

# The following command can be used to create a user.
curl -s -k --user ${tenant_admin_username}:${tenant_admin_pass} -d @$request_data2 -H "Content-Type: text/xml" -H "SOAPAction: urn:addUser" -o /dev/null https://${is_host}/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating user alex. !!"
  echo
  delete_user ${is_host} ${tenant_admin_auth} ${cameron_username} ${alex_username}
  echo
  return -1
 fi
echo "** The user alex was successfully created. **"
echo

# Update the add role xml file with correct user list values
if [ -f "${SCENARIO_DIR}/${scenario}/add-role.xml" ]
then
   rm -r ${SCENARIO_DIR}/${scenario}/add-role.xml
fi
touch ${SCENARIO_DIR}/${scenario}/add-role.xml
echo " <soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\"
                  xmlns:ser=\"http://service.ws.um.carbon.wso2.org\"
                  xmlns:xsd=\"http://dao.service.ws.um.carbon.wso2.org/xsd\">
    <soapenv:Header/>
    <soapenv:Body>
        <ser:addRole>
            <!--Optional:-->
            <ser:roleName>Manager</ser:roleName>
            <!--Zero or more repetitions:-->
            <ser:userList>${cameron_username}</ser:userList>
            <!--Zero or more repetitions:-->
            <ser:permissions>
                <!--Optional:-->
                <xsd:action>ui.execute</xsd:action>
                <!--Optional:-->
                <xsd:resourceId>/permission/admin/login</xsd:resourceId>
            </ser:permissions>
            <ser:permissions>
                <!--Optional:-->
                <xsd:action>ui.execute</xsd:action>
                <!--Optional:-->
                <xsd:resourceId>/permission/admin/manage/identity/applicationmgt</xsd:resourceId>
            </ser:permissions>
            <ser:permissions>
                <!--Optional:-->
                <xsd:action>ui.execute</xsd:action>
                <!--Optional:-->
                <xsd:resourceId>/permission/admin/manage/identity/claimmgt</xsd:resourceId>
            </ser:permissions>
            <ser:permissions>
                <!--Optional:-->
                <xsd:action>ui.execute</xsd:action>
                <!--Optional:-->
                <xsd:resourceId>/permission/admin/manage/identity/applicationmgt/create</xsd:resourceId>
            </ser:permissions>
            <ser:permissions>
                <!--Optional:-->
                <xsd:action>ui.execute</xsd:action>
                <!--Optional:-->
                <xsd:resourceId>/permission/admin/manage/identity/applicationmgt/delete</xsd:resourceId>
            </ser:permissions>
            <ser:permissions>
                <!--Optional:-->
                <xsd:action>ui.execute</xsd:action>
                <!--Optional:-->
                <xsd:resourceId>/permission/admin/manage/identity/applicationmgt/update</xsd:resourceId>
            </ser:permissions>
            <ser:permissions>
                <!--Optional:-->
                <xsd:action>ui.execute</xsd:action>
                <!--Optional:-->
                <xsd:resourceId>/permission/admin/manage/identity/applicationmgt/view</xsd:resourceId>
            </ser:permissions>
        </ser:addRole>
    </soapenv:Body>
</soapenv:Envelope>" >> ${SCENARIO_DIR}/${scenario}/add-role.xml

echo "Creating a role named Manager..."
request_data3="${SCENARIO_DIR}/${scenario}/add-role.xml"

#The following command will add a role to the user.
curl -s -k --user ${tenant_admin_username}:${tenant_admin_pass} -d @$request_data3 -H "Content-Type: text/xml" -H "SOAPAction: urn:addRole" -o /dev/null https://${is_host}/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating role manager. !!"
  echo
  delete_user ${is_host} ${tenant_admin_auth} ${cameron_username} ${alex_username}
  echo
  return -1
 fi
echo "** The role Manager was successfully created. **"
echo
}

add_service_provider() {

sp_name="${1}"
scenario="${2}"
soap_action="${3}"
endpoint="${4}"
tenant_admin_auth="${5}"
is_host="${6}"
cameron_auth="${7}"
cameron_username="${8}"
alex_username="${9}"


request_data="${SCENARIO_DIR}/${scenario}/create-sp-${sp_name}.xml"

  if [ ! -d "${SCENARIO_DIR}/${scenario}" ]
  then
    echo "${SCENARIO_DIR}/${scenario} Directory not exists."
    return -1
  fi

  if [ ! -f "$request_data" ]
   then
    echo "$request_data File does not exists."
    return -1
  fi
echo
echo "Creating Service Provider $sp_name..."

# Send the SOAP request to create the new SP.
curl -s -k -d @$request_data -H "Authorization: Basic ${cameron_auth}" -H "Content-Type: text/xml" -H "SOAPAction: ${soap_action}" -o /dev/null $endpoint
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating the service provider. !!"
  echo
  delete_sp dispatch Common urn:deleteApplication https://${is_host}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ ${cameron_auth}
  delete_sp manager Common urn:deleteApplication https://${is_host}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ ${cameron_auth}
  delete_user ${is_host} ${tenant_admin_auth} ${cameron_username} ${alex_username}
  echo
  return -1
 fi

echo "** Service Provider $sp_name successfully created. **"
echo
return 0;
}

delete_user() {

is_host="${1}"
admin_user_auth="${2}"
cameron_username="${3}"
alex_username="${4}"

request_data1="${SCENARIO_DIR}/Common/delete-cameron.xml"
request_data2="${SCENARIO_DIR}/Common/delete-alex.xml"
request_data3="${SCENARIO_DIR}/Common/delete-role.xml"

# update the user cameron xml file with correct fully qualified username
if [ -f "${SCENARIO_DIR}/Common/delete-cameron.xml" ]
then
   rm -r ${SCENARIO_DIR}/Common/delete-cameron.xml
fi
touch ${SCENARIO_DIR}/Common/delete-cameron.xml
echo "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ser=\"http://service.ws.um.carbon.wso2.org\">
  <soapenv:Header/>
  <soapenv:Body>
     <ser:deleteUser>
        <!--Optional:-->
        <ser:userName>${cameron_username}</ser:userName>
     </ser:deleteUser>
  </soapenv:Body>
</soapenv:Envelope>" >> ${SCENARIO_DIR}/Common/delete-cameron.xml
echo
echo "Deleting the user named cameron..."

# Send the SOAP request to delete the user.
curl -s -k -d @$request_data1 -H "Authorization: Basic ${admin_user_auth}" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o /dev/null https://${is_host}/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while deleting the user cameron. !!"
  echo
  return -1
 fi
echo "** The user cameron was successfully deleted. **"

# update the user alex xml file with correct fully qualified username
if [ -f "${SCENARIO_DIR}/Common/delete-alex.xml" ]
then
   rm -r ${SCENARIO_DIR}/Common/delete-alex.xml
fi
touch ${SCENARIO_DIR}/Common/delete-alex.xml
echo "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ser=\"http://service.ws.um.carbon.wso2.org\">
  <soapenv:Header/>
  <soapenv:Body>
     <ser:deleteUser>
        <!--Optional:-->
        <ser:userName>${alex_username}</ser:userName>
     </ser:deleteUser>
  </soapenv:Body>
</soapenv:Envelope>" >> ${SCENARIO_DIR}/Common/delete-cameron.xml
echo
echo
echo "Deleting the user named alex..."

# Send the SOAP request to delete the user.
curl -s -k -d @$request_data2 -H "Authorization: Basic ${admin_user_auth}" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o /dev/null https://${is_host}/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
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
curl -s -k -d @$request_data3 -H "Authorization: Basic ${admin_user_auth}" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteRole" -o /dev/null https://${is_host}/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
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

sp_name="${1}"
scenario="${2}"
soap_action="${3}"
endpoint="${4}"
admin_user_auth="${5}"
request_data="${SCENARIO_DIR}/${scenario}/delete-sp-${sp_name}.xml"

 if [ ! -d "${SCENARIO_DIR}/${scenario}" ]
  then
    echo "${SCENARIO_DIR}/${scenario} Directory not exists."
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
curl -s -k -d @$request_data -H "Authorization: Basic ${admin_user_auth}" -H "Content-Type: text/xml" -H "SOAPAction: ${soap_action}" -o /dev/null $endpoint
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while deleting the service provider. !!"
  echo
  return -1
 fi
echo "** Service Provider $sp_name successfully deleted. **"

return 0;
}

configure_saml() {

sp_name="${1}"
scenario="${2}"
soap_action="${3}"
endpoint="${4}"
tenant_admin_auth="${5}"
is_host="${6}"
server_host="${7}"
cameron_auth="${8}"
cameron_username="${9}"
alex_username="${10}"


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
            <xsd1:assertionConsumerUrls>http://${server_host}/saml2-web-app-pickup-${sp_name}.com/home.jsp</xsd1:assertionConsumerUrls>
            <!--Optional:-->
            <xsd1:assertionQueryRequestProfileEnabled>false</xsd1:assertionQueryRequestProfileEnabled>
            <!--Optional:-->
            <xsd1:attributeConsumingServiceIndex>1223160755</xsd1:attributeConsumingServiceIndex>
            <!--Optional:-->
            <xsd1:certAlias>wso2carbon</xsd1:certAlias>
            <!--Optional:-->
            <xsd1:defaultAssertionConsumerUrl>http://${server_host}/saml2-web-app-pickup-${sp_name}.com/home.jsp</xsd1:defaultAssertionConsumerUrl>
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
            <xsd1:idpInitSLOReturnToURLs>http://${server_host}/saml2-web-app-pickup-${sp_name}.com/home.jsp</xsd1:idpInitSLOReturnToURLs>
            <!--Optional:-->
            <xsd1:issuer>saml2-web-app-pickup-${sp_name}.com</xsd1:issuer>
            <!--Optional:-->
            <xsd1:nameIDFormat>urn/oasis/names/tc/SAML/1.1/nameid-format/emailAddress</xsd1:nameIDFormat>
            <!--Zero or more repetitions:-->
            <xsd1:requestedAudiences>https://${is_host}/oauth2/token</xsd1:requestedAudiences>
            <!--Zero or more repetitions:-->
            <xsd1:requestedRecipients>https://${is_host}/oauth2/token</xsd1:requestedRecipients>
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
curl -s -k -d @$request_data -H "Authorization: Basic ${cameron_auth}" -H "Content-Type: text/xml" -H "SOAPAction: ${soap_action}" -o /dev/null $endpoint
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while configuring SAML2 web SSO for ${sp_name}.... !!"
  echo
  delete_sp dispatch Common urn:deleteApplication https://${is_host}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ ${cameron_auth}
  delete_sp manager Common urn:deleteApplication https://${is_host}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ ${cameron_auth}
  delete_user ${is_host} ${tenant_admin_auth} ${cameron_username} ${alex_username}
  echo
  return -1
 fi
echo "** Successfully configured SAML. **"
echo
return 0;
}


create_updateapp_saml() {

sp_name="${1}"
tenant_admin_auth="${2}"
is_host="${3}"
server_host="${4}"
cameron_auth="${5}"
cameron_username="${6}"
alex_username="${7}"

scenario=02
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
curl -s -k -d @$request_data -H "Authorization: Basic ${cameron_auth}" -H "Content-Type: text/xml" -H "SOAPAction: urn:getApplication" https://${is_host}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ > response_unformatted.xml
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while getting application details for ${sp_name}.... !!"
  echo
  delete_sp dispatch Common urn:deleteApplication https://${is_host}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ ${cameron_auth}
  delete_sp manager Common urn:deleteApplication https://${is_host}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ ${cameron_auth}
  delete_user ${is_host} ${tenant_admin_auth} ${cameron_username} ${alex_username}
  echo
  return -1
 fi

#format the response_unformatted.xml file
xmllint -o ${SCENARIO_DIR}/${scenario}/response_unformatted.xml --format ${SCENARIO_DIR}/${scenario}/response_unformatted.xml
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

update_application_saml() {
sp_name="${1}"
scenario="${2}"
soap_action="${3}"
endpoint="${4}"
tenant_admin_auth="${5}"
is_host="${6}"
cameron_auth="${7}"
cameron_username="${8}"
alex_username="${9}"

request_data="${SCENARIO_DIR}/${scenario}/update-app-${sp_name}.xml"

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

echo
echo "Updating application ${sp_name}..."

# Send the SOAP request to Update the Application. 
curl -s -k -d @$request_data -H "Authorization: Basic ${cameron_auth}" -H "Content-Type: text/xml" -H "SOAPAction: ${soap_action}" -o /dev/null $endpoint
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while updating application ${sp_name}.... !!"
  echo
  delete_sp dispatch Common urn:deleteApplication https://${is_host}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ ${cameron_auth}
  delete_sp manager Common urn:deleteApplication https://${is_host}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ ${cameron_auth}
  delete_user ${is_host} ${tenant_admin_auth} ${cameron_username} ${alex_username}
  echo
  return -1
 fi
echo "** Successfully updated the application ${sp_name}. **"

return 0;
}


start_the_flow() {
    echo "Please pick a scenario from the following."
    echo "-----------------------------------------------------------------------------"
    echo "|  Scenario 1 - Configuring Single-Sign-On with SAML2                       |"
    echo "-----------------------------------------------------------------------------"
    echo "Enter the scenario number you selected."

    # Reading the scenarios available.
    read scenario
    case $scenario in
        1)

        configure_sso_saml2 ${IS_DOMAIN} ${IS_DISPATCH_APP_URL} ${IS_MANAGER_APP_URL} ${USER_NAME} ${USER_PASS} ${AUTH} ${USER_CAMERON_NAME} ${USER_CAMERON_PASS} ${USER_CAMERON_AUTH} ${USER_ALEX_NAME} ${USER_ALEX_PASS}
        end_message saml2-web-app-pickup-dispatch.com saml2-web-app-pickup-manager.com ${IS_DISPATCH_APP_URL} ${IS_MANAGER_APP_URL} ${USER_CAMERON_NAME} ${USER_CAMERON_PASS} ${USER_CAMERON_AUTH} ${USER_ALEX_NAME} ${IS_DOMAIN} ${AUTH}
        if [ "$?" -ne "0" ]; then
          echo "Sorry, we had a problem there!"
        fi
        ;;

        2)
        configure_sso_oidc ${IS_DOMAIN} ${IS_PORT} ${SERVER_DOMAIN} ${SERVER_PORT}
        end_message pickup-dispatch pickup-manager ${IS_DISPATCH_APP_URL} ${IS_MANAGER_APP_URL} ${USER_CAMERON_NAME} ${USER_CAMERON_PASS} ${USER_ALEX_NAME} ${IS_DOMAIN} ${AUTH}
        if [ "$?" -ne "0" ]; then
          echo "Sorry, we had a problem there!"
        fi
        ;;

        3)
        create_multifactor_auth ${IS_DOMAIN} ${IS_PORT} ${SERVER_DOMAIN} ${SERVER_PORT}
        end_message saml2-web-app-pickup-dispatch.com saml2-web-app-pickup-manager.com ${IS_DISPATCH_APP_URL} ${IS_MANAGER_APP_URL} ${USER_CAMERON_NAME} ${USER_CAMERON_PASS} ${USER_ALEX_NAME} ${IS_DOMAIN} ${AUTH}
        delete_idp 05 urn:deleteIdP https://${is_host}/services/IdentityProviderMgtService.IdentityProviderMgtServiceHttpsSoap11Endpoint/
        ;;

        4)
        configure_federated_auth ${IS_DOMAIN} ${IS_PORT} ${SERVER_DOMAIN} ${SERVER_PORT}
        end_message saml2-web-app-pickup-dispatch.com saml2-web-app-pickup-manager.com ${IS_DISPATCH_APP_URL} ${IS_MANAGER_APP_URL} ${USER_CAMERON_NAME} ${USER_CAMERON_PASS} ${USER_ALEX_NAME} ${IS_DOMAIN} ${AUTH}
        delete_idp 05 urn:deleteIdP https://${is_host}/services/IdentityProviderMgtService.IdentityProviderMgtServiceHttpsSoap11Endpoint/
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
PROPERTY_FILE=${CONF_DIR}/cloud.properties

echo "Before running samples make sure the following                                "
echo "  * Added correct details to the cloud.properties.                            "
echo "  * Your WSO2 IS and sample applications are running.                         "
echo "                                                                              "
echo " If okay to continue, Please press 'Y' else press 'N'                         "
read continueState
case $continueState in
      [Yy]*)

        echo "Reading server paths from $PROPERTY_FILE"
        IS_DOMAIN=$(getProperty "wso2is.host.domain")
        echo "IS host domain ${IS_DOMAIN}"

        if [ -z "${IS_DOMAIN}" ]
        then
            echo "IS host domain is not configured. Please configure that and Try again"
            return -1
        fi

        IS_DISPATCH_APP_URL=$(getProperty "cloud.dispatch.app.url")
        echo "Integration Cloud dispatch app url ${IS_DISPATCH_APP_URL}"

        if [ -z "${IS_DISPATCH_APP_URL}" ]
        then
            echo "Integration Cloud dispatch app url is not configured. Please configure that and Try again"
            return -1
        fi

        IS_MANAGER_APP_URL=$(getProperty "cloud.manager.app.url")
        echo "server port ${IS_MANAGER_APP_URL}"

        if [ -z "${IS_MANAGER_APP_URL}" ]
        then
            echo "Integration Cloud manager app url is not configured. Please configure that and Try again"
            return -1
        fi

        USER_NAME=$(getProperty "tenant.admin.name")
        echo "Fully qualified user name of tenant admin is ${USER_NAME}"
        if [ -z "${USER_NAME}" ]
        then
            echo "Fully qualified user name of tenant admin is not configured. Please configure that and Try again"
            return -1
        fi

        USER_PASS=$(getProperty "tenant.admin.password")
        echo "Tenant admin password is ${USER_PASS}"
        if [ -z "${USER_PASS}" ]
        then
            echo "Tenant admin password is not configured. Please configure that and Try again"
            return -1
        fi

        AUTH=$(getProperty "tenant.admin.auth.token")
        echo "Tenant admin auth token is ${AUTH}"
        if [ -z "${AUTH}" ]
        then
            echo "Tenant admin auth token is not configured. Please configure that and Try again"
            return -1
        fi

        USER_CAMERON_NAME=$(getProperty "user.cameron.name")
        echo "Fully qualified user name for Cameron is ${USER_CAMERON_NAME}"
        if [ -z "${USER_CAMERON_NAME}" ]
        then
            echo "Full qualified user name for Cameron is not configured. Please configure that and Try again"
            return -1
        fi

        USER_CAMERON_PASS=$(getProperty "user.cameron.passoword")
        echo "User Cameron passowrd is ${USER_CAMERON_PASS}"
        if [ -z "${USER_CAMERON_PASS}" ]
        then
            echo "User Cameron password is not configured. Please configure that and Try again"
            return -1
        fi

        USER_CAMERON_AUTH=$(getProperty "user.cameron.auth.token")
        echo "User Cameron auth token ${USER_CAMERON_AUTH}"
        if [ -z "${USER_CAMERON_AUTH}" ]
        then
            echo "User Cameron auth token is not configured. Please configure that and Try again"
            return -1
        fi
        
        USER_ALEX_NAME=$(getProperty "user.alex.name")
        echo "Fully qualified user name for Alex is ${USER_ALEX_NAME}"
        if [ -z "${USER_ALEX_NAME}" ]
        then
            echo "Full qualified user name for Alex is not configured. Please configure that and Try again"
            return -1
        fi

        USER_ALEX_PASS=$(getProperty "user.alex.password")
        echo "User Alex passowrd is ${USER_ALEX_PASS}"
        if [ -z "${USER_ALEX_PASS}" ]
        then
            echo "User Alex password is not configured. Please configure that and Try again"
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
