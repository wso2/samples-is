/*
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

package org.wso2.carbon.identity.custom.claim.provider;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.wso2.carbon.identity.oauth2.IdentityOAuth2Exception;
import org.wso2.carbon.identity.oauth2.authz.OAuthAuthzReqMessageContext;
import org.wso2.carbon.identity.oauth2.dto.OAuth2AccessTokenRespDTO;
import org.wso2.carbon.identity.oauth2.dto.OAuth2AuthorizeRespDTO;
import org.wso2.carbon.identity.oauth2.token.OAuthTokenReqMessageContext;
import org.wso2.carbon.identity.openidconnect.ClaimProvider;

import java.util.HashMap;
import java.util.Map;

/**
 * This class is used to insert sid claim into ID token.
 */
public class CustomClaimProvider implements ClaimProvider {

    private static final Log log = LogFactory.getLog(CustomClaimProvider.class);

    @Override
    public Map<String, Object> getAdditionalClaims(OAuthAuthzReqMessageContext oAuthAuthzReqMessageContext,
                                                   OAuth2AuthorizeRespDTO oAuth2AuthorizeRespDTO)
            throws IdentityOAuth2Exception {

        Map<String, Object> additionalClaims = new HashMap<>();
        additionalClaims.put("sid", "123-1bc-879-uk3");
        if (log.isDebugEnabled()) {
            log.debug("sid claim is added to ID token.");
        }
        return additionalClaims;
    }

    @Override
    public Map<String, Object> getAdditionalClaims(OAuthTokenReqMessageContext oAuthTokenReqMessageContext,
                                                   OAuth2AccessTokenRespDTO oAuth2AccessTokenRespDTO)
            throws IdentityOAuth2Exception {

        Map<String, Object> additionalClaims = new HashMap<>();
        additionalClaims.put("sid", "123-1bc-879-uk3");
        if (log.isDebugEnabled()) {
            log.debug("sid claim is added to ID token.");
        }
        return additionalClaims;
    }
}
