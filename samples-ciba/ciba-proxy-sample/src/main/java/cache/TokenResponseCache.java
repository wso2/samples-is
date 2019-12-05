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
import transactionartifacts.TokenResponse;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.logging.Logger;

/**
 * Token response cache that implements abstract layer of proxy cache.
 */
public class TokenResponseCache implements ProxyCache {

    private static final Logger LOGGER = Logger.getLogger(TokenResponseCache.class.getName());

    private TokenResponseCache() {

    }

    private static TokenResponseCache tokenResponseCacheInstance = new TokenResponseCache();

    public static TokenResponseCache getInstance() {

        if (tokenResponseCacheInstance == null) {

            synchronized (TokenResponseCache.class) {

                if (tokenResponseCacheInstance == null) {

                    /* instance will be created at request time */
                    tokenResponseCacheInstance = new TokenResponseCache();
                }
            }
        }
        return tokenResponseCacheInstance;
    }

    private ArrayList<Handlers> interestedparty = new ArrayList<Handlers>();
    private HashMap<String, Object> tokenResponseCache = new HashMap<String, Object>();

    @Override
    public void add(String authReqId, Object tokenresponse) {

        if (tokenresponse instanceof TokenResponse) {
            tokenResponseCache.put(authReqId, tokenresponse);
            LOGGER.info(authReqId + " : Token Response added by the server.");

        }

    }

    @Override
    public void remove(String authReqId) {

        tokenResponseCache.remove(authReqId);
    }

    @Override
    public Object get(String authReqId) {

        LOGGER.info(authReqId + " : Polling checked for Token Response availability.");
        return tokenResponseCache.get(authReqId);
    }

    @Override
    public void clear() {

    }

    @Override
    public long size() {

        return tokenResponseCache.size();
    }

    @Override
    public void register(Object object) {

        interestedparty.add((Handlers) object);
    }
}
