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

import java.io.UnsupportedEncodingException;
import java.util.Base64;

/**
 * Configuration file.
 */
public class ConfigurationFile {

    public ConfigurationFile() {

    }

    private static ConfigurationFile configurationFileInstance = new ConfigurationFile();

    public static ConfigurationFile getInstance() {

        if (configurationFileInstance == null) {

            synchronized (ConfigurationFile.class) {

                if (configurationFileInstance == null) {

                    /* instance will be created at request time */
                    configurationFileInstance = new ConfigurationFile();
                }
            }
        }
        return configurationFileInstance;

    }

    private String APP_NAME;
    private String CLIENT_ID;
    private String CLIENT_SECRET;
    private String SEC_TOKEN;
    private String STORE_CONNECTOR_TYPE;
    private String DB_USER_NAME;
    private String DB_PASSWORD;
    private String DATABASE;
    private String FLOW_MODE;
    private String CLIENT_NOTIFICATION_ENDPOINT;

    public String getCLIENT_NOTIFICATION_ENDPOINT() {

        return CLIENT_NOTIFICATION_ENDPOINT;
    }

    public void setCLIENT_NOTIFICATION_ENDPOINT(String CLIENT_NOTIFICATION_ENDPOINT) {

        this.CLIENT_NOTIFICATION_ENDPOINT = CLIENT_NOTIFICATION_ENDPOINT;
    }

    public String getFLOW_MODE() {

        return FLOW_MODE;
    }

    public void setFLOW_MODE(String FLOW_MODE) {

        this.FLOW_MODE = FLOW_MODE;
    }

    public String getAPP_NAME() {

        return APP_NAME;
    }

    public void setAPP_NAME(String APP_NAME) {

        this.APP_NAME = APP_NAME;
    }

    public String getCLIENT_ID() {

        return CLIENT_ID;
    }

    public void setCLIENT_ID(String CLIENT_ID) {

        this.CLIENT_ID = CLIENT_ID;
    }

    public String getCLIENT_SECRET() {

        return CLIENT_SECRET;
    }

    public void setCLIENT_SECRET(String CLIENT_SECRET) {

        this.CLIENT_SECRET = CLIENT_SECRET;
    }

    public void setSEC_TOKEN(String SEC_TOKEN) {

        this.SEC_TOKEN = SEC_TOKEN;
    }

 /*   public String getAUTHORIZATION_USER() {
        return AUTHORIZATION_USER;
    }

    public void setAUTHORIZATION_USER(String AUTHORIZATION_USER) {
        this.AUTHORIZATION_USER = AUTHORIZATION_USER;
    }

    public String getAUTHORIZATION_PASSWORD() {
        return AUTHORIZATION_PASSWORD;
    }

    public void setAUTHORIZATION_PASSWORD(String AUTHORIZATION_PASSWORD) {
        this.AUTHORIZATION_PASSWORD = AUTHORIZATION_PASSWORD;
    }*/

    public String getSTORE_CONNECTOR_TYPE() {

        return STORE_CONNECTOR_TYPE;
    }

    public void setSTORE_CONNECTOR_TYPE(String STORE_CONNECTOR_TYPE) {

        this.STORE_CONNECTOR_TYPE = STORE_CONNECTOR_TYPE;
    }

    public String getDB_USER_NAME() {

        return DB_USER_NAME;
    }

    public void setDB_USER_NAME(String DB_USER_NAME) {

        this.DB_USER_NAME = DB_USER_NAME;
    }

    public String getDB_PASSWORD() {

        return DB_PASSWORD;
    }

    public void setDB_PASSWORD(String DB_PASSWORD) {

        this.DB_PASSWORD = DB_PASSWORD;
    }

    public String getDATABASE() {

        return DATABASE;
    }

    public void setDATABASE(String DATABASE) {

        this.DATABASE = DATABASE;
    }

    public String getSEC_TOKEN() {

        return SEC_TOKEN;
    }

    public void setSEC_TOKEN(String AUTHORIZATION_USER, String AUTHORIZATION_PASSWORD)
            throws UnsupportedEncodingException {

        this.SEC_TOKEN = Base64.getEncoder()
                .encodeToString((AUTHORIZATION_USER + ":" + AUTHORIZATION_PASSWORD).getBytes("utf-8"));
        // System.out.println("Sec token here :"+SEC_TOKEN);
    }

}
