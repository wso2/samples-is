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

package authorizationserver;

import ciba.proxy.server.servicelayer.ServerRequestHandler;
import ciba.proxy.server.servicelayer.ServerResponseHandler;
import com.nimbusds.jose.Payload;
import com.nimbusds.jwt.JWTClaimsSet;
import configuration.ConfigHandler;
import exceptions.InternalServerErrorException;
import handlers.CIBAAuthRequestHandler;
import handlers.Handlers;
import handlers.RegisterHandler;
import handlers.TokenRequestHandler;
import handlers.UserRegisterHandler;
import net.minidev.json.JSONObject;
import net.minidev.json.parser.ParseException;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import tempErrorCache.TempErrorCache;

import java.io.IOException;
import java.util.ArrayList;
import java.util.logging.Logger;

/**
 * Actual implementation of CIBA proxy server.
 */

@RestController
public class CIBAProxyServer implements AuthorizationServer {

    private ArrayList<Handlers> handlers = new ArrayList<>();
    // List of interested observers.

    private static final Logger LOGGER = Logger.getLogger(CIBAProxyServer.class.getName());

    private final Object mutex = new Object();
    //to serve as a mutex lock in synchronization

    public CIBAProxyServer() {

        CIBAAuthRequestHandler cibaauthrequesthandler = CIBAAuthRequestHandler.getInstance();
        this.register(cibaauthrequesthandler);
        // Registering to Proxy server and to observe on auth requests coming.

        TokenRequestHandler tokenrequesthandler = TokenRequestHandler.getInstance();
        this.register(tokenrequesthandler);
        // Registering to Proxy server and to observe on token requests coming.

        RegisterHandler registerHandler = RegisterHandler.getInstance();
        this.register(registerHandler);
        // Registering to Proxy server and to observe on client app registration requests coming.

        UserRegisterHandler userRegisterHandler = UserRegisterHandler.getInstance();
        this.register(userRegisterHandler);
        // Registering to Proxy server and to observe on user registration requests coming.

        ServerResponseHandler serverResponseHandler = ServerResponseHandler.getInstance();
        this.register(serverResponseHandler);
        // Registering to Proxy server and to observe on grant codes coming.

        LOGGER.config("Successfully configured the Handlers as observers.");

    }

