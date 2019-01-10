/**
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 * <p>
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package org.wso2.qsg.webapp.pickup.manager;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.opensaml.xml.XMLObject;
import org.opensaml.xml.io.Marshaller;
import org.opensaml.xml.io.MarshallerFactory;
import org.opensaml.xml.util.Base64;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.w3c.dom.bootstrap.DOMImplementationRegistry;
import org.w3c.dom.ls.DOMImplementationLS;
import org.w3c.dom.ls.LSOutput;
import org.w3c.dom.ls.LSSerializer;
import org.wso2.carbon.identity.sso.agent.bean.LoggedInSessionBean;
import org.xml.sax.SAXException;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import javax.net.ssl.HttpsURLConnection;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

public class CommonUtil {

    private static Log log = LogFactory.getLog(CommonUtil.class);

    private static Properties properties;

    static {
        properties = new Properties();
        try {
            properties.load(CommonUtil.class.getClassLoader().getResourceAsStream("sso.properties"));
        } catch (IOException e) {
            log.error("Error while loading properties", e);
        }
    }

    /**
     * Serialize the Auth. Request
     *
     * @param xmlObject
     * @return serialized auth. req
     */
    public static String marshall(XMLObject xmlObject) throws Exception {

        ByteArrayOutputStream byteArrayOutputStream = null;
        try {

            MarshallerFactory marshallerFactory = org.opensaml.xml.Configuration.getMarshallerFactory();
            Marshaller marshaller = marshallerFactory.getMarshaller(xmlObject);
            Element element = marshaller.marshall(xmlObject);

            byteArrayOutputStream = new ByteArrayOutputStream();
            DOMImplementationRegistry registry = DOMImplementationRegistry.newInstance();
            DOMImplementationLS impl = (DOMImplementationLS) registry.getDOMImplementation("LS");
            LSSerializer writer = impl.createLSSerializer();
            LSOutput output = impl.createLSOutput();
            output.setByteStream(byteArrayOutputStream);
            writer.write(element, output);
            return byteArrayOutputStream.toString("UTF-8");
        } catch (Exception e) {
            log.error("Error Serializing the SAML Response");
            throw new Exception("Error Serializing the SAML Response", e);
        } finally {
            if (byteArrayOutputStream != null) {
                try {
                    byteArrayOutputStream.close();
                } catch (IOException e) {
                    log.error("Error while closing the stream", e);
                }
            }
        }
    }

    public static Map<String, String> getClaimValueMap(final LoggedInSessionBean loggedInSessionBean) {

        final Map<String, String> subjectAttributes = loggedInSessionBean.getSAML2SSO().getSubjectAttributes();

        final Map<String, String> claimMappingsDisplayValue =
                getClaimMappingsDisplayValue(new ArrayList<>(subjectAttributes.keySet()));

        final Map<String, String> samlClaimValuePairs = new HashMap<>();

        for (final String claimUri : claimMappingsDisplayValue.keySet()) {
            samlClaimValuePairs.put(claimMappingsDisplayValue.get(claimUri), subjectAttributes.get(claimUri));
        }

        return samlClaimValuePairs;
    }

    /**
     * Encoding the response
     *
     * @param xmlString String to be encoded
     * @return encoded String
     */
    public static String encode(String xmlString) {
        // Encoding the message
        String encodedRequestMessage =
                Base64.encodeBytes(xmlString.getBytes(StandardCharsets.UTF_8),
                        Base64.DONT_BREAK_LINES);
        return encodedRequestMessage.trim();
    }

    private static Map<String, String> getClaimMappingsDisplayValue(final List<String> claimURIList) {

        final Map<String, String> claimDisplayValueMap = new HashMap<>();

        // We call claim management service and retrieve local claim details
        String claimManagementEndpoint = properties.getProperty("claimManagementEndpoint");

        String soapBody = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\"" +
                " xmlns:xsd=\"http://org.apache.axis2/xsd\">\n" +
                "   <soapenv:Header/>\n" +
                "   <soapenv:Body>\n" +
                "      <xsd:getLocalClaims/>\n" +
                "   </soapenv:Body>\n" +
                "</soapenv:Envelope>";

        final String soapResponse;

        try {
            final URL url = new URL(claimManagementEndpoint);
            final HttpsURLConnection urlConnection = (HttpsURLConnection) url.openConnection();

            urlConnection.setDoOutput(true);
            urlConnection.setRequestMethod("POST");
            urlConnection.setRequestProperty("Content-Type", "text/xml");
            urlConnection.setRequestProperty("Authorization", getAuthHeader());
            urlConnection.setRequestProperty("SOAPAction", "getLocalClaims");

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

            soapResponse = soapResponseBuilder.toString();
        } catch (final IOException e) {
            log.error("Error while retrieving claim details", e);
            return claimDisplayValueMap;
        }

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
            log.error("Error while parsing claim SOAP response", e);
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

    private static String getAuthHeader() {

        String adminUsername = properties.getProperty("adminUsername");
        String adminPassword = properties.getProperty("adminPassword");

        String base64Part =
                new String(java.util.Base64.getEncoder()
                        .encode(String.join(":", adminUsername, adminUsername)
                                .getBytes()));

        return String.join(" ", "Basic", base64Part);
    }

}
