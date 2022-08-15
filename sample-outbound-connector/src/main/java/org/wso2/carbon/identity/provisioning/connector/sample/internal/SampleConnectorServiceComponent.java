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

package org.wso2.carbon.identity.provisioning.connector.sample.internal;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.osgi.service.component.ComponentContext;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.wso2.carbon.identity.provisioning.AbstractProvisioningConnectorFactory;
import org.wso2.carbon.identity.provisioning.connector.sample.SampleProvisioningConnectorFactory;

/**
 * Registers the connector as an osgi component.
 */
@Component(
        name = "identity.outbound.provisioning.sample.component",
        immediate = true
)
public class SampleConnectorServiceComponent {

    private static Log LOG = LogFactory.getLog(SampleConnectorServiceComponent.class);

    @Activate
    protected void activate(ComponentContext context) {

        if (LOG.isDebugEnabled()) {
            LOG.debug("Activating SampleConnectorServiceComponent");
        }
        try {
            SampleProvisioningConnectorFactory provisioningConnectorFactory = new
                    SampleProvisioningConnectorFactory();
            context.getBundleContext().registerService(AbstractProvisioningConnectorFactory.class.getName(),
                    provisioningConnectorFactory, null);
            if (LOG.isDebugEnabled()) {
                LOG.debug("Sample Outbound Provisioning Connector bundle is activated");
            }
        } catch (Throwable e) {
            LOG.error("Error while activating Sample Identity Provisioning Connector ", e);
        }
    }
}
