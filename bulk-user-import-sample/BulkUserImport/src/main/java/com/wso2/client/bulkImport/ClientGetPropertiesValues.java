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
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package com.wso2.client.bulkImport;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import static java.lang.System.setProperty;

class ClientGetPropertiesValues {

    private String userStoreName = "";
    private String defaultPassword = "";
    private String filePath = "";
    private String productUrl = "";
    private String remoteAddress = "";
    private String authUser = "";
    private String authPwd = "";
    private InputStream inputStream;

    ClientGetPropertiesValues() throws IOException {
        try {
            Properties prop = new Properties();
            String propFileName = "client.properties";
            try {
                inputStream = new FileInputStream(propFileName);
            } catch (FileNotFoundException e) {
                throw new FileNotFoundException("property file '" + propFileName + "' not found");
            }

            prop.load(inputStream);


            setProperty("javax.net.ssl.trustStore", prop.getProperty("javax.net.ssl.trustStore"));
            setProperty("javax.net.ssl.trustStorePassword", prop.getProperty("javax.net.ssl.trustStorePassword"));
            setProperty("javax.net.ssl.trustStoreType", prop.getProperty("javax.net.ssl.trustStoreType"));

            userStoreName = prop.getProperty("bulk.userStore.name", "");
            defaultPassword = prop.getProperty("bulk.default.pwd", "");
            productUrl = prop.getProperty("product.url");
            filePath = prop.getProperty("file.path");
            remoteAddress = prop.getProperty("remote.address");
            authUser = prop.getProperty("auth.user");
            authPwd = prop.getProperty("auth.pwd");

        } catch (Exception e) {
            System.out.println("Exception: " + e);
        } finally {
            if (inputStream != null) {
                inputStream.close();
            }
        }
    }

    String getUserStoreName() {
        return userStoreName;
    }

    String getDefaultPassword() {
        return defaultPassword;
    }

    String getProductUrl() {
        return productUrl;
    }

    String getFilePath() {
        return filePath;
    }

    String getRemoteAddress() {
        return remoteAddress;
    }

    String getAuthUser() {
        return authUser;
    }

    String getAuthPwd() {
        return authPwd;
    }
}
