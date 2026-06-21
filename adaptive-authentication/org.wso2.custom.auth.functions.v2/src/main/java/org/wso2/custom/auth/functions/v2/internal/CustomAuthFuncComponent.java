/*
 * Copyright (c) 2025, WSO2 LLC. (http://www.wso2.com).
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

package org.wso2.custom.auth.functions.v2.internal;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.osgi.service.component.ComponentContext;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ReferenceCardinality;
import org.osgi.service.component.annotations.ReferencePolicy;
import org.wso2.carbon.identity.application.authentication.framework.JsFunctionRegistry;
import org.wso2.carbon.identity.user.profile.mgt.association.federation.FederatedAssociationManager;
import org.wso2.carbon.registry.core.service.RegistryService;
import org.wso2.carbon.user.core.service.RealmService;
import org.wso2.custom.auth.functions.v2.GetFederatedAssociationsFunctionImpl;

@Component(
        name = "custom.auth.functions.component",
        immediate = true
)
public class CustomAuthFuncComponent {

    private static final Log LOG = LogFactory.getLog(CustomAuthFuncComponent.class);
    private static JsFunctionRegistry jsFunctionRegistry;

    @Activate
    protected void activate(ComponentContext ctxt) {

        jsFunctionRegistry.register(JsFunctionRegistry.Subsystem.SEQUENCE_HANDLER, "getFederatedAssociations",
                new GetFederatedAssociationsFunctionImpl());
    }

    @Deactivate
    protected void deactivate(ComponentContext ctxt) {

        if (jsFunctionRegistry != null) {
            jsFunctionRegistry.deRegister(JsFunctionRegistry.Subsystem.SEQUENCE_HANDLER, "getFederatedAssociations");
        }
    }

    @Reference(
            name = "user.realmservice.default",
            service = RealmService.class,
            cardinality = ReferenceCardinality.MANDATORY,
            policy = ReferencePolicy.DYNAMIC,
            unbind = "unsetRealmService"
    )
    protected void setRealmService(RealmService realmService) {

        if (LOG.isDebugEnabled()) {
            LOG.debug("RealmService is set in the custom conditional authentication user functions bundle");
        }
        CustomAuthFuncHolder.getInstance().setRealmService(realmService);
    }

    protected void unsetRealmService(RealmService realmService) {

        if (LOG.isDebugEnabled()) {
            LOG.debug("RealmService is unset in the custom conditional authentication user functions bundle");
        }
        CustomAuthFuncHolder.getInstance().setRealmService(null);
    }

    @Reference(
            name = "registry.service",
            service = RegistryService.class,
            cardinality = ReferenceCardinality.MANDATORY,
            policy = ReferencePolicy.DYNAMIC,
            unbind = "unsetRegistryService"
    )
    protected void setRegistryService(RegistryService registryService) {

        if (LOG.isDebugEnabled()) {
            LOG.debug("RegistryService is set in the custom conditional authentication user functions bundle");
        }
        CustomAuthFuncHolder.getInstance().setRegistryService(registryService);
    }

    protected void unsetRegistryService(RegistryService registryService) {

        if (LOG.isDebugEnabled()) {
            LOG.debug("RegistryService is unset in the custom conditional authentication user functions bundle");
        }
        CustomAuthFuncHolder.getInstance().setRegistryService(null);
    }

    @Reference(
            service = JsFunctionRegistry.class,
            cardinality = ReferenceCardinality.MANDATORY,
            policy = ReferencePolicy.DYNAMIC,
            unbind = "unsetJsFunctionRegistry"
    )
    public void setJsFunctionRegistry(JsFunctionRegistry jsFunctionRegistry) {

        this.jsFunctionRegistry = jsFunctionRegistry;
    }

    public void unsetJsFunctionRegistry(JsFunctionRegistry jsFunctionRegistry) {

        this.jsFunctionRegistry = null;
    }

    @Reference(
            name = "identity.user.profile.mgt.component",
            service = FederatedAssociationManager.class,
            cardinality = ReferenceCardinality.MANDATORY,
            policy = ReferencePolicy.DYNAMIC,
            unbind = "unsetFederatedAssociationManagerService"
    )
    protected void setFederatedAssociationManagerService(FederatedAssociationManager
                                                                 federatedAssociationManagerService) {

        if (LOG.isDebugEnabled()) {
            LOG.debug("Federated Association Manager Service is set in the Application Authentication Framework " +
                    "bundle");
        }
        CustomAuthFuncHolder.getInstance().setFederatedAssociationManager(federatedAssociationManagerService);
    }

    protected void unsetFederatedAssociationManagerService(FederatedAssociationManager
                                                                   federatedAssociationManagerService) {

        if (LOG.isDebugEnabled()) {
            LOG.debug("Federated Association Manager Service is unset in the Application Authentication Framework " +
                    "bundle");
        }
        CustomAuthFuncHolder.getInstance().setFederatedAssociationManager(null);
    }
}
