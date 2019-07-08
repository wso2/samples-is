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

package org.wso2.carbon.identity.handler.step.utils;

/**
 * Constants for custom step handler.
 */
public class CustomStepHandlerConstants {

    public static final String IWA_AUTHENTICATION_STATUS = "IWAAuthenticatorStatus";
    public static final String IWA_AUTHENTICATION_STATUS_FAILED = "failed";
    public static final String IWA_AUTHENTICATION_STATUS_SUCCESS = "success";
    public static final String IWA_KERBEROS_AUTHENTICATOR_NAME = "IWAKerberosAuthenticator";
    public static final String BASIC_AUTHENTICATOR_NAME = "BasicAuthenticator";
    public static final String LOCAL_IDP_NAME = "LOCAL";
    public static final String USER_AGENT_HEADER = "user-agent";
    public static final String FIREFOX_BROWSER_NAME = "Firefox";
    public static final String IP_CONFIG_FILE_PATH = "repository/conf/identity/internal_ip_addresses.txt";

    // Private constructor to prevent instantiation.
    private CustomStepHandlerConstants() {}
}
