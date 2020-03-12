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

getProperty() {
   PROP_KEY=$1
   PROP_VALUE=`cat $PROPERTY_FILE | grep "$PROP_KEY" | cut -d'=' -f2`
   echo $PROP_VALUE
}

update_app_fed_auth() {
sp_name=$1
request_data="get-app-${sp_name}.xml"
auth=$2
is_host=$3
is_port=$4
key=$5
secret=$6
soap_action=$7
endpoint=$8

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
curl -s -k -d @$request_data -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" -H "SOAPAction: urn:getApplication" https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ > response_unformatted.xml
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while getting application details for ${sp_name}.... !!"
  echo
  delete_sp dispatch Common urn:deleteApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  delete_sp swift Common urn:deleteApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  delete_user ${is_host} ${is_port}
  echo
  return -1
 fi

app_id=`java -jar QSG-*.jar`

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

echo "Updating application ${sp_name}..."

# Send the SOAP request to Update the Application.
curl -s -k -d @$request_data -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" -H "SOAPAction: ${soap_action}" -o /dev/null $endpoint
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while updating application ${sp_name}.... !!"
  echo
     delete_sp pickup urn:deleteApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
     delete_user ${is_host} ${is_port}
  echo
  return -1
 fi
echo "** Successfully updated the application ${sp_name}. **"
return 0;
}

run_fed_step01() {

is_host=$1
is_port=$2
tomcat_host=$3
tomcat_port=$4

add_user admin admin ${is_host} ${is_port}

add_identity_provider admin admin ${is_host} ${is_port}

add_service_provider pickup urn:createApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz ${is_host} ${is_port}
configure_oidc pickup urn:registerOAuthApplicationData https://${is_host}:${is_port}/services/OAuthAdminService.OAuthAdminServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz ${is_host} ${is_port} ${tomcat_host} ${tomcat_port}
update_oidc_app pickup Y2FtZXJvbjpjYW1lcm9uMTIz PQGlzcGF0Y2g= PqGlzcGF0Y2gMjMO ${is_host} ${is_port} ${tomcat_host} ${tomcat_port}

update_app_fed_auth pickup Y2FtZXJvbjpjYW1lcm9uMTIz ${is_host} ${is_port} PQGlzcGF0Y2g= PqGlzcGF0Y2gMjMO urn:updateApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/
}

run_step01() {

is_host=$1
is_port=$2
tomcat_host=$3
tomcat_port=$4

add_user admin admin ${is_host} ${is_port}

configure_selfsignup urn:updateResidentIdP https://${is_host}:${is_port}/services/IdentityProviderMgtService.IdentityProviderMgtServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz ${is_host} ${is_port}

add_service_provider pickup urn:createApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz ${is_host} ${is_port}
add_service_provider notification-center urn:createApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz ${is_host} ${is_port}

configure_oidc pickup urn:registerOAuthApplicationData https://${is_host}:${is_port}/services/OAuthAdminService.OAuthAdminServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz ${is_host} ${is_port} ${tomcat_host} ${tomcat_port}
configure_oidc notification-center urn:registerOAuthApplicationData https://${is_host}:${is_port}/services/OAuthAdminService.OAuthAdminServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz ${is_host} ${is_port} ${tomcat_host} ${tomcat_port}

update_oidc_app pickup Y2FtZXJvbjpjYW1lcm9uMTIz PQGlzcGF0Y2g= PqGlzcGF0Y2gMjMO ${is_host} ${is_port} ${tomcat_host} ${tomcat_port}
update_oidc_app notification-center Y2FtZXJvbjpjYW1lcm9uMTIz KpQGlzcGF0Y2h= KpGlzcGF0Y2gMjHy ${is_host} ${is_port} ${tomcat_host} ${tomcat_port}

return 0;
}

run_step02() {

add_users admin admin ${is_host} ${is_port}
add_consents admin admin ${is_host} ${is_port}

return 0;
}

