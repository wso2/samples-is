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

import org.wso2.carbon.identity.application.authentication.framework.config.model.graph.js.JsAuthenticationContext;

import java.util.List;

/**
 * Function definition for retrieving federated associations of a user.
 */
@FunctionalInterface
public interface GetFederatedAssociationsFunction {

    /**
     * Retrieve the federated associations for a given user.
     *
     * @param context         JsAuthenticationContext instance.
     * @param loginIdentifier Optional login identifier of the user.
     * @return List of JSAssociatedAccount instances representing federated associations.
     */
    List<String> getFederatedAssociations(JsAuthenticationContext context, String loginIdentifier);
}
