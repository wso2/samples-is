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

# ================= Check for required dependencies ====================

if ! command -v jq >/dev/null 2>&1; then
  echo "Error: 'jq' is required but not installed. Please install jq and try again."
  exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "Error: 'curl' is required but not installed. Please install curl and try again."
  exit 1
fi

configure_sso_saml2 () {
  add_user_data admin admin

  add_service_provider dispatch Y2FtZXJvbjpDYW1lcm9uQDEyMw==
  add_service_provider manager Y2FtZXJvbjpDYW1lcm9uQDEyMw==

  configure_saml dispatch Y2FtZXJvbjpDYW1lcm9uQDEyMw==
  configure_saml manager Y2FtZXJvbjpDYW1lcm9uQDEyMw==

  configure_sp_claims dispatch Y2FtZXJvbjpDYW1lcm9uQDEyMw==
  configure_sp_claims manager Y2FtZXJvbjpDYW1lcm9uQDEyMw==

  return 0;
}

configure_sso_oidc() {
  add_user_data admin admin

  add_service_provider dispatch Y2FtZXJvbjpDYW1lcm9uQDEyMw==
  add_service_provider manager Y2FtZXJvbjpDYW1lcm9uQDEyMw==

  configure_oidc dispatch ZGlzcGF0Y2g= ZGlzcGF0Y2gxMjM0 Y2FtZXJvbjpDYW1lcm9uQDEyMw==
  configure_oidc manager c3dpZnRhcHA= ZGlzcGF0Y2gxMjM0 Y2FtZXJvbjpDYW1lcm9uQDEyMw==

  configure_sp_claims dispatch Y2FtZXJvbjpDYW1lcm9uQDEyMw==
  configure_sp_claims manager Y2FtZXJvbjpDYW1lcm9uQDEyMw==

  return 0;
}

configure_federated_auth() {
  echo
  echo "---------------------------------------------------------------------------------------------"
  echo "|                                                                                           |"
  echo "|  To configure Google as a federated authenticator you should                              |"
  echo "|                                                                                           |"
  echo "|  Register OAuth 2.0 Application in Google                                                 |"
  echo "|                                                                                           |"
  echo "|                                                                                           |"
  echo "|                        To register OAuth 2.0 application in Google                        |"
  echo "|                   *** Please press ctrl button and click on the link ***                  |"
  echo "|       https://is.docs.wso2.com/en/latest/guides/authentication/federated-login/           |"
  echo "|            and select Google under the Create a connection application section.           |"
  echo "|                      Note down the API key and secret for later use.                      |"
  echo "|                                                                                           |"
  echo "|  Continue the script when this is completed.                                              |"
  echo "|                                                                                           |"
  echo "|  Do you want to continue?                                                                 |"
  echo "|                                                                                           |"
  echo "|  Press Y - YES                                                                            |"
  echo "|  Press N - NO                                                                             |"
  echo "|                                                                                           |"
  echo "---------------------------------------------------------------------------------------------"
  echo
  read -r user
  
  case ${user} in
    [Yy]* )

    add_identity_provider admin admin

    configure_sso_saml2

    configure_google_auth dispatch Y2FtZXJvbjpDYW1lcm9uQDEyMw==
    configure_google_auth manager Y2FtZXJvbjpDYW1lcm9uQDEyMw==

    ;;
    [Nn]* ) return 1;;
    * ) echo "Please answer Y or N.";;
    esac
  
  return 0;
}

configure_self_signup (){
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
  read -r user
  echo

  case ${user} in
    1)
    enable_self_signup YWRtaW46YWRtaW4= false
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
    echo    "Press Y - YES"
    echo    "Press N - NO"
    echo
    read -r input
    case ${input} in
      [Yy]* )
      enable_self_signup YWRtaW46YWRtaW4= true
      ;;
    
      [Nn]* )
      echo "Please make the necessary configurations and restart the script."
      echo
      return 1;;
    
      * )
      echo "Please answer Y or N.";;
    esac
    ;;
    
    *)
    echo "Sorry, that's not an option."
    ;;
  esac

  # Add a service provider in wso2-is
  add_service_provider dispatch YWRtaW46YWRtaW4=
  
  # Configure OIDC for the Service Providers
  configure_oidc dispatch ZGlzcGF0Y2g= ZGlzcGF0Y2gxMjM0 YWRtaW46YWRtaW4=
  configure_sp_claims dispatch YWRtaW46YWRtaW4=

  echo
  echo "---------------------------------------------------------------------------------"
  echo "|                                                                               |"
  echo "|  To tryout self registration please log into the sample                       |"
  echo "|  app below.                                                                   |"
  echo "|  *** Please press ctrl button and click on the link ***                       |"
  echo "|                                                                               |"
  echo "|  pickup-dispatch - http://${SERVER_DOMAIN}:${SERVER_PORT}/pickup-dispatch/      |"
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
  echo "Press Y - YES"
  echo "Press N - NO"
  echo
  read -r clean

  case ${clean} in
    [Yy]* )
      delete_sp dispatch YWRtaW46YWRtaW4=
      ;;
    [Nn]* ) exit;;
    * ) echo "Please answer Y or N.";;
  esac

  return 0;
}

