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
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package org.wso2.carbon.identity.handler.step;

import org.wso2.carbon.identity.handler.step.utils.CustomStepHandlerConstants;
import org.wso2.carbon.identity.handler.step.utils.CustomStepHandlerUtil;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.wso2.carbon.identity.application.authentication.framework.ApplicationAuthenticator;
import org.wso2.carbon.identity.application.authentication.framework.config.builder.FileBasedConfigurationBuilder;
import org.wso2.carbon.identity.application.authentication.framework.config.model.AuthenticatorConfig;
import org.wso2.carbon.identity.application.authentication.framework.config.model.SequenceConfig;
import org.wso2.carbon.identity.application.authentication.framework.config.model.StepConfig;
import org.wso2.carbon.identity.application.authentication.framework.context.AuthenticationContext;
import org.wso2.carbon.identity.application.authentication.framework.exception.FrameworkException;
import org.wso2.carbon.identity.application.authentication.framework.handler.step.impl.DefaultStepHandler;
import org.wso2.carbon.identity.application.common.model.IdentityProvider;
import org.wso2.carbon.identity.core.util.IdentityUtil;
import org.wso2.carbon.idp.mgt.IdentityProviderManagementException;
import org.wso2.carbon.idp.mgt.IdentityProviderManager;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;

/**
 * This class is responsible for orchestrating invocation of authenticators based on the availability of the
 * IWAKerberosAuthenticator in the authenticator list. If both IWA and Basic Authenticators are available as options
 * in the same step configuration this step handler will modify the list to include only the IWAKerberosAuthenticator.
 */
public class CustomStepHandler extends DefaultStepHandler {

