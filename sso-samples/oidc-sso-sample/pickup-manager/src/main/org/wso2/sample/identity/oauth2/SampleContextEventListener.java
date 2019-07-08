/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
package org.wso2.sample.identity.oauth2;

import org.wso2.samples.claims.manager.ClaimManagerProxy;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import java.io.IOException;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

public class SampleContextEventListener implements ServletContextListener {

    private static Logger LOGGER = Logger.getLogger("org.wso2.sample.is.sso.agent");

    private static Properties properties;

    public void contextInitialized(ServletContextEvent servletContextEvent) {

        properties = new Properties();
        try {
            properties.load(servletContextEvent.getServletContext().
                    getResourceAsStream("/WEB-INF/classes/manager.properties"));
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, e.getMessage(), e);
        }

        // Obtain a claim manager instance for this application and set it to servlet context
        ClaimManagerProxy claimManagerProxy =
                new ClaimManagerProxy(
                        properties.getProperty("claimManagementEndpoint"),
                        properties.getProperty("adminUsername"),
                        properties.getProperty("adminPassword"));

        servletContextEvent.getServletContext().setAttribute("claimManagerProxyInstance", claimManagerProxy);
    }

    public void contextDestroyed(ServletContextEvent servletContextEvent) {

    }

    /**
     * Get the properties of the sample
     *
     * @return Properties
     */
    public static Properties getProperties() {

        return properties;
    }

    public static String getPropertyByKey(final String key) {

        return properties.getProperty(key);
    }
}