enable_self_signup() {
  auth=$1
  lock_on_creation=$2
  
  self_registration_payload=$(jq -n \
    --arg entityId "${IS_DOMAIN}" \
    --arg destination "https://${IS_DOMAIN}:${IS_PORT}/samlsso" \
    --arg lockOnCreation "$lock_on_creation" \
    '{
      operation: "UPDATE",
      properties: [
        { name: "SelfRegistration.Enable", value: "true" },
        { name: "SelfRegistration.LockOnCreation", value: $lockOnCreation },
        { name: "SelfRegistration.Notification.InternallyManage", value: "true" },
        { name: "SelfRegistration.NotifyAccountConfirmation", value: "false" },
        { name: "SelfRegistration.SendConfirmationOnCreation", value: "false" },
        { name: "SelfRegistration.ReCaptcha", value: "false" },
        { name: "SelfRegistration.VerificationCode.ExpiryTime", value: "1440" }
      ]
    }')
  
  curl -s -k -X PATCH "https://${IS_DOMAIN}:${IS_PORT}/api/server/v1/identity-governance/VXNlciBPbmJvYXJkaW5n/connectors/c2VsZi1zaWduLXVw" \
    -H "Authorization: Basic ${auth}" \
    -H "Content-Type: application/json" \
    -d "$self_registration_payload"
  
  echo "** Self registration is successfully enabled. **"
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
  echo "|        http://${SERVER_DOMAIN}:${SERVER_PORT}/${dispatch_url}/                        |"
  echo "|    pick-manager -                                                                   |"
  echo "|        http://${SERVER_DOMAIN}:${SERVER_PORT}/${manager_url}/                         |"
  echo "|                                                                                     |"
  echo "|    Please use one of the following user credentials to log in.                      |"
  echo "|                                                                                     |"
  echo "|    Junior Manager                                                                   |"
  echo "|      Username: alex                                                                 |"
  echo "|      Password: Alex@123                                                              |"
  echo "|                                                                                     |"
  echo "|    Senior Manager                                                                   |"
  echo "|      Username: cameron                                                              |"
  echo "|      Password: Cameron@123                                                           |"
  echo "---------------------------------------------------------------------------------------"
  echo
  echo "If you have finished trying out the sample web apps, you can clean the process now."
  echo "Do you want to clean up the setup?"
  echo
  echo "Press Y - YES"
  echo "Press N - NO"
  echo
  read -r clean
  
  case ${clean} in
    [Yy]* )
      delete_sp dispatch Y2FtZXJvbjpDYW1lcm9uQDEyMw==
      delete_sp manager Y2FtZXJvbjpDYW1lcm9uQDEyMw==
      delete_user_data
      ;;
    [Nn]* ) exit;;
    * ) echo "Please answer Y or N.";;
  esac
  return 0;
}

create_multifactor_auth() {
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
  echo "|                                                                                   |"
  echo "|  and the below config to the <IS_HOME>/repository/conf/deployment.toml            |"
  echo "|  [[resource.access_control]]                                                      |"
  echo "|  context = \"\(.*\)/sample-auth/\(.*\)\"                                            |"
  echo "|  secure = false                                                                   |"
  echo "|  http_method = \"all\"                                                              |"
  echo "|                                                                                   |"
  echo "|  to continue the script.                                                          |"
  echo "|  Restart the IS server when done.                                                 |"
  echo "|                                                                                   |"
  echo "|  Do you want to continue?                                                         |"
  echo "|                                                                                   |"
  echo "|  Press Y - YES                                                                    |"
  echo "|  Press N - NO                                                                     |"
  echo "|                                                                                   |"
  echo "-------------------------------------------------------------------------------------"
  echo
  read -r user
  
  case ${user} in
    [Yy]* )
      configure_sso_saml2
      configure_multi_auth dispatch Y2FtZXJvbjpDYW1lcm9uQDEyMw==
      configure_multi_auth manager Y2FtZXJvbjpDYW1lcm9uQDEyMw==
      ;;
    [Nn]* ) return 1;;
    * ) echo "Please answer Y or N.";;
  esac
  
  return 0;
}

