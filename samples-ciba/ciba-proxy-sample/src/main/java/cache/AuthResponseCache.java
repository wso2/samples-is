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

package cache;

import handlers.Handlers;
import transactionartifacts.CIBAauthResponse;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.logging.Logger;

/**
 * Authentication response cache.
 */
public class AuthResponseCache implements ProxyCache {

    private static final Logger LOGGER = Logger.getLogger(AuthResponseCache.class.getName());

    private AuthResponseCache() {

    }

    private static AuthResponseCache authResponseCacheInstance = new AuthResponseCache();

    public static AuthResponseCache getInstance() {

        if (authResponseCacheInstance == null) {

            synchronized (AuthResponseCache.class) {

                if (authResponseCacheInstance == null) {

                    /* instance will be created at request time */
                    authResponseCacheInstance = new AuthResponseCache();
                }
            }
        }
        return authResponseCacheInstance;

    }

    private ArrayList<Handlers> interestedparty = new ArrayList<Handlers>();
    private HashMap<String, Object> authResponseCache = new HashMap<String, Object>();

    @Override
    public void add(String auth_req_id, Object authresponse) {

        if (authresponse instanceof CIBAauthResponse) {

            authResponseCache.put(auth_req_id, authresponse);
            LOGGER.info("CIBA Auth response added to store.");
        }

    }

    @Override
    public void remove(String auth_req_idey) {

        authResponseCache.remove(auth_req_idey);
    }

    @Override
    public Object get(String auth_req_id) {

        return authResponseCache.get(auth_req_id);
    }

    @Override
    public void clear() {

    }

    @Override
    public long size() {

        return authResponseCache.size();
    }

    @Override
    public void register(Object object) {

        interestedparty.add((Handlers) object);
    }
}
