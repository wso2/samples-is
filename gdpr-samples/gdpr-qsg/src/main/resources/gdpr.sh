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

run_step01() {

add_user admin admin

configure_selfsignup urn:updateResidentIdP https://localhost:9443/services/IdentityProviderMgtService.IdentityProviderMgtServiceHttpsSoap11Endpoint/ YWRtaW46YWRtaW4=

add_service_provider pickup urn:createApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ YWRtaW46YWRtaW4=
add_service_provider pick-my-book urn:createApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ YWRtaW46YWRtaW4=
add_service_provider notification-center urn:createApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ YWRtaW46YWRtaW4=

configure_oidc pickup urn:registerOAuthApplicationData https://localhost:9443/services/OAuthAdminService.OAuthAdminServiceHttpsSoap11Endpoint/ YWRtaW46YWRtaW4=
configure_oidc pick-my-book urn:registerOAuthApplicationData https://localhost:9443/services/OAuthAdminService.OAuthAdminServiceHttpsSoap11Endpoint/ YWRtaW46YWRtaW4=
configure_oidc notification-center urn:registerOAuthApplicationData https://localhost:9443/services/OAuthAdminService.OAuthAdminServiceHttpsSoap11Endpoint/ YWRtaW46YWRtaW4=

update_oidc_app pickup YWRtaW46YWRtaW4= ZGlzcGF0Y2g= ZGlzcGF0Y2gxMjM0
update_oidc_app pick-my-book YWRtaW46YWRtaW4= c3dpZnRhcHA= c3dpZnRhcHAxMjM=
update_oidc_app notification-center YWRtaW46YWRtaW4= bm90aWZpY2F0aW9u bm90aWZpY2F0aW9uMTIz

return 0;
}

run_step02() {

add_users admin admin
add_consents admin admin
delete_setup

return 0;
}

