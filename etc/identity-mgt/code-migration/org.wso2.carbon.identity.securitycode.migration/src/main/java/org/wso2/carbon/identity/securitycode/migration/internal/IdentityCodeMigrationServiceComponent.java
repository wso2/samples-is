/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.wso2.carbon.identity.securitycode.migration.internal;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.osgi.service.component.ComponentContext;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ReferenceCardinality;
import org.osgi.service.component.annotations.ReferencePolicy;
import org.wso2.carbon.identity.core.util.IdentityCoreInitializedEvent;
import org.wso2.carbon.identity.securitycode.migration.service.SecurityCodeMigrationService;
import org.wso2.carbon.registry.core.service.RegistryService;
import org.wso2.carbon.user.core.service.RealmService;

import static org.apache.commons.lang.StringUtils.isBlank;
import static org.apache.commons.lang.StringUtils.isNotBlank;
import static org.wso2.carbon.identity.securitycode.migration.MigrationConstants.SYSTEM_PROPERTY_MIGRATE;
import static org.wso2.carbon.identity.securitycode.migration.MigrationConstants.SYSTEM_PROPERTY_MIGRATE_TENANTS;
import static org.wso2.carbon.identity.securitycode.migration.MigrationConstants.SYSTEM_PROPERTY_MIGRATE_TENANT_RANGE;
import static org.wso2.carbon.identity.securitycode.migration.MigrationConstants.SYSTEM_PROPERTY_START_TENANT;
import static org.wso2.carbon.identity.securitycode.migration.MigrationConstants.SYSTEM_PROPERTY_TENANT_COUNT;
import static org.wso2.carbon.identity.securitycode.migration.MigrationConstants.TENANT_DELIMITER;

@Component(
        name = "IdentityCodeMigrationServiceComponent",
        immediate = true
)
public class IdentityCodeMigrationServiceComponent {

    private static final Log log = LogFactory.getLog(IdentityCodeMigrationServiceComponent.class);

    @Activate
    protected void activate(ComponentContext context) {

        if (log.isDebugEnabled()) {
            log.debug("Security code migration bundle is activated");
        }

        SecurityCodeMigrationService securityCodeMigrationService = new SecurityCodeMigrationService();
        String migrateCode = System.getProperty(SYSTEM_PROPERTY_MIGRATE);
        String tenantsToMigrate = System.getProperty(SYSTEM_PROPERTY_MIGRATE_TENANTS);
        String tenantRangeMigrate = System.getProperty(SYSTEM_PROPERTY_MIGRATE_TENANT_RANGE);
        String startTenant = System.getProperty(SYSTEM_PROPERTY_START_TENANT);
        String tenantCount = System.getProperty(SYSTEM_PROPERTY_TENANT_COUNT);

        if (log.isDebugEnabled()) {
            log.debug("MigrateCode: " + migrateCode);
            log.debug("All tenant Migrate: " + tenantsToMigrate);
            log.debug ("Tenant range Migrate: " + tenantRangeMigrate);
            log.debug ("Tenant Start Count: " + tenantCount);
        }

        try {
            if (Boolean.parseBoolean(migrateCode) && isNotBlank(tenantsToMigrate)) {
                String[] tenantDomains = tenantsToMigrate.split(TENANT_DELIMITER);
                securityCodeMigrationService.migrateTenants(tenantDomains);
            } else if (Boolean.parseBoolean(migrateCode)) {
                if (Boolean.parseBoolean(tenantRangeMigrate)) {
                    if (log.isDebugEnabled()) {
                        log.debug("Migrating security codes of a given tenant range started");
                    }
                    securityCodeMigrationService.migrateTenantRange(Integer.parseInt(startTenant),
                            Integer.parseInt(tenantCount));

                } else if(isBlank(tenantsToMigrate)) {
                    if (log.isDebugEnabled()) {
                        log.debug("Migrating security codes of all tenants started");
                    }
                    securityCodeMigrationService.migrateAllTenants();
                    if (log.isDebugEnabled()) {
                        log.debug("Migrating security codes of all tenants ended");
                    }
                }

            }
        } catch (Throwable throwable) {
            log.error(throwable);
        }
    }

    protected void deactivate(ComponentContext context) {

        if (log.isDebugEnabled()) {
            log.debug("Security code migration bundle is de-activated");
        }
    }

    @Reference(
            name = "realm.service",
            service = RealmService.class,
            cardinality = ReferenceCardinality.MANDATORY,
            policy = ReferencePolicy.DYNAMIC,
            unbind = "unsetRealmService"
    )
    protected void setRealmService(RealmService realmService) {

        log.debug("Setting the Realm Service");
        IdentityCodeMigrationServiceDataHolder.setRealmService(realmService);
    }

    protected void unsetRealmService(RealmService realmService) {

        log.debug("UnSetting the Realm Service");
        IdentityCodeMigrationServiceDataHolder.setRealmService(null);
    }

    @Reference(
            name = "registry.service",
            service = RegistryService.class,
            cardinality = ReferenceCardinality.MANDATORY,
            policy = ReferencePolicy.DYNAMIC,
            unbind = "unsetRegistryService"
    )
    protected void setRegistryService(RegistryService registryService) {

        log.debug("Setting the Registry Service");
        IdentityCodeMigrationServiceDataHolder.setRegistryService(registryService);
    }

    protected void unsetRegistryService(RegistryService registryService) {

        log.debug("UnSetting the Registry Service");
        IdentityCodeMigrationServiceDataHolder.setRegistryService(null);
    }

    @Reference(
            name = "identityCoreInitializedEventService",
            service = IdentityCoreInitializedEvent.class,
            cardinality = ReferenceCardinality.MANDATORY,
            policy = ReferencePolicy.DYNAMIC,
            unbind = "unsetIdentityCoreInitializedEventService"
    )
    protected void setIdentityCoreInitializedEventService(IdentityCoreInitializedEvent identityCoreInitializedEvent) {
        /* reference IdentityCoreInitializedEvent service to guarantee that this component will wait until identity core
         is started */
    }

    protected void unsetIdentityCoreInitializedEventService(IdentityCoreInitializedEvent identityCoreInitializedEvent) {
        /* reference IdentityCoreInitializedEvent service to guarantee that this component will wait until identity core
         is started */
    }

    private boolean migrateAll(String migrateCode, String tenantsToMigrate) {

        return Boolean.parseBoolean(migrateCode) && isBlank(tenantsToMigrate);
    }
}

