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
package org.wso2.jks;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * A listener to get invoked at application deployment.
 * This will allow us to set the carbon JKS for HTTPS communication.
 */
public class JKSLoader implements ServletContextListener {

    private static final Logger LOGGER = Logger.getLogger(JKSLoader.class.getName());

    @Override
    public void contextInitialized(ServletContextEvent servletContextEvent) {
        // First find jks properties
        final InputStream jksInputStream = this.getClass().getClassLoader().getResourceAsStream("jks.properties");

        if (jksInputStream == null) {
            LOGGER.log(Level.SEVERE, "jks.properties not found. Trust store properties will not be set.");
            return;
        }

        // Load properties
        final Properties jksProperties = new Properties();

        try {
            jksProperties.load(jksInputStream);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "Error while loading properties.", e);
            return;
        }

        // Find and set JKS required for IS server communication
        final URL resource = this.getClass().getClassLoader().getResource(jksProperties.getProperty("keystorename"));

        if (resource != null) {
            LOGGER.log(Level.INFO, "Setting trust store path to : " + resource.getPath());
            System.setProperty("javax.net.ssl.trustStore", resource.getPath());
            System.setProperty("javax.net.ssl.trustStorePassword", jksProperties.getProperty("keystorepassword"));
        } else {
            LOGGER.log(Level.INFO, "Unable to find JKS defined by properties. Trust store properties will not be set.");
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent servletContextEvent) {
        // Ignored
    }
}