add_identity_provider() {

IS_name=$1
IS_pass=$2
is_host=$3
is_port=$4

request_data="create-idp.xml"

 if [ ! -f "$request_data" ]
  then
   echo "$request_data File does not exists."
   return -1
 fi

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
    <ns1:alias xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">https://${is_host}:${is_port}/oauth2/token</ns1:alias>
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
        <value>${key}</value>
      </properties>
      <properties>
        <name>APISecret</name>
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
      <displayName>twitter</displayName>
      <enabled>true</enabled>
      <name>TwitterAuthenticator</name>
      <properties>
        <name>APIKey</name>
        <value>${key}</value>
      </properties>
      <properties>
        <name>APISecret</name>
        <value>${secret}</value>
      </properties>
      <properties>
        <name>callbackUrl</name>
        <value>https://${is_host}:${is_port}/commonauth</value>
      </properties>
    </federatedAuthenticatorConfigs>
    <justInTimeProvisioningConfig xmlns:ns1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\" >
      <provisioningEnabled>true</provisioningEnabled>
      <provisioningUserStore>PRIMARY</provisioningUserStore>
      <passwordProvisioningEnabled>true</passwordProvisioningEnabled>
      <promptConsent>true</promptConsent>
    </justInTimeProvisioningConfig>
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


add_user() {

IS_name=$1
IS_pass=$2
is_host=$3
is_port=$4

request_data="add-role.xml"
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

echo "Creating a role named Manager..."

# The following command will add a role to the user.
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

return 0;
}

add_users() {

IS_name=$1
IS_pass=$2
is_host=$3
is_port=$4

curl -s -k --user ${IS_name}:${IS_pass} --data '{"schemas":[],"name":{"familyName":"Richards","givenName":"Alex"},"userName":"alex","password":"alex123","emails":"alex@gmail.com","addresses":{"country":"Canada"}}' --header "Content-Type:application/json" -o /dev/null https://${is_host}:${is_port}/wso2/scim/Users
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating user Alex. !!"
  echo
  return -1
 fi
echo "** The user Alex was successfully created. **"
echo

curl -s -k --user ${IS_name}:${IS_pass} --data "{"schemas":[],"name":{"familyName":"Lively","givenName":"Blake"},"userName":"blake","password":"blake123","emails":"blake@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o /dev/null https://${is_host}:${is_port}/wso2/scim/Users
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating user Blake. !!"
  echo
  return -1
 fi
echo "** The user Blake was successfully created. **"
echo

curl -s -k --user ${IS_name}:${IS_pass} --data "{"schemas":[],"name":{"familyName":"Mathews","givenName":"Chris"},"userName":"chris","password":"chris123","emails":"chris@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o /dev/null https://${is_host}:${is_port}/wso2/scim/Users
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating user Chris. !!"
  echo
  return -1
 fi
echo "** The user Chris was successfully created. **"
echo

curl -s -k --user ${IS_name}:${IS_pass} --data "{"schemas":[],"name":{"familyName":"Garret","givenName":"Dale"},"userName":"dale","password":"dale123","emails":"dale@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o /dev/null https://${is_host}:${is_port}/wso2/scim/Users
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating user Dale. !!"
  echo
  return -1
 fi
echo "** The user Dale was successfully created. **"
echo

curl -s -k --user ${IS_name}:${IS_pass} --data "{"schemas":[],"name":{"familyName":"Simon","givenName":"Eddie"},"userName":"eddie","password":"eddie123","emails":"eddie@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o /dev/null https://${is_host}:${is_port}/wso2/scim/Users
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating user Eddie. !!"
  echo
  return -1
 fi
echo "** The user Eddie was successfully created. **"
echo

curl -s -k --user ${IS_name}:${IS_pass} --data "{"schemas":[],"name":{"familyName":"Colin","givenName":"Gray"},"userName":"gray","password":"gray123","emails":"gray@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o /dev/null https://${is_host}:${is_port}/wso2/scim/Users
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating user Gray. !!"
  echo
  return -1
 fi
echo "** The user Gray was successfully created. **"
echo

curl -s -k --user ${IS_name}:${IS_pass} --data "{"schemas":[],"name":{"familyName":"Brown","givenName":"Harper"},"userName":"harper","password":"harper123","emails":"harper@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o /dev/null https://${is_host}:${is_port}/wso2/scim/Users
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating user Harper. !!"
  echo
  return -1
 fi
echo "** The user Harper was successfully created. **"
echo

curl -s -k --user ${IS_name}:${IS_pass} --data "{"schemas":[],"name":{"familyName":"Smith","givenName":"Jean"},"userName":"jean","password":"jean123","emails":"jean@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o /dev/null https://${is_host}:${is_port}/wso2/scim/Users
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating user Jean. !!"
  echo
  return -1
 fi
echo "** The user Jean was successfully created. **"
echo

curl -s -k --user ${IS_name}:${IS_pass} --data "{"schemas":[],"name":{"familyName":"Thomas","givenName":"Kelly"},"userName":"kelly","password":"kelly123","emails":"kelly@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o /dev/null https://${is_host}:${is_port}/wso2/scim/Users
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating user Kelly. !!"
  echo
  return -1
 fi
echo "** The user Kelly was successfully created. **"
echo

curl -s -k --user ${IS_name}:${IS_pass} --data "{"schemas":[],"name":{"familyName":"Moore","givenName":"Ray"},"userName":"ray","password":"ray123","emails":"ray@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o /dev/null https://${is_host}:${is_port}/wso2/scim/Users
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating user Ray. !!"
  echo
  return -1
 fi
echo "** The user Ray was successfully created. **"
echo

return 0;
}

add_consents() {

IS_name=$1
IS_pass=$2
is_host=$3
is_port=$4
echo "Adding consents to the users created..."
echo

gdprJarName=`find . -name "GDPR-*.jar"  2>&1 | grep -v "Permission denied"`
gdprJarName1=`echo "${gdprJarName#./}"`

cat_id=`java -cp "${gdprJarName1}:lib/httpclient-4.5.3.jar:lib/httpcore-4.4.6.jar:lib/json-20180130.jar:lib/commons-logging-1.2.jar" CategoryIdRetriever`
purp_id=`java -cp "${gdprJarName1}:lib/httpclient-4.5.3.jar:lib/httpcore-4.4.6.jar:lib/json-20180130.jar:lib/commons-logging-1.2.jar" PurposeIdRetriever`

curl -s -k -X POST "https://${is_host}:${is_port}/api/identity/consent-mgt/v1.0/consents" -H "Authorization: Basic YWxleDphbGV4MTIz" -H "accept: application/json" -H "Content-Type: application/json" -o /dev/null -d "{\"services\":[{\"service\":\"localhost\",\"serviceDisplayName\": \"Resident IDP\",\"serviceDescription\": \"Resident IDP\",\"tenantDomain\":\"carbon.super\",\"purposes\":[{\"purposeId\":${purp_id},\"purposeCategoryId\":[1],\"consentType\":\"EXPLICIT\",\"piiCategory\":[{\"piiCategoryId\":2,\"validity\":\"DATE_UNTIL:INDEFINITE\"},{\"piiCategoryId\":${cat_id},\"validity\":\"DATE_UNTIL:INDEFINITE\"}],\"primaryPurpose\":true,\"termination\":\"DATE_UNTIL:INDEFINITE\",\"thirdPartyDisclosure\":false,\"thirdPartyName\":null}]}],\"collectionMethod\":\"Sign-Up\",\"jurisdiction\":\"CA\",\"language\":\"EN\",\"policyURL\":\"https://${is_host}:${is_port}/authenticationendpoint/privacy_policy.do\",\"properties\":[{\"key\":\"publicKey\",\"value\":\"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAluZFdW1ynitztkWLC6xKegbRWxky+5P0p4ShYEOkHs30QI2VCuR6Qo4Bz5rTgLBrky03W1GAVrZxuvKRGj9V9+PmjdGtau4CTXu9pLLcqnruaczoSdvBYA3lS9a7zgFU0+s6kMl2EhB+rk7gXluEep7lIOenzfl2f6IoTKa2fVgVd3YKiSGsyL4tztS70vmmX121qm0sTJdKWP4HxXyqK9neolXI9fYyHOYILVNZ69z/73OOVhkh/mvTmWZLM7GM6sApmyLX6OXUp8z0pkY+vT/9+zRxxQs7GurC4/C1nK3rI/0ySUgGEafO1atNjYmlFN+M3tZX6nEcA6g94IavyQIDAQAB\"}]}"
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while adding consents. !!"
  echo
  return -1
 fi

curl -s -k -X POST "https://${is_host}:${is_port}/api/identity/consent-mgt/v1.0/consents" -H "Authorization: Basic Ymxha2U6Ymxha2UxMjM=" -H "accept: application/json" -H "Content-Type: application/json" -o /dev/null -d "{\"services\":[{\"service\":\"localhost\",\"serviceDisplayName\": \"Resident IDP\",\"serviceDescription\": \"Resident IDP\",\"tenantDomain\":\"carbon.super\",\"purposes\":[{\"purposeId\":${purp_id},\"purposeCategoryId\":[1],\"consentType\":\"EXPLICIT\",\"piiCategory\":[{\"piiCategoryId\":2,\"validity\":\"DATE_UNTIL:INDEFINITE\"}],\"primaryPurpose\":true,\"termination\":\"DATE_UNTIL:INDEFINITE\",\"thirdPartyDisclosure\":false,\"thirdPartyName\":null}]}],\"collectionMethod\":\"Sign-Up\",\"jurisdiction\":\"CA\",\"language\":\"EN\",\"policyURL\":\"https://${is_host}:${is_port}/authenticationendpoint/privacy_policy.do\",\"properties\":[{\"key\":\"publicKey\",\"value\":\"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAluZFdW1ynitztkWLC6xKegbRWxky+5P0p4ShYEOkHs30QI2VCuR6Qo4Bz5rTgLBrky03W1GAVrZxuvKRGj9V9+PmjdGtau4CTXu9pLLcqnruaczoSdvBYA3lS9a7zgFU0+s6kMl2EhB+rk7gXluEep7lIOenzfl2f6IoTKa2fVgVd3YKiSGsyL4tztS70vmmX121qm0sTJdKWP4HxXyqK9neolXI9fYyHOYILVNZ69z/73OOVhkh/mvTmWZLM7GM6sApmyLX6OXUp8z0pkY+vT/9+zRxxQs7GurC4/C1nK3rI/0ySUgGEafO1atNjYmlFN+M3tZX6nEcA6g94IavyQIDAQAB\"}]}"
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while adding consents. !!"
  echo
  return -1
 fi

curl -s -k -X POST "https://${is_host}:${is_port}/api/identity/consent-mgt/v1.0/consents" -H "Authorization: Basic Y2hyaXM6Y2hyaXMxMjM=" -H "accept: application/json" -H "Content-Type: application/json" -o /dev/null -d "{\"services\":[{\"service\":\"localhost\",\"serviceDisplayName\": \"Resident IDP\",\"serviceDescription\": \"Resident IDP\",\"tenantDomain\":\"carbon.super\",\"purposes\":[{\"purposeId\":${purp_id},\"purposeCategoryId\":[1],\"consentType\":\"EXPLICIT\",\"piiCategory\":[{\"piiCategoryId\":2,\"validity\":\"DATE_UNTIL:INDEFINITE\"},{\"piiCategoryId\":${cat_id},\"validity\":\"DATE_UNTIL:INDEFINITE\"}],\"primaryPurpose\":true,\"termination\":\"DATE_UNTIL:INDEFINITE\",\"thirdPartyDisclosure\":false,\"thirdPartyName\":null}]}],\"collectionMethod\":\"Sign-Up\",\"jurisdiction\":\"CA\",\"language\":\"EN\",\"policyURL\":\"https://${is_host}:${is_port}/authenticationendpoint/privacy_policy.do\",\"properties\":[{\"key\":\"publicKey\",\"value\":\"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAluZFdW1ynitztkWLC6xKegbRWxky+5P0p4ShYEOkHs30QI2VCuR6Qo4Bz5rTgLBrky03W1GAVrZxuvKRGj9V9+PmjdGtau4CTXu9pLLcqnruaczoSdvBYA3lS9a7zgFU0+s6kMl2EhB+rk7gXluEep7lIOenzfl2f6IoTKa2fVgVd3YKiSGsyL4tztS70vmmX121qm0sTJdKWP4HxXyqK9neolXI9fYyHOYILVNZ69z/73OOVhkh/mvTmWZLM7GM6sApmyLX6OXUp8z0pkY+vT/9+zRxxQs7GurC4/C1nK3rI/0ySUgGEafO1atNjYmlFN+M3tZX6nEcA6g94IavyQIDAQAB\"}]}"
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while adding consents. !!"
  echo
  return -1
 fi

curl -s -k -X POST "https://${is_host}:${is_port}/api/identity/consent-mgt/v1.0/consents" -H "Authorization: Basic ZGFsZTpkYWxlMTIz" -H "accept: application/json" -H "Content-Type: application/json" -o /dev/null -d "{\"services\":[{\"service\":\"localhost\",\"serviceDisplayName\": \"Resident IDP\",\"serviceDescription\": \"Resident IDP\",\"tenantDomain\":\"carbon.super\",\"purposes\":[{\"purposeId\":${purp_id},\"purposeCategoryId\":[1],\"consentType\":\"EXPLICIT\",\"piiCategory\":[{\"piiCategoryId\":2,\"validity\":\"DATE_UNTIL:INDEFINITE\"}],\"primaryPurpose\":true,\"termination\":\"DATE_UNTIL:INDEFINITE\",\"thirdPartyDisclosure\":false,\"thirdPartyName\":null}]}],\"collectionMethod\":\"Sign-Up\",\"jurisdiction\":\"CA\",\"language\":\"EN\",\"policyURL\":\"https://${is_host}:${is_port}/authenticationendpoint/privacy_policy.do\",\"properties\":[{\"key\":\"publicKey\",\"value\":\"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAluZFdW1ynitztkWLC6xKegbRWxky+5P0p4ShYEOkHs30QI2VCuR6Qo4Bz5rTgLBrky03W1GAVrZxuvKRGj9V9+PmjdGtau4CTXu9pLLcqnruaczoSdvBYA3lS9a7zgFU0+s6kMl2EhB+rk7gXluEep7lIOenzfl2f6IoTKa2fVgVd3YKiSGsyL4tztS70vmmX121qm0sTJdKWP4HxXyqK9neolXI9fYyHOYILVNZ69z/73OOVhkh/mvTmWZLM7GM6sApmyLX6OXUp8z0pkY+vT/9+zRxxQs7GurC4/C1nK3rI/0ySUgGEafO1atNjYmlFN+M3tZX6nEcA6g94IavyQIDAQAB\"}]}"
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while adding consents. !!"
  echo
  return -1
 fi

curl -s -k -X POST "https://${is_host}:${is_port}/api/identity/consent-mgt/v1.0/consents" -H "Authorization: Basic ZWRkaWU6ZWRkaWUxMjM=" -H "accept: application/json" -H "Content-Type: application/json" -o /dev/null -d "{\"services\":[{\"service\":\"localhost\",\"serviceDisplayName\": \"Resident IDP\",\"serviceDescription\": \"Resident IDP\",\"tenantDomain\":\"carbon.super\",\"purposes\":[{\"purposeId\":${purp_id},\"purposeCategoryId\":[1],\"consentType\":\"EXPLICIT\",\"piiCategory\":[{\"piiCategoryId\":2,\"validity\":\"DATE_UNTIL:INDEFINITE\"},{\"piiCategoryId\":${cat_id},\"validity\":\"DATE_UNTIL:INDEFINITE\"}],\"primaryPurpose\":true,\"termination\":\"DATE_UNTIL:INDEFINITE\",\"thirdPartyDisclosure\":false,\"thirdPartyName\":null}]}],\"collectionMethod\":\"Sign-Up\",\"jurisdiction\":\"CA\",\"language\":\"EN\",\"policyURL\":\"https://${is_host}:${is_port}/authenticationendpoint/privacy_policy.do\",\"properties\":[{\"key\":\"publicKey\",\"value\":\"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAluZFdW1ynitztkWLC6xKegbRWxky+5P0p4ShYEOkHs30QI2VCuR6Qo4Bz5rTgLBrky03W1GAVrZxuvKRGj9V9+PmjdGtau4CTXu9pLLcqnruaczoSdvBYA3lS9a7zgFU0+s6kMl2EhB+rk7gXluEep7lIOenzfl2f6IoTKa2fVgVd3YKiSGsyL4tztS70vmmX121qm0sTJdKWP4HxXyqK9neolXI9fYyHOYILVNZ69z/73OOVhkh/mvTmWZLM7GM6sApmyLX6OXUp8z0pkY+vT/9+zRxxQs7GurC4/C1nK3rI/0ySUgGEafO1atNjYmlFN+M3tZX6nEcA6g94IavyQIDAQAB\"}]}"
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while adding consents. !!"
  echo
  return -1
 fi

curl -s -k -X POST "https://${is_host}:${is_port}/api/identity/consent-mgt/v1.0/consents" -H "Authorization: Basic Z3JheTpncmF5MTIz" -H "accept: application/json" -H "Content-Type: application/json" -o /dev/null -d "{\"services\":[{\"service\":\"localhost\",\"serviceDisplayName\": \"Resident IDP\",\"serviceDescription\": \"Resident IDP\",\"tenantDomain\":\"carbon.super\",\"purposes\":[{\"purposeId\":${purp_id},\"purposeCategoryId\":[1],\"consentType\":\"EXPLICIT\",\"piiCategory\":[{\"piiCategoryId\":2,\"validity\":\"DATE_UNTIL:INDEFINITE\"}],\"primaryPurpose\":true,\"termination\":\"DATE_UNTIL:INDEFINITE\",\"thirdPartyDisclosure\":false,\"thirdPartyName\":null}]}],\"collectionMethod\":\"Sign-Up\",\"jurisdiction\":\"CA\",\"language\":\"EN\",\"policyURL\":\"https://${is_host}:${is_port}/authenticationendpoint/privacy_policy.do\",\"properties\":[{\"key\":\"publicKey\",\"value\":\"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAluZFdW1ynitztkWLC6xKegbRWxky+5P0p4ShYEOkHs30QI2VCuR6Qo4Bz5rTgLBrky03W1GAVrZxuvKRGj9V9+PmjdGtau4CTXu9pLLcqnruaczoSdvBYA3lS9a7zgFU0+s6kMl2EhB+rk7gXluEep7lIOenzfl2f6IoTKa2fVgVd3YKiSGsyL4tztS70vmmX121qm0sTJdKWP4HxXyqK9neolXI9fYyHOYILVNZ69z/73OOVhkh/mvTmWZLM7GM6sApmyLX6OXUp8z0pkY+vT/9+zRxxQs7GurC4/C1nK3rI/0ySUgGEafO1atNjYmlFN+M3tZX6nEcA6g94IavyQIDAQAB\"}]}"
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while adding consents. !!"
  echo
  return -1
 fi

curl -s -k -X POST "https://${is_host}:${is_port}/api/identity/consent-mgt/v1.0/consents" -H "Authorization: Basic aGFycGVyOmhhcnBlcjEyMw==" -H "accept: application/json" -H "Content-Type: application/json" -o /dev/null -d "{\"services\":[{\"service\":\"localhost\",\"serviceDisplayName\": \"Resident IDP\",\"serviceDescription\": \"Resident IDP\",\"tenantDomain\":\"carbon.super\",\"purposes\":[{\"purposeId\":${purp_id},\"purposeCategoryId\":[1],\"consentType\":\"EXPLICIT\",\"piiCategory\":[{\"piiCategoryId\":2,\"validity\":\"DATE_UNTIL:INDEFINITE\"},{\"piiCategoryId\":${cat_id},\"validity\":\"DATE_UNTIL:INDEFINITE\"}],\"primaryPurpose\":true,\"termination\":\"DATE_UNTIL:INDEFINITE\",\"thirdPartyDisclosure\":false,\"thirdPartyName\":null}]}],\"collectionMethod\":\"Sign-Up\",\"jurisdiction\":\"CA\",\"language\":\"EN\",\"policyURL\":\"https://${is_host}:${is_port}/authenticationendpoint/privacy_policy.do\",\"properties\":[{\"key\":\"publicKey\",\"value\":\"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAluZFdW1ynitztkWLC6xKegbRWxky+5P0p4ShYEOkHs30QI2VCuR6Qo4Bz5rTgLBrky03W1GAVrZxuvKRGj9V9+PmjdGtau4CTXu9pLLcqnruaczoSdvBYA3lS9a7zgFU0+s6kMl2EhB+rk7gXluEep7lIOenzfl2f6IoTKa2fVgVd3YKiSGsyL4tztS70vmmX121qm0sTJdKWP4HxXyqK9neolXI9fYyHOYILVNZ69z/73OOVhkh/mvTmWZLM7GM6sApmyLX6OXUp8z0pkY+vT/9+zRxxQs7GurC4/C1nK3rI/0ySUgGEafO1atNjYmlFN+M3tZX6nEcA6g94IavyQIDAQAB\"}]}"
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while adding consents. !!"
  echo
  return -1
 fi

curl -s -k -X POST "https://${is_host}:${is_port}/api/identity/consent-mgt/v1.0/consents" -H "Authorization: Basic amVhbjpqZWFuMTIz" -H "accept: application/json" -H "Content-Type: application/json" -o /dev/null -d "{\"services\":[{\"service\":\"localhost\",\"serviceDisplayName\": \"Resident IDP\",\"serviceDescription\": \"Resident IDP\",\"tenantDomain\":\"carbon.super\",\"purposes\":[{\"purposeId\":${purp_id},\"purposeCategoryId\":[1],\"consentType\":\"EXPLICIT\",\"piiCategory\":[{\"piiCategoryId\":2,\"validity\":\"DATE_UNTIL:INDEFINITE\"}],\"primaryPurpose\":true,\"termination\":\"DATE_UNTIL:INDEFINITE\",\"thirdPartyDisclosure\":false,\"thirdPartyName\":null}]}],\"collectionMethod\":\"Sign-Up\",\"jurisdiction\":\"CA\",\"language\":\"EN\",\"policyURL\":\"https://${is_host}:${is_port}/authenticationendpoint/privacy_policy.do\",\"properties\":[{\"key\":\"publicKey\",\"value\":\"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAluZFdW1ynitztkWLC6xKegbRWxky+5P0p4ShYEOkHs30QI2VCuR6Qo4Bz5rTgLBrky03W1GAVrZxuvKRGj9V9+PmjdGtau4CTXu9pLLcqnruaczoSdvBYA3lS9a7zgFU0+s6kMl2EhB+rk7gXluEep7lIOenzfl2f6IoTKa2fVgVd3YKiSGsyL4tztS70vmmX121qm0sTJdKWP4HxXyqK9neolXI9fYyHOYILVNZ69z/73OOVhkh/mvTmWZLM7GM6sApmyLX6OXUp8z0pkY+vT/9+zRxxQs7GurC4/C1nK3rI/0ySUgGEafO1atNjYmlFN+M3tZX6nEcA6g94IavyQIDAQAB\"}]}"
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while adding consents. !!"
  echo
  return -1
 fi

curl -s -k -X POST "https://${is_host}:${is_port}/api/identity/consent-mgt/v1.0/consents" -H "Authorization: Basic a2VsbHk6a2VsbHkxMjM=" -H "accept: application/json" -H "Content-Type: application/json" -o /dev/null -d "{\"services\":[{\"service\":\"localhost\",\"serviceDisplayName\": \"Resident IDP\",\"serviceDescription\": \"Resident IDP\",\"tenantDomain\":\"carbon.super\",\"purposes\":[{\"purposeId\":${purp_id},\"purposeCategoryId\":[1],\"consentType\":\"EXPLICIT\",\"piiCategory\":[{\"piiCategoryId\":2,\"validity\":\"DATE_UNTIL:INDEFINITE\"},{\"piiCategoryId\":${cat_id},\"validity\":\"DATE_UNTIL:INDEFINITE\"}],\"primaryPurpose\":true,\"termination\":\"DATE_UNTIL:INDEFINITE\",\"thirdPartyDisclosure\":false,\"thirdPartyName\":null}]}],\"collectionMethod\":\"Sign-Up\",\"jurisdiction\":\"CA\",\"language\":\"EN\",\"policyURL\":\"https://${is_host}:${is_port}/authenticationendpoint/privacy_policy.do\",\"properties\":[{\"key\":\"publicKey\",\"value\":\"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAluZFdW1ynitztkWLC6xKegbRWxky+5P0p4ShYEOkHs30QI2VCuR6Qo4Bz5rTgLBrky03W1GAVrZxuvKRGj9V9+PmjdGtau4CTXu9pLLcqnruaczoSdvBYA3lS9a7zgFU0+s6kMl2EhB+rk7gXluEep7lIOenzfl2f6IoTKa2fVgVd3YKiSGsyL4tztS70vmmX121qm0sTJdKWP4HxXyqK9neolXI9fYyHOYILVNZ69z/73OOVhkh/mvTmWZLM7GM6sApmyLX6OXUp8z0pkY+vT/9+zRxxQs7GurC4/C1nK3rI/0ySUgGEafO1atNjYmlFN+M3tZX6nEcA6g94IavyQIDAQAB\"}]}"
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while adding consents. !!"
  echo
  return -1
 fi

curl -s -k -X POST "https://${is_host}:${is_port}/api/identity/consent-mgt/v1.0/consents" -H "Authorization: Basic cmF5OnJheTEyMw==" -H "accept: application/json" -H "Content-Type: application/json" -o /dev/null -d "{\"services\":[{\"service\":\"localhost\",\"serviceDisplayName\": \"Resident IDP\",\"serviceDescription\": \"Resident IDP\",\"tenantDomain\":\"carbon.super\",\"purposes\":[{\"purposeId\":${purp_id},\"purposeCategoryId\":[1],\"consentType\":\"EXPLICIT\",\"piiCategory\":[{\"piiCategoryId\":2,\"validity\":\"DATE_UNTIL:INDEFINITE\"}],\"primaryPurpose\":true,\"termination\":\"DATE_UNTIL:INDEFINITE\",\"thirdPartyDisclosure\":false,\"thirdPartyName\":null}]}],\"collectionMethod\":\"Sign-Up\",\"jurisdiction\":\"CA\",\"language\":\"EN\",\"policyURL\":\"https://${is_host}:${is_port}/authenticationendpoint/privacy_policy.do\",\"properties\":[{\"key\":\"publicKey\",\"value\":\"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAluZFdW1ynitztkWLC6xKegbRWxky+5P0p4ShYEOkHs30QI2VCuR6Qo4Bz5rTgLBrky03W1GAVrZxuvKRGj9V9+PmjdGtau4CTXu9pLLcqnruaczoSdvBYA3lS9a7zgFU0+s6kMl2EhB+rk7gXluEep7lIOenzfl2f6IoTKa2fVgVd3YKiSGsyL4tztS70vmmX121qm0sTJdKWP4HxXyqK9neolXI9fYyHOYILVNZ69z/73OOVhkh/mvTmWZLM7GM6sApmyLX6OXUp8z0pkY+vT/9+zRxxQs7GurC4/C1nK3rI/0ySUgGEafO1atNjYmlFN+M3tZX6nEcA6g94IavyQIDAQAB\"}]}"
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while adding consents. !!"
  echo
  return -1
 fi

echo "** The consents were successfully added. **"
echo

return 0;
}

configure_selfsignup() {

soap_action=$1
endpoint=$2
auth=$3
is_host=$4
is_port=$5

request_data="enable-selfsignup.xml"

  if [ ! -f "$request_data" ]
   then
    echo "$request_data File does not exists."
    return -1
  fi

  if [ -f "$request_data" ]
   then
     rm -r enable-selfsignup.xml
  fi

touch enable-selfsignup.xml

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
</soapenv:Envelope>" >> enable-selfsignup.xml

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

return 0;
}

add_service_provider() {

sp_name=$1
soap_action=$2
endpoint=$3
auth=$4
is_host=$5
is_port=$6

request_data="create-sp-${sp_name}.xml"

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
  echo "!! Problem occurred while creating the service provider. Remove SPs manually if any created !!"
  echo
#  delete_sp dispatch Common urn:deleteApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
#  delete_sp swift Common urn:deleteApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  delete_setup ${is_host} ${is_port}
  echo
  return -1
 fi
echo "** Service Provider $sp_name successfully created. **"
echo

return 0;
}

configure_oidc() {

sp_name=$1
soap_action=$2
endpoint=$3
auth=$4
is_host=$5
is_port=$6
tomcat_host=$7
tomcat_port=$8

if [ "$sp_name" = "pickup" ];
 then
 client_id="PQGlzcGF0Y2g="
 secret="PqGlzcGF0Y2gMjMO"
 callback=${sp_name}
elif [ "$sp_name" = "notification-center" ];
then
 client_id="KpQGlzcGF0Y2h="
 secret="KpGlzcGF0Y2gMjHy"
 callback="notification"
 else
  client_id="CdQGlzcGF0Y2g="
  secret="CdHmlzcGF0Y2gMjMo="
  callback=${sp_name}
fi

request_data="oidc-config-${sp_name}.xml"

   if [ -f "$request_data" ]
   then
      rm -r oidc-config-${sp_name}.xml
   fi

touch oidc-config-${sp_name}.xml

echo "
<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://org.apache.axis2/xsd\" xmlns:xsd1=\"http://dto.oauth.identity.carbon.wso2.org/xsd\">
<soapenv:Header/>
<soapenv:Body>
    <xsd:registerOAuthApplicationData>
        <xsd:application>
            <xsd1:OAuthVersion>OAuth-2.0</xsd1:OAuthVersion>
            <xsd1:applicationName>${sp_name}</xsd1:applicationName>
            <xsd1:callbackUrl>http://${tomcat_host}:${tomcat_port}/${callback}/oauth2client</xsd1:callbackUrl>
            <xsd1:grantTypes>refresh_token urn:ietf:params:oauth:grant-type:saml2-bearer implicit password client_credentials iwa:ntlm authorization_code</xsd1:grantTypes>
            <xsd1:oauthConsumerKey>${client_id}</xsd1:oauthConsumerKey>
            <xsd1:oauthConsumerSecret>${secret}</xsd1:oauthConsumerSecret>
            <xsd1:pkceMandatory>false</xsd1:pkceMandatory>
        </xsd:application>
    </xsd:registerOAuthApplicationData>
</soapenv:Body>
</soapenv:Envelope>" >> oidc-config-${sp_name}.xml

echo "Configuring OIDC for ${sp_name}..."

# Configure OIDC for the created SPs.
curl -s -k -d @$request_data -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" -H "SOAPAction: ${soap_action}" -o /dev/null $endpoint
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while configuring OIDC web SSO for ${sp_name}.... Please delete users and SPs manually!!"
  echo
#  delete_sp dispatch Common urn:deleteApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
#  delete_sp swift Common urn:deleteApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  delete_setup ${is_host} ${is_port}
  echo
  return -1
 fi
echo "** OIDC successfully configured for the Service Provider $sp_name. **"
echo

return 0;
}

update_oidc_app() {

sp_name=$1
request_data="get-app-${sp_name}.xml"
auth=$2
key=$3
secret=$4
is_host=$5
is_port=$6
tomcat_host=$7
tomcat_port=$8

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

curl -s -k -d @$request_data -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" -H "SOAPAction: urn:getApplication" https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ > response_unformatted.xml
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while getting application details for ${sp_name}.... !!"
  echo
#  delete_sp dispatch Common urn:deleteApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
#  delete_sp swift Common urn:deleteApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
  delete_setup ${is_host} ${is_port}
  echo
  return -1
 fi

jarName=`find . -name "QSG-*.jar"  2>&1 | grep -v "Permission denied"`
jarName2=`echo "${jarName#./}"`

app_id=`java -jar ${jarName2}`
# Send the SOAP request to Update the Application.
curl -s -k -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" -H "SOAPAction: urn:updateApplication" -o /dev/null https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ -d "<soapenv:Envelope xmlns:soapenv="\"http://schemas.xmlsoap.org/soap/envelope/"\" xmlns:xsd="\"http://org.apache.axis2/xsd"\" xmlns:xsd1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">
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
</soapenv:Envelope>"
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while updating application ${sp_name}.... !!"
  delete_setup ${is_host} ${is_port}
  echo
  echo
  return -1
 fi
echo "** Successfully updated the application ${sp_name}. **"

return 0;
}

delete_idp() {
soap_action=$1
endpoint=$2
request_data="$delete-idp-twitter.xml"

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


delete_setup_fed() {
is_host=$1
is_port=$2
echo "If you have finished trying out the sample web apps, you can clean the process now."
echo "Do you want to clean up the setup?"
echo
echo "Press y - YES"
echo "Press n - NO"
echo
read clean

 case ${clean} in
        [Yy]* )
        delete_idp urn:deleteIdP https://${is_host}:${is_port}/services/IdentityProviderMgtService.IdentityProviderMgtServiceHttpsSoap11Endpoint/
        delete_sp pickup urn:deleteApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
        delete_user ${is_host} ${is_port}

    break;;
        [Nn]* ) exit;;
        * ) echo "Please answer yes or no.";;
    esac

