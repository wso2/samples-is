/*
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.wso2.carbon.identity.custom.claim.provider.internal;

import org.wso2.carbon.identity.custom.claim.provider.CustomClaimProvider;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.osgi.service.component.ComponentContext;
import org.wso2.carbon.identity.openidconnect.ClaimProvider;
import org.wso2.carbon.user.core.service.RealmService;

/**
 * @scr.component name="org.wso2.carbon.identity.custom.claim.provider.internal.CustomClaimProviderServiceComponent" immediate="true"
 * @scr.reference name="realm.service"
 * interface="org.wso2.carbon.user.core.service.RealmService"cardinality="1..1"
 * policy="dynamic" bind="setRealmService" unbind="unsetRealmService"
 */
public class CustomClaimProviderServiceComponent {

    private static final Log log = LogFactory.getLog(CustomClaimProviderServiceComponent.class);

    private static RealmService realmService;

    public static RealmService getRealmService() {
        return realmService;
    }

    protected void activate(ComponentContext context) {

        try {
            CustomClaimProvider customClaimProvider
                    = new CustomClaimProvider();
            context.getBundleContext().registerService(ClaimProvider.class.getName(),
                    customClaimProvider, null);
        } catch (Throwable e) {
            log.error("Error while activating custom claim provider service component", e);
        }
        if (log.isDebugEnabled()) {
            log.debug("Custom claim provider service component activate success");
        }
    }


    protected void deactivate(ComponentContext ctxt) {

        if (log.isDebugEnabled()) {
            log.info("BasicCustomAuthenticator bundle is deactivated");
        }
    }

    protected void unsetRealmService(RealmService realmService) {

        log.debug("UnSetting the Realm Service");
        CustomClaimProviderServiceComponent.realmService = null;
    }

    protected void setRealmService(RealmService realmService) {

        log.debug("Setting the Realm Service");
        CustomClaimProviderServiceComponent.realmService = realmService;
    }
}
