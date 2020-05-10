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

package org.wso2.photo.edit.services;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.wso2.photo.edit.CommonUtils;

import java.io.DataOutputStream;
import java.io.IOException;
import java.net.URL;
import java.util.logging.Logger;
import javax.net.ssl.HttpsURLConnection;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static org.wso2.photo.edit.CommonUtils.getAuthHeader;
import static org.wso2.photo.edit.CommonUtils.getBearerHeader;
import static org.wso2.photo.edit.CommonUtils.getIdpUrl;
import static org.wso2.photo.edit.CommonUtils.readFromResponse;

public class ResourceServlet extends HttpServlet {

    private static final Logger LOGGER = Logger.getLogger(ResourceServlet.class.getName());

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {


        String authorizationHeader = req.getHeader("Authorization");

        try {
        if (StringUtils.isNotBlank(authorizationHeader) && authorizationHeader.contains("Bearer ")) {
            String token = authorizationHeader.split("Bearer ")[1];

            if (StringUtils.isNotBlank(token)) {


                JSONObject introspect = introspect(token);
                LOGGER.info("Intro response json:" + introspect.toString());
                boolean isActive = introspect.getBoolean("active");

                if (isActive) {
                    JSONArray permissions = introspect.getJSONArray("permissions");
                    JSONObject perm = permissions.getJSONObject(0);
                    String resource_id = perm.getString("resource_id");

                    ResourceTokenData resourceTokenData = CommonUtils.getFromResourceMap(req.getPathInfo().substring
                            (1));
                    LOGGER.info("resourceTokenData rec_id: " + resourceTokenData.getResourceId() + ", " +
                            "Introspect rec_id: " + resource_id);
                    if (resource_id.equals(resourceTokenData.getResourceId())) {

                        LOGGER.fine("Matching resource ID found: " + resource_id);
                        resp.setStatus(HttpServletResponse.SC_OK);
                        final JSONArray jsonArray = new JSONArray();
                        jsonArray.put("http://localhost.com:8080/photo-edit/res/sri_lanka.jpg");
                        final ServletOutputStream outputStream = resp.getOutputStream();
                        outputStream.print(jsonArray.toString());
                        outputStream.close();
                    }

                    LOGGER.fine("Resource ID with permission in introspection response: " + resource_id);
                } else {
                    sendPTResponse(req, resp);
                }

            } else {
                sendPTResponse(req, resp);
            }
        } else {
            sendPTResponse(req, resp);
        }
        } catch (Throwable e) {
            LOGGER.severe("Error fetching resource: " + e);
        }
    }

    private void sendPTResponse(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String pt = getPT(req.getPathInfo().substring(1));
        LOGGER.warning("Permission ticket: " + pt);
        if (pt == null) {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND);
        } else {
            final ServletOutputStream outputStream = resp.getOutputStream();
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.setHeader("WWW-Authenticate", "UMA");
            String payload = "as_uri=" + getIdpUrl() +
                             "&ticket=" + pt;
            outputStream.print(payload);
            outputStream.close();
        }
    }

    private String getPT(String requestResourceId) throws IOException {

        ResourceTokenData resourceTokenData = CommonUtils.getFromResourceMap(requestResourceId);

        if (resourceTokenData == null) {
            return null;
        }

        String resourceId = resourceTokenData.getResourceId();
        String token = resourceTokenData.getToken();
        String idpUrl = CommonUtils.getIdpUrl();
        String permissionEp = idpUrl + "/api/identity/oauth2/uma/permission/v1.0/permission";

        final JSONArray permissions = new JSONArray();
        final JSONObject jsonObject = new JSONObject();

        final JSONArray resourceScopes = new JSONArray();
        resourceScopes.put("view");

        jsonObject.put("resource_scopes", resourceScopes);
        jsonObject.put("resource_id", resourceId);

        permissions.put(jsonObject);
        final String jsonPayload = permissions.toString();

        LOGGER.fine("Permission ticket request payload: " + jsonPayload);
        HttpsURLConnection urlConnection = (HttpsURLConnection) new URL(permissionEp).openConnection();
        urlConnection.setRequestMethod("POST");
        urlConnection.setRequestProperty("Authorization", getBearerHeader(token));
        urlConnection.setRequestProperty("Content-Type", "application/json");

        urlConnection.setDoOutput(true);

        DataOutputStream dataOutputStream = new DataOutputStream(urlConnection.getOutputStream());

        dataOutputStream.writeBytes(jsonPayload);
        String res = readFromResponse(urlConnection);
        LOGGER.fine("Permission ticket response payload: " + res);
        JSONObject jsonResp = new JSONObject(res);
        return jsonResp.getString("ticket");
    }

    private JSONObject introspect(String token) throws IOException {

        String idpUrl = CommonUtils.getIdpUrl();
        String introspectEp = idpUrl + "/oauth2/introspect";


        HttpsURLConnection urlConnection = (HttpsURLConnection) new URL(introspectEp).openConnection();
        urlConnection.setRequestMethod("POST");
        urlConnection.setRequestProperty("Authorization", getAuthHeader());
        urlConnection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");

        urlConnection.setDoOutput(true);

        String payload = "token=" + token;

        DataOutputStream dataOutputStream = new DataOutputStream(urlConnection.getOutputStream());

        dataOutputStream.writeBytes(payload);
        String res = readFromResponse(urlConnection);
        LOGGER.warning("Introspection response: " + res);
        return new JSONObject(res);
    }
}
