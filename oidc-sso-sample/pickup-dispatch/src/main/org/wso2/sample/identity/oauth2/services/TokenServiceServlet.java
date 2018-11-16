/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

package org.wso2.sample.identity.oauth2.services;

import org.json.JSONObject;
import org.wso2.sample.identity.oauth2.CommonUtils;
import org.wso2.sample.identity.oauth2.TokenData;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Optional;

/**
 * A servlet that helps to retrieve access token to front end
 * Will only be used when we want front end to interact with an external API protected by IS tokens
 */
public class TokenServiceServlet extends HttpServlet {

    @Override
    protected void doGet(final HttpServletRequest req, final HttpServletResponse resp)
            throws IOException {
        final Optional<Cookie> appIdCookie = CommonUtils.getAppIdCookie(req);

        if (!appIdCookie.isPresent()) {
            sendNotFound(resp);
        } else {
            sendAccessToken(appIdCookie.get(), resp);
        }
    }

    private static void sendNotFound(final HttpServletResponse response) throws IOException {
        response.sendError(404);
    }

    private static void sendAccessToken(final Cookie appIdCookie, final HttpServletResponse response) throws IOException {
        final Optional<TokenData> tokenData = CommonUtils.getTokenDataByCookieID(appIdCookie.getValue());

        if (tokenData.isPresent()) {
            final JSONObject jsonObject = new JSONObject();
            jsonObject.put("value", tokenData.get().getAccessToken());

            final PrintWriter responseWriter = response.getWriter();
            responseWriter.write(jsonObject.toString());

            response.setHeader("Content-Type", "application/json");

            responseWriter.close();

        } else {
            sendNotFound(response);
        }
    }
}
