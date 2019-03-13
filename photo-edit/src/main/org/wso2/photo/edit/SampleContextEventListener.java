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
package org.wso2.photo.edit;

import org.wso2.photo.edit.exceptions.SampleAppServerException;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class SampleContextEventListener implements ServletContextListener {

    private static Logger LOGGER = Logger.getLogger("org.wso2.sample.identity.oauth2");

    private static Properties properties;

    private static String propertyFilePath;

    public void contextInitialized(ServletContextEvent servletContextEvent) {

        properties = new Properties();
        try {
            propertyFilePath = servletContextEvent.getServletContext().getRealPath("/WEB-INF/classes/appone.properties");
            properties.load(servletContextEvent.getServletContext().
                    getResourceAsStream("/WEB-INF/classes/appone.properties"));
            // Clear the resource info for every app startup.
            clearResourceInfo();
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, e.getMessage(), e);
        }

        try {
            DCRUtility.performDCR();
        } catch (SampleAppServerException e) {
            throw new RuntimeException("Something went wrong", e);
        }
    }

    public void contextDestroyed(ServletContextEvent servletContextEvent) {

    }

    private void clearResourceInfo() {

        properties.remove("resource_id");
        try (OutputStream outputStream = Files.newOutputStream(Paths.get(propertyFilePath))) {
            properties.store(outputStream, null);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, e.getMessage(), e);
        }

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

    public static String getPropertyFilePath() {

        return propertyFilePath;
    }
}