return 0;
}

delete_setup() {
is_host=$1
is_port=$2
echo "If you have finished trying out the sample web apps, you can clean the process now."
echo "Do you want to clean up the setup?"
echo
echo "Press y - YES"
echo "Press n - NO"
echo
read clean

 case ${clean} in
        [Yy]* )
        delete_sp pickup urn:deleteApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
        delete_sp notification-center urn:deleteApplication https://${is_host}:${is_port}/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
        delete_user ${is_host} ${is_port}
        delete_users ${is_host} ${is_port}
    break;;
        [Nn]* ) exit;;
        * ) echo "Please answer yes or no.";;
    esac

return 0;
}

delete_user() {
is_host=$1
is_port=$2
request_data1=delete-cameron.xml
request_data2=delete-role.xml

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

echo "Deleting the role named Manager..."

# Send the SOAP request to delete the role.
curl -s -k -d @$request_data2 -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteRole" -o /dev/null https://${is_host}:${is_port}/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while deleting the role Manager. !!"
  echo
  exit -1
 fi
echo "** The role Manager was successfully deleted. **"
echo

return 0;
}

delete_users() {
is_host=$1
is_port=$2
request_data1=delete-alex.xml
request_data2=delete-blake.xml
request_data3=delete-chris.xml
request_data4=delete-dale.xml
request_data5=delete-eddie.xml
request_data6=delete-gray.xml
request_data7=delete-harper.xml
request_data8=delete-jean.xml
request_data9=delete-kelly.xml
request_data10=delete-ray.xml

echo
echo "Deleting the user named Alex..."

# Send the SOAP request to delete the user.
curl -s -k -d @$request_data1 -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o /dev/null https://${is_host}:${is_port}/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while deleting the user Alex. !!"
  echo
  return -1
 fi
echo "** The user Alex was successfully deleted. **"
echo

echo
echo "Deleting the user named Blake..."

# Send the SOAP request to delete the user.
curl -s -k -d @$request_data2 -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o /dev/null https://${is_host}:${is_port}/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while deleting the user Blake. !!"
  echo
  return -1
 fi
echo "** The user Blake was successfully deleted. **"
echo

echo
echo "Deleting the user named Chris..."

# Send the SOAP request to delete the user.
curl -s -k -d @$request_data3 -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o /dev/null https://${is_host}:${is_port}/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while deleting the user Chris. !!"
  echo
  return -1
 fi
echo "** The user Chris was successfully deleted. **"
echo

echo
echo "Deleting the user named Dale..."

# Send the SOAP request to delete the user.
curl -s -k -d @$request_data4 -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o /dev/null https://${is_host}:${is_port}/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while deleting the user Dale. !!"
  echo
  return -1
 fi
echo "** The user Dale was successfully deleted. **"
echo

echo
echo "Deleting the user named Eddie..."

# Send the SOAP request to delete the user.
curl -s -k -d @$request_data5 -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o /dev/null https://${is_host}:${is_port}/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while deleting the user Eddie. !!"
  echo
  return -1
 fi
echo "** The user Eddie was successfully deleted. **"
echo

echo
echo "Deleting the user named Gray..."

# Send the SOAP request to delete the user.
curl -s -k -d @$request_data6 -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o /dev/null https://${is_host}:${is_port}/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while deleting the user Gray. !!"
  echo
  return -1
 fi
echo "** The user Gray was successfully deleted. **"
echo

echo
echo "Deleting the user named Harper..."

# Send the SOAP request to delete the user.
curl -s -k -d @$request_data7 -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o /dev/null https://${is_host}:${is_port}/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while deleting the user Harper. !!"
  echo
  return -1
 fi
echo "** The user Harper was successfully deleted. **"
echo

echo
echo "Deleting the user named Jean..."

# Send the SOAP request to delete the user.
curl -s -k -d @$request_data8 -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o /dev/null https://${is_host}:${is_port}/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while deleting the user Jean. !!"
  echo
  return -1
 fi
echo "** The user Jean was successfully deleted. **"
echo

echo
echo "Deleting the user named Kelly..."

# Send the SOAP request to delete the user.
curl -s -k -d @$request_data9 -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o /dev/null https://${is_host}:${is_port}/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while deleting the user Kelly. !!"
  echo
  return -1
 fi
echo "** The user Kelly was successfully deleted. **"
echo

echo
echo "Deleting the user named Ray..."

# Send the SOAP request to delete the user.
curl -s -k -d @$request_data10 -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o /dev/null https://${is_host}:${is_port}/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while deleting the user Ray. !!"
  echo
  return -1
 fi
echo "** The user Ray was successfully deleted. **"
echo

return 0;
}

