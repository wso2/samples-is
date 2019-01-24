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
package org.wso2.samples.claims.manager;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
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
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.net.ssl.HttpsURLConnection;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

/*
 * This is a utility that helps to map OIDC and SAML claims to their display values.
 * It utilize WSO2 Identity Server's claim management APIs.
 *
 * Usage of claim mapping is not MANDATORY for OIDC and SAML usage. But it helps to display claim values in an
 * appropriate manner.
 */
public class ClaimManagerProxy {

    private final static Logger logger = Logger.getLogger(ClaimManagerProxy.class.getName());

    private static final String externalClaimSoapAction = "getExternalClaims";
    private static final String localClaimSoapAction = "getLocalClaims";

    private final String claimManagementUrl;
    private final String identityServerUsername;
    private final String identityServerPassword;

    private final List<Node> oidcDialectNodes;
    private final List<Node> localClaimNodes;

    public ClaimManagerProxy(
            final String claimManagementUrl,
            final String identityServerUsername,
            final String identityServerPassword) {

        this.claimManagementUrl = claimManagementUrl;
        this.identityServerUsername = identityServerUsername;
        this.identityServerPassword = identityServerPassword;

        // Obtain SOAP responses at initiating time
        oidcDialectNodes = getOIDCDialectNodes();
        localClaimNodes = getLocalClaimNodes();
    }

    public Map<String, String> getOidcClaimDisplayNameMapping(final List<String> oidcClaims) {

        final Map<String, String> oidcClaimToLocalUriClaimMapping = new HashMap<>();

        // Iterate and search for local URIs for claims
        for (final Node node : this.oidcDialectNodes) {
            Element nsElement = (Element) node;
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

        final Map<String, String> oidcClaimDisplayValueMap = new HashMap<>();

        // Obtain display based on local claim mapping
        final Map<String, String> claimUriDisplayValueMappings =
                getLocalClaimUriDisplayValueMapping(new ArrayList<>(oidcClaimToLocalUriClaimMapping.values()));

        // Map claims against display values
        for (final String claim : oidcClaimToLocalUriClaimMapping.keySet()) {
            oidcClaimDisplayValueMap.put(
                    claim,
                    claimUriDisplayValueMappings.get(oidcClaimToLocalUriClaimMapping.get(claim))
            );
        }

        return oidcClaimDisplayValueMap;
    }

    public Map<String, String> getLocalClaimUriDisplayValueMapping(final List<String> localClaimUriList) {

        final Map<String, String> claimDisplayValueMap = new HashMap<>();

        // Iterate and filter for required local claim URIs
        for (final Node node : this.localClaimNodes) {
            Element nsElement = (Element) node;

            // Find prefix  ex:- ax2342
            String prefix = nsElement.getAttribute("xsi:type").split(":")[0];

            NodeList localClaimUriElement = nsElement.getElementsByTagName(prefix + ":localClaimURI");

            String claimUri = localClaimUriElement.item(0).getTextContent();

            //  Check for local claim URI matching
            if (localClaimUriElement.getLength() == 1 && localClaimUriList.contains(claimUri)) {

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

    private List<Node> getOIDCDialectNodes() {

        final String oidcDilectSoapBody =
                "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" " +
                        "xmlns:xsd=\"http://org.apache.axis2/xsd\">\n" +
                        "   <soapenv:Header/>\n" +
                        "   <soapenv:Body>\n" +
                        "      <xsd:getExternalClaims>\n" +
                        "         <xsd:externalClaimDialectURI>http://wso2.org/oidc/claim</xsd:externalClaimDialectURI>\n" +
                        "      </xsd:getExternalClaims>\n" +
                        "   </soapenv:Body>\n" +
                        "</soapenv:Envelope>";

        final String claimManagementResponse = getClaimManagementResponse(oidcDilectSoapBody, externalClaimSoapAction);

        final List<Node> oidcNodes = new ArrayList<>();

        try {
            DocumentBuilder documentBuilder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
            Document xmlDocument = documentBuilder.parse(new ByteArrayInputStream(claimManagementResponse.getBytes()));

            // Extract "ns:return" tagged nodes
            NodeList nsReturnElements = xmlDocument.getElementsByTagName("ns:return");

            for (int i = 0; i < nsReturnElements.getLength(); i++) {
                oidcNodes.add(nsReturnElements.item(i));
            }

        } catch (ParserConfigurationException | SAXException | IOException e) {
            logger.log(Level.SEVERE, "Error while parsing claim SOAP response. Response will be ignored", e);
        }

        return oidcNodes;
    }

    private List<Node> getLocalClaimNodes() {

        final String localClaimSoapBody =
                "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\"" +
                        " xmlns:xsd=\"http://org.apache.axis2/xsd\">\n" +
                        "   <soapenv:Header/>\n" +
                        "   <soapenv:Body>\n" +
                        "      <xsd:getLocalClaims/>\n" +
                        "   </soapenv:Body>\n" +
                        "</soapenv:Envelope>";

        final String claimManagementResponse = getClaimManagementResponse(localClaimSoapBody, localClaimSoapAction);

        final List<Node> localClaimNodes = new ArrayList<>();

        try {
            DocumentBuilder documentBuilder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
            Document xmlDocument = documentBuilder.parse(new ByteArrayInputStream(claimManagementResponse.getBytes()));

            // Extract "ns:return" tagged nodes
            NodeList nsReturnElements = xmlDocument.getElementsByTagName("ns:return");

            for (int i = 0; i < nsReturnElements.getLength(); i++) {
                localClaimNodes.add(nsReturnElements.item(i));
            }

        } catch (ParserConfigurationException | SAXException | IOException e) {
            logger.log(Level.SEVERE, "Error while parsing claim SOAP response. Response will be ignored", e);
        }

        return localClaimNodes;
    }

    private String getClaimManagementResponse(final String soapBody, final String soapAction) {

        try {
            final URL url = new URL(this.claimManagementUrl);
            final HttpsURLConnection urlConnection = (HttpsURLConnection) url.openConnection();

            urlConnection.setDoOutput(true);
            urlConnection.setRequestMethod("POST");
            urlConnection.setRequestProperty("Content-Type", "text/xml");
            urlConnection.setRequestProperty(
                    "Authorization",
                    getAuthHeader(this.identityServerUsername, this.identityServerPassword));
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
            logger.log(Level.SEVERE, "Error while retrieving response", e);
            throw new RuntimeException("Error while retrieving response", e);
        }
    }

    private static String getAuthHeader(final String username, final String password) {

        final String base64Part =
                new String(java.util.Base64.getEncoder()
                        .encode(String.join(":", username, password)
                                .getBytes()));

        return String.join(" ", "Basic", base64Part);
    }
}
