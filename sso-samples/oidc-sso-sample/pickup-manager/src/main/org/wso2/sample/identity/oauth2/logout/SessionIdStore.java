/*
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
package org.wso2.sample.identity.oauth2.logout;

import com.nimbusds.jwt.SignedJWT;
import org.wso2.sample.identity.oauth2.OAuth2Constants;

import javax.servlet.http.HttpSession;
import java.text.ParseException;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;


/**
 * Xlass for storing HttpSession against sid.
 */
public class SessionIdStore {

    private static final Logger LOGGER = Logger.getLogger(SessionIdStore.class.getName());
    private static Map<String, HttpSession> sessionMap = new HashMap<>();

    public static void storeSession(String sid, HttpSession session) {

        LOGGER.info("Storing session: " + session.getId() + " against the sid: " + sid);
        sessionMap.put(sid, session);
    }

    public static String getSid(String idToken) throws ParseException {

        return (String) SignedJWT.parse(idToken).getJWTClaimsSet().getClaim(OAuth2Constants.SID);
    }

    public static HttpSession getSession(String sid) {

        if (sid != null && sessionMap.get(sid) != null) {
            LOGGER.info("Retrieving session: " + sessionMap.get(sid).getId() + " for the sid: " + sid);
            return sessionMap.get(sid);
        } else {
            LOGGER.warning("No session found for the sid: " + sid);
            return null;
        }
    }

    public static void removeSession(String sid) {

        sessionMap.remove(sid);
    }
}
