/*
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

package org.wso2.carbon.identity.application.authentication.handler.ciba;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.wso2.carbon.identity.application.authentication.framework.AbstractApplicationAuthenticator;
import org.wso2.carbon.identity.application.authentication.framework.AuthenticatorFlowStatus;
import org.wso2.carbon.identity.application.authentication.framework.LocalApplicationAuthenticator;
import org.wso2.carbon.identity.application.authentication.framework.context.AuthenticationContext;
import org.wso2.carbon.identity.application.authentication.handler.ciba.internal.CibaHandlerDataHolder;
import org.wso2.carbon.user.api.UserStoreException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Username based Authenticator.
 */
public class CibaHandler extends AbstractApplicationAuthenticator implements LocalApplicationAuthenticator {

    private static final long serialVersionUID = -4406878411547612129L;

    private static Log log = LogFactory.getLog(CibaHandler.class);

    @Override
    public AuthenticatorFlowStatus process(HttpServletRequest request,
                                           HttpServletResponse response, AuthenticationContext context) {

        if (context.isLogoutRequest()) {
            return AuthenticatorFlowStatus.SUCCESS_COMPLETED;
        }

        String user = request.getParameter("user");

        if (StringUtils.isNotBlank(user)) {

            return AuthenticatorFlowStatus.SUCCESS_COMPLETED;
        }

        return AuthenticatorFlowStatus.FAIL_COMPLETED;
    }

    @Override
    protected void processAuthenticationResponse(HttpServletRequest httpServletRequest, HttpServletResponse
            httpServletResponse, AuthenticationContext authenticationContext) {

    }

    public boolean canHandle(HttpServletRequest httpServletRequest) {

        return true;
    }

    public String getContextIdentifier(HttpServletRequest httpServletRequest) {

        return httpServletRequest.getParameter("sessionDataKey");
    }

    public String getName() {

        return CibaHandlerConstants.HANDLER_NAME;
    }

    public String getFriendlyName() {

        return CibaHandlerConstants.HANDLER_FRIENDLY_NAME;
    }

    /**
     * Check whether user exists in store.
     *
     * @param tenantID   tenantID of the clientAPP
     * @param userIdHint that identifies a user
     * @return boolean Returns whether user exists in store.
     */
    public static boolean isUserExists(int tenantID, String userIdHint) throws UserStoreException {

        return CibaHandlerDataHolder.getInstance().getRealmService().getTenantUserRealm(tenantID)
                .getUserStoreManager()
                .isExistingUser(userIdHint);
    }
}
