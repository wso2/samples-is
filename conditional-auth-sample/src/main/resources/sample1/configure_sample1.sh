#!/bin/bash

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


configure_sample_1() {
    echo
    echo "-------------------------------------------------------------------"
    echo "|                                                                 |"
    echo "|  We are configuring Google as the federated identity provider.  |"
    echo "|  Therefore, you have to register an OAuth 2.0 Application in    |"
    echo "|  Google API Console.                                            |"
    echo "|                                                                 |"
    echo "|  https://docs.wso2.com/display/IS560/Configuring+Google         |"
    echo "|                                                                 |"
    echo "|  So please make sure you have registered an application before  |"
    echo "|  continuing the script.                                         |"
    echo "|                                                                 |"
    echo "|  Do you want to continue?                                       |"
    echo "|                                                                 |"
    echo "|  Press y - YES                                                  |"
    echo "|  Press n - EXIT                                                 |"
    echo "|                                                                 |"
    echo "-------------------------------------------------------------------"
    echo
    read -r continue

    case ${continue} in
        [Yy]* )
            create_google_idp "GoogleIDP" "GoogleIDP" "${COMMON_HOME}/configs/create-google-idp.xml" admin admin
            configure_service_provider_for_samlsso dispatch saml2-web-app-dispatch.com http://localhost:8080/saml2-web-app-dispatch.com/consumer admin admin "${COMMON_HOME}/configs/sso-config.xml"
            configure_service_provider_for_samlsso swift saml2-web-app-swift.com http://localhost:8080/saml2-web-app-swift.com/consumer admin admin "${COMMON_HOME}/configs/sso-config.xml"
            configure_service_provider dispatch admin admin "${COMMON_HOME}/configs/get-sp.xml" "${SAMPLE_HOME}/configs/update-sp.xml"
            configure_service_provider swift admin admin "${COMMON_HOME}/configs/get-sp.xml" "${SAMPLE_HOME}/configs/update-sp.xml"
            display_sample_info
        ;;
        [Nn]* )
            exit 1
        ;;
    esac

    return 0;
}

display_sample_info() {
    echo
    echo "----------------------------------------------------------------------"
    echo "|                                                                    |"
    echo "|    The conditional authentication enables you to add more          |"
    echo "|    control and constraints to the authentication process.          |"
    echo "|                                                                    |"
    echo "|    Here we are going to try out a conditional authentication       |"
    echo "|    scenario where users will be prompted to be authenticated       |"
    echo "|    with external identity providers based on the tenant they are   |"
    echo "|    from                                                            |"
    echo "|                                                                    |"
    echo "|    Use case: The users from \"drivers.pickup.com\" are prompted    |"
    echo "|    to authenticate with federated authentication(Google),          |"
    echo "|    where users from \"management.pickup.com\" is only required     |"
    echo "|    to be authenticated via basic authentication.                   |"
    echo "|                                                                    |"
    echo "|    To tryout conditional authentication please log into            |"
    echo "|    the sample applications below.                                  |"
    echo "|                                                                    |"
    echo "|    Dispatch - http://localhost:8080/saml2-web-app-dispatch.com/    |"
    echo "|    Swift - http://localhost:8080/saml2-web-app-swift.com/          |"
    echo "|                                                                    |"
    echo "|    Users in \"management.pickup.com\" tenant                       |"
    echo "|      Username: cameron@management.pickup.com                       |"
    echo "|      Password: cameron123                                          |"
    echo "|                                                                    |"
    echo "|      Username: john@management.pickup.com                          |"
    echo "|      Password: john123                                             |"
    echo "|                                                                    |"
    echo "|    Users in \"drivers.pickup.com\" tenant                          |"
    echo "|      Username: alex@drivers.pickup.com                             |"
    echo "|      Password: alex123                                             |"
    echo "|                                                                    |"
    echo "|      Username: tiger@drivers.pickup.com                            |"
    echo "|      Password: tiger123                                            |"
    echo "|                                                                    |"
    echo "|      Username: garrett@drivers.pickup.com                          |"
    echo "|      Password: garrett123                                          |"
    echo "|                                                                    |"
    echo "----------------------------------------------------------------------"
    echo
    echo "If you have finished trying out the sample, you can clean the generated artifacts now."
    echo "Do you want to clean up the setup?"
    echo
    echo "Press y - YES"
    echo "Press n - NO"
    echo

    read -r clean

    case ${clean} in
        [Yy]* )
            cleanup_sample;;
        [Nn]* )
            exit;;
        * ) echo "Please answer yes or no.";;
    esac
}

cleanup_sample() {
    echo
    echo "Removing service providers"
    delete_sp admin admin dispatch "${COMMON_HOME}/cleanup/delete-sp.xml"
    delete_sp admin admin swift "${COMMON_HOME}/cleanup/delete-sp.xml"

    echo
    echo "Removing IDPs"
    delete_idp admin admin GoogleIDP "${COMMON_HOME}/cleanup/delete-idp.xml"

    echo
    echo "Removing users"
    delete_user alex@drivers.pickup.com alex123 tiger "${COMMON_HOME}/cleanup/delete-user.xml"
    delete_user alex@drivers.pickup.com alex123 garrett "${COMMON_HOME}/cleanup/delete-user.xml"
    delete_user cameron@management.pickup.com cameron123 john "${COMMON_HOME}/cleanup/delete-user.xml"

    echo
    echo "Deactivating tenants"
    deactivate_tenant admin admin management.pickup.com "${SAMPLE_HOME}/cleanup/deactivate-tenant.xml"
    deactivate_tenant admin admin drivers.pickup.com "${SAMPLE_HOME}/cleanup/deactivate-tenant.xml"

    echo
    echo "Cleaning up created temporary files"

    if [ -d "${SAMPLE_HOME}/tmp" ]
        then
            rm -r "${SAMPLE_HOME}/tmp"
    fi

    if [ -d "${COMMON_HOME}/tmp" ]
        then
            rm -r "${COMMON_HOME}/tmp"
    fi

    echo
    echo "Resources cleaning finished"

    return 0;
}