add_user() {

IS_name=$1
IS_pass=$2

request_data="add-role.xml"
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

echo "Creating a role named Manager..."

# The following command will add a role to the user.
curl -s -k --user ${IS_name}:${IS_pass} -d @$request_data -H "Content-Type: text/xml" -H "SOAPAction: urn:addRole" -o /dev/null https://localhost:9443/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating role manager. !!"
  echo
  delete_user
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

curl -s -k --user ${IS_name}:${IS_pass} --data '{"schemas":[],"name":{"familyName":"Richards","givenName":"Alex"},"userName":"alex","password":"alex123","emails":"alex@gmail.com","addresses":{"country":"Canada"}}' --header "Content-Type:application/json" -o /dev/null https://localhost:9443/wso2/scim/Users
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating user Alex. !!"
  echo
  return -1
 fi
echo "** The user Alex was successfully created. **"
echo

curl -s -k --user ${IS_name}:${IS_pass} --data "{"schemas":[],"name":{"familyName":"Lively","givenName":"Blake"},"userName":"blake","password":"blake123","emails":"blake@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o /dev/null https://localhost:9443/wso2/scim/Users
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating user Blake. !!"
  echo
  return -1
 fi
echo "** The user Blake was successfully created. **"
echo

curl -s -k --user ${IS_name}:${IS_pass} --data "{"schemas":[],"name":{"familyName":"Mathews","givenName":"Chris"},"userName":"chris","password":"chris123","emails":"chris@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o /dev/null https://localhost:9443/wso2/scim/Users
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating user Chris. !!"
  echo
  return -1
 fi
echo "** The user Chris was successfully created. **"
echo

curl -s -k --user ${IS_name}:${IS_pass} --data "{"schemas":[],"name":{"familyName":"Garret","givenName":"Dale"},"userName":"dale","password":"dale123","emails":"dale@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o /dev/null https://localhost:9443/wso2/scim/Users
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating user Dale. !!"
  echo
  return -1
 fi
echo "** The user Dale was successfully created. **"
echo

curl -s -k --user ${IS_name}:${IS_pass} --data "{"schemas":[],"name":{"familyName":"Simon","givenName":"Eddie"},"userName":"eddie","password":"eddie123","emails":"eddie@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o /dev/null https://localhost:9443/wso2/scim/Users
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating user Eddie. !!"
  echo
  return -1
 fi
echo "** The user Eddie was successfully created. **"
echo

curl -s -k --user ${IS_name}:${IS_pass} --data "{"schemas":[],"name":{"familyName":"Colin","givenName":"Gray"},"userName":"gray","password":"gray123","emails":"gray@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o /dev/null https://localhost:9443/wso2/scim/Users
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating user Gray. !!"
  echo
  return -1
 fi
echo "** The user Gray was successfully created. **"
echo

curl -s -k --user ${IS_name}:${IS_pass} --data "{"schemas":[],"name":{"familyName":"Brown","givenName":"Harper"},"userName":"harper","password":"harper123","emails":"harper@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o /dev/null https://localhost:9443/wso2/scim/Users
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating user Harper. !!"
  echo
  return -1
 fi
echo "** The user Harper was successfully created. **"
echo

curl -s -k --user ${IS_name}:${IS_pass} --data "{"schemas":[],"name":{"familyName":"Smith","givenName":"Jean"},"userName":"jean","password":"jean123","emails":"jean@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o /dev/null https://localhost:9443/wso2/scim/Users
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating user Jean. !!"
  echo
  return -1
 fi
echo "** The user Jean was successfully created. **"
echo

curl -s -k --user ${IS_name}:${IS_pass} --data "{"schemas":[],"name":{"familyName":"Thomas","givenName":"Kelly"},"userName":"kelly","password":"kelly123","emails":"kelly@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o /dev/null https://localhost:9443/wso2/scim/Users
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while creating user Kelly. !!"
  echo
  return -1
 fi
echo "** The user Kelly was successfully created. **"
echo

curl -s -k --user ${IS_name}:${IS_pass} --data "{"schemas":[],"name":{"familyName":"Moore","givenName":"Ray"},"userName":"ray","password":"ray123","emails":"ray@gmail.com","addresses":{"country":"Canada"}}" --header "Content-Type:application/json" -o /dev/null https://localhost:9443/wso2/scim/Users
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

echo "Adding consents to the users created..."
echo

gdprJarName=`find . -name "GDPR-*.jar"  2>&1 | grep -v "Permission denied"`
gdprJarName1=`echo "${gdprJarName#./}"`

cat_id=`java -cp "${gdprJarName1}:lib/httpclient-4.5.3.jar:lib/httpcore-4.4.6.jar:lib/json-20180130.jar:lib/commons-logging-1.2.jar" CategoryIdRetriever`
purp_id=`java -cp "${gdprJarName1}:lib/httpclient-4.5.3.jar:lib/httpcore-4.4.6.jar:lib/json-20180130.jar:lib/commons-logging-1.2.jar" PurposeIdRetriever`

curl -s -k -X POST "https://localhost:9443/api/identity/consent-mgt/v1.0/consents" -H "Authorization: Basic YWxleDphbGV4MTIz" -H "accept: application/json" -H "Content-Type: application/json" -o /dev/null -d "{\"services\":[{\"service\":\"localhost\",\"serviceDisplayName\": \"Resident IDP\",\"serviceDescription\": \"Resident IDP\",\"tenantDomain\":\"carbon.super\",\"purposes\":[{\"purposeId\":${purp_id},\"purposeCategoryId\":[1],\"consentType\":\"EXPLICIT\",\"piiCategory\":[{\"piiCategoryId\":2,\"validity\":\"DATE_UNTIL:INDEFINITE\"},{\"piiCategoryId\":${cat_id},\"validity\":\"DATE_UNTIL:INDEFINITE\"}],\"primaryPurpose\":true,\"termination\":\"DATE_UNTIL:INDEFINITE\",\"thirdPartyDisclosure\":false,\"thirdPartyName\":null}]}],\"collectionMethod\":\"Sign-Up\",\"jurisdiction\":\"CA\",\"language\":\"EN\",\"policyURL\":\"https://localhost:9443/authenticationendpoint/privacy_policy.do\",\"properties\":[{\"key\":\"publicKey\",\"value\":\"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAluZFdW1ynitztkWLC6xKegbRWxky+5P0p4ShYEOkHs30QI2VCuR6Qo4Bz5rTgLBrky03W1GAVrZxuvKRGj9V9+PmjdGtau4CTXu9pLLcqnruaczoSdvBYA3lS9a7zgFU0+s6kMl2EhB+rk7gXluEep7lIOenzfl2f6IoTKa2fVgVd3YKiSGsyL4tztS70vmmX121qm0sTJdKWP4HxXyqK9neolXI9fYyHOYILVNZ69z/73OOVhkh/mvTmWZLM7GM6sApmyLX6OXUp8z0pkY+vT/9+zRxxQs7GurC4/C1nK3rI/0ySUgGEafO1atNjYmlFN+M3tZX6nEcA6g94IavyQIDAQAB\"}]}"
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while adding consents. !!"
  echo
  return -1
 fi

curl -s -k -X POST "https://localhost:9443/api/identity/consent-mgt/v1.0/consents" -H "Authorization: Basic Ymxha2U6Ymxha2UxMjM=" -H "accept: application/json" -H "Content-Type: application/json" -o /dev/null -d "{\"services\":[{\"service\":\"localhost\",\"serviceDisplayName\": \"Resident IDP\",\"serviceDescription\": \"Resident IDP\",\"tenantDomain\":\"carbon.super\",\"purposes\":[{\"purposeId\":${purp_id},\"purposeCategoryId\":[1],\"consentType\":\"EXPLICIT\",\"piiCategory\":[{\"piiCategoryId\":2,\"validity\":\"DATE_UNTIL:INDEFINITE\"}],\"primaryPurpose\":true,\"termination\":\"DATE_UNTIL:INDEFINITE\",\"thirdPartyDisclosure\":false,\"thirdPartyName\":null}]}],\"collectionMethod\":\"Sign-Up\",\"jurisdiction\":\"CA\",\"language\":\"EN\",\"policyURL\":\"https://localhost:9443/authenticationendpoint/privacy_policy.do\",\"properties\":[{\"key\":\"publicKey\",\"value\":\"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAluZFdW1ynitztkWLC6xKegbRWxky+5P0p4ShYEOkHs30QI2VCuR6Qo4Bz5rTgLBrky03W1GAVrZxuvKRGj9V9+PmjdGtau4CTXu9pLLcqnruaczoSdvBYA3lS9a7zgFU0+s6kMl2EhB+rk7gXluEep7lIOenzfl2f6IoTKa2fVgVd3YKiSGsyL4tztS70vmmX121qm0sTJdKWP4HxXyqK9neolXI9fYyHOYILVNZ69z/73OOVhkh/mvTmWZLM7GM6sApmyLX6OXUp8z0pkY+vT/9+zRxxQs7GurC4/C1nK3rI/0ySUgGEafO1atNjYmlFN+M3tZX6nEcA6g94IavyQIDAQAB\"}]}"
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while adding consents. !!"
  echo
  return -1
 fi

curl -s -k -X POST "https://localhost:9443/api/identity/consent-mgt/v1.0/consents" -H "Authorization: Basic Y2hyaXM6Y2hyaXMxMjM=" -H "accept: application/json" -H "Content-Type: application/json" -o /dev/null -d "{\"services\":[{\"service\":\"localhost\",\"serviceDisplayName\": \"Resident IDP\",\"serviceDescription\": \"Resident IDP\",\"tenantDomain\":\"carbon.super\",\"purposes\":[{\"purposeId\":${purp_id},\"purposeCategoryId\":[1],\"consentType\":\"EXPLICIT\",\"piiCategory\":[{\"piiCategoryId\":2,\"validity\":\"DATE_UNTIL:INDEFINITE\"},{\"piiCategoryId\":${cat_id},\"validity\":\"DATE_UNTIL:INDEFINITE\"}],\"primaryPurpose\":true,\"termination\":\"DATE_UNTIL:INDEFINITE\",\"thirdPartyDisclosure\":false,\"thirdPartyName\":null}]}],\"collectionMethod\":\"Sign-Up\",\"jurisdiction\":\"CA\",\"language\":\"EN\",\"policyURL\":\"https://localhost:9443/authenticationendpoint/privacy_policy.do\",\"properties\":[{\"key\":\"publicKey\",\"value\":\"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAluZFdW1ynitztkWLC6xKegbRWxky+5P0p4ShYEOkHs30QI2VCuR6Qo4Bz5rTgLBrky03W1GAVrZxuvKRGj9V9+PmjdGtau4CTXu9pLLcqnruaczoSdvBYA3lS9a7zgFU0+s6kMl2EhB+rk7gXluEep7lIOenzfl2f6IoTKa2fVgVd3YKiSGsyL4tztS70vmmX121qm0sTJdKWP4HxXyqK9neolXI9fYyHOYILVNZ69z/73OOVhkh/mvTmWZLM7GM6sApmyLX6OXUp8z0pkY+vT/9+zRxxQs7GurC4/C1nK3rI/0ySUgGEafO1atNjYmlFN+M3tZX6nEcA6g94IavyQIDAQAB\"}]}"
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while adding consents. !!"
  echo
  return -1
 fi

curl -s -k -X POST "https://localhost:9443/api/identity/consent-mgt/v1.0/consents" -H "Authorization: Basic ZGFsZTpkYWxlMTIz" -H "accept: application/json" -H "Content-Type: application/json" -o /dev/null -d "{\"services\":[{\"service\":\"localhost\",\"serviceDisplayName\": \"Resident IDP\",\"serviceDescription\": \"Resident IDP\",\"tenantDomain\":\"carbon.super\",\"purposes\":[{\"purposeId\":${purp_id},\"purposeCategoryId\":[1],\"consentType\":\"EXPLICIT\",\"piiCategory\":[{\"piiCategoryId\":2,\"validity\":\"DATE_UNTIL:INDEFINITE\"}],\"primaryPurpose\":true,\"termination\":\"DATE_UNTIL:INDEFINITE\",\"thirdPartyDisclosure\":false,\"thirdPartyName\":null}]}],\"collectionMethod\":\"Sign-Up\",\"jurisdiction\":\"CA\",\"language\":\"EN\",\"policyURL\":\"https://localhost:9443/authenticationendpoint/privacy_policy.do\",\"properties\":[{\"key\":\"publicKey\",\"value\":\"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAluZFdW1ynitztkWLC6xKegbRWxky+5P0p4ShYEOkHs30QI2VCuR6Qo4Bz5rTgLBrky03W1GAVrZxuvKRGj9V9+PmjdGtau4CTXu9pLLcqnruaczoSdvBYA3lS9a7zgFU0+s6kMl2EhB+rk7gXluEep7lIOenzfl2f6IoTKa2fVgVd3YKiSGsyL4tztS70vmmX121qm0sTJdKWP4HxXyqK9neolXI9fYyHOYILVNZ69z/73OOVhkh/mvTmWZLM7GM6sApmyLX6OXUp8z0pkY+vT/9+zRxxQs7GurC4/C1nK3rI/0ySUgGEafO1atNjYmlFN+M3tZX6nEcA6g94IavyQIDAQAB\"}]}"
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while adding consents. !!"
  echo
  return -1
 fi

curl -s -k -X POST "https://localhost:9443/api/identity/consent-mgt/v1.0/consents" -H "Authorization: Basic ZWRkaWU6ZWRkaWUxMjM=" -H "accept: application/json" -H "Content-Type: application/json" -o /dev/null -d "{\"services\":[{\"service\":\"localhost\",\"serviceDisplayName\": \"Resident IDP\",\"serviceDescription\": \"Resident IDP\",\"tenantDomain\":\"carbon.super\",\"purposes\":[{\"purposeId\":${purp_id},\"purposeCategoryId\":[1],\"consentType\":\"EXPLICIT\",\"piiCategory\":[{\"piiCategoryId\":2,\"validity\":\"DATE_UNTIL:INDEFINITE\"},{\"piiCategoryId\":${cat_id},\"validity\":\"DATE_UNTIL:INDEFINITE\"}],\"primaryPurpose\":true,\"termination\":\"DATE_UNTIL:INDEFINITE\",\"thirdPartyDisclosure\":false,\"thirdPartyName\":null}]}],\"collectionMethod\":\"Sign-Up\",\"jurisdiction\":\"CA\",\"language\":\"EN\",\"policyURL\":\"https://localhost:9443/authenticationendpoint/privacy_policy.do\",\"properties\":[{\"key\":\"publicKey\",\"value\":\"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAluZFdW1ynitztkWLC6xKegbRWxky+5P0p4ShYEOkHs30QI2VCuR6Qo4Bz5rTgLBrky03W1GAVrZxuvKRGj9V9+PmjdGtau4CTXu9pLLcqnruaczoSdvBYA3lS9a7zgFU0+s6kMl2EhB+rk7gXluEep7lIOenzfl2f6IoTKa2fVgVd3YKiSGsyL4tztS70vmmX121qm0sTJdKWP4HxXyqK9neolXI9fYyHOYILVNZ69z/73OOVhkh/mvTmWZLM7GM6sApmyLX6OXUp8z0pkY+vT/9+zRxxQs7GurC4/C1nK3rI/0ySUgGEafO1atNjYmlFN+M3tZX6nEcA6g94IavyQIDAQAB\"}]}"
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while adding consents. !!"
  echo
  return -1
 fi

curl -s -k -X POST "https://localhost:9443/api/identity/consent-mgt/v1.0/consents" -H "Authorization: Basic Z3JheTpncmF5MTIz" -H "accept: application/json" -H "Content-Type: application/json" -o /dev/null -d "{\"services\":[{\"service\":\"localhost\",\"serviceDisplayName\": \"Resident IDP\",\"serviceDescription\": \"Resident IDP\",\"tenantDomain\":\"carbon.super\",\"purposes\":[{\"purposeId\":${purp_id},\"purposeCategoryId\":[1],\"consentType\":\"EXPLICIT\",\"piiCategory\":[{\"piiCategoryId\":2,\"validity\":\"DATE_UNTIL:INDEFINITE\"}],\"primaryPurpose\":true,\"termination\":\"DATE_UNTIL:INDEFINITE\",\"thirdPartyDisclosure\":false,\"thirdPartyName\":null}]}],\"collectionMethod\":\"Sign-Up\",\"jurisdiction\":\"CA\",\"language\":\"EN\",\"policyURL\":\"https://localhost:9443/authenticationendpoint/privacy_policy.do\",\"properties\":[{\"key\":\"publicKey\",\"value\":\"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAluZFdW1ynitztkWLC6xKegbRWxky+5P0p4ShYEOkHs30QI2VCuR6Qo4Bz5rTgLBrky03W1GAVrZxuvKRGj9V9+PmjdGtau4CTXu9pLLcqnruaczoSdvBYA3lS9a7zgFU0+s6kMl2EhB+rk7gXluEep7lIOenzfl2f6IoTKa2fVgVd3YKiSGsyL4tztS70vmmX121qm0sTJdKWP4HxXyqK9neolXI9fYyHOYILVNZ69z/73OOVhkh/mvTmWZLM7GM6sApmyLX6OXUp8z0pkY+vT/9+zRxxQs7GurC4/C1nK3rI/0ySUgGEafO1atNjYmlFN+M3tZX6nEcA6g94IavyQIDAQAB\"}]}"
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while adding consents. !!"
  echo
  return -1
 fi

curl -s -k -X POST "https://localhost:9443/api/identity/consent-mgt/v1.0/consents" -H "Authorization: Basic aGFycGVyOmhhcnBlcjEyMw==" -H "accept: application/json" -H "Content-Type: application/json" -o /dev/null -d "{\"services\":[{\"service\":\"localhost\",\"serviceDisplayName\": \"Resident IDP\",\"serviceDescription\": \"Resident IDP\",\"tenantDomain\":\"carbon.super\",\"purposes\":[{\"purposeId\":${purp_id},\"purposeCategoryId\":[1],\"consentType\":\"EXPLICIT\",\"piiCategory\":[{\"piiCategoryId\":2,\"validity\":\"DATE_UNTIL:INDEFINITE\"},{\"piiCategoryId\":${cat_id},\"validity\":\"DATE_UNTIL:INDEFINITE\"}],\"primaryPurpose\":true,\"termination\":\"DATE_UNTIL:INDEFINITE\",\"thirdPartyDisclosure\":false,\"thirdPartyName\":null}]}],\"collectionMethod\":\"Sign-Up\",\"jurisdiction\":\"CA\",\"language\":\"EN\",\"policyURL\":\"https://localhost:9443/authenticationendpoint/privacy_policy.do\",\"properties\":[{\"key\":\"publicKey\",\"value\":\"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAluZFdW1ynitztkWLC6xKegbRWxky+5P0p4ShYEOkHs30QI2VCuR6Qo4Bz5rTgLBrky03W1GAVrZxuvKRGj9V9+PmjdGtau4CTXu9pLLcqnruaczoSdvBYA3lS9a7zgFU0+s6kMl2EhB+rk7gXluEep7lIOenzfl2f6IoTKa2fVgVd3YKiSGsyL4tztS70vmmX121qm0sTJdKWP4HxXyqK9neolXI9fYyHOYILVNZ69z/73OOVhkh/mvTmWZLM7GM6sApmyLX6OXUp8z0pkY+vT/9+zRxxQs7GurC4/C1nK3rI/0ySUgGEafO1atNjYmlFN+M3tZX6nEcA6g94IavyQIDAQAB\"}]}"
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while adding consents. !!"
  echo
  return -1
 fi

curl -s -k -X POST "https://localhost:9443/api/identity/consent-mgt/v1.0/consents" -H "Authorization: Basic amVhbjpqZWFuMTIz" -H "accept: application/json" -H "Content-Type: application/json" -o /dev/null -d "{\"services\":[{\"service\":\"localhost\",\"serviceDisplayName\": \"Resident IDP\",\"serviceDescription\": \"Resident IDP\",\"tenantDomain\":\"carbon.super\",\"purposes\":[{\"purposeId\":${purp_id},\"purposeCategoryId\":[1],\"consentType\":\"EXPLICIT\",\"piiCategory\":[{\"piiCategoryId\":2,\"validity\":\"DATE_UNTIL:INDEFINITE\"}],\"primaryPurpose\":true,\"termination\":\"DATE_UNTIL:INDEFINITE\",\"thirdPartyDisclosure\":false,\"thirdPartyName\":null}]}],\"collectionMethod\":\"Sign-Up\",\"jurisdiction\":\"CA\",\"language\":\"EN\",\"policyURL\":\"https://localhost:9443/authenticationendpoint/privacy_policy.do\",\"properties\":[{\"key\":\"publicKey\",\"value\":\"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAluZFdW1ynitztkWLC6xKegbRWxky+5P0p4ShYEOkHs30QI2VCuR6Qo4Bz5rTgLBrky03W1GAVrZxuvKRGj9V9+PmjdGtau4CTXu9pLLcqnruaczoSdvBYA3lS9a7zgFU0+s6kMl2EhB+rk7gXluEep7lIOenzfl2f6IoTKa2fVgVd3YKiSGsyL4tztS70vmmX121qm0sTJdKWP4HxXyqK9neolXI9fYyHOYILVNZ69z/73OOVhkh/mvTmWZLM7GM6sApmyLX6OXUp8z0pkY+vT/9+zRxxQs7GurC4/C1nK3rI/0ySUgGEafO1atNjYmlFN+M3tZX6nEcA6g94IavyQIDAQAB\"}]}"
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while adding consents. !!"
  echo
  return -1
 fi

curl -s -k -X POST "https://localhost:9443/api/identity/consent-mgt/v1.0/consents" -H "Authorization: Basic a2VsbHk6a2VsbHkxMjM=" -H "accept: application/json" -H "Content-Type: application/json" -o /dev/null -d "{\"services\":[{\"service\":\"localhost\",\"serviceDisplayName\": \"Resident IDP\",\"serviceDescription\": \"Resident IDP\",\"tenantDomain\":\"carbon.super\",\"purposes\":[{\"purposeId\":${purp_id},\"purposeCategoryId\":[1],\"consentType\":\"EXPLICIT\",\"piiCategory\":[{\"piiCategoryId\":2,\"validity\":\"DATE_UNTIL:INDEFINITE\"},{\"piiCategoryId\":${cat_id},\"validity\":\"DATE_UNTIL:INDEFINITE\"}],\"primaryPurpose\":true,\"termination\":\"DATE_UNTIL:INDEFINITE\",\"thirdPartyDisclosure\":false,\"thirdPartyName\":null}]}],\"collectionMethod\":\"Sign-Up\",\"jurisdiction\":\"CA\",\"language\":\"EN\",\"policyURL\":\"https://localhost:9443/authenticationendpoint/privacy_policy.do\",\"properties\":[{\"key\":\"publicKey\",\"value\":\"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAluZFdW1ynitztkWLC6xKegbRWxky+5P0p4ShYEOkHs30QI2VCuR6Qo4Bz5rTgLBrky03W1GAVrZxuvKRGj9V9+PmjdGtau4CTXu9pLLcqnruaczoSdvBYA3lS9a7zgFU0+s6kMl2EhB+rk7gXluEep7lIOenzfl2f6IoTKa2fVgVd3YKiSGsyL4tztS70vmmX121qm0sTJdKWP4HxXyqK9neolXI9fYyHOYILVNZ69z/73OOVhkh/mvTmWZLM7GM6sApmyLX6OXUp8z0pkY+vT/9+zRxxQs7GurC4/C1nK3rI/0ySUgGEafO1atNjYmlFN+M3tZX6nEcA6g94IavyQIDAQAB\"}]}"
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while adding consents. !!"
  echo
  return -1
 fi

curl -s -k -X POST "https://localhost:9443/api/identity/consent-mgt/v1.0/consents" -H "Authorization: Basic cmF5OnJheTEyMw==" -H "accept: application/json" -H "Content-Type: application/json" -o /dev/null -d "{\"services\":[{\"service\":\"localhost\",\"serviceDisplayName\": \"Resident IDP\",\"serviceDescription\": \"Resident IDP\",\"tenantDomain\":\"carbon.super\",\"purposes\":[{\"purposeId\":${purp_id},\"purposeCategoryId\":[1],\"consentType\":\"EXPLICIT\",\"piiCategory\":[{\"piiCategoryId\":2,\"validity\":\"DATE_UNTIL:INDEFINITE\"}],\"primaryPurpose\":true,\"termination\":\"DATE_UNTIL:INDEFINITE\",\"thirdPartyDisclosure\":false,\"thirdPartyName\":null}]}],\"collectionMethod\":\"Sign-Up\",\"jurisdiction\":\"CA\",\"language\":\"EN\",\"policyURL\":\"https://localhost:9443/authenticationendpoint/privacy_policy.do\",\"properties\":[{\"key\":\"publicKey\",\"value\":\"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAluZFdW1ynitztkWLC6xKegbRWxky+5P0p4ShYEOkHs30QI2VCuR6Qo4Bz5rTgLBrky03W1GAVrZxuvKRGj9V9+PmjdGtau4CTXu9pLLcqnruaczoSdvBYA3lS9a7zgFU0+s6kMl2EhB+rk7gXluEep7lIOenzfl2f6IoTKa2fVgVd3YKiSGsyL4tztS70vmmX121qm0sTJdKWP4HxXyqK9neolXI9fYyHOYILVNZ69z/73OOVhkh/mvTmWZLM7GM6sApmyLX6OXUp8z0pkY+vT/9+zRxxQs7GurC4/C1nK3rI/0ySUgGEafO1atNjYmlFN+M3tZX6nEcA6g94IavyQIDAQAB\"}]}"
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

request_data="enable-selfsignup.xml"

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

return 0;
}

