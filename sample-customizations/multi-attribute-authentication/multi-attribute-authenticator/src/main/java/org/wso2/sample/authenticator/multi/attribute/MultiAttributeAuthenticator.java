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
package org.wso2.sample.authenticator.multi.attribute;

import org.wso2.sample.authenticator.multi.attribute.internal.MultiAttributeAuthenticatorServiceComponent;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.wso2.carbon.identity.application.authentication.framework.context.AuthenticationContext;
import org.wso2.carbon.identity.application.authentication.framework.exception.AuthenticationFailedException;
import org.wso2.carbon.identity.application.authentication.framework.exception.InvalidCredentialsException;
import org.wso2.carbon.identity.application.authentication.framework.model.AuthenticatedUser;
import org.wso2.carbon.identity.application.authentication.framework.util.FrameworkUtils;
import org.wso2.carbon.identity.application.authenticator.basicauth.BasicAuthenticator;
import org.wso2.carbon.identity.application.authenticator.basicauth.BasicAuthenticatorConstants;
import org.wso2.carbon.identity.application.common.model.User;
import org.wso2.carbon.identity.base.IdentityRuntimeException;
import org.wso2.carbon.identity.core.util.IdentityTenantUtil;
import org.wso2.carbon.identity.core.util.IdentityUtil;
import org.wso2.carbon.user.api.UserRealm;
import org.wso2.carbon.user.core.UserStoreException;
import org.wso2.carbon.user.core.UserStoreManager;
import org.wso2.carbon.utils.multitenancy.MultitenantUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class MultiAttributeAuthenticator extends BasicAuthenticator {

    private static final Log log = LogFactory.getLog(MultiAttributeAuthenticator.class);

    private static final String PASSWORD_PROPERTY = "PASSWORD_PROPERTY";
    private static final String RE_CAPTCHA_USER_DOMAIN = "user-domain-recaptcha";

    @Override
    protected void processAuthenticationResponse(HttpServletRequest request,
                                                 HttpServletResponse response, AuthenticationContext context)
            throws AuthenticationFailedException {

        boolean isAuthenticated;
        UserStoreManager userStoreManager;
        String internalUsername;
        String authenticatingClaimUri = MultiAttributeAuthenticatorConstants.USERNAME_CLAIM;
        List<String> allowedIdentifierClaims = new ArrayList<String>();
        allowedIdentifierClaims.add(MultiAttributeAuthenticatorConstants.EMAIL_CLAIM);
        allowedIdentifierClaims.add(MultiAttributeAuthenticatorConstants.MOBILE_CLAIM);

        String username = request.getParameter(BasicAuthenticatorConstants.USER_NAME);
        String password = request.getParameter(BasicAuthenticatorConstants.PASSWORD);
        String tenantDomainFromParam = request.getParameter(MultiAttributeAuthenticatorConstants.TENANT_DOMAIN);
        String loginIdentifier = request.getParameter(MultiAttributeAuthenticatorConstants.LOGIN_IDENTIFIER);

        if (loginIdentifier == null || "auto".equals(loginIdentifier)) {
            if (isRegexMatching(MultiAttributeAuthenticatorConstants.EMAIL_REGEX, username)){
                authenticatingClaimUri = MultiAttributeAuthenticatorConstants.EMAIL_CLAIM;
            } else if (isRegexMatching(MultiAttributeAuthenticatorConstants.MOBILE_REGEX, username)){
                authenticatingClaimUri = MultiAttributeAuthenticatorConstants.MOBILE_CLAIM;
            }
        } else if (allowedIdentifierClaims.contains(loginIdentifier)) {
            authenticatingClaimUri = loginIdentifier;
        }

        Map<String, Object> authProperties = context.getProperties();
        if (authProperties == null) {
            authProperties = new HashMap<String, Object>();
            context.setProperties(authProperties);
        }

        authProperties.put(PASSWORD_PROPERTY, password);

        // Reset RE_CAPTCHA_USER_DOMAIN thread local variable before the authentication
        IdentityUtil.threadLocalProperties.get().remove(RE_CAPTCHA_USER_DOMAIN);

           try {
            int tenantId = IdentityTenantUtil.getTenantId(tenantDomainFromParam);
            UserRealm userRealm = MultiAttributeAuthenticatorServiceComponent.getRealmService().
                    getTenantUserRealm(tenantId);
            if (userRealm != null) {
                userStoreManager = (UserStoreManager) userRealm.getUserStoreManager();

                internalUsername = getUsernameFromClaim(authenticatingClaimUri, username, tenantDomainFromParam,
                        userStoreManager, password, response);
                if (log.isDebugEnabled()) {
                    log.debug("Trying to authenticate user with internal username: " + internalUsername);
                }
                isAuthenticated = userStoreManager.
                        authenticate(MultitenantUtils.getTenantAwareUsername(internalUsername), password);
            } else {
                throw new AuthenticationFailedException("Cannot find the user realm for the given tenant: " +
                        tenantId, User.getUserFromUserName(username));
            }

        } catch (IdentityRuntimeException e) {
            if (log.isDebugEnabled()) {
                log.debug("BasicAuthentication failed while trying to get the tenant ID of the user " + username, e);
            }
            throw new AuthenticationFailedException(e.getMessage(), User.getUserFromUserName(username), e);

        } catch (org.wso2.carbon.user.api.UserStoreException e) {
            if (log.isDebugEnabled()) {
                log.debug("BasicAuthentication failed while trying to authenticate", e);
            }
            throw new AuthenticationFailedException(e.getMessage(), User.getUserFromUserName(username), e);
        }

        if (!isAuthenticated) {
            if (log.isDebugEnabled()) {
                log.debug("User authentication failed due to invalid credentials");
            }
            if (IdentityUtil.threadLocalProperties.get().get(RE_CAPTCHA_USER_DOMAIN) != null) {
                internalUsername = IdentityUtil.addDomainToName(internalUsername,
                        IdentityUtil.threadLocalProperties.get().get(RE_CAPTCHA_USER_DOMAIN).toString());
            }
            IdentityUtil.threadLocalProperties.get().remove(RE_CAPTCHA_USER_DOMAIN);
            throw new InvalidCredentialsException("User authentication failed due to invalid credentials",
                    User.getUserFromUserName(internalUsername));
        }

        String tenantDomain = MultitenantUtils.getTenantDomain(internalUsername);
        authProperties.put("user-tenant-domain", tenantDomain);

        internalUsername = FrameworkUtils.prependUserStoreDomainToName(internalUsername);

        context.setSubject(AuthenticatedUser.createLocalAuthenticatedUserFromSubjectIdentifier(internalUsername));

        String rememberMe = request.getParameter("chkRemember");
        if ("on".equals(rememberMe)) {
            context.setRememberMe(true);
        }
    }

    private String getUsernameFromClaim(String claimUri, String claimValue, String tenantDomain,
                                        UserStoreManager userStoreManager, String password, HttpServletResponse response)
            throws UserStoreException, AuthenticationFailedException {

        if (MultiAttributeAuthenticatorConstants.USERNAME_CLAIM.equals(claimUri)) {
            return claimValue + "@" + tenantDomain;
        }

        String[] userList;

        if (log.isDebugEnabled()) {
            log.info("Searching for a user with " + claimUri + ": " + claimValue + " and tenant domain: "
                    + tenantDomain);
        }
        userList = userStoreManager.getUserList(claimUri, claimValue,
                MultiAttributeAuthenticatorConstants.DEFAULT_PROFILE);

        if (userList == null || userList.length == 0) {
            if (log.isDebugEnabled()) {
                log.debug("No user found with the provided " + claimUri + ": " + claimValue);
            }
            throw new AuthenticationFailedException("Authentication failed");
        } else if (userList.length == 1) {
            if (log.isDebugEnabled()) {
                log.debug("Found a single user " + userList[0] + " with the " + claimUri + ": " + claimValue);
            }
            return userList[0] + "@" + tenantDomain;
        }

        if (log.isDebugEnabled()) {
            log.debug("Multiple users exist with the " + claimUri + ": " + claimValue + ". "
                    + userList.toString());
        }
        for (String username: userList) {
            if (userStoreManager.authenticate(username, password)) {
                response.addHeader(MultiAttributeAuthenticatorConstants.FOUND_MULTIPLE_USERS_WITH_SAME_IDENTIFIER, "true");
                return username + "@" + tenantDomain;
            }
        }

        if (log.isDebugEnabled()) {
            log.debug("The provided password was not valid for any of the user with " + claimUri +
                    ": " + claimValue);
        }
        throw new AuthenticationFailedException("Authentication failed");
    }

    private boolean isRegexMatching(String regularExpression, String attribute) {
        Pattern pattern = Pattern.compile(regularExpression);
        Matcher matcher = pattern.matcher(attribute);
        return matcher.matches();
    }

    @Override
    public String getFriendlyName() {
        return MultiAttributeAuthenticatorConstants.AUTHENTICATOR_FRIENDLY_NAME;
    }

    @Override
    public String getName() {
        return MultiAttributeAuthenticatorConstants.AUTHENTICATOR_NAME;
    }

}
