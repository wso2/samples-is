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

package org.wso2.custom.auth.functions.v2;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.graalvm.polyglot.HostAccess;
import org.wso2.carbon.identity.application.authentication.framework.config.model.graph.js.JsAuthenticationContext;
import org.wso2.carbon.identity.core.util.IdentityTenantUtil;
import org.wso2.carbon.identity.user.profile.mgt.AssociatedAccountDTO;
import org.wso2.carbon.identity.user.profile.mgt.association.federation.exception.FederatedAssociationManagerException;
import org.wso2.custom.auth.functions.v2.internal.CustomAuthFuncHolder;

import java.util.ArrayList;
import java.util.List;

/**
 * Implementation of GetFederatedAssociationsFunction.
 */
public class GetFederatedAssociationsFunctionImpl implements GetFederatedAssociationsFunction {

    private static final Log LOG = LogFactory.getLog(GetFederatedAssociationsFunctionImpl.class);

    @Override
    @HostAccess.Export
    public List<String> getFederatedAssociations(JsAuthenticationContext context, String loginIdentifier) {

        List<AssociatedAccountDTO> federatedAssociations = new ArrayList<>();
        try {
            String tenantDomain = context.getWrapped().getTenantDomain();
            int tenantId = IdentityTenantUtil.getTenantId(tenantDomain);
            String userDomain = "PRIMARY";
            String username;
            if (loginIdentifier != null) {
                username = loginIdentifier;
                if (loginIdentifier.contains("/")) {
                    String[] parts = loginIdentifier.split("/", 2);
                    userDomain = parts[0];
                    username = parts[1];
                }
            } else {
                username = context.getWrapped().getSubject().getUserName();
                userDomain = context.getWrapped().getSubject().getUserStoreDomain();
            }
            federatedAssociations = CustomAuthFuncHolder.getInstance().getFederatedAssociationManager()
                    .getFederatedAssociationsOfUser(tenantId, userDomain, username);
        } catch (FederatedAssociationManagerException e) {
            LOG.error("Error while retrieving federated associations.", e);
        }

        List<String> jsAssociatedAccounts = new ArrayList<>();
        for (AssociatedAccountDTO associatedAccountDTO : federatedAssociations) {
            jsAssociatedAccounts.add(associatedAccountDTO.getIdentityProviderName());
        }
        return jsAssociatedAccounts;
    }
}
