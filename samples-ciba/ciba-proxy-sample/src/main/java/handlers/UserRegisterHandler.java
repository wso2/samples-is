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

import ciba.proxy.server.servicelayer.ServerUserRegistrationHandler;
import dao.DaoFactory;
import exceptions.BadRequestException;
import net.minidev.json.JSONObject;
import org.springframework.http.HttpHeaders;
import transactionartifacts.User;

import java.util.logging.Logger;

/**
 * Handles user registration.
 */
public class UserRegisterHandler implements Handlers {

    private static final Logger LOGGER = Logger.getLogger(UserRegisterHandler.class.getName());
    DaoFactory daoFactory = DaoFactory.getInstance();

    private UserRegisterHandler() {

    }

    private static UserRegisterHandler userRegisterHandlerInstance = new UserRegisterHandler();

    public static UserRegisterHandler getInstance() {

        if (userRegisterHandlerInstance == null) {

            synchronized (UserRegisterHandler.class) {

                if (userRegisterHandlerInstance == null) {

                    /* instance will be created at request time */
                    userRegisterHandlerInstance = new UserRegisterHandler();
                }
            }
        }
        return userRegisterHandlerInstance;

    }

    /**
     * Stores user registration request.
     *
     * @param id   Identifier for the user.
     * @param user User who wanted to be registered.
     */
    public void store(String id, User user) {

        // It is always in-memory.
        daoFactory.getUserStoreConnector("InMemoryCache").addUser(id, user);

    }

    /**
     * Receive user registration request.
     *
     * @param userjson    Attributes of user as JSON.
     * @param httpHeaders headers that needed to be added for request that to be sent to IS.
     * @return String.
     */
    public String receive(JSONObject userjson, HttpHeaders httpHeaders) {

        User user = new User();
        if (String.valueOf(userjson.get("appid")) == "null") {

        } else {
            user.setAppid(userjson.get("appid").toString());
        }

        if (String.valueOf(userjson.get("ClientID")) != "null") {
            user.setClientappid(userjson.get("ClientID").toString());
        }

        user.setUserName(userjson.get("userName").toString());
        user.addClaim("emails", userjson.getAsString("emails"));

        try {
            if (validate(userjson)) {

                createUserRegistrationResponse(userjson, httpHeaders);
            } else {
                throw new BadRequestException("Parameters missing");

            }
        } catch (BadRequestException badRequestException) {
            badRequestException.printStackTrace();
        }
        return "";
    }

    /**
     * Create and return user registration response.
     *
     * @param user        Attributes of user as JSON.
     * @param httpHeaders headers that needed to be added for request that to be sent to IS.
     * @return String.
     */
    private String createUserRegistrationResponse(JSONObject user, HttpHeaders httpHeaders) {

        return registerInServer(user, httpHeaders);
    }

    /**
     * Validate user registration request.
     *
     * @param user Attributes of user as JSON.
     * @return Boolean.
     */
    public Boolean validate(JSONObject user) {

        return true;
    }

    /**
     * Validate user registration request.
     *
     * @param user        Attributes of user as JSON.
     * @param httpHeaders headers that needed to be added for request that to be sent to IS.
     * @return String.
     */
    public String registerInServer(JSONObject user, HttpHeaders httpHeaders) {

        return (ServerUserRegistrationHandler.getInstance().save(user, httpHeaders));
    }
}