configure_multi_auth() {
  sp_name=$1
  auth=$2

  app_id=$(curl -s -k -X GET "https://${IS_DOMAIN}:${IS_PORT}/api/server/v1/applications?filter=name+eq+${sp_name}" \
    -H "Authorization: Basic ${auth}" \
    -H "Accept: application/json" | jq -r '.applications | if length > 0 then .[0].id else "" end')

  if [ -z "$app_id" ] || [ "$app_id" = "null" ]; then
    echo "!! Problem occurred while getting application details for ${sp_name}.... !!"
    return 1
  fi

  update_payload=$(jq -n '
  {
    "claimConfiguration": { "dialect": "LOCAL", "subject": { "mappedLocalSubjectMandatory": false } },
    "provisioningConfigurations": {
      "inboundProvisioning": { "proxyMode": false, "provisioningUserstoreDomain": "PRIMARY" }
    },
    "authenticationSequence": {
      "type": "USER_DEFINED",
      "steps": [
        { "id": 1, "options": [ { "authenticator": "BasicAuthenticator", "idp": "LOCAL" } ] },
        { "id": 2, "options": [ { "authenticator": "DemoHardwareKeyAuthenticator", "idp": "LOCAL" } ] }
      ]
    },
    "advancedConfigurations": { "saas": false, "enableAuthorization": false }
  }')

  curl -s -k -X PATCH "https://${IS_DOMAIN}:${IS_PORT}/api/server/v1/applications/${app_id}" \
    -H "Authorization: Basic ${auth}" \
    -H "Content-Type: application/json" \
    -d "$update_payload" > /dev/null

  saml_payload=$(jq -n --arg issuer "saml2-web-app-pickup-${sp_name}.com" \
    --arg acs_url "http://${SERVER_DOMAIN}:${SERVER_PORT}/saml2-web-app-pickup-${sp_name}.com/home.jsp" \
    '{
      "manualConfiguration": {
        "issuer": $issuer,
        "assertionConsumerUrls": [$acs_url],
        "defaultAssertionConsumerUrl": $acs_url,
        "responseSigning": { "enabled": true, "signingAlgorithm": "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256" },
        "singleLogoutProfile": { "enabled": true, "logoutMethod": "BACKCHANNEL" }
      }
    }')

  curl -s -k -X PUT "https://${IS_DOMAIN}:${IS_PORT}/api/server/v1/applications/${app_id}/inbound-protocols/saml" \
    -H "Authorization: Basic ${auth}" \
    -H "Content-Type: application/json" \
    -d "$saml_payload" > /dev/null

  return 0;
}

getProperty() {
   PROP_KEY=$1
   PROP_VALUE=$(grep -E "^$PROP_KEY=" "$PROPERTY_FILE" | cut -d'=' -f2-)
   echo "$PROP_VALUE"
}

add_user_data() {
  IS_name=$1
  IS_pass=$2

  create_user() {
    username=$1
    givenName=$2
    familyName=$3
    email=$4
    password=$5

    echo "Creating user $username..."

    payload=$(jq -n \
      --arg given "$givenName" \
      --arg family "$familyName" \
      --arg user "$username" \
      --arg pass "$password" \
      --arg mail "$email" \
      '{
        "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
        "name": { "givenName": $given, "familyName": $family },
        "userName": $user,
        "password": $pass,
        "emails": [$mail],
        "addresses": [ { "type": "home", "locality": "Toronto" } ]
      }')

    curl -s -k --user "${IS_name}:${IS_pass}" \
      -H "Content-Type:application/json" -d "$payload" \
      "https://${IS_DOMAIN}:${IS_PORT}/scim2/Users" > /dev/null

    if [ $? -ne 0 ]; then
      echo "!! Problem occurred while creating user $username. !!"
      return 1
    fi
    echo "** The user $username was successfully created. **"
    echo
    return 0;
  }

  create_user "cameron" "Cameron" "Smith" "cameron@gmail.com" "Cameron@123" || return 1
  create_user "alex" "Alex" "Miller" "alex@gmail.com" "Alex@123" || {
    delete_user_data
    return 1
  }

  echo "Creating a role named Manager..."

  user_id_cameron=$(curl -s -k -X GET "https://${IS_DOMAIN}:${IS_PORT}/scim2/Users?filter=userName%20eq%20%22cameron%22" \
    -H "Authorization: Basic YWRtaW46YWRtaW4=" \
    -H "Accept: application/json" | jq -r '.Resources | if length > 0 then .[0].id else "" end')

  if [ -z "$user_id_cameron" ] || [ "$user_id_cameron" = "null" ]; then
    echo "!! Failed to retrieve user ID for cameron. !!"
    return 1
  fi

  role_payload=$(jq -n \
    --arg userId "$user_id_cameron" \
    '{
      "displayName": "Manager",
      "schemas": ["urn:ietf:params:scim:schemas:extension:enterprise:2.0:Role"],
      "audience": {
        "value": "10084a8d-113f-4211-a0d5-efe36b082211",
        "type": "organization"
      },
      "users": [ { "value": $userId } ],
      "permissions": [
        { "value": "internal_application_mgt_create", "display": "Application Create" },
        { "value": "internal_application_mgt_view", "display": "Application View" },
        { "value": "internal_application_mgt_delete", "display": "Application Delete" },
        { "value": "internal_application_mgt_update", "display": "Application Update" }
      ]
    }')

  response=$(curl -s -k -X POST "https://${IS_DOMAIN}:${IS_PORT}/scim2/v2/Roles" \
    -H "Authorization: Basic YWRtaW46YWRtaW4=" \
    -H "Content-Type: application/scim+json" \
    -d "$role_payload")

  role_id=$(echo "$response" | jq -r '.id')

  if [ -z "$role_id" ] || [ "$role_id" = "null" ]; then
    echo "!! Problem occurred while creating role Manager. !!"
    return 1
  fi

  echo "** The role Manager was successfully created. **"
  echo "Role ID: $role_id"
  echo
  return 0;
}

add_service_provider() {
  sp_name=$1
  auth=$2

  echo "Creating Service Provider $sp_name..."

  sp_payload=$(jq -n --arg name "$sp_name" '{
    name: $name,
    description: "A Quick Start Guide"
  }')

  curl -s -k -X POST "https://${IS_DOMAIN}:${IS_PORT}/api/server/v1/applications" \
    -H "Authorization: Basic ${auth}" \
    -H "Content-Type: application/json" \
    --data-raw "$sp_payload"

  app_id=$(curl -s -k -X GET "https://${IS_DOMAIN}:${IS_PORT}/api/server/v1/applications?filter=name+eq+${sp_name}" \
    -H "Authorization: Basic ${auth}" \
    -H "Accept: application/json" | jq -r '.applications | if length > 0 then .[0].id else "" end')

  if [ -n "$app_id" ] && [ "$app_id" != "null" ]; then
    echo "** Application ID: $app_id **"
  else
    echo "!! Problem occurred: Unable to fetch Application ID for $sp_name. !!"
    return 1
  fi

  echo
  return 0
}

delete_user_data() {
  echo
  echo "Deleting the user named cameron..."
  
  user_id_cameron=$(curl -s -k -X GET "https://${IS_DOMAIN}:${IS_PORT}/scim2/Users?filter=userName%20eq%20%22cameron%22" \
    -H "Authorization: Basic YWRtaW46YWRtaW4=" \
    -H "Accept: application/json" | jq -r '.Resources | if length > 0 then .[0].id else "" end')
  
  if [ -z "$user_id_cameron" ] || [ "$user_id_cameron" = "null" ]; then
    echo "!! User cameron not found. !!"
  else
    curl -s -k -X DELETE "https://${IS_DOMAIN}:${IS_PORT}/scim2/Users/${user_id_cameron}" \
      -H "Authorization: Basic YWRtaW46YWRtaW4=" \
      -H "Content-Type: application/json"
    echo "** The user cameron was successfully deleted. **"
    echo
  fi
  
  echo "Deleting the user named alex..."
  
  user_id_alex=$(curl -s -k -X GET "https://${IS_DOMAIN}:${IS_PORT}/scim2/Users?filter=userName%20eq%20%22alex%22" \
    -H "Authorization: Basic YWRtaW46YWRtaW4=" \
    -H "Accept: application/json" | jq -r '.Resources | if length > 0 then .[0].id else "" end')
  
  if [ -z "$user_id_alex" ] || [ "$user_id_alex" = "null" ]; then
    echo "!! User alex not found. !!"
  else
    curl -s -k -X DELETE "https://${IS_DOMAIN}:${IS_PORT}/scim2/Users/${user_id_alex}" \
      -H "Authorization: Basic YWRtaW46YWRtaW4=" \
      -H "Content-Type: application/json"
    echo "** The user alex was successfully deleted. **"
    echo
  fi
  
  echo "Deleting the role named Manager..."
  
  role_id=$(curl -s -k -X GET "https://${IS_DOMAIN}:${IS_PORT}/scim2/v2/Roles?filter=displayName%20eq%20%22Manager%22" \
    -H "Authorization: Basic YWRtaW46YWRtaW4=" \
    -H "Accept: application/json" | jq -r '.Resources | if length > 0 then .[0].id else "" end')
  
  if [ -z "$role_id" ] || [ "$role_id" = "null" ]; then
    echo "!! Role Manager not found. !!"
    return 0
  fi
  
  response=$(curl -s -k -X DELETE "https://${IS_DOMAIN}:${IS_PORT}/scim2/v2/Roles/${role_id}" \
    -H "Authorization: Basic YWRtaW46YWRtaW4=" \
    -H "Content-Type: application/json")
  
  if [ -z "$response" ]; then
    echo "** The role Manager was successfully deleted. **"
    echo
  else
    echo "!! Problem occurred while deleting role Manager. !!"
    return 1
  fi
  
  return 0;
}

delete_sp() {
  sp_name=$1
  auth=$2
  
  app_id=$(curl -s -k -X GET "https://${IS_DOMAIN}:${IS_PORT}/api/server/v1/applications?filter=name+eq+${sp_name}" \
    -H "Authorization: Basic ${auth}" \
    -H "Accept: application/json" | jq -r '.applications | if length > 0 then .[0].id else "" end')
  
  if [ -z "$app_id" ] || [ "$app_id" = "null" ]; then
    echo "!! Service Provider $sp_name not found. !!"
    return 0
  fi
  
  echo
  echo "Deleting Service Provider $sp_name..."
  
  response=$(curl -s -k -X DELETE "https://${IS_DOMAIN}:${IS_PORT}/api/server/v1/applications/${app_id}" \
    -H "Authorization: Basic ${auth}" \
    -H "Content-Type: application/json")
  if [ -z "$response" ]; then
    echo "** The Service Provider $sp_name was successfully deleted. **"
  else
    echo "!! Problem occurred while deleting Service Provider $sp_name. !!"
    echo "Response: $response"
    return 1
  fi
  
  return 0;
}

delete_idp() {
  IS_name=$1
  IS_pass=$2
  idp_name=$3

  auth=$(echo "${IS_name}:${IS_pass}" | base64)
  idp_id=$(curl -s -k -X GET "https://${IS_DOMAIN}:${IS_PORT}/api/server/v1/identity-providers?filter=name+eq+$idp_name" \
    -H "Authorization: Basic ${auth}" \
    -H "Accept: application/json" | jq -r '.identityProviders[0].id')

  if [ -z "$idp_id" ] || [ "$idp_id" = "null" ]; then
    echo "Identity Provider '${idp_name}' not found."
    return 1
  fi

  echo "Deleting Identity Provider ${idp_name}..."

  curl -s -k -X DELETE "https://${IS_DOMAIN}:${IS_PORT}/api/server/v1/identity-providers/${idp_id}" \
    -H "Authorization: Basic ${auth}" \
    -H "Accept: application/json" > /dev/null

  echo "** Identity Provider IDP-google successfully deleted. **"
  return 0;
}

configure_saml() {
  sp_name=$1
  auth=$2

  app_id=$(curl -s -k -X GET "https://${IS_DOMAIN}:${IS_PORT}/api/server/v1/applications?filter=name+eq+${sp_name}" \
    -H "Authorization: Basic ${auth}" \
    -H "Accept: application/json" | jq -r '.applications | if length > 0 then .[0].id else "" end')

  if [ -z "$app_id" ] || [ "$app_id" = "null" ]; then
    echo "!! Service Provider ${sp_name} not found. !!"
    return 1
  fi

  saml_payload=$(jq -n --arg issuer "saml2-web-app-pickup-${sp_name}.com" \
    --arg acs_url "http://${SERVER_DOMAIN}:${SERVER_PORT}/saml2-web-app-pickup-${sp_name}.com/home.jsp" \
    '{
      "manualConfiguration": {
        "issuer": $issuer,
        "assertionConsumerUrls": [$acs_url],
        "attributeProfile": {
          "enabled": true,
          "alwaysIncludeAttributesInResponse": true,
          "nameFormat": "urn:oasis:names:tc:SAML:2.0:attrname-format:basic"
        },
        "defaultAssertionConsumerUrl": $acs_url,
        "enableAssertionQueryProfile": false,
        "requestValidation": { "enableSignatureValidation": false },
        "responseSigning": { "enabled": true, "signingAlgorithm": "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256" },
        "singleLogoutProfile": {
          "enabled": true,
          "idpInitiatedSingleLogout": { "enabled": true, "returnToUrls": [$acs_url] },
          "logoutMethod": "BACKCHANNEL",
          "logoutRequestUrl": "",
          "logoutResponseUrl": ""
        },
        "singleSignOnProfile": {
          "assertion": {
            "audiences": [],
            "digestAlgorithm": "http://www.w3.org/2001/04/xmlenc#sha256",
            "encryption": {
              "assertionEncryptionAlgorithm": "http://www.w3.org/2001/04/xmlenc#aes256-cbc",
              "enabled": false,
              "keyEncryptionAlgorithm": "http://www.w3.org/2001/04/xmlenc#rsa-oaep-mgf1p"
            },
            "nameIdFormat": "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified",
            "recipients": []
          },
          "bindings": [ "HTTP_POST", "HTTP_REDIRECT" ],
          "enableIdpInitiatedSingleSignOn": false,
          "enableSignatureValidationForArtifactBinding": false
        }
      }
    }')

  curl -s -k -X PUT "https://${IS_DOMAIN}:${IS_PORT}/api/server/v1/applications/${app_id}/inbound-protocols/saml" \
    -H "Authorization: Basic ${auth}" \
    -H "Content-Type: application/json" \
    -d "$saml_payload" > /dev/null

  return 0
}

configure_oidc() {
  sp_name=$1
  client_id=$2
  client_secret=$3
  auth=$4

  app_id=$(curl -s -k -X GET "https://${IS_DOMAIN}:${IS_PORT}/api/server/v1/applications?filter=name+eq+${sp_name}" \
    -H "Authorization: Basic ${auth}" \
    -H "Accept: application/json" | jq -r '.applications | if length > 0 then .[0].id else "" end')

  if [ -z "$app_id" ] || [ "$app_id" = "null" ]; then
    echo "!! Service Provider ${sp_name} not found. !!"
    return 1
  fi

  oidc_payload=$(jq -n --arg client_id "${client_id}" \
    --arg client_secret "${client_secret}" \
    --arg callback_url "http://${SERVER_DOMAIN}:${SERVER_PORT}/pickup-${sp_name}/oauth2client" \
    --argjson grant_types '["refresh_token", "implicit", "password", "client_credentials", "authorization_code"]' \
    '{
      "clientId": $client_id,
      "clientSecret": $client_secret,
      "callbackURLs": [$callback_url],
      "grantTypes": $grant_types,
      "allowedOrigins": [],
      "logout": {
        "backChannelLogoutUrl": $callback_url
      },
    }')

  curl -s -k -X PUT "https://${IS_DOMAIN}:${IS_PORT}/api/server/v1/applications/${app_id}/inbound-protocols/oidc" \
    -H "Authorization: Basic ${auth}" \
    -H "Content-Type: application/json" \
    -d "$oidc_payload"

  return 0
}

configure_google_auth() {
  sp_name=$1
  auth=$2

  app_id=$(curl -s -k -X GET "https://${IS_DOMAIN}:${IS_PORT}/api/server/v1/applications?filter=name+eq+${sp_name}" \
    -H "Authorization: Basic ${auth}" \
    -H "Accept: application/json" | jq -r '.applications | if length > 0 then .[0].id else "" end')

  if [ -z "$app_id" ] || [ "$app_id" = "null" ]; then
    echo "!! Problem occurred while getting application details for ${sp_name}.... !!"
    return 1
  fi

  update_payload=$(jq -n '
  {
    "authenticationSequence": {
      "type": "USER_DEFINED",
      "steps": [ { "id": 1, "options": [ { "authenticator": "GoogleOIDCAuthenticator", "idp": "IDP-google" } ] } ]
    }
  }')

  curl -s -k -X PATCH "https://${IS_DOMAIN}:${IS_PORT}/api/server/v1/applications/${app_id}" \
    -H "Authorization: Basic ${auth}" \
    -H "Content-Type: application/json" \
    -d "$update_payload" > /dev/null

  saml_payload=$(jq -n --arg issuer "saml2-web-app-pickup-${sp_name}.com" \
    --arg acs_url "http://${SERVER_DOMAIN}:${SERVER_PORT}/saml2-web-app-pickup-${sp_name}.com/home.jsp" \
    '{
      "manualConfiguration": {
        "issuer": $issuer,
        "assertionConsumerUrls": [$acs_url],
        "defaultAssertionConsumerUrl": $acs_url,
        "responseSigning": { "enabled": true, "signingAlgorithm": "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256" },
        "singleLogoutProfile": { "enabled": true, "logoutMethod": "BACKCHANNEL" }
      }
    }')

  curl -s -k -X PUT "https://${IS_DOMAIN}:${IS_PORT}/api/server/v1/applications/${app_id}/inbound-protocols/saml" \
    -H "Authorization: Basic ${auth}" \
    -H "Content-Type: application/json" \
    -d "$saml_payload" > /dev/null

  return 0;
}

configure_sp_claims() {
  sp_name=$1
  auth=$2

  app_id=$(curl -s -k -X GET "https://${IS_DOMAIN}:${IS_PORT}/api/server/v1/applications?filter=name+eq+${sp_name}" \
    -H "Authorization: Basic ${auth}" \
    -H "Accept: application/json" | jq -r '.applications | if length > 0 then .[0].id else "" end')

  if [ -z "$app_id" ] || [ "$app_id" = "null" ]; then
    echo "!! Service Provider ${sp_name} not found. !!"
    return 1
  fi

  claim_payload=$(jq -n '{
    "claimConfiguration": {
      "dialect": "LOCAL",
      "claimMappings": [
        {
          "localClaim": { "uri": "http://wso2.org/claims/givenname" }, 
          "applicationClaim": "http://wso2.org/claims/givenname"
        },
        {
          "localClaim": { "uri": "http://wso2.org/claims/lastname" },
          "applicationClaim": "http://wso2.org/claims/lastname"
        },
        {
          "localClaim": { "uri": "http://wso2.org/claims/emailaddress" },
          "applicationClaim": "http://wso2.org/claims/emailaddress"
        }
      ],
      "requestedClaims": [
        { "claim": { "uri": "http://wso2.org/claims/givenname" }, "mandatory": true },
        { "claim": { "uri": "http://wso2.org/claims/lastname" }, "mandatory": true },
        { "claim": { "uri": "http://wso2.org/claims/emailaddress" }, "mandatory": true }
      ]
    },
    "advancedConfigurations": { "skipLoginConsent": true, "skipLogoutConsent": true, }
  }')

  curl -s -k -X PATCH "https://${IS_DOMAIN}:${IS_PORT}/api/server/v1/applications/${app_id}" \
    -H "Authorization: Basic ${auth}" \
    -H "Content-Type: application/json" \
    --data-raw "$claim_payload"

  return 0
}

add_identity_provider() {
  IS_name=$1
  IS_pass=$2

  echo
  echo "Please enter your CLIENT_ID"
  echo "(This can be found in the Google API Credentials section)"
  echo
  read -r key
  echo
  echo "Please enter your CLIENT_SECRET"
  echo "(This can be found in the Google API Credentials section)"
  echo
  read -r secret
  echo

  idp_name="IDP-google"
  callback_url="https://${IS_DOMAIN}:${IS_PORT}/commonauth"

  echo "Creating Identity Provider..."
  idp_payload=$(jq -n \
    --arg name "$idp_name" \
    --arg client_id "$key" \
    --arg client_secret "$secret" \
    --arg callback_url "$callback_url" \
    '{
      name: $name,
      alias: "",
      image: "assets/images/logos/google.svg",
      templateId: "google-idp",
      federatedAuthenticators: {
        defaultAuthenticatorId: "R29vZ2xlT0lEQ0F1dGhlbnRpY2F0b3I",
        authenticators: [
          {
            authenticatorId: "R29vZ2xlT0lEQ0F1dGhlbnRpY2F0b3I",
            isEnabled: true,
            properties: [
              { key: "ClientId", value: $client_id },
              { key: "ClientSecret", value: $client_secret },
              { key: "callbackUrl", value: $callback_url },
              { key: "AdditionalQueryParameters", value: "scope=email openid profile"}
            ]
          }
        ]
      },
      claims: {
        provisioningClaims: [],
        roleClaim: { uri: "http://wso2.org/claims/role" },
        userIdClaim: {
          id: "aHR0cDovL3dzbzIub3JnL2NsYWltcy91c2VybmFtZQ",
          uri: "http://wso2.org/claims/username",
          displayName: "Username"
        }
      }
    }')

  auth=$(echo "${IS_name}:${IS_pass}" | base64)
  curl -s -k -X POST "https://${IS_DOMAIN}:${IS_PORT}/api/server/v1/identity-providers" \
    -H "Authorization: Basic ${auth}" \
    -H "Content-Type: application/json" \
    -d "$idp_payload" > /dev/null

  echo "** The identity provider was successfully created. **"
  echo

  return 0;
}

start_the_flow() {
  echo "Please pick a scenario from the following:"
  echo "-----------------------------------------------------------------------------"
  echo "|  Scenario 1 - Configuring Single-Sign-On with SAML2                       |"
  echo "|  Scenario 2 - Configuring Single-Sign-On with OIDC                        |"
  echo "|  Scenario 3 - Configuring Multi-Factor Authentication                     |"
  echo "|  Scenario 4 - Configuring Google as a Federated Authenticator             |"
  echo "|  Scenario 5 - Configuring Self-Signup                                     |"
  echo "-----------------------------------------------------------------------------"
  echo "Enter the scenario number (1-5): \c"
  
  # Reading the scenarios available.
  read -r scenario
  echo
  case $scenario in
    1)
    configure_sso_saml2
    end_message saml2-web-app-pickup-dispatch.com saml2-web-app-pickup-manager.com
    if [ "$?" -ne "0" ]; then
      echo "Sorry, we had a problem there!"
    fi
    ;;
  
    2)
    configure_sso_oidc
    end_message pickup-dispatch pickup-manager
    if [ "$?" -ne "0" ]; then
      echo "Sorry, we had a problem there!"
    fi
    ;;
  
    3)
    create_multifactor_auth
    end_message saml2-web-app-pickup-dispatch.com saml2-web-app-pickup-manager.com
    ;;
  
    4)
    configure_federated_auth
    end_message saml2-web-app-pickup-dispatch.com saml2-web-app-pickup-manager.com
    delete_idp admin admin IDP-google
    if [ "$?" -ne "0" ]; then
      echo "Sorry, we had a problem there!"
    fi
    ;;
  
    5)
    configure_self_signup
    ;;
  
    *)
    echo "Invalid selection. Please enter a number between 1 and 5."
    ;;
  esac
  echo
}

