package org.wso2.sample.scope.validator;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.osgi.service.component.annotations.Component;
import org.wso2.carbon.identity.oauth2.IdentityOAuth2Exception;
import org.wso2.carbon.identity.oauth2.authz.OAuthAuthzReqMessageContext;
import org.wso2.carbon.identity.oauth2.token.OAuthTokenReqMessageContext;
import org.wso2.carbon.identity.oauth2.validators.OAuth2TokenValidationMessageContext;
import org.wso2.carbon.identity.oauth2.validators.scope.ScopeValidator;

import java.util.ArrayList;
import java.util.List;

@Component(name = "CustomScopeValidator", immediate = true, service = ScopeValidator.class)
public class CustomScopeValidator implements ScopeValidator {

    Log log = LogFactory.getLog(CustomScopeValidator.class);

    @Override
    public boolean validateScope(OAuthAuthzReqMessageContext oAuthAuthzReqMessageContext) {

        log.info("Validating the scopes of the Authorization Request with Custom Scope Validator.");
        String[] approvedScope = oAuthAuthzReqMessageContext.getApprovedScope();
        List<String> validScopes = new ArrayList<>();
        for (String scope : approvedScope) {
            if (!scope.startsWith("test")) {
                validScopes.add(scope);
            }
        }
        oAuthAuthzReqMessageContext.setApprovedScope(validScopes.toArray(new String[0]));
        log.info("Custom Scope Validator validated the scopes of the Authorization Request.");
        return true;
    }

    @Override
    public boolean validateScope(OAuthTokenReqMessageContext oAuthTokenReqMessageContext) {

        log.info("Validating the scopes of the Access Token Request with Custom Scope Validator.");
        String[] approvedScope = oAuthTokenReqMessageContext.getScope();
        List<String> validScopes = new ArrayList<>();
        for (String scope : approvedScope) {
            if (!scope.startsWith("test")) {
                validScopes.add(scope);
            }
        }
        oAuthTokenReqMessageContext.setScope(validScopes.toArray(new String[0]));
        log.info("Custom Scope Validator validated the scopes of the Access Token Request.");
        return true;
    }

    @Override
    public boolean validateScope(OAuth2TokenValidationMessageContext oAuth2TokenValidationMessageContext) {

        return true;
    }

    @Override
    public String getName() {
        return "CustomScopeValidator";
    }


}
