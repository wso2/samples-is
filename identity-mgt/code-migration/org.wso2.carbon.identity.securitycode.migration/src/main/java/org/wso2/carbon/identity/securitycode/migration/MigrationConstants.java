/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations und
 */
package org.wso2.carbon.identity.securitycode.migration;

/**
 * This class is used to define the constants used in security code migration.
 */
public class MigrationConstants {

    public static final String CONFIRMATION_REGISTRY_RESOURCE_PATH = "/repository/components/org.wso2.carbon" +
            ".identity.mgt/data/";
    public static final String EXPIRE_TIME_PROPERTY = "expireTime";
    public static final String USER_ID_PROPERTY = "userId";
    public static final String SELF_SIGN_UP_CODE_DELIMITER = "1";
    public static final String PW_RESET_CODE_DELIMITER = "2";
    public static final String REG_DELIMITER = "___";
    public static final String TENANT_DELIMITER = ":";
    public static final String SYSTEM_PROPERTY_MIGRATE = "migrateSecurityCode";
    public static final String SYSTEM_PROPERTY_MIGRATE_TENANTS = "migrateTenants";
    public static final String SYSTEM_PROPERTY_MIGRATE_TENANT_RANGE = "migrateTenantRange";
    public static final String SYSTEM_PROPERTY_START_TENANT = "tenantStartNo";
    public static final String SYSTEM_PROPERTY_TENANT_COUNT = "tenantCount";


}
