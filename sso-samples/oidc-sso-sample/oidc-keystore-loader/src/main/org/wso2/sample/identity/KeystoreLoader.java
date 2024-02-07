/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
package org.wso2.sample.identity;

import java.net.URISyntaxException;
import java.nio.file.Paths;
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
 * This will allow us to set the carbon keystore for HTTPS communication.
 */
public class KeystoreLoader implements ServletContextListener {

    private static final Logger LOGGER = Logger.getLogger(KeystoreLoader.class.getName());

    @Override
    public void contextInitialized(ServletContextEvent servletContextEvent) {
        // First find keystore properties
        final InputStream keystoreInputStream = this.getClass().getClassLoader()
                .getResourceAsStream("keystore.properties");

        if (keystoreInputStream == null) {
            LOGGER.log(Level.SEVERE, "keystore.properties not found. Trust store properties will not be set.");
            return;
        }

        // Load properties
        final Properties keystoreProperties = new Properties();

        try {
            keystoreProperties.load(keystoreInputStream);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "Error while loading properties.", e);
            return;
        }

        // Find and set keystore required for IS server communication
        final URL resource = this.getClass().getClassLoader()
                .getResource(keystoreProperties.getProperty("keystorename"));

        if (resource != null) {
            try {
                String trustStorePath = Paths.get(resource.toURI()).toFile().getAbsolutePath();
                LOGGER.log(Level.INFO, "Setting trust store path to : " + trustStorePath);
                System.setProperty("javax.net.ssl.trustStore", trustStorePath);
            } catch (URISyntaxException e) {
                LOGGER.log(Level.SEVERE, "Unable to find keystore defined by properties. " +
                        "Trust store properties will not be set.", e);
            }
            System.setProperty("javax.net.ssl.trustStorePassword", keystoreProperties.getProperty("keystorepassword"));
        } else {
            LOGGER.log(Level.INFO, "Unable to find keystore defined by properties. " +
                    "Trust store properties will not be set.");
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent servletContextEvent) {
        // Ignored
    }
}
