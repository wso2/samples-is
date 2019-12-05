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

import java.util.ArrayList;

/**
 * Cache of Ciba Proxy.
 */
public class CibaProxyCache {

    private ArrayList<Handlers> interestedparty = new ArrayList<>();

    private AuthRequestCache authRequestCache;
    private AuthResponseCache authResponseCache;
    private TokenRequestCache tokenRequestCache;
    private TokenResponseCache tokenResponseCache;
    private PollingAttributeCache pollingAtrributeCache;

    private CibaProxyCache() {

        authRequestCache = AuthRequestCache.getInstance();
        authResponseCache = AuthResponseCache.getInstance();
        tokenRequestCache = TokenRequestCache.getInstance();
        tokenResponseCache = TokenResponseCache.getInstance();
        pollingAtrributeCache = PollingAttributeCache.getInstance();

    }

    private static CibaProxyCache cibaProxyCacheInstance = new CibaProxyCache();

    public static CibaProxyCache getInstance() {

        if (cibaProxyCacheInstance == null) {

            synchronized (CibaProxyCache.class) {

                if (cibaProxyCacheInstance == null) {

                    /* instance will be created at request time */
                    cibaProxyCacheInstance = new CibaProxyCache();
                }
            }
        }
        return cibaProxyCacheInstance;

    }

    public AuthRequestCache getAuthRequestCache() {

        return authRequestCache;
    }

    public AuthResponseCache getAuthResponseCache() {

        return authResponseCache;
    }

    public TokenRequestCache getTokenRequestCache() {

        return tokenRequestCache;
    }

    public TokenResponseCache getTokenResponseCache() {

        return tokenResponseCache;
    }

    public PollingAttributeCache getPollingAtrributeCache() {

        return pollingAtrributeCache;
    }

    public static CibaProxyCache getCibaProxyCacheInstance() {

        return cibaProxyCacheInstance;
    }

}