add_service_provider() {

sp_name=$1
soap_action=$2
endpoint=$3
auth=$4
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
  echo "!! Problem occurred while creating the service provider. !!"
  echo
#  delete_sp dispatch Common urn:deleteApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
#  delete_sp swift Common urn:deleteApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
#  delete_user
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
request_data="oidc-config-${sp_name}.xml"

 if [ ! -f "$request_data" ]
  then
   echo "$request_data File does not exists."
   return -1
 fi

echo "Configuring OIDC for ${sp_name}..."

# Configure OIDC for the created SPs.
curl -s -k -d @$request_data -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" -H "SOAPAction: ${soap_action}" -o /dev/null $endpoint
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while configuring OIDC web SSO for ${sp_name}.... !!"
  echo
#  delete_sp dispatch Common urn:deleteApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
#  delete_sp swift Common urn:deleteApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
#  delete_user
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
#  delete_sp dispatch Common urn:deleteApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
#  delete_sp swift Common urn:deleteApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ Y2FtZXJvbjpjYW1lcm9uMTIz
#  delete_user
  echo
  return -1
 fi

jarName=`find . -name "QSG-*.jar"  2>&1 | grep -v "Permission denied"`
jarName2=`echo "${jarName#./}"`

app_id=`java -jar ${jarName2}`

# Send the SOAP request to Update the Application.
curl -s -k -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" -H "SOAPAction: urn:updateApplication" -o /dev/null https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ -d "<soapenv:Envelope xmlns:soapenv="\"http://schemas.xmlsoap.org/soap/envelope/"\" xmlns:xsd="\"http://org.apache.axis2/xsd"\" xmlns:xsd1="\"http://model.common.application.identity.carbon.wso2.org/xsd"\">
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
            <xsd1:owner>
               <!--Optional:-->
               <xsd1:tenantDomain>carbon.super</xsd1:tenantDomain>
               <!--Optional:-->
               <xsd1:userName>admin</xsd1:userName>
               <!--Optional:-->
               <xsd1:userStoreDomain>PRIMARY</xsd1:userStoreDomain>
            </xsd1:owner>
         </xsd:serviceProvider>
      </xsd:updateApplication>
   </soapenv:Body>
</soapenv:Envelope>"
res=$?
 if test "${res}" != "0"; then
  echo "!! Problem occurred while updating application ${sp_name}.... !!"
  echo
#  delete_sp dispatch Common urn:deleteApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ YWRtaW46YWRtaW4=
#  delete_sp swift Common urn:deleteApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ YWRtaW46YWRtaW4=
#  delete_user
  echo
  return -1
 fi
echo "** Successfully updated the application ${sp_name}. **"

return 0;
}

