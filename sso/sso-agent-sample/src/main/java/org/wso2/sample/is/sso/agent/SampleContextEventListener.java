/**
 * Copyright (c) WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  WSO2 Inc. licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
package org.wso2.sample.is.sso.agent;

import org.wso2.carbon.identity.sso.agent.util.SSOAgentConstants;
import org.wso2.carbon.identity.sso.agent.bean.SSOAgentConfig;
import org.wso2.carbon.identity.sso.agent.exception.SSOAgentException;
import org.wso2.carbon.identity.sso.agent.security.SSOAgentX509Credential;
import org.wso2.carbon.identity.sso.agent.security.SSOAgentX509KeyStoreCredential;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

public class SampleContextEventListener implements ServletContextListener {

    private static Logger LOGGER = Logger.getLogger("org.wso2.sample.is.sso.agent");

    private static Properties properties;

    public void contextInitialized(ServletContextEvent servletContextEvent) {

        properties = new Properties();
        try {
            if(servletContextEvent.getServletContext().getContextPath().contains("travelocity.com")) {
                properties.load(servletContextEvent.getServletContext().
                        getResourceAsStream("/WEB-INF/classes/travelocity.properties"));
            } else if(servletContextEvent.getServletContext().getContextPath().contains("avis.com")) {
                properties.load(servletContextEvent.getServletContext().
                        getResourceAsStream("/WEB-INF/classes/avis.properties"));
            } else {
                String resourcePath = "/WEB-INF/classes" + servletContextEvent.getServletContext().getContextPath() +
                                      ".properties";
                InputStream resourceStream = servletContextEvent.getServletContext().getResourceAsStream(resourcePath);
                if (resourceStream != null) {
                    properties.load(servletContextEvent.getServletContext().getResourceAsStream(resourcePath));
                }
            }
            InputStream keyStoreInputStream = servletContextEvent.getServletContext().
                    getResourceAsStream("/WEB-INF/classes/wso2carbon.p12");
            SSOAgentX509Credential credential =
                    new SSOAgentX509KeyStoreCredential(keyStoreInputStream,
                            properties.getProperty("KeyStorePassword").toCharArray(),
                            properties.getProperty("IdPPublicCertAlias"),
                            properties.getProperty("PrivateKeyAlias"),
                            properties.getProperty("PrivateKeyPassword").toCharArray());

            SSOAgentConfig config = new SSOAgentConfig();
            config.initConfig(properties);
            config.getSAML2().setSSOAgentX509Credential(credential);
            config.getOpenId().setAttributesRequestor(new SampleAttributesRequestor());
            servletContextEvent.getServletContext().setAttribute(SSOAgentConstants.CONFIG_BEAN_NAME, config);
        } catch (IOException | SSOAgentException e){
            LOGGER.log(Level.SEVERE, e.getMessage(), e);
        }
    }

    public void contextDestroyed(ServletContextEvent servletContextEvent) {

    }

    /**
     * Get the properties of the sample
     * @return Properties
     */
    public static Properties getProperties(){
        return properties;
    }
}