#=================The start of the script:============================================
BASE_DIR="$(cd "$(dirname "$0")" || exit 1; pwd)";
CONF_DIR=${BASE_DIR}/../conf
PROPERTY_FILE=${CONF_DIR}/server.properties

echo
echo "Before running samples, please ensure:"
echo "  * 'server.properties' is correctly configured."
echo "  * WSO2 IS and the sample applications are running."
echo

echo "Continue? (Y/N): \c"
read -r continueState
echo

case $continueState in
  [Yy]*)
  
    echo "Reading server paths from $PROPERTY_FILE"
    IS_DOMAIN=$(getProperty "wso2is.host.domain")
    #echo ${IS_DOMAIN}
  
    if [ -z "${IS_DOMAIN}" ]
    then
      echo "IS host domain is not configured. Please configure that and Try again"
      return 1
    fi
  
    IS_PORT=$(getProperty "wso2is.host.port")
    #echo "is port ${IS_PORT}"
  
    if [ -z "${IS_PORT}" ]
    then
      echo "IS host port is not configured. Please configure that and Try again"
      return 1
    fi
  
    SERVER_DOMAIN=$(getProperty "server.host.domain")
    #echo "server port ${SERVER_DOMAIN}"
  
    if [ -z "${SERVER_DOMAIN}" ]
    then
      echo "Server host domain is not configured. Please configure that and Try again"
      return 1
    fi
  
    SERVER_PORT=$(getProperty "server.host.port")
    #echo "Server port ${SERVER_PORT}"
    if [ -z "${SERVER_PORT}" ]
    then
      echo "Server host port is not configured. Please configure that and Try again"
      return 1
    fi
    start_the_flow
    ;;
  
  [Nn]*)
    echo "Please start server and restart the script."
    exit;;
  *)
    echo "Please answer Y or N."
    ;;
esac
