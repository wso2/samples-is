/*******************************************************************************
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
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
 ******************************************************************************/

package org.wso2.carbon.identity.sample.oauth2.federated.authenticator.internal;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.osgi.service.component.ComponentContext;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;
import org.wso2.carbon.identity.application.authentication.framework.ApplicationAuthenticator;
import org.wso2.carbon.identity.sample.oauth2.federated.authenticator.OAuth2CustomAuthenticator;

import java.util.Hashtable;

@Component(name = "custom.oauth2.federated.authenticator", immediate = true)
public class OAuth2CustomAuthenticatorServiceComponent {

    private static final Log logger = LogFactory.getLog(OAuth2CustomAuthenticatorServiceComponent.class);

    @Activate
    protected void activate(ComponentContext ctxt) {

        try {
            OAuth2CustomAuthenticator oAuth2CustomAuthenticator = new OAuth2CustomAuthenticator();
            Hashtable<String, String> props = new Hashtable<>();
            ctxt.getBundleContext().registerService(ApplicationAuthenticator.class.getName(), oAuth2CustomAuthenticator,
                    props);
            if (logger.isDebugEnabled()) {
                logger.debug("OAuth2 Custom Authenticator is activated.");
            }

        } catch (Throwable e) {
            logger.error("Error while activating OAuth2 Custom Authenticator.", e);
        }
    }

    @Deactivate
    protected void deactivate(ComponentContext ctxt) {

        if (logger.isDebugEnabled()) {
            logger.debug("OAuth2 Custom Authenticator is deactivated.");
        }
    }

}
