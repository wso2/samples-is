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

package tempErrorCache;

import java.util.HashMap;

/**
 * Temporary Error cache memory..
 */
public class TempErrorCache {

    private HashMap<String, String> authenticationResponseCache = new HashMap<String, String>();

    private TempErrorCache() {

    }

    private static TempErrorCache tokenRequestValidatorInstance = new TempErrorCache();

    public static TempErrorCache getInstance() {

        if (tokenRequestValidatorInstance == null) {

            synchronized (TempErrorCache.class) {

                if (tokenRequestValidatorInstance == null) {

                    /* instance will be created at request time */
                    tokenRequestValidatorInstance = new TempErrorCache();
                }
            }
        }
        return tokenRequestValidatorInstance;

    }

    public void addAuthenticationStatus(String auth_req_id, String state) {

        authenticationResponseCache.put(auth_req_id, state);

    }

    public String getAuthenticationResponse(String auth_req_id) {

        return authenticationResponseCache.get(auth_req_id);

    }

    public void removeAuthResponse(String auth_req_id) {

        authenticationResponseCache.remove(auth_req_id);
    }
}
