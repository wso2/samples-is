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

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * Main entry point for our msf4j backend
 */
public class BackendApplication {

    private static final Logger LOGGER = LoggerFactory.getLogger(BookingService.class);
    private static final Properties PROPERTIES = new Properties();

    // Perform property loading
    static {
        final InputStream resourceAsStream =
                BackendApplication.class.getClassLoader().getResourceAsStream("service.properties");

        try {
            PROPERTIES.load(resourceAsStream);
            LOGGER.info("Service properties loaded successfully.");
        } catch (final IOException e) {
            LOGGER.error("Failed to load service properties.");
            throw new RuntimeException("Service start failed due to configuration loading failure", e);
        }
    }

    public static void main(final String[] args) {

        final int runningPort;

        if (args.length == 0) {
            LOGGER.info("No port configuration override provided. Using default properties.");
            runningPort = Integer.valueOf(PROPERTIES.getProperty("port"));
        } else {
            if (Constants.getPortArg().equals(args[0]) && args.length > 1) {
                runningPort = Integer.valueOf(args[1]);
                LOGGER.info("Running port successfully changed to " + runningPort);
            } else {
                LOGGER.info("Invalid port configuration override. Using default properties.");
                runningPort = Integer.valueOf(PROPERTIES.getProperty("port"));
            }
        }

        // Start the service
        LOGGER.info("Starting backend service.");

        new MicroservicesRunner(runningPort).deploy(new BookingService()).start();
    }
}
