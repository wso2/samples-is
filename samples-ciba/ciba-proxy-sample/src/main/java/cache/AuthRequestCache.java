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
import transactionartifacts.CIBAauthRequest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.logging.Logger;

/**
 * Authentication Request Cache.
 */
public class AuthRequestCache implements ProxyCache {

    private static final Logger LOGGER = Logger.getLogger(AuthRequestCache.class.getName());

    private AuthRequestCache() {

    }

    private static AuthRequestCache authRequestCacheInstance = new AuthRequestCache();

    public static AuthRequestCache getInstance() {

        if (authRequestCacheInstance == null) {

            synchronized (AuthRequestCache.class) {

                if (authRequestCacheInstance == null) {

                    /* instance will be created at request time */
                    authRequestCacheInstance = new AuthRequestCache();
                }
            }
        }
        return authRequestCacheInstance;

    }

    private ArrayList<Handlers> interestedparty = new ArrayList<>();

    private HashMap<String, Object> authRequestCache = new HashMap<String, Object>();

    @Override
    public void add(String auth_req_id, Object authrequest) {

        if (authrequest instanceof CIBAauthRequest) {
            LOGGER.info("CIBA Authentication added to store.");
            authRequestCache.put(auth_req_id, authrequest);

        }
    }

    @Override
    public void remove(String auth_req_idey) {

        authRequestCache.remove(auth_req_idey);
    }

    @Override
    public Object get(String auth_req_id) {

        return authRequestCache.get(auth_req_id);
    }

    @Override
    public void clear() {
        //To be implemented if needed

    }

    @Override
    public long size() {

        return authRequestCache.size();
    }

    @Override
    public void register(Object object) {

        interestedparty.add((Handlers) object);

    }

}
