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
import com.nimbusds.jwt.SignedJWT;
import configuration.ConfigurationFile;
import exceptions.BadRequestException;
import handlers.Handlers;
import net.minidev.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import tempErrorCache.TempErrorCache;
import transactionartifacts.CIBAauthRequest;
import util.CodeGenerator;
import util.RestTemplateFactory;

import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.text.ParseException;
import java.util.HashMap;
import java.util.logging.Logger;

/**
 * Responsible for making authorize request to the Identity server.
 */
public class ServerRequestHandler implements Handlers {

    private HashMap<String, String> identifierstore = new HashMap<String, String>();
    private static final Logger LOGGER = Logger.getLogger(ServerRequestHandler.class.getName());

    private ServerRequestHandler() {

    }

    private static ServerRequestHandler serverRequestHandlerInstance = new ServerRequestHandler();

    public static ServerRequestHandler getInstance() {

        if (serverRequestHandlerInstance == null) {

            synchronized (ServerRequestHandler.class) {

                if (serverRequestHandlerInstance == null) {

                    /* instance will be created at request time */
                    serverRequestHandlerInstance = new ServerRequestHandler();
                }
            }
        }
        return serverRequestHandlerInstance;
    }

    /**
     * Initiate communication with Identity server.
     *
     * @param auth_req_id     ciba authentication request identifier.
     * @param cibAauthRequest Ciba Authentication rrequest.
     */
    public void initiateServerCommunication(CIBAauthRequest cibAauthRequest, String auth_req_id) {

        // create a mapping for the ciba authentication request and the authorize request.

        // Create a mapping ID and store.
        String mappingID = storeInDB(auth_req_id);

        // Initiate Authorization request.
        initiateRequest(cibAauthRequest, mappingID);

    }

    /**
     * Create mapping ID and store.
     *
     * @param authreqid ciba authentication request identifier.
     */
    private String storeInDB(String authreqid) {

        String identifier = CodeGenerator.getInstance().getRandomID();
        identifierstore.put(identifier, authreqid);
        LOGGER.info("Identifier for auth_req_id generated and stored.");

        return identifier;
    }

    /**
     * Fire authorize request.
     *
     * @param cibAauthRequest cibaAuthenticationRequest.
     * @param identifier      mapping identifier for the auth_req_id.
     */
    private void initiateRequest(CIBAauthRequest cibAauthRequest, String identifier) {

        System.out.println("Initiating server auth2 code grant");
        //Start sending request to IS server and listen upon.

        try {
            String user = getUser(cibAauthRequest);
            if (!user.equals(null)) {
                String bindingmessage = cibAauthRequest
                        .getBinding_message();
                String usercode = cibAauthRequest.getUser_code();

                TempErrorCache.getInstance()
                        .addAuthenticationStatus(ServerRequestHandler.getInstance().getAuthReqId(identifier),
                                "RequestSent");

                RestTemplate restTemplate = RestTemplateFactory.getInstance().getRestTemplate();
                String result = restTemplate
                        .getForObject(CIBAParameters.getInstance().getAUTHORIZE_ENDPOINT() + "?scope=openid&" +
                                "response_type=code&state=" + identifier + "&redirect_uri=" +
                                CIBAParameters.getInstance().
                                        getCallBackURL() + "&client_id=" +
                                ConfigurationFile.getInstance().getCLIENT_ID() + "&user=" + user, String.class);

                if (result != null) {
                    LOGGER.info("Code received at the Endpoint. Need processing the code flow");

                }
            } else {
                throw new BadRequestException("Identifier for request not found.");
            }

        } catch (KeyStoreException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Improper Keys.");
        } catch (HttpClientErrorException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User Denied the consent.");
        } catch (NoSuchAlgorithmException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No such Algorithm.");
        } catch (KeyManagementException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "KeyManagement Exception.");

        } catch (BadRequestException badRequestException) {
            LOGGER.info("Identifier for request not found.");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, badRequestException.getMessage());
        }
    }

    /**
     * Get user from authentication request.
     *
     * @param cibAauthRequest cibaAuthenticationRequest.
     * @return String user from authentication request.
     */
    private String getUser(CIBAauthRequest cibAauthRequest) {

        try {
            if (!cibAauthRequest.getLogin_hint().equals("null")) {
                return cibAauthRequest.getLogin_hint();
                // sending the request as binded.

                // We don't support this for now.But still extensible.
            } else if (!cibAauthRequest.getLogin_hint_token()
                    .equals("null")) {
                return null;
            } else if (!cibAauthRequest.getId_token_hint().equals("null")) {

                SignedJWT signedJWT = SignedJWT.parse(cibAauthRequest.getId_token_hint());
                String payload = signedJWT.getPayload().toString();
                System.out.println(payload);

                JSONObject jo = signedJWT.getJWTClaimsSet().toJSONObject();

                if (String.valueOf(jo.get("email")) != null) {
                    return String.valueOf(jo.get("email"));
                    // obtaining email of user and setting it as user

                } else if (String.valueOf(jo.get("given_name")) != null) {
                    return String.valueOf(jo.get("given_name"));
                    //  obtaining name of user and setting it as user

                } else if (String.valueOf(jo.get("family_name")) != null) {
                    return String.valueOf(jo.get("family_name"));
                    // obtaining name of user and setting it as user

                } else if (String.valueOf(jo.get("name")) != null) {
                    return String.valueOf(jo.get("name"));
                    // obtaining email of name and setting it as user

                } else if (String.valueOf(jo.get("username")) != null) {
                    return String.valueOf(jo.get("username"));
                    // obtaining username of user and setting it as user

                } else if (String.valueOf(jo.get("userid")) != null) {
                    return String.valueOf(jo.get("userid"));
                    // obtaining userid of user and setting it as user

                } else if (String.valueOf(jo.get("mobile")) != null) {
                    return String.valueOf(jo.get("mobile"));
                    // obtaining mobile of user and setting it as user

                } else if (String.valueOf(jo.get("phonenumber.work")) != null) {
                    return String
                            .valueOf(jo.get("phonenumber.work"));
                    // obtaining phonenumber of user and setting it as user

                } else if (String.valueOf(jo.get("phonenumber.home")) != null) {
                    return String
                            .valueOf(jo.get("phonenumber.home"));
                    // obtaining phonenumber of user and setting it as user

                } else {
                    return null;
                }

            } else {
                return null;
            }

        } catch (ParseException e) {
            LOGGER.info("Unable to parse given ID TokenHint.");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unable to parse given ID TokenHint.");
        }

    }

    /**
     * Get auth_req_id mapped with mappingID.
     *
     * @param identifier mappingID.
     * @return String user from authentication request.
     */
    public String getAuthReqId(String identifier) {

        return identifierstore.get(identifier);

    }

}