    /**
     * Endpoint where authentication request hits and then proceeded.
     */
    @RequestMapping(value = "/CIBAEndPoint")
    public String acceptAuthRequest(@RequestParam(defaultValue = "", value = "request") String request) {

        LOGGER.info("CIBA Authentication request hits the CIBA Auth Request Endpoint.");

        try {
            if (!handlers.isEmpty()) {
                for (Handlers handler : handlers) {
                    if (handler instanceof CIBAAuthRequestHandler && !request.equals("")) {
                        return notifyHandler(handler, request);
                    }
                }
            }

            throw new InternalServerErrorException("No Authentication Request Handlers configured to listen.");

        } catch (InternalServerErrorException internalServerErrorException) {
            LOGGER.warning("No Authentication Request Handlers to listen the request.");
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, internalServerErrorException.getMessage());

        }

    }

    /**
     * Endpoint where token request hits and then proceeded.
     */
    @RequestMapping(value = "/TokenEndPoint")
    public String acceptTokenRequest(@RequestParam(defaultValue = "", value = "auth_req_id") String auth_req_id,
                                     @RequestParam(defaultValue = "", value = "grant_type") String grantType) {

        LOGGER.info("CIBA Token request hits the CIBA Token Request Endpoint.");

        try {
            if (!handlers.isEmpty()) {
                for (Handlers handler : handlers) {
                    if (handler instanceof TokenRequestHandler) {

                        return this.notifyHandler(handler, auth_req_id, grantType).toString();

                    }
                }
            }

            LOGGER.warning("No Token request handlers added to the system.");
            throw new InternalServerErrorException("No Token request handlers registered");
        } catch (InternalServerErrorException internalServerErrorException) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, internalServerErrorException
                    .getMessage());
        }

    }

    /**
     * Endpoint through which  client app can be registered.
     */
    @RequestMapping("/RegistrationEndPoint")
    public String acceptRegistrationRequest(@RequestParam(defaultValue = "", value = "name") String name,
                                            @RequestParam(defaultValue = "", value = "password") String password,
                                            @RequestParam(defaultValue = "", value = "mode") String mode) {

        LOGGER.info("CIBA Client App registration request hits the CIBA Registration Endpoint.");

        try {
            if (!handlers.isEmpty()) {
                for (Handlers handler : handlers) {
                    if (handler instanceof RegisterHandler) {

                        return this.notifyHandler(handler, name, password, mode).toString();

                    }
                }
            }

            LOGGER.warning("No Client Registration handlers added to the system.");
            throw new InternalServerErrorException("No Client Registration handlers registered.");
        } catch (InternalServerErrorException internalServerErrorException) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, internalServerErrorException
                    .getMessage());
        }

    }

    /**
     * Endpoint where token request hits and then proceeded.
     */
    @RequestMapping("/UserRegistrationEndPoint")
    public String acceptUserRegistration(@RequestBody JSONObject user, @RequestHeader HttpHeaders headersRequest) {

        LOGGER.info("CIBA User registration request hits the CIBA User Registration Endpoint.");

        try {
            if (!handlers.isEmpty()) {
                for (Handlers handler : handlers) {
                    if (handler instanceof UserRegisterHandler) {

                        return this.notifyHandler(handler, user, headersRequest);

                    }
                }
            }

            LOGGER.warning("No User Registration handlers added to the system.");
            throw new InternalServerErrorException("No User Registration handlers registered.");
        } catch (InternalServerErrorException internalServerErrorException) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, internalServerErrorException
                    .getMessage());
        }

    }

    /**
     * Endpoint which serves as Callbackurl.
     */
    @RequestMapping("/CallBackEndpoint")
    public void acceptAuthCode(@RequestParam(defaultValue = "", value = "code") String code,
                               @RequestParam(defaultValue = "", value = "session_state") String session_state,
                               @RequestParam(defaultValue = "", value = "state") String state,
                               @RequestParam(defaultValue = "", value = "error_description") String error_description) {

        LOGGER.info("Grant code is being received at this Callback Endpoint.");

        try {
            if (!handlers.isEmpty()) {

                for (Handlers handler : handlers) {
                    if (handler instanceof ServerResponseHandler) {
                        // if (response.get("code").toString() != null && response.get("session_state") != null) {
                        if (!code.isEmpty() && !StringUtils.isBlank(code)) {

                            JWTClaimsSet claims = new JWTClaimsSet.Builder()
                                    .claim("code", code)
                                    .claim("session_state", session_state)
                                    .claim("state", state)
                                    .build();

                            TempErrorCache.getInstance()
                                    .removeAuthResponse(ServerRequestHandler.getInstance().getAuthReqId(state));
                            TempErrorCache.getInstance()
                                    .addAuthenticationStatus(ServerRequestHandler.getInstance().getAuthReqId(state),
                                            "Success");

                            JSONObject response = claims.toJSONObject();
                            notifyCodeHandler(handler, response, state);

                        } else {
                            TempErrorCache.getInstance()
                                    .removeAuthResponse(ServerRequestHandler.getInstance().getAuthReqId(state));
                            TempErrorCache.getInstance()
                                    .addAuthenticationStatus(ServerRequestHandler.getInstance().getAuthReqId(state),
                                            "Failed");

                        }
                    }
                }

            } else {
                LOGGER.warning("No Server Response handlers added to the system.");
                throw new InternalServerErrorException("No Server event handlers registered.");

            }
        } catch (InternalServerErrorException internalServerErrorException) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, internalServerErrorException
                    .getMessage());

        }
    }

    /**
     * Notifies relevant code handler.
     *
     * @param handler    Handlers of the relevant requests.
     * @param identifier Identifier that uniquely identify particular request.
     * @param response   Response for the request.
     */
    private void notifyCodeHandler(Handlers handler, JSONObject response, String identifier) {

        try {
            if (handler instanceof ServerResponseHandler) {

                ServerResponseHandler serverResponseHandler = (ServerResponseHandler) handler;

                LOGGER.info("Server Request Handler is notified about reception of grant code.");
                serverResponseHandler.receivecode(response, identifier);

            } else {
                throw new InternalServerErrorException("No CallBack handlers found.");
            }
        } catch (InternalServerErrorException internalServerErrorException) {
            LOGGER.severe("No CallBack handlers found.");
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, internalServerErrorException
                    .getMessage());
        }
    }

    /**
     * Notifies relevant token handler.
     *
     * @param handler    Handlers of the relevant requests.
     * @param identifier Identifier that uniquely identify particular request.
     * @param response   Response for the request.
     */
    private void notifyTokenHandler(Handlers handler, JSONObject response, String identifier) {

        try {
            if (handler instanceof ServerResponseHandler) {

                ServerResponseHandler serverResponseHandler = (ServerResponseHandler) handler;

                LOGGER.info("Server Response Handler is notified about reception of token.");
                serverResponseHandler.receivetoken(response, identifier);

            } else {
                throw new InternalServerErrorException("No CallBack handlers found.");
            }
        } catch (InternalServerErrorException internalServerErrorException) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, internalServerErrorException
                    .getMessage());
        }
    }

    /**
     * Register observers to endpoint.
     *
     * @param handler Handlers of the relevant requests.
     */
    public void register(Handlers handler) {

        if (handler == null) {
            throw new NullPointerException("Null Handlers.");
        }
        synchronized (mutex) {
            if (!handlers.contains(handler)) {
                handlers.add(handler);
            }
        }
    }

    /**
     * Removes observers from endpoint.
     *
     * @param handler Handlers of the relevant requests.
     */
    public void deRegister(Handlers handler) {

        synchronized (mutex) {
            handlers.remove(handler);
        }
    }

    /**
     * Notifies the relevant observers.
     *
     * @param handler Handlers of the relevant requests.
     * @param params  parameters of particular request.
     */
    private String notifyHandler(Handlers handler, String params) {

        try {
            if (handler instanceof CIBAAuthRequestHandler) {

                CIBAAuthRequestHandler cibaauthrequesthandler = (CIBAAuthRequestHandler) handler;
                LOGGER.info("Authentication request handler notified.");

                return cibaauthrequesthandler.receive(params);

            }
            throw new InternalServerErrorException("No Authentication request handlers found.");

        } catch (InternalServerErrorException internalServerErrorException) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, internalServerErrorException
                    .getMessage());
        }

    }

    /**
     * Notifies relevant handlers.
     *
     * @param handler Handlers of the relevant requests.
     */
    private Payload notifyHandler(Handlers handler, String authReqid, String grantType) {

        try {
            if (handler instanceof TokenRequestHandler) {

                TokenRequestHandler tokenrequesthandler = (TokenRequestHandler) handler;
                LOGGER.info("Token request handler notified.");
                return tokenrequesthandler.receive(authReqid, grantType);

            } else {
                throw new InternalServerErrorException("No Authentication request handlers found.");
            }
        } catch (InternalServerErrorException internalServerErrorException) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, internalServerErrorException
                    .getMessage());
        }
    }

    /**
     * Notifies relevant handlers.
     *
     * @param handler Handlers of the relevant requests.
     */
    private Payload notifyHandler(Handlers handler, String name, String password, String mode) {

        try {
            if (handler instanceof RegisterHandler) {

                RegisterHandler registerHandler = (RegisterHandler) handler;
                LOGGER.info("Client Registration handler notified.");

                return registerHandler.receive(name, password, mode);

            }
            throw new InternalServerErrorException("No Authentication request handlers found.");

        } catch (InternalServerErrorException internalServerErrorException) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, internalServerErrorException
                    .getMessage());
        }

    }

    /**
     * Notifies relevant handlers.
     *
     * @param handler Handlers of the relevant requests.
     */
    private String notifyHandler(Handlers handler, JSONObject user, HttpHeaders httpHeaders) {

        try {
            if (handler instanceof UserRegisterHandler) {

                UserRegisterHandler userRegisterHandler = (UserRegisterHandler) handler;
                LOGGER.info("User registration handler notified.");

                return userRegisterHandler.receive(user, httpHeaders);

            }
            throw new InternalServerErrorException("No Authentication request handlers found.");

        } catch (InternalServerErrorException internalServerErrorException) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, internalServerErrorException
                    .getMessage());
        }

    }

    /**
     * Configure proxy.
     */
    private void configureProxy() throws IOException, ParseException {

        ConfigHandler.getInstance().configure();
        LOGGER.config("Configuring Proxy for the Client of Application.");
    }

}

