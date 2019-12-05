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

package handlers;

import authorizationserver.CIBAProxyServer;
import com.nimbusds.jose.Payload;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import validator.TokenRequestValidator;

import java.util.logging.Logger;

/**
 * Accepts token request and initiates validation.
 */
@ComponentScan("handlers")
@Configuration
public class TokenRequestHandler implements Handlers {

    private static final Logger LOGGER = Logger.getLogger(CIBAProxyServer.class.getName());

    private TokenRequestHandler() {

    }

    private static TokenRequestHandler tokenRequestHandlerInstance = new TokenRequestHandler();

    public static TokenRequestHandler getInstance() {

        if (tokenRequestHandlerInstance == null) {

            synchronized (TokenRequestHandler.class) {

                if (tokenRequestHandlerInstance == null) {

                    /* instance will be created at request time */
                    tokenRequestHandlerInstance = new TokenRequestHandler();
                }
            }
        }
        return tokenRequestHandlerInstance;

    }

    /**
     * Extract parameters from request and return response after validation.
     *
     * @param authReqId Authentication request Identifier.
     * @param grantType GrantType for token.
     * @return response payload.
     */
    public Payload processTokenRequest(String authReqId, String grantType) {

        TokenRequestValidator tokenRequestValidator = TokenRequestValidator.getInstance();

        // Validator class taking care of validation of the token request.
        if (tokenRequestValidator.validateTokenRequest(authReqId, grantType) != null) {

            // TokenRequestHandler getting the service from Token_Response_Handler to create response.
            TokenResponseHandler tokenresponsehandler = TokenResponseHandler.getInstance();
            return (tokenresponsehandler.createTokenResponse(authReqId));

        } else {
            TokenResponseHandler tokenresponsehandler = TokenResponseHandler.getInstance();
            return (tokenresponsehandler.createTokenErrorResponse(authReqId));
        }

    }

    /**
     * Receives token request.
     *
     * @param authReqId Authentication request Identifier.
     * @param grantType GrantType for token.
     * @return response payload.
     */
    public Payload receive(String authReqId, String grantType) {

        return processTokenRequest(authReqId, grantType);
    }

}
