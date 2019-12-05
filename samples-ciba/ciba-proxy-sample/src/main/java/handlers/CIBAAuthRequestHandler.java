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
import com.nimbusds.jwt.SignedJWT;
import configuration.ConfigurationFile;
import dao.DaoFactory;
import net.minidev.json.JSONObject;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import transactionartifacts.CIBAauthRequest;
import util.CodeGenerator;
import validator.AuthRequestValidator;

import java.util.logging.Logger;

/**
 * Accepts and handle the CIBA authentication requests.
 */
@ComponentScan("handlers")
@Configuration
public class CIBAAuthRequestHandler implements Handlers {

    private static final Logger LOGGER = Logger.getLogger(CIBAProxyServer.class.getName());
    DaoFactory daoFactory = DaoFactory.getInstance();

    private CIBAAuthRequestHandler() {

    }

    private static CIBAAuthRequestHandler cibaAuthRequestHandlerInstance = new CIBAAuthRequestHandler();

    public static CIBAAuthRequestHandler getInstance() {

        if (cibaAuthRequestHandlerInstance == null) {

            synchronized (CIBAAuthRequestHandler.class) {

                if (cibaAuthRequestHandlerInstance == null) {

                    /* instance will be created at request time */
                    cibaAuthRequestHandlerInstance = new CIBAAuthRequestHandler();
                }
            }
        }
        return cibaAuthRequestHandlerInstance;

    }

    /**
     * Extract parameters from authentication request.
     *
     * @param request Ciba Authenitcation request.
     * @return Authentication response.
     */
    public String extractParameters(String request) {

        CIBAAuthResponseHandler cibaAuthResponseHandler = CIBAAuthResponseHandler.getInstance();
        try {

            SignedJWT signedJWT = SignedJWT.parse(request);
            String payload = signedJWT.getPayload().toString();
            System.out.println("Payload" + payload);
            JSONObject jo = signedJWT.getJWTClaimsSet().toJSONObject();

            LOGGER.info("Auth request parameters extracted.");

            // Once properly validated creating the authentication response.
            if (this.refactorAuthRequest(jo) != null) {

                // Initiate code generator.
                CodeGenerator codeGenerator = CodeGenerator.getInstance();

                // Creation of auth_req_id happens here.
                String authReqId = codeGenerator.getAuthReqId();

                // Store CIBA authentication request to the memory.
                storeAuthRequest(authReqId, this.refactorAuthRequest(jo));

                // Returning authentication response.
                return cibaAuthResponseHandler.createAuthResponse(authReqId)
                        .toString();
            }

        } catch (ArrayIndexOutOfBoundsException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Improper 'request' parameter.");

        } catch (java.text.ParseException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unable to parse JWS.");
        }

        return null;

    }

    /**
     * Extract parameters from authentication request.
     *
     * @param jo Ciba Authentication request.
     * @return Authentication response.
     */
    public CIBAauthRequest refactorAuthRequest(JSONObject jo) {

        // Initiating the validation process.
        AuthRequestValidator authRequestValidator = AuthRequestValidator.getInstance();

        if (authRequestValidator.validateAuthRequest(jo) != null) {

            // Validate authentication request.
            return authRequestValidator.validateAuthRequest(jo);
        } else {

            return null;
        }
    }

    /**
     * Receive ciba authentication request parameters.
     *
     * @param params Ciba Authentication request parameters.
     * @return Authentication response.
     */
    public String receive(String params) {

        LOGGER.info("Auth request handler received the auth request.");

        // Return extracted parameters.
        return extractParameters(params);
    }

    /**
     * Store authentication request to store.
     *
     * @param authReqId       Ciba Authentication request identifier.
     * @param cibAauthRequest Ciba Authentication request.
     */
    public void storeAuthRequest(String authReqId, CIBAauthRequest cibAauthRequest) {

        daoFactory.getArtifactStoreConnector(ConfigurationFile.getInstance().getSTORE_CONNECTOR_TYPE())
                .addAuthRequest(authReqId, cibAauthRequest);
        LOGGER.info("Authentication request stored in  Authentication Request Database.");
    }
}