    private static final Log log = LogFactory.getLog(CustomStepHandler.class);

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AuthenticationContext context)
            throws FrameworkException {

        try {
            int currentStep = context.getCurrentStep();
            StepConfig stepConfig = context.getSequenceConfig().getStepMap().get(currentStep);
            String spName = context.getServiceProviderName();

            if (stepConfig != null) {
                if (log.isDebugEnabled()) {
                    log.debug("Updating AuthConfigList of StepConfig in the step: " + currentStep + " of service " +
                            "provider: " + spName);
                }
                updateStepConfig(request, context, stepConfig);
            } else {
                if (log.isDebugEnabled()) {
                    log.debug("stepConfig is null in step: " + currentStep + " of service provider: " + spName);
                }
            }
        } catch (Exception e) {
            log.error("Error occurred during executing custom step handler.", e);
        }

        super.handle(request, response, context);

    }

    /**
     * This method modifies the authentication step config, by identifying the client IP address.
     *
     * @param request HTTP Servlet request.
     * @param context Authentication context.
     * @param stepConfig Authentication Step Config.
     */
    private void updateStepConfig(HttpServletRequest request, AuthenticationContext context, StepConfig
            stepConfig) {

        List<AuthenticatorConfig> authConfigList = stepConfig.getAuthenticatorList();
        List<AuthenticatorConfig> filteredAuthConfigList = new ArrayList<>();

        AuthenticatorConfig locatedIWAAuthenticatorConfig = null;
        AuthenticatorConfig locatedBasicAuthenticatorConfig = null;

        if (authConfigList != null) {
            for (AuthenticatorConfig config : authConfigList) {

                if (log.isDebugEnabled()) {
                    log.debug("Authenticator name : " + config.getName());
                }

                if (CustomStepHandlerConstants.IWA_KERBEROS_AUTHENTICATOR_NAME.equals(config.getName())) {
                    locatedIWAAuthenticatorConfig = config;
                } else if (CustomStepHandlerConstants.BASIC_AUTHENTICATOR_NAME.equals(config.getName())) {
                    locatedBasicAuthenticatorConfig = config;
                }
            }
        } else {
            if (log.isDebugEnabled()) {
                String spName = context.getServiceProviderName();
                int currentStep = context.getCurrentStep();
                log.debug("'AuthConfigList' is empty in the step : " + currentStep + " of service provider : " +
                        spName);
            }
        }

        String clientIpAddress = IdentityUtil.getClientIpAddress(request);
        if (log.isDebugEnabled()) {
            log.debug("client IP Address : " + clientIpAddress);
        }
        boolean isInternalIP = CustomStepHandlerUtil.isInternalIP(clientIpAddress);

        /*
         * modify the authConfigList based on the IP address to include IWA for internal network users and basic auth
         * for external users.
         */
        if (isInternalIP) {
            if (locatedIWAAuthenticatorConfig != null) {
                if (log.isDebugEnabled()) {
                    log.debug("Client IP address is from internal range. Hence modifying the authConfigList to " +
                            "include IWA Kerberos Authenticator for internal network users.");
                }
                filteredAuthConfigList.add(locatedIWAAuthenticatorConfig);
            } else {
                if (log.isDebugEnabled()) {
                    log.debug("Client IP address is from internal range but IWA is not configured in Auth Config " +
                            "list.");
                }
            }
        } else {

            if (locatedBasicAuthenticatorConfig != null) {
                if (log.isDebugEnabled()) {
                    log.debug("Client IP address is from external range. Hence modifying the authConfigList to " +
                            "include Basic Authenticator for external network users.");
                }
                filteredAuthConfigList.add(locatedBasicAuthenticatorConfig);
            } else {
                if (log.isDebugEnabled()) {
                    log.debug("Client IP address is from external range but Basic-auth not available in Auth Config " +
                            "list.");
                }
            }
        }

        if (CustomStepHandlerUtil.isFireFox(request) && locatedIWAAuthenticatorConfig != null) {

            if (locatedBasicAuthenticatorConfig != null) {
                /*
                 * In the SP, this step has both IWA enabled. For firefox browser based requests we need to disable IWA
                 * and prompt for basic authentication.
                 */
                log.info("Defaulting to Basic Authentication for FireFox Browsers..");
                List<AuthenticatorConfig> authConfigListWithBasic = new ArrayList<>();
                authConfigListWithBasic.add(locatedBasicAuthenticatorConfig);
                updateAuthConfigList(context, stepConfig, authConfigListWithBasic, false);

            } else {
                /*
                 * In the SP, this step has only IWA enabled. For firefox browser based requests we need to disable IWA
                 * and prompt for basic authentication.
                 */
                log.info("Defaulting to Basic Authentication for FireFox Browsers..");
                List<AuthenticatorConfig> authConfigListWithBasic = new ArrayList<>();
                authConfigListWithBasic.add(getBasicAuthenticatorConfig(context));
                updateAuthConfigList(context, stepConfig, authConfigListWithBasic, false);
            }
        } else if (!hasIWAAuthenticationFailed(context) && locatedIWAAuthenticatorConfig != null &&
                locatedBasicAuthenticatorConfig != null) {
            /*
             * In the SP, the step has both iwa and basic authenticators added as multi option, so we modify the
             * config list to only contain IWA.
             */
            if (isInternalIP) {
                log.info("Defaulting to IWA for internal network users..");
            } else {
                log.info("Defaulting to basic authentication for external users..");
            }
            updateAuthConfigList(context, stepConfig, filteredAuthConfigList, filteredAuthConfigList.size() > 1);
        } else if (hasIWAAuthenticationFailed(context) && locatedIWAAuthenticatorConfig != null &&
                locatedBasicAuthenticatorConfig != null) {
            /*
             * The step has both iwa and basic authenticators added as multi option. And IWA
             * authentication has failed in the previous attempt. Therefore we fallback to basic authentication for
             * retrying.
             */
            log.info("IWA Authentication Failed in previous attempt. Fallback to Basic Authentication..");
            List<AuthenticatorConfig> authConfigListWithBasic = new ArrayList<>();
            authConfigListWithBasic.add(locatedBasicAuthenticatorConfig);
            updateAuthConfigList(context, stepConfig, authConfigListWithBasic, false);
        }
    }

    private void updateAuthConfigList(AuthenticationContext context, StepConfig stepConfig, List<AuthenticatorConfig>
            authConfigList, boolean isMultiOption) {

        stepConfig.setAuthenticatorList(authConfigList);
        stepConfig.setMultiOption(isMultiOption);
        context.getSequenceConfig().getStepMap().put(context.getCurrentStep(), stepConfig);
    }

    @Override
    protected void doAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationContext
            context, AuthenticatorConfig authenticatorConfig) throws FrameworkException {

        super.doAuthentication(request, response, context, authenticatorConfig);

        try {
            ApplicationAuthenticator authenticator = authenticatorConfig.getApplicationAuthenticator();
            /*
             * if request authenticated flag is set to true, it means that IWA authenticator failed. So, we fall
             * back to basic authentication.
             */
            if (CustomStepHandlerConstants.IWA_KERBEROS_AUTHENTICATOR_NAME.equals(authenticator.getName()) && !context
                    .isRequestAuthenticated()) {
                if (log.isDebugEnabled()) {
                    log.debug("IWA authenticator failed in this attempt. Adding context property " +
                            "'IWAAuthenticatorStatus' to detect IWA authentication failure during handle method.");
                }
                /*
                 * add context property 'IWAAuthenticatorStatus' to detect IWA authentication failure during handle
                 * method.
                 */
                context.getProperties().put(CustomStepHandlerConstants.IWA_AUTHENTICATION_STATUS,
                        CustomStepHandlerConstants.IWA_AUTHENTICATION_STATUS_FAILED);

                SequenceConfig sequenceConfig = context.getSequenceConfig();
                int currentStep = context.getCurrentStep();
                String spName = context.getServiceProviderName();
                if (log.isDebugEnabled()) {
                    log.debug("Updating AuthConfigList of StepConfig in the step: " + currentStep + " of service " +
                            "provider: " + spName + " with basic authenticator config.");
                }
                StepConfig stepConfig = sequenceConfig.getStepMap().get(currentStep);
                AuthenticatorConfig basicAuthConfig = getBasicAuthenticatorConfig(context);

                List<AuthenticatorConfig> filteredAuthConfigList = new ArrayList<>();
                filteredAuthConfigList.add(basicAuthConfig);
                filteredAuthConfigList.add(authenticatorConfig);

                updateAuthConfigList(context, stepConfig, filteredAuthConfigList, filteredAuthConfigList.size() > 1);
                stepConfig.setRetrying(true);
                context.getSequenceConfig().getStepMap().put(context.getCurrentStep(), stepConfig);
            }
        } catch (Exception e) {
            log.error("Error occurred during CustomStepHandler doAuthentication method.", e);
            context.setRequestAuthenticated(false);
        }
    }

    /**
     * Checks whether IWA Authentication Failed during previous attempt.
     *
     * @param context
     * @return
     */
    private boolean hasIWAAuthenticationFailed(AuthenticationContext context) {

        String iwaStatus = (String) context.getProperty(CustomStepHandlerConstants.IWA_AUTHENTICATION_STATUS);
        return CustomStepHandlerConstants.IWA_AUTHENTICATION_STATUS_FAILED.equals(iwaStatus);
    }

    /**
     * Retrieve basic authenticator config.
     *
     * @param context
     * @return
     */
    private AuthenticatorConfig getBasicAuthenticatorConfig(AuthenticationContext context) {

        try {
            AuthenticatorConfig basicAuthConfig = FileBasedConfigurationBuilder.getInstance().getAuthenticatorBean
                    (CustomStepHandlerConstants.BASIC_AUTHENTICATOR_NAME);
            IdentityProvider localIDP = IdentityProviderManager.getInstance().getIdPByName(CustomStepHandlerConstants.LOCAL_IDP_NAME,
                    context.getTenantDomain());
            basicAuthConfig.getIdps().put(CustomStepHandlerConstants.LOCAL_IDP_NAME, localIDP);
            basicAuthConfig.setEnabled(true);
            return basicAuthConfig;
        } catch (IdentityProviderManagementException e) {
            log.error("Error occurred while retrieving local IDP.", e);
        }
        // since IDP config is mandatory for building basic auth config, we return null here.
        return null;
    }
}
