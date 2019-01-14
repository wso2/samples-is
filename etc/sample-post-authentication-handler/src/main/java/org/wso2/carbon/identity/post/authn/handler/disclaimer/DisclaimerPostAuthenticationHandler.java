/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package org.wso2.carbon.identity.post.authn.handler.disclaimer;

import org.apache.commons.codec.digest.DigestUtils;
import org.wso2.carbon.identity.application.authentication.framework.config.ConfigurationFacade;
import org.wso2.carbon.identity.application.authentication.framework.context.AuthenticationContext;
import org.wso2.carbon.identity.application.authentication.framework.exception.PostAuthenticationFailedException;
import org.wso2.carbon.identity.application.authentication.framework.handler.request.AbstractPostAuthnHandler;
import org.wso2.carbon.identity.application.authentication.framework.handler.request.PostAuthnHandlerFlowStatus;
import org.wso2.carbon.identity.application.authentication.framework.model.AuthenticatedUser;
import org.wso2.carbon.identity.application.authentication.framework.util.FrameworkUtils;

import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class DisclaimerPostAuthenticationHandler extends AbstractPostAuthnHandler {

    private String CONSENT_POPPED_UP = "consentPoppedUp";

    @Override
    public PostAuthnHandlerFlowStatus handle(HttpServletRequest httpServletRequest,
                                             HttpServletResponse httpServletResponse,
                                             AuthenticationContext authenticationContext)
            throws PostAuthenticationFailedException {

        if (getAuthenticatedUser(authenticationContext) == null) {
            return PostAuthnHandlerFlowStatus.SUCCESS_COMPLETED;
        }

        if (isConsentPoppedUp(authenticationContext)) {
            if (httpServletRequest.getParameter("consent").equalsIgnoreCase("approve")) {
                return PostAuthnHandlerFlowStatus.SUCCESS_COMPLETED;
            } else {
                throw new PostAuthenticationFailedException("Cannot access this application : Consent Denied",
                        "Consent denied");
            }
        } else {
            try {
                httpServletResponse.sendRedirect
                        (ConfigurationFacade.getInstance().getAuthenticationEndpointURL().replace("/login.do", ""
                        ) + "/disclaimer" + ".jsp?sessionDataKey=" + authenticationContext.getContextIdentifier() +
                                "&application=" + authenticationContext
                                .getSequenceConfig().getApplicationConfig().getApplicationName());
                setConsentPoppedUpState(authenticationContext);
                return PostAuthnHandlerFlowStatus.INCOMPLETE;
            } catch (IOException e) {
                throw new PostAuthenticationFailedException("Invalid Consent", "Error while redirecting", e);
            }
        }
    }

    @Override
    public String getName() {

        return "DisclaimerHandler";
    }

    private AuthenticatedUser getAuthenticatedUser(AuthenticationContext authenticationContext) {

        AuthenticatedUser user = authenticationContext.getSequenceConfig().getAuthenticatedUser();
        return user;
    }

    private void setConsentPoppedUpState(AuthenticationContext authenticationContext) {

        authenticationContext.addParameter(CONSENT_POPPED_UP, true);
    }

    private boolean isConsentPoppedUp(AuthenticationContext authenticationContext) {

        return authenticationContext.getParameter(CONSENT_POPPED_UP) != null;
    }

}
