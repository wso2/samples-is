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

import handlers.Handlers;

import java.util.ArrayList;

/**
 * JDBC store for proxy.
 */
public class CibaProxyJdbcStore {

    private ArrayList<Handlers> interestedparty = new ArrayList<Handlers>();
    private AuthRequestDB authRequestDB;
    private AuthResponseDB authResponseDB;
    private TokenRequestDB tokenRequestDB;
    private TokenResponseDB tokenResponseDB;
    private PollingAttributeDB pollingAttributeDB;

    private CibaProxyJdbcStore() {

        authRequestDB = AuthRequestDB.getInstance();
        authResponseDB = AuthResponseDB.getInstance();
        tokenRequestDB = TokenRequestDB.getInstance();
        tokenResponseDB = TokenResponseDB.getInstance();
        pollingAttributeDB = PollingAttributeDB.getInstance();

    }

    private static CibaProxyJdbcStore cibaProxyJdbcStoreInstance = new CibaProxyJdbcStore();

    public static CibaProxyJdbcStore getInstance() {

        if (cibaProxyJdbcStoreInstance == null) {

            synchronized (CibaProxyJdbcStore.class) {

                if (cibaProxyJdbcStoreInstance == null) {

                    /* instance will be created at request time */
                    cibaProxyJdbcStoreInstance = new CibaProxyJdbcStore();
                }
            }
        }
        return cibaProxyJdbcStoreInstance;

    }

    public AuthRequestDB getAuthRequestDB() {

        return authRequestDB;
    }

    public AuthResponseDB getAuthResponseDB() {

        return authResponseDB;
    }

    public TokenRequestDB getTokenRequestDB() {

        return tokenRequestDB;
    }

    public TokenResponseDB getTokenResponseDB() {

        return tokenResponseDB;
    }

    public PollingAttributeDB getPollingAttributeDB() {

        return pollingAttributeDB;
    }

    public static CibaProxyJdbcStore getcibaProxyJdbcStoreInstance() {

        return cibaProxyJdbcStoreInstance;
    }

}


