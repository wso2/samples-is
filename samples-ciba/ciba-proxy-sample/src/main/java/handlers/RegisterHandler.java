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

import com.nimbusds.jose.Payload;
import com.nimbusds.jwt.JWTClaimsSet;
import dao.DaoFactory;
import exceptions.BadRequestException;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import transactionartifacts.Client;
import util.CodeGenerator;
import util.SecretKeyPairGenerator;
import validator.RegistrationValidator;

import java.security.NoSuchAlgorithmException;
import java.util.logging.Logger;

/**
 * Handles the registration of client and user to the store.
 */
@ComponentScan("handlers")
@Configuration
public class RegisterHandler implements Handlers {

    private static final Logger LOGGER = Logger.getLogger(RegisterHandler.class.getName());
    DaoFactory daoFactory = DaoFactory.getInstance();

    private RegisterHandler() {

    }

    private static RegisterHandler registerHandlerInstance = new RegisterHandler();

    public static RegisterHandler getInstance() {

        if (registerHandlerInstance == null) {

            synchronized (RegisterHandler.class) {

                if (registerHandlerInstance == null) {

                    /* instance will be created at request time */
                    registerHandlerInstance = new RegisterHandler();
                }
            }
        }
        return registerHandlerInstance;

    }

    /**
     * Receives client registration request.
     *
     * @param appname  Application name.
     * @param mode
     * @param password Application password.
     * @return response payload.
     */
    public Payload receive(String appname, String password, String mode) {

        LOGGER.info("Client Application registration request received.");
        return extractParameters(appname, password, mode);
    }

    /**
     * Extracts parameters from client registration request.
     *
     * @param appname  Application name.
     * @param mode
     * @param password Application password.
     * @return response payload.
     */
    private Payload extractParameters(String appname, String password, String mode) {

        // Validate the request.
        if (!RegistrationValidator.getInstance().validate(appname, password, mode)) {
            try {
                throw new BadRequestException("Invalid Parameters");
            } catch (BadRequestException badRequestException) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, badRequestException.getMessage());
            }
        }
        return (this.createRegistrationResponse(appname, password, mode));

    }

    /**
     * Receives client registration request.
     *
     * @param appname  Application name.
     * @param mode
     * @param password Application password.
     * @return response payload.
     */
    private Payload createRegistrationResponse(String appname, String password, String mode) {

        try {
            String clientId = CodeGenerator.getInstance().getRandomID();
            String clientSecret =
                    new String(SecretKeyPairGenerator.getInstance().generatesecretkey().getPrivate().getEncoded());
            String publicKey =
                    new String(SecretKeyPairGenerator.getInstance().generatesecretkey().getPublic().getEncoded());

            JWTClaimsSet claims = new JWTClaimsSet.Builder()
                    .claim("client_id", clientId)
                    .claim("client_secret", clientSecret)
                    .claim("public_key", publicKey)
                    .build();

            Payload payload = new Payload(claims.toJSONObject());

            Client client = new Client();
            client.setClientName(appname);
            client.setPublickey(publicKey);
            client.setClientSecret(clientSecret);
            client.setClientMode(mode);

            // Store client.
            store(clientId, client);

            LOGGER.info("Registration response returned with client id and client secret.");
            return payload;

        } catch (NoSuchAlgorithmException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Client key generation aborted.");
        }

    }

    /**
     * Stores client registration request.
     *
     * @param client   Client Object.
     * @param clientId Client Identifier.
     */
    private void store(String clientId, Client client) {

        DaoFactory.getInstance().getClientStoreConnector("InMemoryCache").addClient(clientId, client);
        System.out.println("Name of Client " +
                DaoFactory.getInstance().getClientStoreConnector("InMemoryCache").getClient(clientId).getClientName());

        LOGGER.info("Client store into the client store.");
    }

}
