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
package org.wso2.carbon.identity.securitycode.migration.service;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.wso2.carbon.context.PrivilegedCarbonContext;
import org.wso2.carbon.identity.application.common.model.User;
import org.wso2.carbon.identity.base.IdentityRuntimeException;
import org.wso2.carbon.identity.core.util.IdentityTenantUtil;
import org.wso2.carbon.identity.recovery.IdentityRecoveryException;
import org.wso2.carbon.identity.recovery.RecoveryScenarios;
import org.wso2.carbon.identity.recovery.RecoverySteps;
import org.wso2.carbon.identity.recovery.model.UserRecoveryData;
import org.wso2.carbon.identity.recovery.store.JDBCRecoveryDataStore;
import org.wso2.carbon.identity.recovery.store.UserRecoveryDataStore;
import org.wso2.carbon.identity.securitycode.migration.internal.IdentityCodeMigrationServiceDataHolder;
import org.wso2.carbon.registry.api.Resource;
import org.wso2.carbon.registry.core.Collection;
import org.wso2.carbon.registry.core.CollectionImpl;
import org.wso2.carbon.registry.core.Registry;
import org.wso2.carbon.registry.core.ResourceImpl;
import org.wso2.carbon.registry.core.exceptions.RegistryException;
import org.wso2.carbon.registry.core.session.UserRegistry;
import org.wso2.carbon.user.api.Tenant;
import org.wso2.carbon.user.api.UserStoreException;
import org.wso2.carbon.user.core.util.UserCoreUtil;
import org.wso2.carbon.utils.multitenancy.MultitenantConstants;

import static org.apache.commons.lang.ArrayUtils.isEmpty;
import static org.apache.commons.lang.StringUtils.isNotBlank;
import static org.wso2.carbon.identity.securitycode.migration.MigrationConstants.CONFIRMATION_REGISTRY_RESOURCE_PATH;
import static org.wso2.carbon.identity.securitycode.migration.MigrationConstants.EXPIRE_TIME_PROPERTY;
import static org.wso2.carbon.identity.securitycode.migration.MigrationConstants.PW_RESET_CODE_DELIMITER;
import static org.wso2.carbon.identity.securitycode.migration.MigrationConstants.REG_DELIMITER;
import static org.wso2.carbon.identity.securitycode.migration.MigrationConstants.SELF_SIGN_UP_CODE_DELIMITER;
import static org.wso2.carbon.identity.securitycode.migration.MigrationConstants.USER_ID_PROPERTY;

public class SecurityCodeMigrationService {

    private static Log log = LogFactory.getLog(SecurityCodeMigrationService.class);

    public void migrateAllTenants() {

        try {
            Tenant[] tenants = getAllTenants();
            migrateSuperTenantSecurityCodes();
            for (Tenant tenant : tenants) {
                migrateSecurityCodes(tenant.getDomain(), tenant.getId());
            }
        } catch (UserStoreException e) {
            log.error("Error while get all tenants. Security Migration skipped.", e);
        }
    }

    public void migrateTenants(String[] tenantDomains) {

        for (String tenantDomain : tenantDomains) {
            if (log.isDebugEnabled()) {
                log.debug("Started migrating security codes tenant: " + tenantDomain);
            }
            try {
                int tenantId = IdentityTenantUtil.getTenantId(tenantDomain);
                migrateSecurityCodes(tenantDomain, tenantId);
            } catch (IdentityRuntimeException e) {
                log.error("Invalid tenant domain: " + tenantDomain);
            }
        }
    }

    private Tenant[] getAllTenants() throws UserStoreException {

        return IdentityCodeMigrationServiceDataHolder.getRealmService().getTenantManager().getAllTenants();
    }

    private void migrateSuperTenantSecurityCodes() {

        migrateSecurityCodes(MultitenantConstants.SUPER_TENANT_DOMAIN_NAME, MultitenantConstants.SUPER_TENANT_ID);
    }

    private void migrateSecurityCodes(String tenantDomain, int tenantId) {

        startTenantFlow(tenantDomain);
        try {
            IdentityTenantUtil.getTenantRegistryLoader().loadTenantRegistry(tenantId);
            Registry registry = getConfigSystemRegistry(tenantId);
            String[] identityResourcesPaths = getIdentityResourcesPaths(registry);
            if (!isEmpty(identityResourcesPaths)) {
                for (String path : identityResourcesPaths) {
                    if (log.isDebugEnabled()) {
                        log.debug("The resource path :" + path);
                    }

                    Resource currentResource = registry.get(path);
                    if (currentResource instanceof CollectionImpl) {
                        String[] resources = ((CollectionImpl) currentResource).getChildren();
                        for (String resource : resources) {
                            if (log.isDebugEnabled()) {
                                log.debug("Migrating resource :" + registry.get(resource) + "of tenant :" + tenantDomain);
                            }
                            migrateCodeFromRegistryResource(tenantDomain, registry.get(resource));
                        }
                    } else if (currentResource instanceof ResourceImpl) {
                        migrateCodeFromRegistryResource(tenantDomain, currentResource);
                    }

                }
            }
        } catch (RegistryException e) {
            log.error("Error occurred while migrating codes of tenant: " + tenantDomain);
            if (log.isDebugEnabled()) {
                log.error(e);
            }
        } finally {
            PrivilegedCarbonContext.endTenantFlow();
        }
    }

