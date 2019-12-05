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

/**
 * Abstract JDBC store for proxy.
 */
public interface ProxyJdbc {

    /**
     * Stores object to the store.
     *
     * @param key   Identifier for the item being stored.
     * @param value Value of item being stored.
     */
    void add(String key, Object value);

    /**
     * Removes object from store.
     *
     * @param key Identifier for the item being removed.
     */
    void remove(String key);

    /**
     * Obtains object from store and returns.
     *
     * @param key Identifier for the item being removed.
     * @return Object that was stored.
     */
    Object get(String key);

    /**
     * clear the store.
     */
    void clear();

    /**
     * @return long Size of the store.
     */
    long size();

    /**
     * Register observers interested in the change of state of the store.
     *
     * @param object Observers interested in the state change.
     */
    void register(Object object);
}
