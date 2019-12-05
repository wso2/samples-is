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
import store.UserStore;
import transactionartifacts.User;

/**
 * Connector for user store in In-Memory.
 */
public class CibaUserStoreCacheConnector implements UserStoreConnector {

    private static CibaUserStoreCacheConnector cibaStorageConnectorInstance = new CibaUserStoreCacheConnector();

    public static CibaUserStoreCacheConnector getInstance() {

        if (cibaStorageConnectorInstance == null) {

            synchronized (CibaUserStoreCacheConnector.class) {

                if (cibaStorageConnectorInstance == null) {

                    /* instance will be created at request time */
                    cibaStorageConnectorInstance = new CibaUserStoreCacheConnector();
                }
            }
        }
        return cibaStorageConnectorInstance;

    }

    @Override
    public void addUser(String userid, Object user) {

        if (user instanceof User) {
            UserStore.getInstance().add(userid, user);
        }

    }

    @Override
    public void removeUser(String userid) {

        if (UserStore.getInstance().get(userid) != null) {
            UserStore.getInstance().remove(userid);
        }

    }

    @Override
    public User getUser(String userid) {

        try {
            if (ClientStore.getInstance().get(userid) == null) {
                throw new BadRequestException("Unexpected user.");

            } else {
                return (User) UserStore.getInstance().get(userid);
            }
        } catch (BadRequestException badrequest) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, badrequest.getMessage());
        }

    }
}