delete_sp() {

sp_name=$1
soap_action=$2
endpoint=$3
auth=$4
request_data="delete-sp-${sp_name}.xml"

 if [ ! -f "$request_data" ]
  then
    echo "$request_data File does not exists."
    return -1
 fi
echo
echo Deleting Service Provider ${sp_name}...

# Send the SOAP request to delete a SP.
curl -s -k -d @$request_data -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" -H "SOAPAction: ${soap_action}" -o /dev/null ${endpoint}
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while deleting the service provider. !!"
  echo
  return -1
 fi
echo "** Service Provider ${sp_name} successfully deleted. **"

return 0;
}


start_the_flow() {

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

read scenario
case $scenario in
	1)

	run_step01 ${IS_HOST} ${IS_PORT} ${TOMCAT_HOST} ${TOMCAT_PORT}
	if [ "$?" -ne "0" ]; then
	  echo "Sorry, we had a problem there!"
	  return 0
	fi
   	echo "Now you can try out the scenarios 1 to 4 !"
    echo "Once you finish please type step 2 to continue :"
    read output
        case $output in
             2)
                echo "Now multiple users will be added with consents to the system."
                run_step02 ${IS_HOST} ${IS_PORT} ${TOMCAT_HOST} ${TOMCAT_PORT}
                if [ "$?" -ne "0" ]; then
                  echo "Sorry, we had a problem there!"
                fi
                echo "Now you can try out the scenario 5 !"
                echo "Once you finish, please press 'q' to delete the setup "
                read output1
                    case $output1 in
                      q)
                       delete_setup ${IS_HOST} ${IS_PORT}
                       ;;

                      *)
                       echo "Set up is not deleted. Please delete the set-up manually."
                       ;;
                     esac
             break ;;

             *)
               echo "Sorry, that's not an option."
               ;;
        esac

	break ;;
    2)
    echo "You are now configuring pickup as a Service Provider and configure twitter as the federated IDP"
    run_fed_step01 ${IS_HOST} ${IS_PORT} ${TOMCAT_HOST} ${TOMCAT_PORT}
    if [ "$?" -ne "0" ]; then
         echo "Sorry, we had a problem there!"
    fi
       echo "Now you can try out the scenario 6,7,8 !"
       echo "Once you finish, please press 'q' to delete the setup "
       read output1
       case $output1 in
             q)
                 delete_setup ${IS_HOST} ${IS_PORT}
                 ;;

             *)
                echo "Set up is not deleted. Please delete the set-up manually."
                ;;
             esac
    ;;
    *)
	echo "Sorry, that's not an option."
	;;
