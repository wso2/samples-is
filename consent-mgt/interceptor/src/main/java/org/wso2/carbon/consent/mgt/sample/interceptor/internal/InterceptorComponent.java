/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

package org.wso2.carbon.consent.mgt.sample.interceptor.internal;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.osgi.framework.BundleContext;
import org.osgi.service.component.ComponentContext;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.wso2.carbon.consent.mgt.core.connector.ConsentMgtInterceptor;
import org.wso2.carbon.consent.mgt.sample.interceptor.SampleInterceptor;

@Component(
        name = "sample.consent.mgt.interceptor.component",
        immediate = true
)
public class InterceptorComponent {

    private static final Log log = LogFactory.getLog(InterceptorComponent.class);

    @Activate
    protected void activate(ComponentContext componentContext) {

        try {
            BundleContext bundleContext = componentContext.getBundleContext();
            bundleContext.registerService(ConsentMgtInterceptor.class.getName(), new SampleInterceptor(), null);
            if (log.isDebugEnabled()) {
                log.debug("Sample consent management interceptor activated successfully.");
            }
        } catch (Throwable e) {
            log.error("Error activating sample consent management interceptor.", e);
        }
    }
}
