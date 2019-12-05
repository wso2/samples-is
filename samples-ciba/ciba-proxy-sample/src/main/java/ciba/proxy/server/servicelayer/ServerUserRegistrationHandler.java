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

import handlers.Handlers;
import net.minidev.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.web.client.RestTemplate;
import util.RestTemplateFactory;

import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.util.logging.Logger;

/**
 * Handles user registration.
 */
public class ServerUserRegistrationHandler implements Handlers {

    private static final Logger LOGGER = Logger.getLogger(ServerResponseHandler.class.getName());

    private ServerUserRegistrationHandler() {
        // this.run();
    }

    private static ServerUserRegistrationHandler serverUserRegistrationHandlerInstance =
            new ServerUserRegistrationHandler();

    public static ServerUserRegistrationHandler getInstance() {

        if (serverUserRegistrationHandlerInstance == null) {

            synchronized (ServerUserRegistrationHandler.class) {

                if (serverUserRegistrationHandlerInstance == null) {

                    /* instance will be created at request time */
                    serverUserRegistrationHandlerInstance = new ServerUserRegistrationHandler();
                }
            }
        }
        return serverUserRegistrationHandlerInstance;
    }

    public void receive() {
        //receive token from Identity server
    }

    /**
     * Get token from Identity server.
     *
     * @param headers for registration request.
     * @param user    User to  be registered.
     */
    public String save(JSONObject user, HttpHeaders headers) {

        try {
            RestTemplate restTemplate = RestTemplateFactory.getInstance().getRestTemplate();

            System.out.println(user);
            HttpEntity<String> request = new HttpEntity<String>(user.toString(), headers);
            String uri = "https://localhost:9443/scim2/Users";
            return (restTemplate.postForObject(uri, request, String.class));

        } catch (KeyStoreException | NoSuchAlgorithmException | KeyManagementException e) {
            e.printStackTrace();
            LOGGER.severe(e.getMessage());
        }
        return "Unstored";

    }

}
