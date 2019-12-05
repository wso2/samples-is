/**
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 * <p>
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package org.wso2.carbon.identity.application.authentication.handler.ciba.internal;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.osgi.service.component.ComponentContext;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;
import org.wso2.carbon.identity.application.authentication.framework.ApplicationAuthenticator;
import org.wso2.carbon.identity.application.authentication.handler.ciba.CibaHandler;

@Component(
        name = "identity.application.handler.ciba.component",
        immediate = true
)
public class CibaHandlerServiceComponent {

    private static final Log log = LogFactory.getLog(CibaHandlerServiceComponent.class);

    @Activate
    protected void activate(ComponentContext ctxt) {

        try {
            CibaHandler cibaHandler = new CibaHandler();
            ctxt.getBundleContext().registerService(ApplicationAuthenticator.class.getName(), cibaHandler, null);
            if (log.isDebugEnabled()) {
                log.info("CibaHandler Authenticator bundle is activated");
            }
        } catch (Throwable e) {
            log.error("CibaHandler Authenticator bundle activation Failed", e);
        }
    }

    @Deactivate
    protected void deactivate(ComponentContext ctxt) {

        if (log.isDebugEnabled()) {
            log.info("cibaHandler bundle is deactivated");
        }
    }
}
