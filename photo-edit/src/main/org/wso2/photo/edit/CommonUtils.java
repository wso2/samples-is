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

package org.wso2.photo.edit;

import org.apache.oltu.oauth2.client.OAuthClient;
import org.apache.oltu.oauth2.client.URLConnectionClient;
import org.apache.oltu.oauth2.client.request.OAuthClientRequest;
import org.apache.oltu.oauth2.client.response.OAuthClientResponse;
import org.apache.oltu.oauth2.common.exception.OAuthProblemException;
import org.apache.oltu.oauth2.common.exception.OAuthSystemException;
import org.apache.oltu.oauth2.common.message.types.GrantType;
import org.json.JSONObject;
import org.wso2.photo.edit.exceptions.ClientAppException;
import org.wso2.photo.edit.exceptions.SampleAppServerException;
import org.wso2.photo.edit.services.ResourceTokenData;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Properties;
import java.util.UUID;
import java.util.logging.Logger;
import javax.net.ssl.HttpsURLConnection;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class CommonUtils {

    private static final Map<String, TokenData> TOKEN_STORE = new HashMap<>();
    private static final Map<String, ResourceTokenData> RESOURCE_MAPPING = new HashMap<>();
    private static final Logger LOGGER = Logger.getLogger(CommonUtils.class.getName());


    public static JSONObject requestToJson(final OAuthClientRequest accessRequest) {

        JSONObject obj = new JSONObject();
        obj.append("tokenEndPoint", accessRequest.getLocationUri());
        obj.append("request body", accessRequest.getBody());

        return obj;
    }

    public static JSONObject responseToJson(final OAuthClientResponse oAuthResponse) {

        JSONObject obj = new JSONObject();
        obj.append("status-code", "200");
        obj.append("id_token", oAuthResponse.getParam("id_token"));
        obj.append("access_token", oAuthResponse.getParam("access_token"));
        return obj;

    }

    public static boolean logout(final HttpServletRequest request, final HttpServletResponse response) {
        // Invalidate session
        final HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        final Optional<Cookie> appIdCookie = getAppIdCookie(request);

        if (appIdCookie.isPresent()) {
            TOKEN_STORE.remove(appIdCookie.get().getValue());
            appIdCookie.get().setMaxAge(0);
            response.addCookie(appIdCookie.get());
            return true;
        }
        return false;
    }

    public static void getToken(final HttpServletRequest request, final HttpServletResponse response)
            throws OAuthProblemException, OAuthSystemException, SampleAppServerException {

        final Optional<Cookie> appIdCookie = getAppIdCookie(request);
        final HttpSession session = request.getSession(false);
        final Properties properties = SampleContextEventListener.getProperties();

        final TokenData storedTokenData;

        if (appIdCookie.isPresent()) {
            storedTokenData = TOKEN_STORE.get(appIdCookie.get().getValue());
            if (storedTokenData != null) {
                setTokenDataToSession(session, storedTokenData);
                return;
            }
        }

        final String authzCode = request.getParameter("code");

        if (authzCode == null) {
            throw new SampleAppServerException("Authorization code not present in callback");
        }

        final OAuthClientRequest.TokenRequestBuilder oAuthTokenRequestBuilder =
                new OAuthClientRequest.TokenRequestBuilder(properties.getProperty("tokenEndpoint"));

        final OAuthClientRequest accessRequest = oAuthTokenRequestBuilder.setGrantType(GrantType.AUTHORIZATION_CODE)
                .setClientId(properties.getProperty("consumerKey"))
                .setClientSecret(properties.getProperty("consumerSecret"))
                .setRedirectURI(properties.getProperty("callBackUrl"))
                .setCode(authzCode)
                .buildBodyMessage();

        //create OAuth client that uses custom http client under the hood
        final OAuthClient oAuthClient = new OAuthClient(new URLConnectionClient());
        final JSONObject requestObject = requestToJson(accessRequest);
        final OAuthClientResponse oAuthResponse = oAuthClient.accessToken(accessRequest);
        final JSONObject responseObject = responseToJson(oAuthResponse);
        final String accessToken = oAuthResponse.getParam("access_token");

        session.setAttribute("requestObject", requestObject);
        session.setAttribute("responseObject", responseObject);
        if (accessToken != null) {
            session.setAttribute("accessToken", accessToken);
            String idToken = oAuthResponse.getParam("id_token");
            if (idToken != null) {
                session.setAttribute("idToken", idToken);
            }
            session.setAttribute("authenticated", true);
            TokenData tokenData = new TokenData();
            tokenData.setAccessToken(accessToken);
            tokenData.setIdToken(idToken);

            final String sessionId = UUID.randomUUID().toString();
            TOKEN_STORE.put(sessionId, tokenData);
            final Cookie cookie = new Cookie("AppID", sessionId);
            cookie.setMaxAge(-1);
            cookie.setPath("/");
            response.addCookie(cookie);
        } else {
            session.invalidate();
        }
    }

    public static Optional<Cookie> getAppIdCookie(final HttpServletRequest request) {

        final Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("AppID".equals(cookie.getName())) {
                    return Optional.of(cookie);
                }
            }
        }
        return Optional.empty();
    }

    public static Optional<TokenData> getTokenDataByCookieID(final String cookieID) {

        if (TOKEN_STORE.containsKey(cookieID)) {
            return Optional.of(TOKEN_STORE.get(cookieID));
        }

        return Optional.empty();
    }

    public static String getAuthHeader() {

        final String username = SampleContextEventListener.getProperties().getProperty("isUser");
        final String password = SampleContextEventListener.getProperties().getProperty("isPass");

        final String encodedCredentials =
                new String(Base64.getEncoder().encode(String.join(":", username, password).getBytes()));

        return "Basic " + encodedCredentials;
    }

    public static String getBearerHeader(HttpServletRequest req) {

        HttpSession session = req.getSession(false);
        String accessToken = (String) session.getAttribute("accessToken");

        return "Bearer " + accessToken;
    }

    public static String getBearerHeader(String accessToken) {

        return "Bearer " + accessToken;
    }

    private static void setTokenDataToSession(final HttpSession session, final TokenData storedTokenData) {

        session.setAttribute("authenticated", true);
        session.setAttribute("accessToken", storedTokenData.getAccessToken());
        session.setAttribute("idToken", storedTokenData.getIdToken());
    }

    private static HttpsURLConnection getHttpsURLConnection(final String url) throws ClientAppException {

        try {
            final URL requestUrl = new URL(url);
            return (HttpsURLConnection) requestUrl.openConnection();
        } catch (IOException e) {
            throw new ClientAppException("Error while creating connection to: " + url, e);
        }
    }

    public static void addToResourceMap(String albumId, ResourceTokenData resourceTokenData) {

        LOGGER.fine("Adding to resource map. Album ID: " + albumId + ", Token data: " + resourceTokenData);
        RESOURCE_MAPPING.put(albumId, resourceTokenData);
    }

    public static ResourceTokenData getFromResourceMap(String albumId) {

        ResourceTokenData resourceTokenData = RESOURCE_MAPPING.get(albumId);

        LOGGER.fine("Retrieving from resource map. Album ID: " + albumId + ", Token data: " + resourceTokenData);
        return resourceTokenData;
    }

    public static String getIdpUrl() {

        return SampleContextEventListener.getProperties().getProperty("idp_url", "https://localhost:9443");
    }

    public static String readFromResponse(final URLConnection urlConnection) throws IOException {

        final BufferedReader BufferedReader = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));

        final StringBuilder stringBuilder = new StringBuilder();

        String line;
        while ((line = BufferedReader.readLine()) != null) {
            stringBuilder.append(line);
        }

        return stringBuilder.toString();
    }
}