    private void migrateCodeFromRegistryResource(String tenantDomain, Resource currentResource) {

        if (isCodeNotValid(currentResource)) {
            if (log.isDebugEnabled()) {
                log.debug("The code in the current resource: " + currentResource + "  is not valid, its Expired for" +
                        " the tenant domain : " + tenantDomain);
            }
            return;
        }
        String resourceName = currentResource.getPath().replace(CONFIRMATION_REGISTRY_RESOURCE_PATH, "");
        String userId = UserCoreUtil.addTenantDomainToEntry(currentResource.getProperty
                (USER_ID_PROPERTY), tenantDomain);
        User user = User.getUserFromUserName(userId);
        if (resourceName.startsWith(SELF_SIGN_UP_CODE_DELIMITER)) {
            migrateSelfRegistrationCode(resourceName, user);
        } else if (resourceName.startsWith(PW_RESET_CODE_DELIMITER)) {
            migratePasswordResetOrAskPasswordsCode(resourceName, user);
        }
    }

    private String[] getIdentityResourcesPaths(Registry registry) throws RegistryException {

        Collection identityDataResource = (Collection) registry.get(CONFIRMATION_REGISTRY_RESOURCE_PATH);
        return identityDataResource.getChildren();
    }

    private UserRegistry getConfigSystemRegistry(int tenantId) throws RegistryException {

        return IdentityCodeMigrationServiceDataHolder.getRegistryService().
                getConfigSystemRegistry(tenantId);
    }

    private boolean isCodeNotValid(Resource currentResource) {

        long currentTimeMillis = System.currentTimeMillis();
        long resourceExpireTime = Long.parseLong(currentResource.getProperty(EXPIRE_TIME_PROPERTY));
        return currentTimeMillis > resourceExpireTime;
    }

    private void migrateSelfRegistrationCode(String resourceName, User user) {

        String secretKey = extractSecurityKey(resourceName);
        if (isNotBlank(secretKey)) {
            if (log.isDebugEnabled()) {
                log.debug("Migrating self sign-up code of user: " + user.toFullQualifiedUsername());
            }
            UserRecoveryDataStore userRecoveryDataStore = JDBCRecoveryDataStore.getInstance();
            UserRecoveryData recoveryDataDO = new UserRecoveryData(user, secretKey, RecoveryScenarios
                    .SELF_SIGN_UP, RecoverySteps.CONFIRM_SIGN_UP);
            try {
                userRecoveryDataStore.store(recoveryDataDO);
            } catch (IdentityRecoveryException e) {
                log.error("Error while migrating self sign-up code of user: " + user.toFullQualifiedUsername());
            }
        } else {
            log.warn("Invalid code: " + secretKey);
        }
    }

    private void migratePasswordResetOrAskPasswordsCode(String resourceName, User user) {

        String secretKey = extractSecurityKey(resourceName);
        if (isNotBlank(secretKey)) {
            if (log.isDebugEnabled()) {
                log.debug("Migrating password reset code of user: " + user.toFullQualifiedUsername());
            }
            UserRecoveryDataStore userRecoveryDataStore = JDBCRecoveryDataStore.getInstance();
            UserRecoveryData recoveryDataDO = new UserRecoveryData(user, secretKey, RecoveryScenarios
                    .NOTIFICATION_BASED_PW_RECOVERY, RecoverySteps.UPDATE_PASSWORD);
            try {
                userRecoveryDataStore.store(recoveryDataDO);
            } catch (IdentityRecoveryException e) {
                log.error("Error while migrating security code of user: " + user.toFullQualifiedUsername());
            }
        } else {
            log.warn("Invalid code: " + secretKey);
        }
    }

    private void startTenantFlow(String tenantDomain) {

        PrivilegedCarbonContext.startTenantFlow();
        PrivilegedCarbonContext.getThreadLocalCarbonContext().setTenantDomain(tenantDomain, true);
    }

    private String extractSecurityKey(String code) {

        String[] splitCodes = code.split(REG_DELIMITER);
        if (!isEmpty(splitCodes) && splitCodes.length == 3) {
            return splitCodes[2];
        }
        return null;
    }
}
