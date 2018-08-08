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

configure_sample4() {
    add_email_template admin admin "${SAMPLE_HOME}/configs/add-email-template-type.xml" "${SAMPLE_HOME}/configs/add-email-template.xml"
    configure_service_provider_for_samlsso dispatch saml2-web-app-dispatch.com http://localhost:8080/saml2-web-app-dispatch.com/consumer admin admin "${COMMON_HOME}/configs/sso-config.xml"
    configure_service_provider_for_samlsso swift saml2-web-app-swift.com http://localhost:8080/saml2-web-app-swift.com/consumer admin admin "${COMMON_HOME}/configs/sso-config.xml"

    echo
    echo "Please enter your allowed IP subnet."
    echo "Example: 192.168.4.0/24"

    read -r ip_range

    configure_service_provider dispatch admin admin "${COMMON_HOME}/configs/get-sp.xml" "${SAMPLE_HOME}/configs/update-sp.xml" "${ip_range}"
    configure_service_provider swift admin admin "${COMMON_HOME}/configs/get-sp.xml" "${SAMPLE_HOME}/configs/update-sp.xml" "${ip_range}"
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
    echo "|    scenario where users will be notified via email if user logged  |"
    echo "|    from an ip which is not within the allowed range.               |"
    echo "|                                                                    |"
    echo "|    To tryout conditional authentication please log into            |"
    echo "|    the sample applications below with the user created by you.     |"
    echo "|                                                                    |"
    echo "|    Dispatch - http://localhost:8080/saml2-web-app-dispatch.com/    |"
    echo "|    Swift - http://localhost:8080/saml2-web-app-swift.com/          |"
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
    echo "Removing email templates"
    delete_email_template admin admin "${SAMPLE_HOME}/cleanup/delete-email-template-type.xml"

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

add_email_template() {
    username=$1
    password=$2
    config_file1=$3
    config_file2=$4

    auth=$(echo "${username}:${password}"|base64)

    if [ ! -f "${config_file1}" ]
        then
            echo "${config_file1} does not exist".
            exit 255
    fi

    if [ ! -f "${config_file2}" ]
        then
            echo "${config_file1} does not exist".
            exit 255
    fi

    curl -s -k -d @"${config_file1}" -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" \
    -H "SOAPAction: urn:addEmailTemplateType" -o /dev/null \
    https://localhost:9443/services/I18nEmailMgtConfigService.I18nEmailMgtConfigServiceHttpsSoap11Endpoint/
    res=$?
    if test "${res}" != "0";
    then
        echo "!! Problem occurred while adding the email template type. !!"
        echo "${res}"
        return 255
    fi
    echo "** Email template type successfully added. **"

    curl -s -k -d @"${config_file2}" -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" \
    -H "SOAPAction: urn:saveEmailTemplate" -o /dev/null \
    https://localhost:9443/services/I18nEmailMgtConfigService.I18nEmailMgtConfigServiceHttpsSoap11Endpoint/
    res=$?
    if test "${res}" != "0";
    then
        echo "!! Problem occurred while saving the email template. !!"
        echo "${res}"
        return 255
    fi
    echo "** Email template successfully saved. **"

    return 0;
}

delete_email_template() {
    username=$1
    password=$2
    config_file=$3

    auth=$(echo "${username}:${password}"|base64)

    if [ ! -f "${config_file}" ]
        then
            echo "${config_file} does not exist".
            exit 255
    fi

    curl -s -k -d @"${config_file}" -H "Authorization: Basic ${auth}" -H "Content-Type: text/xml" \
    -H "SOAPAction: urn:deleteEmailTemplateType" -o /dev/null \
    https://localhost:9443/services/I18nEmailMgtConfigService.I18nEmailMgtConfigServiceHttpsSoap11Endpoint/
    res=$?
    if test "${res}" != "0";
    then
        echo "!! Problem occurred while deleting the email template type. !!"
        echo "${res}"
        return 255
    fi
    echo "** Email template type successfully deleted. **"

    return 0;
}

configure_service_provider() {
    sp_name=$1
    username=$2
    password=$3
    config_file1=$4
    config_file2=$5
    ip_range=$6

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

    sed -i 's#${SP_NAME}#'${sp_name}'#g' tmp/get-sp-"${sp_name}".xml

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

    sed -i 's#${SP_NAME}#'${sp_name}'#g' tmp/update-sp-"${sp_name}".xml
    sed -i 's#${APP_ID}#'${app_id}'#g' tmp/update-sp-"${sp_name}".xml
    sed -i 's#${ALLOWED_IP_RANGE}#'${ip_range}'#g' tmp/update-sp-"${sp_name}".xml


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
echo "PREREQUISITES"
echo
echo "1. This sample requires enabling email notifications in Identity Server in order to send emails for users."
echo
echo "      Follow the below documentation to enable email notifications in Identity Server"
echo
echo "      https://docs.wso2.com/display/IS560/Enabling+Notifications+for+User+Operations"
echo
echo "2. In order to send an email, this sample requires a user profile with a working email address. Therefore before"
echo "   running the sample, please log in to the Management Console and create a user and update the user's email"
echo "   address to a working email and also First Name and the Last Name."
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
            create_service_provider dispatch admin admin "${COMMON_HOME}/configs/create-sp.xml"
            create_service_provider swift admin admin "${COMMON_HOME}/configs/create-sp.xml"
            configure_sample4
            ;;
        [Nn]* )
            exit
            ;;
        * )
            echo "Please answer yes or no."
            ;;
    esac
