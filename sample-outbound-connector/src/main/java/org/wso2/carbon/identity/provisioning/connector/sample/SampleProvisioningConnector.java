/*
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

package org.wso2.carbon.identity.provisioning.connector.sample;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.wso2.carbon.identity.application.common.model.Property;
import org.wso2.carbon.identity.provisioning.AbstractOutboundProvisioningConnector;
import org.wso2.carbon.identity.provisioning.IdentityProvisioningConstants;
import org.wso2.carbon.identity.provisioning.IdentityProvisioningException;
import org.wso2.carbon.identity.provisioning.ProvisionedIdentifier;
import org.wso2.carbon.identity.provisioning.ProvisioningEntity;
import org.wso2.carbon.identity.provisioning.ProvisioningEntityType;
import org.wso2.carbon.identity.provisioning.ProvisioningOperation;

import java.util.Properties;

/**
 * This class handles the user provisioning operations to the desired system.
 */
public class SampleProvisioningConnector extends AbstractOutboundProvisioningConnector {

    private static final Log LOG = LogFactory.getLog(SampleProvisioningConnector.class);
    private SampleProvisioningConnectorConfig configHolder;

    @Override
    public void init(Property[] provisioningProperties) throws IdentityProvisioningException {

        Properties configs = new Properties();

        if (provisioningProperties != null && provisioningProperties.length > 0) {
            for (Property property : provisioningProperties) {
                configs.put(property.getName(), property.getValue());
                if (IdentityProvisioningConstants.JIT_PROVISIONING_ENABLED.equals(property.getName())) {
                    if (SampleConnectorConstants.PROPERTY_VALUE_TRUE.equals(property.getValue())) {
                        jitProvisioningEnabled = true;
                    }
                }
            }
        }
        configHolder = new SampleProvisioningConnectorConfig(configs);
    }

    @Override
    public ProvisionedIdentifier provision(ProvisioningEntity provisioningEntity)
            throws IdentityProvisioningException {

        String provisionedId = null;

        if (provisioningEntity != null) {

            if (provisioningEntity.isJitProvisioning() && !isJitProvisioningEnabled()) {
                LOG.debug("JIT provisioning disabled for Office365 connector");
                return null;
            }

            if (ProvisioningEntityType.USER == provisioningEntity.getEntityType()) {
                if (ProvisioningOperation.DELETE == provisioningEntity.getOperation()) {
                    deleteUser(provisioningEntity);
                } else if (ProvisioningOperation.POST == provisioningEntity.getOperation()) {
                    provisionedId = createUser(provisioningEntity);
                } else if (ProvisioningOperation.PUT == provisioningEntity.getOperation()) {
                    updateUser(provisioningEntity);
                } else {
                    LOG.warn("Unsupported provisioning operation " + provisioningEntity.getOperation() +
                            " for entity type " + provisioningEntity.getEntityType());
                }
            } else {
                LOG.warn("Unsupported provisioning entity type " + provisioningEntity.getEntityType());
            }
        }

        // Creates a provisioned identifier for the provisioned user.
        ProvisionedIdentifier identifier = new ProvisionedIdentifier();
        identifier.setIdentifier(provisionedId);
        return identifier;
    }

    private String createUser(ProvisioningEntity provisioningEntity) {

        // Implement user creation logic.
        String provisionedId = null;
        LOG.info("Creating the copy of the user in the external system.");
        return provisionedId;
    }

    private void deleteUser(ProvisioningEntity provisioningEntity) {

        // Implement user deletion logic.
        LOG.info("Delete the user account from the external system.");
    }

    private void updateUser(ProvisioningEntity provisioningEntity) {

        // Implement user update logic.
        LOG.info("Update user account in the external system.");
    }
}
