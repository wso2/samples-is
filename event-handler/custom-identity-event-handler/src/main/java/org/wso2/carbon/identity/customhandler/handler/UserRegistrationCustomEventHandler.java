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

package org.wso2.carbon.identity.customhandler.handler;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.wso2.carbon.identity.base.IdentityRuntimeException;
import org.wso2.carbon.identity.core.bean.context.MessageContext;
import org.wso2.carbon.identity.core.handler.InitConfig;
import org.wso2.carbon.identity.event.IdentityEventConstants;
import org.wso2.carbon.identity.event.event.Event;
import org.wso2.carbon.identity.event.handler.AbstractEventHandler;

public class UserRegistrationCustomEventHandler extends AbstractEventHandler {

    private static final Log log = LogFactory.getLog(UserRegistrationCustomEventHandler.class);

    @Override
    public String getName() {

        return "customUserRegistration";
    }

    public void handleEvent(Event event) {

        if (IdentityEventConstants.Event.PRE_ADD_USER.equals(event.getEventName())) {
            String tenantDomain = (String) event.getEventProperties().get(
                    IdentityEventConstants.EventProperty.TENANT_DOMAIN);
            String username = (String) event.getEventProperties().get(IdentityEventConstants.EventProperty.USER_NAME);
            log.info("Handling the event before adding user: " + username + " in tenant domain: " + tenantDomain);
            // You can write any code here to handle the event.
        }

        if (IdentityEventConstants.Event.POST_ADD_USER.equals(event.getEventName())) {
            String tenantDomain = (String) event.getEventProperties()
                    .get(IdentityEventConstants.EventProperty.TENANT_DOMAIN);
            String userName = (String) event.getEventProperties().get(IdentityEventConstants.EventProperty.USER_NAME);
            log.info("Handling the event after adding user: " + userName + " in tenant domain: " + tenantDomain);
            // You can write any code here to handle the event.
        }
    }

    @Override
    public void init(InitConfig configuration) throws IdentityRuntimeException {

        super.init(configuration);
    }

    @Override
    public int getPriority(MessageContext messageContext) {

        return 250;
    }
}
