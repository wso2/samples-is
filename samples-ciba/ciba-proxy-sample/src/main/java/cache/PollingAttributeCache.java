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
import transactionartifacts.PollingAtrribute;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.logging.Logger;

/**
 * Cache of polling attributes.
 */
public class PollingAttributeCache implements ProxyCache {

    private static final Logger LOGGER = Logger.getLogger(PollingAttributeCache.class.getName());

    private PollingAttributeCache() {

    }

    private static PollingAttributeCache pollingAttributeCacheInstance = new PollingAttributeCache();

    public static PollingAttributeCache getInstance() {

        if (pollingAttributeCacheInstance == null) {

            synchronized (PollingAttributeCache.class) {

                if (pollingAttributeCacheInstance == null) {

                    /* instance will be created at request time */
                    pollingAttributeCacheInstance = new PollingAttributeCache();
                }
            }
        }
        return pollingAttributeCacheInstance;

    }

    private ArrayList<Handlers> interestedparty = new ArrayList<>();

    private HashMap<String, Object> pollingAttributeCache = new HashMap<>();

    @Override
    public void add(String authReqId, Object pollingattribute) {

        if (pollingattribute instanceof PollingAtrribute) {

            LOGGER.info("PollingAttribute added to store");
            pollingAttributeCache.put(authReqId, pollingattribute);
        }
    }

    @Override
    public void remove(String authReqId) {

        pollingAttributeCache.remove(authReqId);

    }

    @Override
    public Object get(String authReqId) {

        return pollingAttributeCache.get(authReqId);
    }

    @Override
    public void clear() {
        //To be implemented if needed
    }

    @Override
    public long size() {

        return pollingAttributeCache.size();
    }

    @Override
    public void register(Object object) {

        interestedparty.add((Handlers) object);
    }
}

