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
import transactionartifacts.PollingAtrribute;

import java.util.ArrayList;
import java.util.logging.Logger;

/**
 * Data Store for Polling Attribute.
 */
public class PollingAttributeDB implements ProxyJdbc {

    private static final Logger LOGGER = Logger.getLogger(PollingAttributeDB.class.getName());

    private PollingAttributeDB() {

    }

    private static PollingAttributeDB PollingAttributeDBInstance = new PollingAttributeDB();

    public static PollingAttributeDB getInstance() {

        // TODO: 8/27/19 need to change this to database
        if (PollingAttributeDBInstance == null) {

            synchronized (PollingAttributeDB.class) {

                if (PollingAttributeDBInstance == null) {

                    /* instance will be created at request time */
                    PollingAttributeDBInstance = new PollingAttributeDB();
                }
            }
        }
        return PollingAttributeDBInstance;


    }

    private ArrayList<Handlers> interestedparty = new ArrayList<Handlers> ();

    @Override
    public void add(String auth_req_id, Object pollingattribute) {
        if (pollingattribute instanceof PollingAtrribute) {

            try {
                if( DbFunctions.getInstance().addPollingAttribute(auth_req_id,pollingattribute)) {
                    LOGGER.info("Polling Attribute added to store");


                }else {
                    throw new InternalServerErrorException("Error Adding Polling Attribute to the store");
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
    public void remove(String auth_req_id) {
        if( DbFunctions.getInstance().deletePollingAttribute(auth_req_id)){
            LOGGER.info(" Polling Attribute is been deleted.");

        }
        else{
            try {
                throw new InternalServerErrorException("Error Deleting Polling Attribute");
            } catch (InternalServerErrorException internalServerErrorException) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, internalServerErrorException
                        .getMessage());
            }
        }

    }


    @Override
    public Object get(String auth_req_id) {
        return DbFunctions.getInstance().getPollingAttribute(auth_req_id);
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
