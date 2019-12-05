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

import transactionartifacts.User;

import java.util.HashMap;
import java.util.logging.Logger;

/**
 * User store.
 */
public class UserStore implements ProxyStore {
    private static final Logger LOGGER = Logger.getLogger(UserStore.class.getName());

    private UserStore() {

    }

    private static UserStore userStoreInstance = new UserStore();

    public static UserStore getInstance() {
        if (userStoreInstance == null) {

            synchronized (UserStore.class) {

                if (userStoreInstance == null) {

                    /* instance will be created at request time */
                    userStoreInstance = new UserStore();
                }
            }
        }
        return userStoreInstance;
    }

    private HashMap<String, Object> userstore = new HashMap<String , Object>();
    @Override
    public void add(String userid, Object user) {
        if (user instanceof User) {
            userstore.put(userid, user);
            LOGGER.info("User added to the store");
        }
    }
    @Override
    public void remove(String userid) {
        userstore.remove(userid);
    }

    @Override
    public Object get(String userid) {
        return  userstore.get(userid);
    }

    @Override
    public void clear() {

    }

    @Override
    public long size() {
        return userstore.size();
    }
}
