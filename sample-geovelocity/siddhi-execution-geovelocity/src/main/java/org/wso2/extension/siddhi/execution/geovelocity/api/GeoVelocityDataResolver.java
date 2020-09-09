/*
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.wso2.extension.siddhi.execution.geovelocity.api;

import org.wso2.extension.siddhi.execution.geovelocity.internal.exception.GeoVelocityException;
import org.wso2.siddhi.core.util.config.ConfigReader;

/**
 * Interface for the Geo-velocity based data on username and city.
 */
public interface GeoVelocityDataResolver {

    /**
     * This method will provide the login behaviour based information related to the given login details.
     *
     * @param username username
     * @param city     logincity
     * @return last login time at the given city of the given use
     */
    public GeoVelocityData getGeoVelocityInfo(String username, String city);

    /**
     * This method will check validity of the location of login
     * according to restricted location combination.
     *
     * @param currentCity  current login location
     * @param previousCity last login location
     * @return 0 or 1 as the count of the restricted location combinations
     */
    public GeoVelocityData checkLoginLocationValidity(String currentCity, String previousCity,
                                                      String currentCountry, String previousCountry);

    /**
     * This method will be invoked after the initializing the extension. You can do any initial configuration here.
     *
     * @param configReader this hold the extensions configuration reader
     * @throws GeoVelocityException this will throws a GeoVelocityException.
     */
    public void init(ConfigReader configReader) throws GeoVelocityException;

}