delete_setup() {

echo "If you have finished trying out the sample web apps, you can clean the process now."
echo "Do you want to clean up the setup?"
echo
echo "Press y - YES"
echo "Press n - NO"
echo
read clean

 case ${clean} in
        [Yy]* )
        delete_sp pickup urn:deleteApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ YWRtaW46YWRtaW4=
        delete_sp pick-my-book urn:deleteApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ YWRtaW46YWRtaW4=
        delete_sp notification-center urn:deleteApplication https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ YWRtaW46YWRtaW4=
        delete_user
        delete_users
    break;;
        [Nn]* ) exit;;
        * ) echo "Please answer yes or no.";;
    esac

return 0;
}


delete_user() {

request_data1=delete-cameron.xml
request_data2=delete-role.xml

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

echo "Deleting the role named Manager..."

# Send the SOAP request to delete the role.
curl -s -k -d @$request_data2 -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteRole" -o /dev/null https://localhost:9443/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
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
curl -s -k -d @$request_data1 -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o /dev/null https://localhost:9443/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
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
curl -s -k -d @$request_data2 -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o /dev/null https://localhost:9443/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
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
curl -s -k -d @$request_data3 -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o /dev/null https://localhost:9443/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
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
curl -s -k -d @$request_data4 -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o /dev/null https://localhost:9443/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
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
curl -s -k -d @$request_data5 -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o /dev/null https://localhost:9443/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
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
curl -s -k -d @$request_data6 -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o /dev/null https://localhost:9443/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
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
curl -s -k -d @$request_data7 -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o /dev/null https://localhost:9443/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
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
curl -s -k -d @$request_data8 -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o /dev/null https://localhost:9443/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
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
curl -s -k -d @$request_data9 -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o /dev/null https://localhost:9443/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
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
curl -s -k -d @$request_data10 -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Content-Type: text/xml" -H "SOAPAction: urn:deleteUser" -o /dev/null https://localhost:9443/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap11Endpoint/
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

echo Please pick a scenario from the following.
echo "----------------------------------------------------------------"
echo "| This is the Quick Start Guide for GDPR demonstrations.        |"
echo "| =====================================================         |"
echo "| Before run this make sure your WSO2 IS and Tomcat is running  |"
echo "| in default ports WSO2 IS - localhost:9443                     |"
echo "|                  tomcat  - localhost:8080                     |"
echo "| Next, Try the below steps in order                            |"
echo "|                                                               |"
echo "|  Step 1 - Add an admin user and Configure service providers.  |"
echo "|                                                               |"
echo "|   Once you finish step 1, Try out the below scenarios         |"
echo "|     Scenario 1: Admin add consent purposes for                |"
echo "|                 self-registration                             |"
echo "|     Scenario 2: Granting consent during Self registration     |"
echo "|     Scenario 3: View consents provided via the user portal    |"
echo "|                                                               |"
echo "|                                                               |"
echo "|  Step 2 - Add multiple users with consents.                   |"
echo "|     Scenario 4: Admin user view users who has provided consent|"
echo "|                 for promotion via notification app in order to|"
echo "|                 send promotions via email or mobile           |"
echo "|                                                               |"
echo "|  Step 3 - Add TwitterIDP as federated IDP and configure       |"
echo "|           JIT provisioning                                    |"
echo "|    Scenario 5: Admin add consent purposes for JIT provisioning|"
echo "|                                                               |"
echo "| |"
echo "| |"
echo "| |"
echo "----------------------------------------------------------------"
echo "Enter the scenario number you selected."

read scenario
case $scenario in
	1)

	run_step01
	if [ "$?" -ne "0" ]; then
	  echo "Sorry, we had a problem there!"
	fi
   	break ;;

	2)
	# Check whether the wso2-is and tomcat servers exits and if they don't download and install them.
    run_step02
	if [ "$?" -ne "0" ]; then
	  echo "Sorry, we had a problem there!"
	fi
	break ;;

    *)
	echo "Sorry, that's not an option."
	;;
esac
echo
