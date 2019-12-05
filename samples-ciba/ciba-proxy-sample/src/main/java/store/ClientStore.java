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
package store;

import transactionartifacts.Client;

import java.util.HashMap;
import java.util.logging.Logger;

/**
 * Client Store of CIBA Proxy Server.
 */
public class ClientStore implements ProxyStore {

    private static final Logger LOGGER = Logger.getLogger(ClientStore.class.getName());

    private ClientStore() {

    }

    private static ClientStore clientStoreInstance = new ClientStore();

    public static ClientStore getInstance() {

        if (clientStoreInstance == null) {

            synchronized (ClientStore.class) {

                if (clientStoreInstance == null) {

                    /* instance will be created at request time */
                    clientStoreInstance = new ClientStore();
                }
            }
        }
        return clientStoreInstance;
    }

    private HashMap<String, Object> clientstore = new HashMap<String, Object>();

    @Override
    public void add(String clientid, Object client) {

        if (client instanceof Client) {
            clientstore.put(clientid, client);
            LOGGER.info("User added to the store");
        }
    }

    @Override
    public void remove(String clientid) {

        clientstore.remove(clientid);
    }

    @Override
    public Object get(String clientid) {

        return clientstore.get(clientid);
    }

    @Override
    public void clear() {

    }

    @Override
    public long size() {

        return clientstore.size();
    }
}
