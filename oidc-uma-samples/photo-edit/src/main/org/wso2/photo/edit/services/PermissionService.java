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
import org.wso2.photo.edit.SampleContextEventListener;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.net.ssl.HttpsURLConnection;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import static org.wso2.photo.edit.CommonUtils.getAuthHeader;
import static org.wso2.photo.edit.CommonUtils.getBearerHeader;
import static org.wso2.photo.edit.CommonUtils.getIdpUrl;
import static org.wso2.photo.edit.CommonUtils.readFromResponse;

public class PermissionService extends HttpServlet {

    private static final Logger LOGGER = Logger.getLogger(PermissionService.class.getName());
    private static final String POLICY_ID = "album-1-policy";
    private static String xacmlRequest = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap" +
                                               ".org/soap/envelope/\" xmlns:xsd=\"http://org.apache.axis2/xsd\" " +
                                               "xmlns:xsd1=\"http://dto.entitlement.identity.carbon.wso2.org/xsd\">\n" +
                                               "   <soapenv:Header/>\n" +
                                               "   <soapenv:Body>\n" +
                                               "      <xsd:updatePolicy>\n" +
                                               "         <!--Optional:-->\n" +
                                               "         <xsd:policyDTO>\n" +
                                               "         \n" +
                                               "            <!--Optional:-->\n" +
                                               "            <xsd1:policy>\n" +
                                               "            <![CDATA[\n" +
                                               "                    <Policy " +
                                               "xmlns=\"urn:oasis:names:tc:xacml:3.0:core:schema:wd-17\"  " +
                                               "PolicyId=\"" + POLICY_ID + "\" " +
                                               "RuleCombiningAlgId=\"urn:oasis:names:tc:xacml:1.0:rule-combining-algorithm:first-applicable\" Version=\"1.0\">\n" +
                                               "                        <Target>\n" +
                                               "                            <AnyOf>\n" +
                                               "                                <AllOf>\n" +
                                               "                                    <Match " +
                                               "MatchId=\"urn:oasis:names:tc:xacml:1.0:function:string-equal\">\n" +
                                               "                                        <AttributeValue " +
                                               "DataType=\"http://www" +
                                               ".w3.org/2001/XMLSchema#string\">${resource-id}</AttributeValue>\n" +
                                               "                                        <AttributeDesignator " +
                                               "AttributeId=\"http://wso2.org/identity/identity-resource/resource-id\" Category=\"http://wso2.org/identity/identity-resource\" DataType=\"http://www.w3.org/2001/XMLSchema#string\" MustBePresent=\"true\"></AttributeDesignator>\n" +
                                               "                                    </Match>\n" +
                                               "                                </AllOf>\n" +
                                               "                            </AnyOf>\n" +
                                               "                         </Target>\n" +
                                               "   <Rule Effect=\"Permit\" RuleId=\"permit_for_username\">"+
                                               "                        ${target}\n" +
                                               "                            <Condition>\n" +
                                               "                                <Apply " +
                                               "FunctionId=\"urn:oasis:names:tc:xacml:1.0:function:string-at-least-one-member-of\">\n" +
                                               "                                    <Apply " +
                                               "FunctionId=\"urn:oasis:names:tc:xacml:1.0:function:string-bag\">\n" +
                                               "                                        <AttributeValue " +
                                               "DataType=\"http://www" +
                                               ".w3.org/2001/XMLSchema#string\">view</AttributeValue>\n" +
                                               "                                        <AttributeValue " +
                                               "DataType=\"http://www" +
                                               ".w3.org/2001/XMLSchema#string\">download</AttributeValue>\n" +
                                               "                                    </Apply>\n" +
                                               "                                    <AttributeDesignator " +
                                               "AttributeId=\"http://wso2.org/identity/identity-action/action-name\" " +
                                               "Category=\"http://wso2.org/identity/identity-action\" " +
                                               "DataType=\"http://www.w3.org/2001/XMLSchema#string\" " +
                                               "MustBePresent=\"true\"></AttributeDesignator>\n" +
                                               "                                </Apply>\n" +
                                               "                            </Condition>\n" +
                                               "                        </Rule>\n" +
                                               "                        <Rule Effect=\"Deny\" " +
                                               "RuleId=\"Deny_all\"></Rule>\n" +
                                               "                    </Policy>      \n" +
                                               "                ]]>\n" +
                                               "            </xsd1:policy>\n" +
                                               "           \n" +
                                               "            <xsd1:policyEditorData></xsd1:policyEditorData>\n" +
                                               "            <!--Optional:-->\n" +
                                               "            <xsd1:policyId>" + POLICY_ID + "</xsd1:policyId>\n" +
                                               "           \n" +
                                               "         </xsd:policyDTO>\n" +
                                               "      </xsd:updatePolicy>\n" +
                                               "   </soapenv:Body>\n" +
                                               "</soapenv:Envelope>";