esac
echo
}

echo Please start from step 1:.
echo "----------------------------------------------------------------"
echo "| This is the Quick Start Guide for GDPR demonstrations.        |"
echo "| =====================================================         |"
echo "| Before run this make sure your WSO2 IS and Tomcat is          |"
echo "| running in default ports.                                     |"
echo "|                                                               |"
echo "| Furthermore, make sure you have correct hostnames and ports   |"
echo "|   of WSO2 IS and tomcat in server.properties file             |"
echo "|                                                               |"
echo "----------------------------------------------------------------"
echo " If okay to continue, Please press 'Y' else press 'N'                         "
read continueState
case $continueState in
      [Yy]*)
        # Read domians/ips and ports from server.properties file
        PROPERTY_FILE=server.properties
        echo "Reading server paths from $PROPERTY_FILE"
        IS_HOST=$(getProperty "wso2is.host.domain")
        # echo ${IS_HOST}

        if [ -z "${IS_HOST}" ]
        then
            echo "IS host domain is not configured. Please configure that and Try again"
            return -1
        fi

        IS_PORT=$(getProperty "wso2is.host.port")
        # echo "is port ${IS_PORT}"

        if [ -z "${IS_PORT}" ]
        then
            echo "IS host port is not configured. Please configure that and Try again"
            return -1
        fi

        TOMCAT_HOST=$(getProperty "tomcat.host.domain")
        # echo "tomcat port ${TOMCAT_HOST}"

        if [ -z "${TOMCAT_HOST}" ]
        then
            echo "Tomcat host domain is not configured. Please configure that and Try again"
            return -1
        fi

        TOMCAT_PORT=$(getProperty "tomcat.host.port")
        # echo "tomcat port ${TOMCAT_PORT}"
        if [ -z "${TOMCAT_PORT}" ]
        then
            echo "Tomcat host port is not configured. Please configure that and Try again"
            return -1
        fi
        start_the_flow
        ;;

      [Nn]*)
         echo "Please Configure server.properties file, install Tomcat, WSO2 IS and restart the script."
         exit;;
      *)
         echo "Please answer yes or no."
         ;;
esac

