echo "---------- Start Setting up accountrecoveryendpoint in a web server ----------"
echo "Please enter the path to your WSO2-IS installation."
echo "Example: /home/downloads/WSO2_Products/wso2is-5.3.0"
read WSO2_PATH

echo

if [ ! -d "${WSO2_PATH}" ]
  then
    echo "${WSO2_PATH} Directory does not exists. Please download and install the latest pack."
    exit;
 fi

echo "Please enter the path to your web-server server installation's webb-apps location."
echo "Example: /home/downloads/apache-tomcat-8.0.49/webapps"
read TOMCAT_PATH
echo

if [ ! -d "${TOMCAT_PATH}" ]
  then
   echo "Web server does not exist in the given location ${TOMCAT_PATH}."
   exit;
 fi

export IS_HOME=${WSO2_PATH}
export WEB_APP_HOME=${TOMCAT_PATH}
export WEB_APP_LIB=${WEB_APP_HOME}/accountrecoveryendpoint/WEB-INF/lib/

rm -rf ${WEB_APP_HOME}/accountrecoveryendpoint

cp -r $IS_HOME/repository/deployment/server/webapps/accountrecoveryendpoint ${WEB_APP_HOME}

rm ${WEB_APP_HOME}/accountrecoveryendpoint.war

cp $IS_HOME/repository/components/plugins/commons-lang_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/encoder_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/com.google.gson_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/httpclient_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/httpcore_*1.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/json_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.identity.mgt.stub_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.identity.user.registration.stub_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.base_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.identity.base_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.ui_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.identity.core_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.utils_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.user.core_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.user.api_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.logging_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/axis2_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/opensaml_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/jettison_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/neethi_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/wsdl4j_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.apache.commons.commons-codec_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/commons-collections_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.identity.mgt_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.tomcat.ext_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/XmlSchema_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.orbit.javax.xml.bind.jaxb-api_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/axiom_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/commons-httpclient_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/commons-lang3_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/javax.cache.wso2_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.eclipse.equinox.jsp.jasper_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.identity.application.common_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.identity.mgt.ui_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.identity.application.mgt.stub_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.identity.application.mgt.ui_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.identity.application.mgt_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.identity.recovery.stub_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.identity.recovery.ui_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.identity.recovery_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.idp.mgt.stub_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.idp.mgt.ui_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.idp.mgt_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.securevault_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.identity.captcha_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.identity.event_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/json-simple_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.core_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.registry.core_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.registry.api_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.identity.governance_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.identity.handler.event.account.lock_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/jstl_*.jar $WEB_APP_LIB
cp $IS_HOME/lib/commons-logging-*.jar $WEB_APP_LIB
cp $IS_HOME/lib/runtimes/cxf3/javax.ws.rs-api-*.jar $WEB_APP_LIB
cp $IS_HOME/lib/runtimes/cxf3/cxf-core-*.jar $WEB_APP_LIB
cp $IS_HOME/lib/runtimes/cxf3/cxf-rt-frontend-jaxrs-*.jar $WEB_APP_LIB
cp $IS_HOME/lib/runtimes/cxf3/cxf-rt-rs-client-*.jar $WEB_APP_LIB
cp $IS_HOME/lib/runtimes/cxf3/cxf-rt-rs-extension-providers-*.jar $WEB_APP_LIB
cp $IS_HOME/lib/runtimes/cxf3/cxf-rt-rs-extension-search-*.jar $WEB_APP_LIB
cp $IS_HOME/lib/runtimes/cxf3/cxf-rt-rs-service-description-*.jar $WEB_APP_LIB
cp $IS_HOME/lib/runtimes/cxf3/cxf-rt-transports-http-*.jar $WEB_APP_LIB
cp $IS_HOME/lib/runtimes/cxf3/jackson-annotations-*.jar $WEB_APP_LIB
cp $IS_HOME/lib/runtimes/cxf3/jackson-core-*.jar $WEB_APP_LIB
cp $IS_HOME/lib/runtimes/cxf3/jackson-databind-*.jar $WEB_APP_LIB
cp $IS_HOME/lib/runtimes/cxf3/jackson-jaxrs-base-*.jar $WEB_APP_LIB
cp $IS_HOME/lib/runtimes/cxf3/jackson-jaxrs-json-provider-*.jar $WEB_APP_LIB
cp $IS_HOME/lib/runtimes/cxf3/jackson-module-jaxb-annotations-*.jar $WEB_APP_LIB
cp $IS_HOME/lib/runtimes/cxf3/org.wso2.carbon.identity.mgt.endpoint.util-*.jar $WEB_APP_LIB
cp $IS_HOME/lib/runtimes/cxf3/jersey-client-*.jar $WEB_APP_LIB
cp $IS_HOME/lib/runtimes/cxf3/jersey-core-*.jar $WEB_APP_LIB
cp $IS_HOME/lib/runtimes/cxf3/jersey-multipart-*.jar $WEB_APP_LIB
cp $IS_HOME/lib/runtimes/cxf3/org.wso2.carbon.identity.application.authentication.endpoint.util-*.jar $WEB_APP_LIB

echo "===================================================================================="
echo
echo "Follow the instruction in the original guide to proceed."
echo
