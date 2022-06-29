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

package org.wso2.carbon.identity.customhandler.internal;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.osgi.framework.BundleContext;
import org.osgi.service.component.ComponentContext;
import org.wso2.carbon.identity.event.handler.AbstractEventHandler;
import org.wso2.carbon.identity.customhandler.handler.UserRegistrationCustomEventHandler;
import org.wso2.carbon.user.core.service.RealmService;

/**
 * @scr.component name="org.wso2.carbon.identity.customhandler.internal.UserRegistrationCustomEventHandlerComponent" immediate="true"
 * @scr.reference name="realm.service"
 * interface="org.wso2.carbon.user.core.service.RealmService" cardinality="1..1"
 * policy="dynamic" bind="setRealmService" unbind="unsetRealmService"
 */
public class UserRegistrationCustomEventHandlerComponent {

    private static Log log = LogFactory.getLog(UserRegistrationCustomEventHandlerComponent.class);
    private UserRegistrationCustomEventHandlerDataHolder dataHolder = UserRegistrationCustomEventHandlerDataHolder
            .getInstance();

    protected void activate(ComponentContext context) {
        try {
            BundleContext bundleContext = context.getBundleContext();
            bundleContext.registerService(AbstractEventHandler.class.getName(), new UserRegistrationCustomEventHandler(),
                    null);
        } catch (Exception e) {
            log.error("Error while activating custom User selfRegistration handler component.", e);
        }
    }

    protected void deactivate(ComponentContext context) {
        if (log.isDebugEnabled()) {
            log.debug("custom self registration handler is de-activated");
        }
    }

    protected void setRealmService(RealmService realmService) {
        if (log.isDebugEnabled()) {
            log.debug("Setting the Realm Service");
        }
        dataHolder.setRealmService(realmService);
    }

    protected void unsetRealmService(RealmService realmService) {
        log.debug("UnSetting the Realm Service");
        dataHolder.setRealmService(null);
    }
}

