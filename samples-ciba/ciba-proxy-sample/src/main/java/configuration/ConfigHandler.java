/*
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;

import java.io.File;
import java.io.IOException;
import java.util.logging.Logger;

/**
 * Configures the proxy server.
 */
public class ConfigHandler {

    private static final Logger LOGGER = Logger.getLogger(ConfigHandler.class.getName());

    private ConfigHandler() {

    }

    private static ConfigHandler configHandlerInstance = new ConfigHandler();

    public static ConfigHandler getInstance() {

        if (configHandlerInstance == null) {

            synchronized (ConfigHandler.class) {

                if (configHandlerInstance == null) {

                    /* instance will be created at request time */
                    configHandlerInstance = new ConfigHandler();
                }
            }
        }
        return configHandlerInstance;
    }

    /**
     * Configures the proxy server with configurations provided.
     */
    public void configure() throws IOException {

        try {
            ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
            TempConfig tempConfig1 = mapper.readValue(new File("src/main/resources/config.yaml"), TempConfig.class);

            if (tempConfig1 instanceof TempConfig) {
                TempConfig tempConfig = (TempConfig) tempConfig1;
                try {
                    if (tempConfig.getAppName().isEmpty() || tempConfig.getAppName().equals("")
                            || tempConfig.getAppName().equals("null")) {
                        throw new IllegalArgumentException();
                    } else {
                        // Configuring proxy for particular client.
                        ConfigurationFile.getInstance().setAPP_NAME(tempConfig.getAppName());
                    }
                } catch (IllegalArgumentException e) {
                    LOGGER.severe("App Name can not be null");
                }

                try {
                    if (tempConfig.getClientId().isEmpty() || tempConfig.getClientId().equals("") ||
                            tempConfig.getClientId().equals("null")) {
                        throw new IllegalArgumentException();
                    } else {
                        // Configuring proxy with relevant client ID.
                        ConfigurationFile.getInstance().setCLIENT_ID(tempConfig.getClientId());
                    }
                } catch (IllegalArgumentException e) {
                    LOGGER.severe("Client ID can not be null");
                }

                try {
                    if (tempConfig.getClientSecret().isEmpty() || tempConfig.getClientSecret().equals("") ||
                            tempConfig.getClientSecret().equals("null")) {
                        throw new IllegalArgumentException();
                    } else {
                        // Configuring proxy with relevant client secret.
                        ConfigurationFile.getInstance().setCLIENT_SECRET(tempConfig.getClientSecret());
                    }
                } catch (IllegalArgumentException e) {
                    LOGGER.severe("Client Secret can not be null");
                }

                try {
                    if (tempConfig.getStoreConnectorType().isEmpty() || tempConfig.getStoreConnectorType().equals("") ||
                            tempConfig.getStoreConnectorType().equals("null")) {
                        throw new IllegalArgumentException();
                    } else {
                        // Configuring proxy with proper store connector type.
                        ConfigurationFile.getInstance().setSTORE_CONNECTOR_TYPE(tempConfig.getStoreConnectorType());
                    }
                } catch (IllegalArgumentException e) {
                    LOGGER.severe("Store Connector Type can not be null");
                }

                try {
                    if (tempConfig.getDbUserName().isEmpty() || tempConfig.getDbUserName().equals("") ||
                            tempConfig.getDbUserName().equals("null")) {
                        throw new IllegalArgumentException();
                    } else {
                        // Configuring storage DB name if the external store to be used.
                        ConfigurationFile.getInstance().setDB_USER_NAME(tempConfig.getDbUserName());
                    }
                } catch (IllegalArgumentException e) {
                    LOGGER.severe("Database User Name can not be null");
                }

                try {
                    if (tempConfig.getDbUserName().isEmpty() || tempConfig.getDbUserName().equals("") ||
                            tempConfig.getDbUserName().equals("null")) {
                        //do nothing as of now
                        ConfigurationFile.getInstance().setDB_PASSWORD(tempConfig.getDbUserPassword());
                        LOGGER.warning("Database Password is null.Advisory to configure one.");

                    } else {
                        // OConfiguring storage password for the external storage.
                        ConfigurationFile.getInstance().setDB_PASSWORD(tempConfig.getDbUserPassword());
                    }
                } catch (IllegalArgumentException e) {
                    LOGGER.warning("Database Password is null.Advisory to configure one.");
                }

                try {
                    if (tempConfig.getDatabase().isEmpty() || tempConfig.getDatabase().equals("") ||
                            tempConfig.getDatabase().equals("null")) {
                        throw new IllegalArgumentException();
                    } else {
                        // Configuring external storage for the proxy server.
                        ConfigurationFile.getInstance().setDATABASE(tempConfig.getDatabase());
                    }
                } catch (IllegalArgumentException e) {
                    LOGGER.severe("Database can not be null");
                }

                try {
                    if (tempConfig.getflowMode().isEmpty() || tempConfig.getflowMode().equals("") ||
                            tempConfig.getflowMode().equals("null")) {
                        throw new IllegalArgumentException();
                    } else {
                        // Configuring the token reception mode for the proxy.
                        ConfigurationFile.getInstance().setFLOW_MODE(tempConfig.getflowMode());
                    }
                } catch (IllegalArgumentException e) {
                    LOGGER.severe("Flow_mode can not be null");
                }

                try {
                    if (tempConfig.getClientNotificationEndpoint().isEmpty() ||
                            tempConfig.getClientNotificationEndpoint().equals("") ||
                            tempConfig.getClientNotificationEndpoint().equals("null")) {
                        throw new IllegalArgumentException();
                    } else {
                        // Configure client notification endpoint if the flow follows 'ping'.
                        ConfigurationFile.getInstance()
                                .setCLIENT_NOTIFICATION_ENDPOINT(tempConfig.getClientNotificationEndpoint());
                    }
                } catch (IllegalArgumentException e) {
                    LOGGER.severe("Client Notification EndPoint can not be null");
                }

                // this.setConfiguration();

                try {
                    if (tempConfig.getflowMode().equalsIgnoreCase("push")) {
                        throw new IllegalArgumentException();
                    }
                } catch (IllegalArgumentException e) {
                    LOGGER.warning("Push mode is not Supported by the Proxy.Configure with 'Poll'or 'Ping'.");
                }
            }
        } catch (IOException e) {
            LOGGER.severe("Config.yaml Not Found. Check File or Source Path.");
            e.printStackTrace();
        } finally {
            LOGGER.info("Proxy Server Configured Properly.");
        }

    }

}
