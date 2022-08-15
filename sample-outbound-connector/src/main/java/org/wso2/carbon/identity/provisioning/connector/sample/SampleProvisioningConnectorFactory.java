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
import org.wso2.carbon.identity.provisioning.AbstractProvisioningConnectorFactory;
import org.wso2.carbon.identity.provisioning.IdentityProvisioningException;

import java.util.ArrayList;
import java.util.List;

/**
 * This class creates the sample connector factory.
 */
public class SampleProvisioningConnectorFactory extends AbstractProvisioningConnectorFactory {

    private static final Log LOG = LogFactory.getLog(SampleProvisioningConnectorFactory.class);
    private static final String CONNECTOR_TYPE = "Sample";

    @Override
    protected AbstractOutboundProvisioningConnector buildConnector(Property[] provisioningProperties) throws
            IdentityProvisioningException {

        SampleProvisioningConnector connector = new SampleProvisioningConnector();
        connector.init(provisioningProperties);
        if (LOG.isDebugEnabled()) {
            LOG.debug("Sample provisioning connector created successfully.");
        }
        return connector;
    }

    @Override
    public String getConnectorType() {
        return CONNECTOR_TYPE;
    }

    @Override
    public List<Property> getConfigurationProperties() {

        Property clientId = new Property();
        clientId.setName(SampleConnectorConstants.SAMPLE_CLIENT_ID);
        clientId.setDisplayName("Client ID");
        clientId.setDisplayOrder(1);
        clientId.setRequired(true);

        Property clientSecret = new Property();
        clientSecret.setName(SampleConnectorConstants.SAMPLE_CLIENT_SECRET);
        clientSecret.setDisplayName("Client Secret");
        clientSecret.setConfidential(true);
        clientSecret.setDisplayOrder(2);
        clientSecret.setRequired(true);

        Property username = new Property();
        username.setName(SampleConnectorConstants.SAMPLE_USERNAME);
        username.setDisplayName("Username");
        username.setDescription("Username for the external system");
        username.setDisplayOrder(3);
        username.setRequired(true);

        Property password = new Property();
        password.setName(SampleConnectorConstants.SAMPLE_PASSWORD);
        password.setDisplayName("Password");
        password.setDisplayOrder(4);
        password.setRequired(true);

        List<Property> properties = new ArrayList<>();
        properties.add(clientId);
        properties.add(clientSecret);
        properties.add(username);
        properties.add(password);
        return properties;
    }
}
