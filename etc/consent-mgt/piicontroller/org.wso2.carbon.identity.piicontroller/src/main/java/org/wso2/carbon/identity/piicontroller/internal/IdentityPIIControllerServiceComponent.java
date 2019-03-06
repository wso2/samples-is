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

package org.wso2.carbon.identity.piicontroller.internal;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.osgi.framework.BundleContext;
import org.osgi.service.component.ComponentContext;
import org.wso2.carbon.consent.mgt.core.connector.PIIController;
import org.wso2.carbon.identity.governance.IdentityGovernanceService;
import org.wso2.carbon.identity.governance.common.IdentityConnectorConfig;
import org.wso2.carbon.identity.piicontroller.connector.ConsentMgtConfigImpl;

/**
 * @scr.component name="IdentityPIIControllerServiceComponent" immediate="true"
 * @scr.reference name="IdentityGovernanceService"
 * interface="org.wso2.carbon.identity.governance.IdentityGovernanceService" cardinality="1..1"
 * policy="dynamic" bind="setIdentityGovernanceService" unbind="unsetIdentityGovernanceService"
 */
public class IdentityPIIControllerServiceComponent {

    private static Log log = LogFactory.getLog(IdentityPIIControllerServiceComponent.class);
    private IdentityGovernanceService identityGovernanceService;

    protected void activate(ComponentContext context) {

        try {
            BundleContext bundleContext = context.getBundleContext();
            ConsentMgtConfigImpl consentMgtConfig = new ConsentMgtConfigImpl(identityGovernanceService);
            bundleContext.registerService(IdentityConnectorConfig.class.getName(), consentMgtConfig,
                    null);
            bundleContext.registerService(PIIController.class.getName(), consentMgtConfig, null);
        } catch (Exception e) {
            log.error("Error while activating pii controller sample component.", e);
        }
    }

    protected void deactivate(ComponentContext context) {

        if (log.isDebugEnabled()) {
            log.debug("PII controller bundle is de-activated");
        }
    }

    protected void unsetIdentityGovernanceService(IdentityGovernanceService idpManager) {

        if (log.isDebugEnabled()) {
            log.debug("Identity Governance service is unset from PII Controller sample");
        }
        identityGovernanceService = null;
    }

    protected void setIdentityGovernanceService(IdentityGovernanceService identityGovernanceService) {

        if (log.isDebugEnabled()) {
            log.debug("Identity Governance service is set form PII Controller sample");
        }
        this.identityGovernanceService = identityGovernanceService;
    }
}
