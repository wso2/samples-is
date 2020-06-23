echo "---------- Start Setting up authenticationendpoint in a web server ----------"
echo "Please enter the path to your WSO2-IS installation."
echo "Example: /home/downloads/WSO2_Products/wso2is-5.10.0"
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
export WEB_APP_LIB=${WEB_APP_HOME}/authenticationendpoint/WEB-INF/lib/

rm -rf ${WEB_APP_HOME}/authenticationendpoint

cp -r $IS_HOME/repository/deployment/server/webapps/authenticationendpoint ${WEB_APP_HOME}

cp $IS_HOME/repository/components/plugins/abdera_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/ant_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/axiom_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/axis2_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/bcprov-jdk15on_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/commons-cli_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/commons-collections_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/commons-dbcp_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/commons-fileupload_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/commons-httpclient_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/commons-io_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/commons-lang_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/commons-pool_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/compass_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/encoder_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/com.google.gson_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/hazelcast_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/httpclient_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/httpcore_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/javax.cache.wso2_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/jdbc-pool_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/joda-time_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/json_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/jstl_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/neethi_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/opensaml_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.eclipse.equinox.http.helper_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.eclipse.osgi_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.base_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.eclipse.osgi_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.eclipse.osgi.services_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.base_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.core_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.crypto.api_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.database.utils_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.identity.application.common_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.identity.base_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.identity.template.mgt_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.queuing_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.registry.api_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.registry.core_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.securevault_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.user.api_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.user.core_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.utils_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.securevault_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/rampart-core_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/slf4j.api_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/tomcat-catalina-ha_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/tomcat-servlet-api_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/wsdl4j_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/XmlSchema_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.ui_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.identity.application.authentication.endpoint.util_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.identity.core_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.identity.user.registration.stub_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.identity.mgt.stub_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.identity.mgt_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.identity.mgt.ui_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/org.wso2.carbon.identity.oauth_*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/features/org.wso2.carbon.identity.application.authentication.framework.server_*/runtimes/cxf3/org.wso2.carbon.identity.application.authentication.endpoint.util-*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/plugins/jettison_*.jar $WEB_APP_LIB
cp $IS_HOME/lib/runtimes/cxf3/javax.ws.rs-api-*.jar $WEB_APP_LIB
cp $IS_HOME/lib/runtimes/cxf3/cxf-core-*.jar $WEB_APP_LIB
cp $IS_HOME/lib/runtimes/cxf3/cxf-rt-frontend-jaxrs-*.jar $WEB_APP_LIB
cp $IS_HOME/lib/runtimes/cxf3/cxf-rt-rs-client-*.jar $WEB_APP_LIB
cp $IS_HOME/lib/runtimes/cxf3/cxf-rt-rs-extension-providers-*.jar $WEB_APP_LIB
cp $IS_HOME/lib/runtimes/cxf3/cxf-rt-rs-extension-search-*.jar $WEB_APP_LIB
cp $IS_HOME/lib/runtimes/cxf3/cxf-rt-rs-service-description-*.jar $WEB_APP_LIB
cp $IS_HOME/lib/runtimes/cxf3/cxf-rt-transports-http-*.jar $WEB_APP_LIB
cp $IS_HOME/bin/org.wso2.carbon.bootstrap-*.jar $WEB_APP_LIB
cp $IS_HOME/bin/tomcat-juli-*.jar $WEB_APP_LIB
cp $IS_HOME/lib/xercesImpl-*.jar $WEB_APP_LIB
cp $IS_HOME/lib/geronimo-jta_*.jar $WEB_APP_LIB
cp $IS_HOME/lib/stax2-api-*.jar $WEB_APP_LIB
cp $IS_HOME/lib/woodstox-core-asl-*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/tools/forget-me/lib/log4j-*.jar $WEB_APP_LIB
cp $IS_HOME/repository/components/tools/forget-me/lib/pax-logging-api-*.jar $WEB_APP_LIB



echo
echo "Please Open ${WEB_APP_HOME}/authenticationendpoint/WEB-INF/web.xml file and make"
echo "following changes to point to Identity Server URLs"
echo
echo "===================================================================================="
echo "..."
echo "   <context-param>"
echo "      <param-name>IdentityManagementEndpointContextURL</param-name>"
echo "     <param-value>https://localhost:9443/accountrecoveryendpoint</param-value>"
echo "   </context-param>"
echo "   <context-param>"
echo "      <param-name>AccountRecoveryRESTEndpointURL</param-name>"
echo "    <param-value>https://localhost:9443/t/tenant-domain/api/identity/user/v0.9/</param-value>"
echo "   </context-param>"
echo "..."
echo "   <context-param>"
echo "      <param-name>IdentityServerEndpointContextURL</param-name>"
echo "      <param-value>https://localhost:9443</param-value>"
echo "   </context-param>"
echo "..."

echo "===================================================================================="
echo
echo "Follow the instruction in the original guide to proceed."
echo
echo "------------ End Setting up authenticationendpoint in a separate server ------------"
