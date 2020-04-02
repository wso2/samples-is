/*
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.wso2.identity.oauth2.grant.password.multi.attribute;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.wso2.carbon.apimgt.keymgt.handlers.ExtendedPasswordGrantHandler;
import org.wso2.carbon.context.PrivilegedCarbonContext;
import org.wso2.carbon.identity.core.util.IdentityTenantUtil;
import org.wso2.carbon.identity.oauth2.IdentityOAuth2Exception;
import org.wso2.carbon.identity.oauth2.model.RequestParameter;
import org.wso2.carbon.identity.oauth2.token.OAuthTokenReqMessageContext;
import org.wso2.carbon.user.api.UserRealm;
import org.wso2.carbon.user.core.UserStoreException;
import org.wso2.carbon.user.core.UserStoreManager;
import org.wso2.carbon.user.core.service.RealmService;

import java.util.Arrays;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Modified version of password grant type to modify the access token.
 */
public class MultiAttributePasswordGrantHandler extends ExtendedPasswordGrantHandler {

    private static Log log = LogFactory.getLog(MultiAttributePasswordGrantHandler.class);

    @Override
    public boolean validateGrant(OAuthTokenReqMessageContext tokReqMsgCtx)
            throws IdentityOAuth2Exception {

        String userFromRequest = tokReqMsgCtx.getOauth2AccessTokenReqDTO().getResourceOwnerUsername();
        String tenantDomain = getTenantDomainFromRequestPrams(tokReqMsgCtx.getOauth2AccessTokenReqDTO()
                .getRequestParameters());
        if (StringUtils.isEmpty(tenantDomain)) {
            tenantDomain = tokReqMsgCtx.getOauth2AccessTokenReqDTO().getTenantDomain();
        }

        String resolvedUsername = resolveUser(userFromRequest, tenantDomain);
        if (log.isDebugEnabled()) {
            log.debug("Resolved username: " + resolvedUsername);
        }
        tokReqMsgCtx.getOauth2AccessTokenReqDTO().setResourceOwnerUsername(resolveUser(userFromRequest, tenantDomain));

        super.validateGrant(tokReqMsgCtx);

        return true;
    }

    private String resolveUser(String userFromRequest, String tenantDomain) throws IdentityOAuth2Exception {

        String authenticatingClaimUri = MultiAttributePasswordGrantHandlerConstants.USERNAME_CLAIM;
        if (isRegexMatching(MultiAttributePasswordGrantHandlerConstants.EMAIL_REGEX, userFromRequest)) {
            authenticatingClaimUri = MultiAttributePasswordGrantHandlerConstants.EMAIL_CLAIM;
        } else if (isRegexMatching(MultiAttributePasswordGrantHandlerConstants.MOBILE_REGEX, userFromRequest)) {
            authenticatingClaimUri = MultiAttributePasswordGrantHandlerConstants.MOBILE_CLAIM;
        }
        int tenantId = IdentityTenantUtil.getTenantId(tenantDomain);

        if (log.isDebugEnabled()) {
            log.debug("Attempting to resolve user from identifier: " + userFromRequest + ", tenantDomain: " + tenantDomain + " , claim_uri: " + authenticatingClaimUri);
        }

        try {
            UserRealm userRealm = getRealmService().getTenantUserRealm(tenantId);
            if (userRealm != null) {
                UserStoreManager userStoreManager = (UserStoreManager) userRealm.getUserStoreManager();

                return getUsernameFromClaim(authenticatingClaimUri, userFromRequest, tenantDomain, userStoreManager);
            } else {
                throw new IdentityOAuth2Exception("Error when resolving user.");
            }
        } catch (org.wso2.carbon.user.api.UserStoreException e) {
            throw new IdentityOAuth2Exception("Error when resolving user." + e);
        }
    }

    private String getUsernameFromClaim(String claimUri, String claimValue, String tenantDomain,
                                        UserStoreManager userStoreManager)
            throws IdentityOAuth2Exception {

        if (MultiAttributePasswordGrantHandlerConstants.USERNAME_CLAIM.equals(claimUri)) {

            return claimValue + "@" + tenantDomain;
        }

        String[] userList;

        if (log.isDebugEnabled()) {
            log.info("Searching for a user with " + claimUri + ": " + claimValue + " and tenant domain: " + tenantDomain);
        }
        try {
            userList = userStoreManager.getUserList(claimUri, claimValue,
                    MultiAttributePasswordGrantHandlerConstants.DEFAULT_PROFILE);
        } catch (UserStoreException e) {
            throw new IdentityOAuth2Exception("Error when resolving user." + e);
        }

        if (userList == null || userList.length == 0) {
            String errorMessage = "No user found with the provided " + claimUri + ": " + claimValue;
            log.error(errorMessage);
            throw new IdentityOAuth2Exception(errorMessage);
        } else if (userList.length == 1) {
            if (log.isDebugEnabled()) {
                log.debug("Found single user " + userList[0] + " with the " + claimUri + ": " + claimValue);
            }
            return userList[0] + "@" + tenantDomain;
        }

        String errorMessage =
                "Multiple users exist with the " + claimUri + ": " + claimValue + ". " + Arrays.toString(userList);
        log.error(errorMessage);
        throw new IdentityOAuth2Exception(errorMessage);
    }

    private boolean isRegexMatching(String regularExpression, String attribute) {

        Pattern pattern = Pattern.compile(regularExpression);
        Matcher matcher = pattern.matcher(attribute);
        return matcher.matches();
    }

    private static RealmService getRealmService() {

        return (RealmService) PrivilegedCarbonContext.getThreadLocalCarbonContext()
                .getOSGiService(RealmService.class, null);
    }

    private String getTenantDomainFromRequestPrams(RequestParameter[] requestParams) {

        if (requestParams == null) {
            return null;
        }

        for (RequestParameter reqParam : requestParams) {
            if (MultiAttributePasswordGrantHandlerConstants.TENANT_DOMAIN.equals(reqParam.getKey())) {
                return reqParam.getValue()[0];
            }
        }

        return null;
    }

}
