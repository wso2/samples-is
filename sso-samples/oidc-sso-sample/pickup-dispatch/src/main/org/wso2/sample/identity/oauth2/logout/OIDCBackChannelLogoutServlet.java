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

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.text.ParseException;
import java.util.logging.Logger;

/**
 * Servlet for handling BackChannel logout requests.
 */
public class OIDCBackChannelLogoutServlet extends HttpServlet {

    private static final Logger LOGGER = Logger.getLogger(OIDCBackChannelLogoutServlet.class.getName());

    public void init(ServletConfig config) throws SecurityException {

    }

    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException,
            IOException {

        doPost(req, resp);
    }

    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException,
            IOException {

        LOGGER.info("BackChannel logout request received.");

        String sid = null;
        try {
            sid = (String) SignedJWT.parse(req.getParameter(OAuth2Constants.LOGOUT_TOKEN)).getJWTClaimsSet()
                    .getClaim(OAuth2Constants.SID);
            LOGGER.info("Logout token: " + req.getParameter(OAuth2Constants.LOGOUT_TOKEN));
        } catch (ParseException e) {
            LOGGER.warning("Error while getting Logout Token.");
        }
        HttpSession session = SessionIdStore.getSession(sid);

        if (session != null) {
            session.invalidate();
            SessionIdStore.removeSession(sid);
            LOGGER.info("Session invalidated successfully for sid: " + sid);
        } else {
            LOGGER.info("Cannot find corresponding session for sid: " + sid);
        }
    }
}
