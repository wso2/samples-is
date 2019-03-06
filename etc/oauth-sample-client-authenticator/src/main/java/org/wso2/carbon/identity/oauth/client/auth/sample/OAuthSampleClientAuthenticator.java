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
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package org.wso2.carbon.identity.oauth.client.auth.sample;

import org.wso2.carbon.identity.oauth.IdentityOAuthAdminException;
import org.wso2.carbon.identity.oauth.common.exception.InvalidOAuthClientException;
import org.wso2.carbon.identity.oauth2.IdentityOAuth2Exception;
import org.wso2.carbon.identity.oauth2.bean.OAuthClientAuthnContext;
import org.wso2.carbon.identity.oauth2.client.authentication.AbstractOAuthClientAuthenticator;
import org.wso2.carbon.identity.oauth2.client.authentication.OAuthClientAuthnException;
import org.wso2.carbon.identity.oauth2.util.OAuth2Util;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

/**
 * Sample client authenticator which will authenticate client request using client_id and cleint_secret which are
 * available as two separate HTTP headers.
 */
public class OAuthSampleClientAuthenticator extends AbstractOAuthClientAuthenticator {

    /**
     * Authenticates oauth client based on client_id and client_secret headers.
     *
     * @param httpServletRequest      Incoming HttpServlet request.
     * @param bodyParams              body content map.
     * @param oAuthClientAuthnContext
     * @return True if successfully authenticates. False if authentication failes
     * @throws OAuthClientAuthnException
     */
    public boolean authenticateClient(HttpServletRequest httpServletRequest,
                                      Map<String, List> bodyParams, OAuthClientAuthnContext oAuthClientAuthnContext)
            throws OAuthClientAuthnException {

        String clientId = httpServletRequest.getHeader("client_id");
        String clientSecret = httpServletRequest.getHeader("client_secret");
        try {
            return OAuth2Util.authenticateClient(clientId, clientSecret);
        } catch (IdentityOAuthAdminException | InvalidOAuthClientException | IdentityOAuth2Exception e) {
            throw new OAuthClientAuthnException("Error while authenticating client", "INVALID_CLIENT", e);
        }
    }

    /**
     * Returns whether this request can be authenticated by this client authenticator.
     *
     * @param httpServletRequest      Incoming HttpServletRequest.
     * @param bodyParams              Content of the body.
     * @param oAuthClientAuthnContext OAuth Client authentication context.
     * @return True if the client can be authenticated and false else.
     */
    public boolean canAuthenticate(HttpServletRequest httpServletRequest, Map<String, List> bodyParams,
                                   OAuthClientAuthnContext oAuthClientAuthnContext) {

        if (httpServletRequest.getHeader("client_id") != null &&
                httpServletRequest.getHeader("client_secret") != null) {
            return true;
        }
        return false;
    }

    /**
     * Extracts client id from incoming request and sends out.
     *
     * @param httpServletRequest      Incoming HttpServletRequest.
     * @param bodyParams              Content of the request body.
     * @param oAuthClientAuthnContext OAuth client authentication context
     * @return Client Id.
     * @throws OAuthClientAuthnException OAuthClientAuthenticationException.
     */
    public String getClientId(HttpServletRequest httpServletRequest, Map<String, List> bodyParams,
                              OAuthClientAuthnContext oAuthClientAuthnContext) throws OAuthClientAuthnException {

        return httpServletRequest.getHeader("client_id");
    }

    /**
     * Returns the execution order of this sample authenticator.
     *
     * @return
     */
    @Override
    public int getPriority() {

        return 150;
    }

    /**
     * Returns the name of this client authenticator.
     *
     * @return
     */
    @Override
    public String getName() {

        return "SampleOAuthClientAuthenticator";
    }
}

