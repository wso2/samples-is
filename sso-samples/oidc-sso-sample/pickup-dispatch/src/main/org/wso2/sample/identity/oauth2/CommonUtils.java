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
package org.wso2.sample.identity.oauth2;

import org.apache.oltu.oauth2.client.OAuthClient;
import org.apache.oltu.oauth2.client.URLConnectionClient;
import org.apache.oltu.oauth2.client.request.OAuthClientRequest;
import org.apache.oltu.oauth2.client.response.OAuthClientResponse;
import org.apache.oltu.oauth2.common.exception.OAuthProblemException;
import org.apache.oltu.oauth2.common.exception.OAuthSystemException;
import org.apache.oltu.oauth2.common.message.types.GrantType;
import org.json.JSONObject;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.wso2.sample.identity.oauth2.exceptions.ClientAppException;
import org.wso2.sample.identity.oauth2.exceptions.SampleAppServerException;
import org.xml.sax.SAXException;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Properties;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.net.ssl.HttpsURLConnection;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

public class CommonUtils {

    private static final Logger LOGGER = Logger.getLogger(CommonUtils.class.getName());
    private static final Map<String, TokenData> TOKEN_STORE = new HashMap<>();

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

    public static Map<String, String> getOidcClaimDisplayNameMapping(final List<String> oidcClaims) {

        final String soapBody = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" " +
                "xmlns:xsd=\"http://org.apache.axis2/xsd\">\n" +
                "   <soapenv:Header/>\n" +
                "   <soapenv:Body>\n" +
                "      <xsd:getExternalClaims>\n" +
                "         <xsd:externalClaimDialectURI>http://wso2.org/oidc/claim</xsd:externalClaimDialectURI>\n" +
                "      </xsd:getExternalClaims>\n" +
                "   </soapenv:Body>\n" +
                "</soapenv:Envelope>";

        final String soapResponse = getClaimManagementResponse(soapBody, "getExternalClaims");

        final Map<String, String> oidcClaimToLocalUriClaimMapping = new HashMap<>();

        try {
            DocumentBuilder documentBuilder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
            Document xmlDocument = documentBuilder.parse(new ByteArrayInputStream(soapResponse.getBytes()));

            // Extract "ns:return" tagged nodes
            NodeList nsReturnElements = xmlDocument.getElementsByTagName("ns:return");

            // Iterate and search for local URIs for claims
            for (int i = 0; i < nsReturnElements.getLength(); i++) {

                Element nsElement = (Element) nsReturnElements.item(i);
                // Find prefix  ex:- ax2342
                String prefix = nsElement.getAttribute("xsi:type").split(":")[0];

                NodeList externalClaimUrlNodes = nsElement.getElementsByTagName(prefix + ":externalClaimURI");

                // Match for requested claims
                if (externalClaimUrlNodes.getLength() == 1
                        && oidcClaims.contains(externalClaimUrlNodes.item(0).getTextContent())) {
                    NodeList mappedLocalClaimUriNodes = nsElement.getElementsByTagName(prefix + ":mappedLocalClaimURI");

                    // There should be only one mapping element. Else put the same value
                    if (mappedLocalClaimUriNodes.getLength() == 1) {
                        oidcClaimToLocalUriClaimMapping.put(
                                externalClaimUrlNodes.item(0).getTextContent(),
                                mappedLocalClaimUriNodes.item(0).getTextContent());
                    } else {
                        oidcClaimToLocalUriClaimMapping.put(
                                externalClaimUrlNodes.item(0).getTextContent(),
                                externalClaimUrlNodes.item(0).getTextContent());
                    }
                }
            }

        } catch (ParserConfigurationException | SAXException | IOException e) {
            LOGGER.log(Level.SEVERE, "Error while parsing claim SOAP response", e);
        }

        final Map<String, String> oidcClaimDisplayValueMap = new HashMap<>();

        // Obtain display based on local claim mapping
        final Map<String, String> claimUriDisplayValueMappings =
                getClaimUriMappingsDisplayValue(new ArrayList<>(oidcClaimToLocalUriClaimMapping.values()));

        // Map claims against display values
        for (final String claim : oidcClaimToLocalUriClaimMapping.keySet()) {
            oidcClaimDisplayValueMap.put(
                    claim,
                    claimUriDisplayValueMappings.get(oidcClaimToLocalUriClaimMapping.get(claim))
            );
        }

        return oidcClaimDisplayValueMap;
    }

