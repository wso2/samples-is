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
import transactionartifacts.CIBAauthResponse;

import java.util.ArrayList;
import java.util.logging.Logger;

/**
 * Auth response store for proxy.
 */
public class AuthResponseDB implements ProxyJdbc {

    private static final Logger LOGGER = Logger.getLogger(AuthResponseDB.class.getName());

    private AuthResponseDB() {

    }

    private static AuthResponseDB authResponseDBInstance = new AuthResponseDB();

    public static AuthResponseDB getInstance() {

        if (authResponseDBInstance == null) {

            synchronized (AuthResponseDB.class) {

                if (authResponseDBInstance == null) {

                    /* instance will be created at request time */
                    authResponseDBInstance = new AuthResponseDB();
                }
            }
        }
        return authResponseDBInstance;

    }

    private ArrayList<Handlers> interestedparty = new ArrayList<Handlers>();

    @Override
    public void add(String authReqId, Object authresponse) {

        if (authresponse instanceof CIBAauthResponse) {

            if (DbFunctions.getInstance().addAuthResponse(authReqId, authresponse)) {
                LOGGER.info("CIBA Auth response added to store.");
            } else {
                try {
                    throw new InternalServerErrorException("Error Adding Authentication Response");
                } catch (InternalServerErrorException internalServerErrorException) {
                    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, internalServerErrorException
                            .getMessage());
                }
            }

        }
    }

    @Override
    public void remove(String authReqId) {

        if (DbFunctions.getInstance().deleteAuthResponse(authReqId)) {

        } else {
            try {
                throw new InternalServerErrorException("Error deleting Authentication Response");
            } catch (InternalServerErrorException internalServerErrorException) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, internalServerErrorException
                        .getMessage());
            }
        }

    }

    @Override
    public Object get(String authReqId) {

        return DbFunctions.getInstance().getAuthResponse(authReqId);

    }

    @Override
    public void clear() {
        //To be implemented if needed
    }

    @Override
    public long size() {

        return 0;
        //To be implemented if needed
    }

    @Override
    public void register(Object object) {

        interestedparty.add((Handlers) object);
    }
}
