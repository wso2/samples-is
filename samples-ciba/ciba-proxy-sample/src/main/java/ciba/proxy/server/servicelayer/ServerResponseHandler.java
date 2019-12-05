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

package ciba.proxy.server.servicelayer;

import cibaparameters.CIBAParameters;
import configuration.ConfigurationFile;
import dao.DaoFactory;
import handlers.Handlers;
import handlers.NotificationHandler;
import net.minidev.json.JSONObject;
import net.minidev.json.parser.JSONParser;
import net.minidev.json.parser.ParseException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import transactionartifacts.TokenResponse;
import util.RestTemplateFactory;
import validator.TokenResponseValidator;

import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.util.logging.Logger;

/**
 * Responsible for making token requests.
 */
public class ServerResponseHandler implements Handlers {

    private static final Logger LOGGER = Logger.getLogger(ServerResponseHandler.class.getName());

    private ServerResponseHandler() {

    }

    private static ServerResponseHandler serverResponseHandlerInstance = new ServerResponseHandler();

    public static ServerResponseHandler getInstance() {

        if (serverResponseHandlerInstance == null) {

            synchronized (ServerResponseHandler.class) {

                if (serverResponseHandlerInstance == null) {

                    /* instance will be created at request time */
                    serverResponseHandlerInstance = new ServerResponseHandler();
                }
            }
        }
        return serverResponseHandlerInstance;
    }

    /**
     * Get token from Identity server.
     *
     * @param code        binding -authorize code.
     * @param idenitifier mapping ID.
     */
    public void getToken(String code, String idenitifier) {

        try {
            RestTemplate restTemplate = RestTemplateFactory.getInstance().getRestTemplate();

            // Setting the headers.
            HttpHeaders headers = new HttpHeaders();
            headers.setBasicAuth(ConfigurationFile.getInstance().getCLIENT_ID(),
                    ConfigurationFile.getInstance().getCLIENT_SECRET());
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            // Adding the attributes to the body.
            MultiValueMap<String, String> map = new LinkedMultiValueMap<String, String>();
            map.add("grant_type", "authorization_code");
            map.add("code", code);
            map.add("redirect_uri", CIBAParameters.getInstance().getCallBackURL());
            map.add("state", idenitifier);

            HttpEntity<MultiValueMap<String, String>> request =
                    new HttpEntity<MultiValueMap<String, String>>(map, headers);

            String token = restTemplate.postForObject("https://localhost:9443/oauth2/token", request, String.class);
            JSONParser parser = new JSONParser();
            JSONObject json = (JSONObject) parser.parse(token);
            receivetoken(json, idenitifier);

        } catch (KeyStoreException | NoSuchAlgorithmException | KeyManagementException | ParseException e) {
            e.printStackTrace();
            LOGGER.severe(e.getMessage());
        }

    }

    /**
     * Validate token and return token response.
     *
     * @param token Token
     * @return TokenResponse
     */
    public TokenResponse validate(JSONObject token) {

        return TokenResponseValidator.getInstance().validateTokens(token);
    }

    public void addtoStore(TokenResponse tokenResponse, String identifier) {

        DaoFactory.getInstance().getArtifactStoreConnector(ConfigurationFile.getInstance().getSTORE_CONNECTOR_TYPE()).
                addTokenResponse(ServerRequestHandler.getInstance().getAuthReqId(identifier), tokenResponse);

        LOGGER.info("Token Response Received and added to Store.");
        notify(ServerRequestHandler.getInstance().getAuthReqId(identifier));

    }

    /**
     * Receive token and add to store.
     *
     * @param token      received token.
     * @param identifier mapping ID.
     */
    public void receivetoken(JSONObject token, String identifier) {

        if (validate(token) != null) {

            addtoStore(validate(token), identifier);
            LOGGER.info("Token Response added to store.");
        }
    }

    /**
     * Receive authorize code.
     *
     * @param codeobject binding -authorize code.
     * @param identifier mapping ID.
     */
    public void receivecode(JSONObject codeobject, String identifier) {

        String code = codeobject.get("code").toString();

        this.getToken(code, identifier);
    }

    /**
     * Notifies the client about auth code reception.
     *
     * @param auth_req_id authentication request identifier.
     */
    private void notify(String auth_req_id) {

        // Notify the client.
        NotificationHandler.getInstance().sendNotificationtoClient(auth_req_id);
    }
}
