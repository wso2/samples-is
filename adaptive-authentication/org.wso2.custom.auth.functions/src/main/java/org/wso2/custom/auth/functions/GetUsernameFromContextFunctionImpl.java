/*
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com).
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

package org.wso2.custom.auth.functions;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.wso2.carbon.identity.application.authentication.framework.config.model.StepConfig;
import org.wso2.carbon.identity.application.authentication.framework.config.model.graph.js.JsAuthenticationContext;

import java.util.Map;

public class GetUsernameFromContextFunctionImpl implements GetUsernameFromContextFunction {

    private static final Log LOG = LogFactory.getLog(GetUsernameFromContextFunctionImpl.class);

    @Override
    public String getUsernameFromContext(JsAuthenticationContext context, int step) {

        String username = null;
        Map<Integer, StepConfig> stepMap = context.getContext().getSequenceConfig().getStepMap();
        if (stepMap == null) {
            LOG.error("StepMap is null in the SequenceConfig.");
        } else if (stepMap.get(step) == null) {
            LOG.error("Step " + step + " is not found in the StepMap.");
        } else if (stepMap.get(step).getAuthenticatedUser() == null) {
            LOG.error("AuthenticatedUser is null in the step " + step + ".");
        } else {
            username = stepMap.get(step).getAuthenticatedUser().getUserName();
        }

        return username;
    }
}
