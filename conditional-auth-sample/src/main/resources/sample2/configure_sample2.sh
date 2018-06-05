#! /bin/sh

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

configure_sample2() {
    configure_service_provider_for_samlsso dispatch saml2-web-app-dispatch.com http://localhost.com:8080/saml2-web-app-dispatch.com/consumer admin admin "${COMMON_HOME}/configs/sso-config.xml"
    configure_service_provider_for_samlsso swift saml2-web-app-swift.com http://localhost.com:8080/saml2-web-app-swift.com/consumer admin admin "${COMMON_HOME}/configs/sso-config.xml"
    configure_service_provider dispatch admin admin "${COMMON_HOME}/configs/get-sp.xml" "${SAMPLE_HOME}/configs/update-sp.xml"
    configure_service_provider swift admin admin "${COMMON_HOME}/configs/get-sp.xml" "${SAMPLE_HOME}/configs/update-sp.xml"
    display_sample_info

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
    echo "|    scenario where users will be prompted a second factor to        |"
    echo "|    authenticate when they are logged in from a mobile device.      |"
    echo "|                                                                    |"
    echo "|    To tryout conditional authentication please log into            |"
    echo "|    the sample applications below.                                  |"
    echo "|                                                                    |"
    echo "|    Dispatch - http://localhost:8080/saml2-web-app-dispatch.com/    |"
    echo "|    Swift - http://localhost:8080/saml2-web-app-swift.com/          |"
    echo "|                                                                    |"
    echo "|    Users                                                           |"
    echo "|      Username: cameron                                             |"
    echo "|      Password: cameron123                                          |"
    echo "|                                                                    |"
    echo "|      Username: alex                                                |"
    echo "|      Password: alex123                                             |"
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
            cleanup_sample
            ;;
        [Nn]* )
            exit
            ;;
        * )
            echo "Please answer yes or no."
            ;;
    esac
}

cleanup_sample() {
    echo
    echo "Removing service providers"
    delete_sp admin admin dispatch "${COMMON_HOME}/cleanup/delete-sp.xml"
    delete_sp admin admin swift "${COMMON_HOME}/cleanup/delete-sp.xml"

    echo
    echo "Removing users"
    delete_user admin admin cameron "${COMMON_HOME}/cleanup/delete-user.xml"
    delete_user admin admin alex "${COMMON_HOME}/cleanup/delete-user.xml"

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

export SAMPLE_HOME=$(cd `dirname $0` && pwd)

cd ${SAMPLE_HOME} || return
cd ../ || return
cd common || return

export COMMON_HOME=$(pwd)

cd ${SAMPLE_HOME} || return

. ${COMMON_HOME}/configure_samples.sh

echo
echo "PREREQUISITES                                                   "
echo
echo "This sample requires sample authenticators for multi-factor authentication step configurations."
echo
echo "In order to get sample authenticators, please follow the steps below,"
echo
echo "1. Clone the product-is repository."
echo "   git clone https://github.com/wso2/product-is"
echo
echo "2. Navigate to the product-is/modules/samples/authenticators directory and build it using the following command."
echo "   mvn clean install"
echo
echo "3. Copy the org.wso2.carbon.identity.sample.extension.authenticators-<VERSION_NUMBER>.jar"
echo "   file found inside the authenicators/components/org.wso2.carbon.identity.sample.extension.authenticators/target"
echo "   directory to <IS_HOME>/repository/components/dropins directory"
echo
echo "4. Copy the sample-auth.war file found inside the"
echo "   product-is/modules/samples/authenticators/components/org.wso2.carbon.identity.sample.extension.auth.endpoint/target"
echo "   directory to <IS_HOME>/repository/deployment/server/webapps directory"
echo
echo "Please continue the above steps and continue the script."
echo "Do you want to continue with the sample?"
echo
echo "Press y - Continue"
echo "Press n - Exit"
echo

read -r continue

    case ${continue} in
        [Yy]* )
            create_user admin admin "Cameron Smith" "${COMMON_HOME}/configs/user_cameron.json"
            create_user admin admin "Alex Miller" "${COMMON_HOME}/configs/user_alex.json"
            create_service_provider dispatch admin admin "${COMMON_HOME}/configs/create-sp.xml"
            create_service_provider swift admin admin "${COMMON_HOME}/configs/create-sp.xml"
            configure_sample2
            ;;
        [Nn]* )
            exit
            ;;
        * )
            echo "Please answer yes or no."
            ;;
    esac