configure_service_provider() {
    sp_name=$1
    username=$2
    password=$3
    config_file1=$4
    config_file2=$5

    auth=$(echo "${username}:${password}"|base64)

    if [ ! -d "tmp" ]
        then
            mkdir tmp
    fi

    if [ -f tmp/response_unformatted.xml ]
        then
            rm tmp/response_unformatted.xml
    fi

    if [ ! -f "${config_file1}" ]
        then
            echo "${config_file1} File does not exists."
            return 255
    fi

    if [ -f tmp/get-sp-"${sp_name}".xml ]
        then
            rm tmp/get-sp-"${sp_name}".xml
    fi

    cp ${config_file1} tmp/get-sp-"${sp_name}".xml

    sed -i 's/${SP_NAME}/'${sp_name}'/g' tmp/get-sp-"${sp_name}".xml

    touch tmp/response_unformatted.xml
    curl -s -k -d @tmp/get-sp-"${sp_name}".xml -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" \
    -H "SOAPAction: urn:getApplication" \
    https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/ > tmp/response_unformatted.xml
    res=$?
    if test "${res}" != "0";
        then
            echo "!! Problem occurred while getting application details for ${sp_name}.... !!"
            echo "${res}"
            return 255
    fi

    xmllint --format tmp/response_unformatted.xml
    app_id=$(xmllint --xpath "//*[local-name()='applicationID']/text()" tmp/response_unformatted.xml)
    rm tmp/response_unformatted.xml

    if [ ! -f "${config_file2}" ]
        then
            echo "${config_file2} File does not exists."
            return 255
    fi

    cp ${config_file2} tmp/update-sp-"${sp_name}".xml

    sed -i 's/${SP_NAME}/'${sp_name}'/g' tmp/update-sp-"${sp_name}".xml
    sed -i 's/${APP_ID}/'${app_id}'/g' tmp/update-sp-"${sp_name}".xml


    curl -s -k -d @tmp/update-sp-"${sp_name}".xml -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" \
    -H "SOAPAction: urn:updateApplication" -o /dev/null \
    https://localhost:9443/services/IdentityApplicationManagementService.IdentityApplicationManagementServiceHttpsSoap11Endpoint/
    res=$?
    if test "${res}" != "0";
        then
            echo "!! Problem occurred while updating application ${sp_name}.... !!"
            echo "${res}"
            return 255
    fi
    echo "** Successfully updated the application ${sp_name}. **"

    return 0;
}

deactivate_tenant() {
    username=$1
    password=$2
    tenant_domain=$3
    config_file=$4

    auth=$(echo "${username}:${password}"|base64)

    if [ ! -d "tmp" ]
        then
            mkdir tmp
    fi

    if [ -f tmp/deactivate-tenant.xml ]
        then
            rm tmp/deactivate-tenant.xml
    fi

    cp ${config_file} tmp/deactivate-tenant.xml

    sed -i 's/${TENANT_DOMAIN}/'${tenant_domain}'/g' tmp/deactivate-tenant.xml

    curl -s -k -d @tmp/deactivate-tenant.xml -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" \
    -H "SOAPAction: urn:deactivateTenant" -o /dev/null \
    https://localhost:9443/services/TenantMgtAdminService.TenantMgtAdminServiceHttpsSoap11Endpoint/
    res=$?
    if test "${res}" != "0";
    then
        echo "!! Problem occurred while deactivating the tenant: ${tenant_domain}. !!"
        echo "${res}"
        return 255
    fi
    echo "** Tenant ${tenant_domain} successfully deactivated. **"
    return 0;
}

export SAMPLE_HOME=$(cd `dirname $0` && pwd)

cd ${SAMPLE_HOME} || return
cd ../ || return
cd common || return

export COMMON_HOME=$(pwd)

cd ${SAMPLE_HOME} || return

. ${COMMON_HOME}/configure_samples.sh

create_tenant admin admin "management.pickup.com" "${SAMPLE_HOME}/configs/create-tenant-pickup-management.xml"
create_tenant admin admin "drivers.pickup.com" "${SAMPLE_HOME}/configs/create-tenant-pickup-drivers.xml"
create_user alex@drivers.pickup.com alex123 "Tiger Nixon" "${SAMPLE_HOME}/configs/user_tiger.json"
create_user alex@drivers.pickup.com alex123 "Garrett Winters" "${SAMPLE_HOME}/configs/user_garrett.json"
create_user cameron@management.pickup.com cameron123 "John Williams" "${SAMPLE_HOME}/configs/user_john.json"
create_service_provider dispatch admin admin "${COMMON_HOME}/configs/create-sp.xml"
create_service_provider swift admin admin "${COMMON_HOME}/configs/create-sp.xml"
configure_sample_1
