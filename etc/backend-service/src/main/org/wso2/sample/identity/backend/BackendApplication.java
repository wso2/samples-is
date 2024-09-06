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
package org.wso2.sample.identity.backend;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.wso2.msf4j.MicroservicesRunner;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Properties;

/**
 * Main entry point for our msf4j backend
 */
public class BackendApplication {

    private static final Logger logger = LoggerFactory.getLogger(BookingService.class);
    private static final Properties properties = new Properties();

    // Perform property loading and keystore setup
    static {
        final InputStream resourceAsStream =
                BackendApplication.class.getClassLoader().getResourceAsStream("service.properties");

        try {
            properties.load(resourceAsStream);
            logger.info("Service properties loaded successfully.");
        } catch (final IOException e) {
            logger.error("Failed to load service properties.");
            throw new RuntimeException("Service start failed due to configuration loading failure", e);
        }

        setupKeystore();
    }

    private static void setupKeystore() {
        // First find keystore properties
        final InputStream keystoreInputStream = BackendApplication.class.getClassLoader()
                .getResourceAsStream("keystore.properties");

        if (keystoreInputStream == null) {
            logger.error("keystore.properties not found. Trust store properties will not be set.");
            return;
        }

        // Load properties
        final Properties keystoreProperties = new Properties();

        try {
            keystoreProperties.load(keystoreInputStream);
        } catch (IOException e) {
            logger.error("Error while loading properties.", e);
            return;
        }

        // Find and store keystore required for SSL communication on a temporary location
        final InputStream keyStoreAsStream = BackendApplication.class.getClassLoader().getResourceAsStream(keystoreProperties.getProperty("keystorename"));

        try {
            final File keystoreTempFile = File.createTempFile(keystoreProperties.getProperty("keystorename"), "");
            keystoreTempFile.deleteOnExit();

            Files.copy(keyStoreAsStream, keystoreTempFile.toPath(), StandardCopyOption.REPLACE_EXISTING);

            logger.info("Setting trust store path to : " + keystoreTempFile.getPath());
            System.setProperty("javax.net.ssl.trustStore", keystoreTempFile.getPath());
            System.setProperty("javax.net.ssl.trustStorePassword", keystoreProperties.getProperty("keystorepassword"));
        } catch (IOException e) {
            logger.error("Error while setting trust store", e);
            throw new RuntimeException(e);
        }
    }

    public static void main(final String[] args) {

        if (args.length > 0) {
            final List<String> argList = Constants.getArgList();

            for (int i = 0; i < args.length; ) {
                if (argList.contains(args[i]) && args.length > (i + 1)) {
                    properties.setProperty(Constants.getPropertyForArg(args[i]), args[i + 1]);
                    i += 2;
                } else {
                    i += 1;
                }
            }
        }

        // Start the service
        logger.info("Starting backend service.");
        logger.info("Configurations : ");

        for (String name : properties.stringPropertyNames()) {
            logger.info(String.format("\t %s: %s", name, properties.getProperty(name)));
        }

        new MicroservicesRunner(Integer.parseInt(properties.getProperty("port"))).deploy(new BookingService(properties)).start();
    }
}