    private static Map<String, String> getClaimUriMappingsDisplayValue(final List<String> claimURIList) {

        final Map<String, String> claimDisplayValueMap = new HashMap<>();

        // We call claim management service and retrieve local claim details
        String claimManagementEndpoint = SampleContextEventListener.getPropertyByKey("claimManagementEndpoint");

        final String soapBody = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\"" +
                " xmlns:xsd=\"http://org.apache.axis2/xsd\">\n" +
                "   <soapenv:Header/>\n" +
                "   <soapenv:Body>\n" +
                "      <xsd:getLocalClaims/>\n" +
                "   </soapenv:Body>\n" +
                "</soapenv:Envelope>";

        final String soapResponse = getClaimManagementResponse(soapBody, "getLocalClaims");

        try {
            DocumentBuilder documentBuilder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
            Document xmlDocument = documentBuilder.parse(new ByteArrayInputStream(soapResponse.getBytes()));

            // Extract "ns:return" tagged nodes
            NodeList nsReturnElements = xmlDocument.getElementsByTagName("ns:return");

            // Iterate and filter for required local claim URIs
            for (int i = 0; i < nsReturnElements.getLength(); i++) {
                Element nsElement = (Element) nsReturnElements.item(i);

                // Find prefix  ex:- ax2342
                String prefix = nsElement.getAttribute("xsi:type").split(":")[0];

                NodeList localClaimUriElement = nsElement.getElementsByTagName(prefix + ":localClaimURI");

                String claimUri = localClaimUriElement.item(0).getTextContent();

                //  Check for local claim URI matching
                if (localClaimUriElement.getLength() == 1 && claimURIList.contains(claimUri)) {

                    String displayValue =
                            getDisplayValueFromNodeList(nsElement.getElementsByTagName(prefix + ":claimProperties"));

                    if (displayValue != null) {
                        claimDisplayValueMap.put(claimUri, displayValue);
                    } else {
                        // Put claim uri as it is
                        claimDisplayValueMap.put(claimUri, claimUri);
                    }
                }
            }

        } catch (ParserConfigurationException | SAXException | IOException e) {
            LOGGER.log(Level.SEVERE, "Error while parsing claim SOAP response", e);
            return claimDisplayValueMap;
        }

        return claimDisplayValueMap;
    }

    // Dedicated method to extract display value from list of claim property nodes
    private static String getDisplayValueFromNodeList(final NodeList claimPropertyNodes) {

        for (int j = 0; j < claimPropertyNodes.getLength(); j++) {
            // Extract property value when property name text is "DisplayName"
            NodeList propertyChildren = claimPropertyNodes.item(j).getChildNodes();

            for (int k = 0; k < propertyChildren.getLength(); k++) {
                if ("DisplayName".equals(propertyChildren.item(k).getTextContent())) {
                    // Extract propertyValue
                    if (k == 0) {
                        return propertyChildren.item(1).getTextContent();
                    } else {
                        return propertyChildren.item(0).getTextContent();
                    }
                }
            }
        }
        return null;
    }

    private static String getClaimManagementResponse(final String soapBody, final String soapAction) {

        final String claimManagementEndpoint = SampleContextEventListener.getPropertyByKey("claimManagementEndpoint");

        try {
            final URL url = new URL(claimManagementEndpoint);
            final HttpsURLConnection urlConnection = (HttpsURLConnection) url.openConnection();

            urlConnection.setDoOutput(true);
            urlConnection.setRequestMethod("POST");
            urlConnection.setRequestProperty("Content-Type", "text/xml");
            urlConnection.setRequestProperty("Authorization", getAuthHeader());
            urlConnection.setRequestProperty("SOAPAction", soapAction);

            OutputStream outputStream = urlConnection.getOutputStream();
            outputStream.write(soapBody.getBytes());
            outputStream.close();

            urlConnection.connect();

            InputStreamReader inputStreamReader = new InputStreamReader(urlConnection.getInputStream());
            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

            final StringBuilder soapResponseBuilder = new StringBuilder();

            String line;
            while ((line = bufferedReader.readLine()) != null) {
                soapResponseBuilder.append(line);
            }

            return soapResponseBuilder.toString();
        } catch (final IOException e) {
            LOGGER.log(Level.SEVERE, "Error while retrieving response", e);
            throw new RuntimeException("Error while retrieving response", e);
        }
    }

    private static String getAuthHeader() {

        String adminUsername = SampleContextEventListener.getPropertyByKey("adminUsername");
        String adminPassword = SampleContextEventListener.getPropertyByKey("adminPassword");

        String base64Part =
                new String(java.util.Base64.getEncoder()
                        .encode(String.join(":", adminUsername, adminUsername)
                                .getBytes()));

        return String.join(" ", "Basic", base64Part);
    }

}
