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
import transactionartifacts.TokenRequest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.logging.Logger;

/**
 * Token request cache that implements abstract layer of proxy cache.
 */
public class TokenRequestCache implements ProxyCache {

    private static final Logger LOGGER = Logger.getLogger(TokenRequestCache.class.getName());

    private TokenRequestCache() {

    }

    private static TokenRequestCache tokenRequestCacheInstance = new TokenRequestCache();

    public static TokenRequestCache getInstance() {

        if (tokenRequestCacheInstance == null) {

            synchronized (TokenRequestCache.class) {

                if (tokenRequestCacheInstance == null) {

                    /* instance will be created at request time */
                    tokenRequestCacheInstance = new TokenRequestCache();
                }
            }
        }
        return tokenRequestCacheInstance;
    }

    private ArrayList<Handlers> interestedparty = new ArrayList<>();
    HashMap<String, Object> tokenRequestCache = new HashMap<>();

    @Override
    public void add(String authReqId, Object tokenrequest) {

        if (tokenrequest instanceof TokenRequest) {
            tokenRequestCache.put(authReqId, tokenrequest);
            LOGGER.info(authReqId + " : Token Request added.");
        }
    }

    @Override
    public void remove(String authReqIdkey) {

        tokenRequestCache.remove(authReqIdkey);
    }

    @Override
    public Object get(String authReqId) {

        return tokenRequestCache.get(authReqId);
    }

    @Override
    public void clear() {

    }

    @Override
    public long size() {

        return tokenRequestCache.size();
    }

    @Override
    public void register(Object object) {

        interestedparty.add((Handlers) object);
    }

}
