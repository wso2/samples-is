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
package org.wso2.photo.view;

import org.json.JSONArray;
import org.json.JSONObject;
import org.wso2.photo.view.exceptions.SampleAppServerException;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.util.Base64;

public class DCRUtility {

    public static void performDCR() throws SampleAppServerException {

        final String dcrEndpoint = SampleContextEventListener.getProperties().getProperty("dcrEndpoint");
        final String appName = SampleContextEventListener.getProperties().getProperty("appName");

        final String verifyExistUrl = dcrEndpoint + "?client_name=" + appName;

        try {
            HttpURLConnection urlConnection = (HttpURLConnection) new URL(verifyExistUrl).openConnection();
            urlConnection.setRequestMethod("GET");
            urlConnection.setRequestProperty("Authorization", getAuthHeader());

            int responseCode = urlConnection.getResponseCode();

            if (responseCode != 200) {
                createApp();
            } else {
                readFromResponse(urlConnection);
            }

        } catch (IOException e) {
            throw new SampleAppServerException("Something went wrong", e);
        }
    }

    private static void createApp() throws SampleAppServerException {

        final String dcrEndpoint = SampleContextEventListener.getProperties().getProperty("dcrEndpoint");
        final String appName = SampleContextEventListener.getProperties().getProperty("appName");

        final String callBackUrl = SampleContextEventListener.getProperties().getProperty("callBackUrl");

        final JSONObject jsonObject = new JSONObject();

        final JSONArray callBackArray = new JSONArray();
        callBackArray.put(callBackUrl);

        final JSONArray grantTypeArray = new JSONArray();
        grantTypeArray.put("authorization_code");
        grantTypeArray.put("urn:ietf:params:oauth:grant-type:uma-ticket");

        jsonObject.put("redirect_uris", callBackArray);
        jsonObject.put("client_name", appName);
        jsonObject.put("grant_types", grantTypeArray);

        final String jsonPayload = jsonObject.toString();

        try {
            HttpURLConnection urlConnection = (HttpURLConnection) new URL(dcrEndpoint).openConnection();
            urlConnection.setRequestMethod("POST");
            urlConnection.setRequestProperty("Authorization", getAuthHeader());
            urlConnection.setRequestProperty("Content-Type", "application/json");

            urlConnection.setDoOutput(true);

            DataOutputStream dataOutputStream = new DataOutputStream(urlConnection.getOutputStream());

            dataOutputStream.writeChars(jsonPayload);

            readFromResponse(urlConnection);

        } catch (IOException e) {
            throw new SampleAppServerException("Something went wrong", e);
        }
    }

    private static void readFromResponse(final URLConnection urlConnection) throws SampleAppServerException {

        try {
            final BufferedReader bufferedInputStream = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));

            final StringBuilder stringBuilder = new StringBuilder();

            String line;
            while ((line = bufferedInputStream.readLine()) != null) {
                stringBuilder.append(line);
            }

            final JSONObject jsonObject = new JSONObject(stringBuilder.toString());

            // Read and set properties
            SampleContextEventListener.getProperties().setProperty("consumerKey", jsonObject.getString("client_id"));
            SampleContextEventListener.getProperties().setProperty("consumerSecret", jsonObject.getString("client_secret"));

        } catch (IOException e) {
            throw new SampleAppServerException("Something went wrong", e);
        }
    }

    private static String getAuthHeader() {

        final String username = SampleContextEventListener.getProperties().getProperty("isUser");
        final String password = SampleContextEventListener.getProperties().getProperty("isPass");

        final String encodedCredentials =
                new String(Base64.getEncoder().encode(String.join(":", username, password).getBytes()));

        return "Basic " + encodedCredentials;
    }

}
