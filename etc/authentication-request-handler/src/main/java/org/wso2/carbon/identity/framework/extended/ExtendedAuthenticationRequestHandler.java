package org.wso2.carbon.identity.framework.extended;

import org.apache.commons.lang.StringUtils;
import org.wso2.carbon.identity.application.authentication.framework.context.AuthenticationContext;
import org.wso2.carbon.identity.application.authentication.framework.exception.FrameworkException;
import org.wso2.carbon.identity.application.authentication.framework.handler.request.impl.DefaultAuthenticationRequestHandler;
import org.wso2.carbon.identity.application.authentication.framework.model.AuthenticatedUser;
import org.wso2.carbon.identity.application.authentication.framework.util.FrameworkConstants;
import org.wso2.carbon.identity.application.common.model.ClaimMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

public class ExtendedAuthenticationRequestHandler extends DefaultAuthenticationRequestHandler {

    private static final String ROLE_CLAIM = "http://wso2.org/claims/role";
    private static final String ROLE_TO_CHECK = "trip";

    @Override
    protected void concludeFlow(HttpServletRequest request,
                                HttpServletResponse response,
                                AuthenticationContext context) throws FrameworkException {


        boolean isAuthenticated = context.isRequestAuthenticated();

        if (isAuthenticated) {
            // Do the authorization logic here
            if (isAuthorized(request, response, context)) {
                // Nothing to do..
            } else {
                // Since authorization failed we mark it as an overall failure
                context.setRequestAuthenticated(false);
            }
        }

        super.concludeFlow(request, response, context);
    }

    private boolean isAuthorized(HttpServletRequest request, HttpServletResponse response,
                                 AuthenticationContext context) throws FrameworkException {

        // We apply authorization only for SAML logins
        if (isSamlLogin(context)) {
            String serviceProviderName = context.getServiceProviderName();
            if (isAuthorizationEnforcedOnSp(serviceProviderName)) {
                // Check whether the user is in the role...
                AuthenticatedUser authenticatedUser = context.getSequenceConfig().getAuthenticatedUser();

                // Get the role claim from the user attributes
                List<String> userRoles = getUserRoles(authenticatedUser);
                // Check whether user has the required role
                return userRoles.contains(ROLE_TO_CHECK);
            }
        }

        return true;
    }

    private List<String> getUserRoles(AuthenticatedUser authenticatedUser) {
        Map<ClaimMapping, String> userAttributes = authenticatedUser.getUserAttributes();

        ClaimMapping roleClaimMapping = null;
        String attributeSeparator = ",";
        for (ClaimMapping claimMapping : userAttributes.keySet()) {
            if (StringUtils.equals(claimMapping.getLocalClaim().getClaimUri(), ROLE_CLAIM)) {
                roleClaimMapping = claimMapping;
                break;
            }
            if(claimMapping.getLocalClaim().getClaimUri().equals("MultiAttributeSeparator")) {
                attributeSeparator = userAttributes.get(claimMapping);
            }
        }

        if (roleClaimMapping == null) {
            // Role claim is not in the user attributes
            return new ArrayList<>();
        } else {
            String roleClaim = userAttributes.get(roleClaimMapping);
            String[] roles = roleClaim.split(attributeSeparator);
            return new ArrayList<>(Arrays.asList(roles));
        }
    }

    private boolean isAuthorizationEnforcedOnSp(String serviceProviderName) {
        return StringUtils.equalsIgnoreCase(serviceProviderName, "TripAction");
    }

    private boolean isSamlLogin(AuthenticationContext context) {

        return StringUtils.equalsIgnoreCase(context.getRequestType(),
                FrameworkConstants.RequestType.CLAIM_TYPE_SAML_SSO);
    }
}