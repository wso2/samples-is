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

# Utility to read property values from property file
getProperty() {
   PROP_KEY=$1
   PROP_VALUE=`cat $PROPERTY_FILE | grep "$PROP_KEY" | cut -d'=' -f2`
   echo $PROP_VALUE
}

BASE_DIR="$(cd "$(dirname "$0")"; pwd)";

CONF_DIR=${BASE_DIR}/../conf
APP_DIR=${BASE_DIR}/../webapps
LIB_DIR=${BASE_DIR}/../lib
SCENARIO_DIR=${BASE_DIR}/../scenarios

PROPERTY_FILE=${CONF_DIR}/server.properties

HOST=$(getProperty "server.host.domain")
PORT=$(getProperty "server.host.port")

echo ""
echo "   Stating sample apps.. "
echo ""
echo "      Using Host : ${HOST} "
echo "      Using Port : ${PORT} "
echo ""

java -jar ${LIB_DIR}/jetty-runner.jar \
                    --host ${HOST} --port ${PORT} \
                    ${APP_DIR}/pickup-dispatch.war \
                    ${APP_DIR}/pickup-manager.war \
                    ${APP_DIR}/saml2-web-app-pickup-dispatch.com.war \
                    ${APP_DIR}/saml2-web-app-pickup-manager.com.war
