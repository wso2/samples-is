/*
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
package org.wso2.carbon.identity.extensions;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.wso2.carbon.identity.oauth2.IdentityOAuth2Exception;
import org.wso2.carbon.identity.oauth2.authz.OAuthAuthzReqMessageContext;
import org.wso2.carbon.identity.oauth2.token.JWTTokenIssuer;
import org.wso2.carbon.identity.oauth2.token.OAuthTokenReqMessageContext;

import com.nimbusds.jwt.JWTClaimsSet;

/**
 * An extended JWT token issuer which formats the 'scope' claim as a JSON array.
 */
public class CustomJWTTokenIssuer extends JWTTokenIssuer {

    private static final Log log = LogFactory.getLog(CustomJWTTokenIssuer.class);
    private static final String SCOPE_CLAIM_NAME = "scope";

    public CustomJWTTokenIssuer() throws IdentityOAuth2Exception {

        super();
        if (log.isDebugEnabled()) {
            log.debug("CustomJWT Access token Issuer is initiated");
        }
    }

    @Override
    protected JWTClaimsSet createJWTClaimSet(OAuthAuthzReqMessageContext authAuthzReqMessageContext,
                                             OAuthTokenReqMessageContext tokenReqMessageContext,
                                             String consumerKey) throws IdentityOAuth2Exception {

        JWTClaimsSet jwtClaimsSet = super.createJWTClaimSet(authAuthzReqMessageContext, tokenReqMessageContext,
                consumerKey);

        String scope = (String) jwtClaimsSet.getClaim(SCOPE_CLAIM_NAME);
        if (scope != null && !scope.isEmpty()) {
            if (log.isDebugEnabled()) {
                log.debug("Scope Exist for the jwt access token");
            }
            String[] scopeSplit = scope.split("\\s");
            JWTClaimsSet.Builder jwtClaimsSetBuilder = new JWTClaimsSet.Builder(jwtClaimsSet);
            jwtClaimsSetBuilder.claim(SCOPE_CLAIM_NAME, scopeSplit);
            return jwtClaimsSetBuilder.build();
        } else {
            if (log.isDebugEnabled()) {
                log.debug("Scope not found for the jwt acccess token");
            }
            JWTClaimsSet.Builder jwtClaimsSetBuilder = new JWTClaimsSet.Builder(jwtClaimsSet);
            return jwtClaimsSetBuilder.build();
        }
    }

}
