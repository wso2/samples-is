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

package dao;

import exceptions.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import store.ClientStore;
import transactionartifacts.Client;

/**
 * Connector for client store in In-Memory.
 */
public class CibaClientStoreCacheConnector implements ClientStoreConnector {

    ClientStore clientStore = ClientStore.getInstance();

    private static CibaClientStoreCacheConnector cibaClientStoreCacheConnectorInstance =
            new CibaClientStoreCacheConnector();

    public static CibaClientStoreCacheConnector getInstance() {

        if (cibaClientStoreCacheConnectorInstance == null) {

            synchronized (CibaClientStoreCacheConnector.class) {

                if (cibaClientStoreCacheConnectorInstance == null) {

                    /* instance will be created at request time */
                    cibaClientStoreCacheConnectorInstance = new CibaClientStoreCacheConnector();
                }
            }
        }
        return cibaClientStoreCacheConnectorInstance;

    }

    @Override
    public void addClient(String clientid, Object client) {

        if (client instanceof Client) {
            clientStore.add(clientid, client);
        }
    }

    @Override
    public void removeClient(String clientid) {

        if (clientStore.get(clientid) != null) {
            clientStore.remove(clientid);
        }

    }

    @Override
    public Client getClient(String clientid) {

        try {
            if (ClientStore.getInstance().get(clientid) == null) {
                throw new BadRequestException("Unexpected client.");

            } else {
                return (Client) ClientStore.getInstance().get(clientid);
            }
        } catch (BadRequestException badrequest) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, badrequest.getMessage());
        }
    }
}
