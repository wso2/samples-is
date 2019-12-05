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

/**
 * Temporary configuration file.
 */
public class TempConfig {

    public TempConfig() {

    }

    private String appName;
    private String clientId;
    private String clientSecret;
    private String storeConnectorType;
    private String dbUserName;
    private String dbUserPassword;
    private String database;
    private String flowMode;
    private String clientNotificationEndpoint;

    public String getClientNotificationEndpoint() {

        return clientNotificationEndpoint;
    }

    public void setClientNotificationEndpoint(String clientNotificationEndpoint) {

        this.clientNotificationEndpoint = clientNotificationEndpoint;
    }

    public String getflowMode() {

        return flowMode;
    }

    public void setflowMode(String flowMode) {

        this.flowMode = flowMode;
    }

    public String getAppName() {

        return appName;
    }

    public void setAppName(String appName) {

        this.appName = appName;
    }

    public String getClientId() {

        return clientId;
    }

    public void setClientId(String clientId) {

        this.clientId = clientId;
    }

    public String getClientSecret() {

        return clientSecret;
    }

    public void setClientSecret(String clientSecret) {

        this.clientSecret = clientSecret;
    }

    public String getStoreConnectorType() {

        return storeConnectorType;
    }

    public void setStoreConnectorType(String storeConnectorType) {

        this.storeConnectorType = storeConnectorType;
    }

    public String getDbUserName() {

        return dbUserName;
    }

    public void setDbUserName(String dbUserName) {

        this.dbUserName = dbUserName;
    }

    public String getDbUserPassword() {

        return dbUserPassword;
    }

    public void setDbUserPassword(String dbUserPassword) {

        this.dbUserPassword = dbUserPassword;
    }

    public String getDatabase() {

        return database;
    }

    public void setDatabase(String database) {

        this.database = database;
    }

}
