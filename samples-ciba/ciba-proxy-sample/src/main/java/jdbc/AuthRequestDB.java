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
import transactionartifacts.CIBAauthRequest;

import java.util.ArrayList;
import java.util.logging.Logger;

/**
 * Auth request store for proxy.
 */
public class AuthRequestDB implements ProxyJdbc {

    private static final Logger LOGGER = Logger.getLogger(AuthRequestDB.class.getName());

    private AuthRequestDB() {

    }

    private static AuthRequestDB authRequestDBInstance = new AuthRequestDB();

    public static AuthRequestDB getInstance() {

        if (authRequestDBInstance == null) {

            synchronized (AuthRequestDB.class) {

                if (authRequestDBInstance == null) {

                    /* instance will be created at request time */
                    authRequestDBInstance = new AuthRequestDB();
                }
            }
        }
        return authRequestDBInstance;

    }

    private ArrayList<Handlers> interestedparty = new ArrayList<Handlers>();

    @Override
    public void add(String authReqId, Object authrequest) {

        if (authrequest instanceof CIBAauthRequest) {

            try {
                if (DbFunctions.getInstance().addAuthRequest(authReqId, authrequest)) {
                    LOGGER.info("CIBA Authentication added to store");
                } else {
                    throw new InternalServerErrorException("Error Adding Authentication Request to the store");
                }
            } catch (InternalServerErrorException internalServerErrorException) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, internalServerErrorException
                        .getMessage());

            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public void remove(String authReqId) {

        if (DbFunctions.getInstance().deleteAuthRequest(authReqId)) {
            LOGGER.info(" Authentication request is been deleted.");
        } else {
            try {
                throw new InternalServerErrorException("Error Deleting Authentication Request");
            } catch (InternalServerErrorException internalServerErrorException) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, internalServerErrorException
                        .getMessage());
            }
        }

    }

    @Override
    public Object get(String authReqId) {

        return DbFunctions.getInstance().getAuthRequest(authReqId);
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
