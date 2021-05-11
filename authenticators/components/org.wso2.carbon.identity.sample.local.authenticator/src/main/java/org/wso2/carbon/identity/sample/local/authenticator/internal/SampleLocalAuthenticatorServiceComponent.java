/*
 * Copyright (c)  2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

package org.wso2.carbon.identity.sample.local.authenticator.internal;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.osgi.service.component.ComponentContext;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ReferenceCardinality;
import org.osgi.service.component.annotations.ReferencePolicy;
import org.wso2.carbon.identity.application.authentication.framework.ApplicationAuthenticator;
import org.wso2.carbon.identity.sample.local.authenticator.SampleLocalAuthenticator;
import org.wso2.carbon.user.core.service.RealmService;

@Component(
        name = "sample.local.auth.component",
        immediate = true)
public class SampleLocalAuthenticatorServiceComponent {

    private static Log log = LogFactory.getLog(SampleLocalAuthenticatorServiceComponent.class);

    private static RealmService realmService;

    @Activate
    protected void activate(ComponentContext ctxt) {

        try {
            SampleLocalAuthenticator sampleLocalAuthenticator = new SampleLocalAuthenticator();
            ctxt.getBundleContext().registerService(ApplicationAuthenticator.class.getName(),
                    sampleLocalAuthenticator, null);
            if (log.isDebugEnabled()) {
                log.debug("SampleLocalAuthenticator bundle is activated");
            }
        } catch (Throwable e) {
            log.error("SampleLocalAuthenticator bundle activation failed.", e);
        }
    }

    @Deactivate
    protected void deactivate(ComponentContext ctxt) {

        if (log.isDebugEnabled()) {
            log.debug("SampleLocalAuthenticator bundle is deactivated");
        }
    }

    public static RealmService getRealmService() {

        return realmService;
    }

    @Reference(name = "realm.service",
            service = org.wso2.carbon.user.core.service.RealmService.class,
            cardinality = ReferenceCardinality.MANDATORY,
            policy = ReferencePolicy.DYNAMIC,
            unbind = "unsetRealmService")
    protected void setRealmService(RealmService realmService) {

        if (log.isDebugEnabled()) {
            log.debug("Setting the Realm Service");
        }
        SampleLocalAuthenticatorServiceComponent.realmService = realmService;
    }

    protected void unsetRealmService(RealmService realmService) {

        if (log.isDebugEnabled()) {
            log.debug("UnSetting the Realm Service");
        }
        SampleLocalAuthenticatorServiceComponent.realmService = null;
    }
}