    private static String publishPolicyRequest = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap" +
                                                 ".org/soap/envelope/\" xmlns:xsd=\"http://org.apache.axis2/xsd\">\n" +
                                                 "    <soapenv:Header/>\n" +
                                                 "    <soapenv:Body>\n" +
                                                 "        <ns3:publishPolicies xmlns:ns3=\"http://org.apache" +
                                                 ".axis2/xsd\">\n" +
                                                 "            <ns3:policyIds>" + POLICY_ID + "</ns3:policyIds>\n" +
                                                 "            <ns3:subscriberIds>PDP Subscriber</ns3:subscriberIds>\n" +
                                                 "            <ns3:action>CREATE</ns3:action>\n" +
                                                 "            <ns3:version xmlns:xsi=\"http://www" +
                                                 ".w3.org/2001/XMLSchema-instance\" xsi:nil=\"1\"/>\n" +
                                                 "            <ns3:enabled>true</ns3:enabled>\n" +
                                                 "            <ns3:order>0</ns3:order>\n" +
                                                 "        </ns3:publishPolicies>\n" +
                                                 "    </soapenv:Body>\n" +
                                                 "</soapenv:Envelope>";

    private static String policyDualTarget = "<Target>\n" +
                                             "         <AnyOf>\n" +
                                             "            <AllOf>\n" +
                                             "               <Match " +
                                             "MatchId=\"urn:oasis:names:tc:xacml:1.0:function:string-equal\">\n" +
                                             "                  <AttributeValue DataType=\"http://www" +
                                             ".w3.org/2001/XMLSchema#string\">oliver</AttributeValue>\n" +
                                             "                  <AttributeDesignator " +
                                             "AttributeId=\"http://wso2.org/identity/user/username\" " +
                                             "Category=\"http://wso2.org/identity/user\" DataType=\"http://www" +
                                             ".w3.org/2001/XMLSchema#string\" " +
                                             "MustBePresent=\"false\"></AttributeDesignator>\n" +
                                             "               </Match>\n" +
                                             "            </AllOf>\n" +
                                             "            <AllOf>\n" +
                                             "               <Match " +
                                             "MatchId=\"urn:oasis:names:tc:xacml:1.0:function:string-equal\">\n" +
                                             "                  <AttributeValue DataType=\"http://www" +
                                             ".w3.org/2001/XMLSchema#string\">pam.uma.demo</AttributeValue>\n" +
                                             "                  <AttributeDesignator " +
                                             "AttributeId=\"http://wso2.org/identity/user/username\" " +
                                             "Category=\"http://wso2.org/identity/user\" DataType=\"http://www" +
                                             ".w3.org/2001/XMLSchema#string\" " +
                                             "MustBePresent=\"false\"></AttributeDesignator>\n" +
                                             "               </Match>\n" +
                                             "            </AllOf>\n" +
                                             "         </AnyOf>\n" +
                                             "      </Target>";

    private static String policySingleTarget = "<Target>\n" +
                                               "         <AnyOf>\n" +
                                               "            <AllOf>\n" +
                                               "               <Match " +
                                               "MatchId=\"urn:oasis:names:tc:xacml:1.0:function:string-equal\">\n" +
                                               "                  <AttributeValue DataType=\"http://www" +
                                               ".w3.org/2001/XMLSchema#string\">${authz-user}</AttributeValue>\n" +
                                               "                  <AttributeDesignator " +
                                               "AttributeId=\"http://wso2.org/identity/user/username\" " +
                                               "Category=\"http://wso2.org/identity/user\" DataType=\"http://www" +
                                               ".w3.org/2001/XMLSchema#string\" " +
                                               "MustBePresent=\"false\"></AttributeDesignator>\n" +
                                               "               </Match>\n" +
                                               "            </AllOf>\n" +
                                               "         </AnyOf>\n" +
                                               "      </Target>";

    private static String target;

    @Override
    protected void doPost(final HttpServletRequest req, final HttpServletResponse resp)
            throws ServletException, IOException {

        final BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(req.getInputStream()));

        final StringBuilder stringBuilder = new StringBuilder();

        String line;

        while ((line = bufferedReader.readLine()) != null) {
            stringBuilder.append(line);
        }

        final JSONObject jsonObject = new JSONObject(stringBuilder.toString());
        final String albumId = jsonObject.getString("photoId");
        final boolean familyView = (boolean) jsonObject.get("familyView");
        final boolean friendView = (boolean) jsonObject.get("friendView");

        if (familyView && friendView) {
            target = policyDualTarget;
        } else if (familyView) {
            target = policySingleTarget.replaceAll("\\$\\{authz-user}", "oliver");
        } else if (friendView) {
            target = policySingleTarget.replaceAll("\\$\\{authz-user}", "pam");
        }

        HttpSession session = req.getSession(false);
        String accessToken = (String) session.getAttribute("accessToken");

        LOGGER.fine("Retrieved access token from session: " + accessToken);
        String resourceId = getResourceId(req);
        LOGGER.fine("Retrieved resource ID: " + resourceId);

        ResourceTokenData resourceTokenData = new ResourceTokenData(resourceId, accessToken);
        CommonUtils.addToResourceMap(albumId, resourceTokenData);

