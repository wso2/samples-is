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

/**
 * Produces the connectors from service layer to data layer.
 */
public class DaoFactory {

    private static final String INMEMORY = "InMemoryCache";
    private static final String JDBC = "JDBC";
    private static final String REDIS = "Redis";

    private DaoFactory() {

    }

    private static DaoFactory daoFactoryInstance = new DaoFactory();

    public static DaoFactory getInstance() {

        if (daoFactoryInstance == null) {

            synchronized (DaoFactory.class) {

                if (daoFactoryInstance == null) {

                    /* instance will be created at request time */
                    daoFactoryInstance = new DaoFactory();
                }
            }
        }
        return daoFactoryInstance;
    }

    /**
     * This returns preferred connectors as the user does.
     *
     * @param name Type of the storage requested.
     * @return specific Artifact store connectors.
     */
    public ArtifactStoreConnectors getArtifactStoreConnector(String name) {

        if (name.equalsIgnoreCase(INMEMORY)) {
            return CacheArtifactStoreConnector.getInstance();
            //return new CacheArtifactStoreConnector();
        }

        if (name.equalsIgnoreCase(REDIS)) {
            return RedisArtifactStoreConnector.getInstance();
        }

        if (name.equals(JDBC)) {
            return JdbcArtifactStoreConnector.getInstance();
        }
        return null;
    }

    /**
     * This returns preferred connectors as the user does.
     *
     * @param name Type of the storage requested.
     * @return specific User store connectors.
     */
    public UserStoreConnector getUserStoreConnector(String name) {

        if (name.equalsIgnoreCase(INMEMORY)) {
            return CibaUserStoreCacheConnector.getInstance();
            //return new CacheStorageConnector();
        }

        if (name.equalsIgnoreCase(REDIS)) {
            return CibaUserStoreRedisConnector.getInstance();
        }

        if (name.equals(JDBC)) {
            return CibaUserStoreJdbcConnector.getInstance();
        }
        return null;
    }

    /**
     * This returns preferred connectors as the user does.
     *
     * @param name Type of the storage requested.
     * @return specific client  store connectors.
     */
    public ClientStoreConnector getClientStoreConnector(String name) {

        if (name.equalsIgnoreCase(INMEMORY)) {
            return CibaClientStoreCacheConnector.getInstance();
            //return new CacheStorageConnector();
        }

        if (name.equalsIgnoreCase(REDIS)) {
            return CibaClientStoreRedisConnector.getInstance();
        }

        if (name.equals(JDBC)) {
            return CibaClientStoreJdbcConnector.getInstance();
        }
        return null;
    }

}
