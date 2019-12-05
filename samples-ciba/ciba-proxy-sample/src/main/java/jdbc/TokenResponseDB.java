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

package jdbc;

import exceptions.InternalServerErrorException;
import handlers.Handlers;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import transactionartifacts.TokenResponse;

import java.util.ArrayList;
import java.util.logging.Logger;

/**
 * Data Store of Token Response.
 */
public class TokenResponseDB implements ProxyJdbc {
    private static final Logger LOGGER = Logger.getLogger(TokenResponseDB.class.getName());

    private TokenResponseDB() {

    }

    private static TokenResponseDB tokenResponseDBInstance = new TokenResponseDB();

    public static TokenResponseDB getInstance() {

        // TODO: 8/27/19 need to change this to database
        if (tokenResponseDBInstance == null) {

            synchronized (TokenResponseDB.class) {

                if (tokenResponseDBInstance == null) {

                    /* instance will be created at request time */
                    tokenResponseDBInstance = new TokenResponseDB();
                }
            }
        }
        return tokenResponseDBInstance;


    }

    private ArrayList<Handlers> interestedparty = new ArrayList<Handlers>();

    @Override
    public void add(String auth_req_id, Object tokenResponse) {
        if (tokenResponse instanceof TokenResponse) {

            if (DbFunctions.getInstance().addTokenResponse(auth_req_id, tokenResponse)) {
                LOGGER.info("Token Response added to store.");
            } else {
                try {
                    throw new InternalServerErrorException("Error Adding Token Response");
                } catch (InternalServerErrorException internalServerErrorException) {
                    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, internalServerErrorException
                            .getMessage());
                }
            }

        }
    }

    @Override
    public void remove(String auth_req_id) {
        if (DbFunctions.getInstance().deleteTokenResponse(auth_req_id)) {

        } else {
            try {
                throw new InternalServerErrorException("Error deleting Token Request");
            } catch (InternalServerErrorException internalServerErrorException) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, internalServerErrorException
                        .getMessage());
            }
        }

    }


    @Override
    public Object get(String auth_req_id) {
        return DbFunctions.getInstance().getTokenResponse(auth_req_id);

    }

    @Override
    public void clear() {

    }

    @Override
    public long size() {
        return 0;
    }

    @Override
    public void register(Object object) {
        interestedparty.add((Handlers) object);
    }
}