        createPolicy(resourceId);
        publishPolicy();
    }

    private String createResource(HttpServletRequest req) throws IOException {

        String isUrl = getIdpUrl();
        String umaResourceEp = isUrl + "/api/identity/oauth2/uma/resourceregistration/v1.0/resource/";

        final JSONObject jsonObject = new JSONObject();

        final JSONArray resourceScopes = new JSONArray();
        resourceScopes.put("view");

        jsonObject.put("resource_scopes", resourceScopes);
        jsonObject.put("description", "Photo album");
        jsonObject.put("icon_uri", "http://www.example.com/icons/album.png");
        jsonObject.put("type", "http://www.example.com/rsrcs/photo-album");
        jsonObject.put("name", "album" + UUID.randomUUID().toString());

        final String jsonPayload = jsonObject.toString();

        LOGGER.fine("Resource creation request payload: " + jsonPayload);
        HttpsURLConnection urlConnection = (HttpsURLConnection) new URL(umaResourceEp).openConnection();
        urlConnection.setRequestMethod("POST");
        urlConnection.setRequestProperty("Authorization", getBearerHeader(req));
        urlConnection.setRequestProperty("Content-Type", "application/json");

        urlConnection.setDoOutput(true);

        DataOutputStream dataOutputStream = new DataOutputStream(urlConnection.getOutputStream());

        dataOutputStream.writeBytes(jsonPayload);
        String res = readFromResponse(urlConnection);
        JSONObject jsonResp = new JSONObject(res);
        return jsonResp.getString("_id");
    }


    private String getResourceId(HttpServletRequest req) throws IOException {

        String resourceId = SampleContextEventListener.getProperties().getProperty("resource_id");

        if (StringUtils.isNotBlank(resourceId)) {
            String verifyExistUrl = getIdpUrl() + "/api/identity/oauth2/uma/resourceregistration/v1.0/resource/" +
                                    resourceId;
            HttpURLConnection urlConnection = (HttpURLConnection) new URL(verifyExistUrl).openConnection();
            urlConnection.setRequestMethod("GET");
            urlConnection.setRequestProperty("Authorization", getBearerHeader(req));

            int responseCode = urlConnection.getResponseCode();

            if (responseCode == 200) {
                return resourceId;
            }
        }
        resourceId = createResource(req);
        updateAppProperties("resource_id", resourceId, true);
        return resourceId;

    }

    private static void updateAppProperties(String key, String value, boolean updateFile) {

        Properties properties = SampleContextEventListener.getProperties();
        properties.put(key, value);
        if (updateFile) {
            updatePropertyFile(key, value);
        }
    }

    private static void updatePropertyFile(String key, String value) {

        Path path = Paths.get(SampleContextEventListener.getPropertyFilePath());
        Properties properties = new Properties();

        try (InputStream inputStream = Files.newInputStream(path)) {
            properties.load(inputStream);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, e.getMessage(), e);
        }
        properties.put(key, value);
        try (OutputStream outputStream = Files.newOutputStream(path)) {
            properties.store(outputStream, null);
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, e.getMessage(), e);
        }
    }

    private void createPolicy(String resourceId) throws IOException {

        String isUrl = getIdpUrl();
        String entitlementServiceUrl = isUrl + "/services/EntitlementPolicyAdminService";

        HttpsURLConnection urlConnection = (HttpsURLConnection) new URL(entitlementServiceUrl).openConnection();
        urlConnection.setRequestMethod("POST");
        urlConnection.setRequestProperty("Authorization", getAuthHeader());
        urlConnection.setRequestProperty("Content-Type", "text/xml");
        urlConnection.setRequestProperty("SOAPAction", "updatePolicy");

        urlConnection.setDoOutput(true);

        DataOutputStream dataOutputStream = new DataOutputStream(urlConnection.getOutputStream());

        String request = xacmlRequest.replaceAll("\\$\\{resource-id}", resourceId)
                                     .replaceAll("\\$\\{target}", target);
        LOGGER.fine("XACML policy update request: " + request);
        dataOutputStream.writeBytes(request);

        LOGGER.fine("XACML policy update request status: " + urlConnection.getResponseCode());
        LOGGER.fine("XACML policy update response: " + readFromResponse(urlConnection));
    }

    private void publishPolicy() throws IOException {

        String isUrl = getIdpUrl();
        String entitlementServiceUrl = isUrl + "/services/EntitlementPolicyAdminService";

        HttpsURLConnection urlConnection = (HttpsURLConnection) new URL(entitlementServiceUrl).openConnection();
        urlConnection.setRequestMethod("POST");
        urlConnection.setRequestProperty("Authorization", getAuthHeader());
        urlConnection.setRequestProperty("Content-Type", "text/xml");
        urlConnection.setRequestProperty("SOAPAction", "publishPolicies");

        urlConnection.setDoOutput(true);

        DataOutputStream dataOutputStream = new DataOutputStream(urlConnection.getOutputStream());

        dataOutputStream.writeBytes(publishPolicyRequest);

        LOGGER.fine("XACML policy publish status: " + urlConnection.getResponseCode());
        LOGGER.fine("XACML policy publish response: " + readFromResponse(urlConnection));
    }
}
