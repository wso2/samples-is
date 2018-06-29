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
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.client.methods.RequestBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;

public class CategoryId {
    public static void main(String[] args) throws IOException {

        // This stdout intentionally added to be read by the script
        System.out.println(getPiiCategoryId());
    }

    public static int getPiiCategoryId() throws IOException {

        JSONObject json;
        int categoryId = 0;

        HttpUriRequest request = RequestBuilder
                .get()
                .setUri("https://localhost:9443/api/identity/consent-mgt/v1.0/consents/pii-categories?limit=10&offset=0")
                .addHeader("Accept","application/json")
                .addHeader("Authorization","Basic YWRtaW46YWRtaW4=")
                .build();

        CloseableHttpClient httpclient = HttpClients.createDefault();

        CloseableHttpResponse closeablehttpresponse = httpclient.execute(request);
        String responseString = EntityUtils.toString(closeablehttpresponse.getEntity(), "UTF-8");

        JSONArray jsonArray = new JSONArray(responseString);
        for (int i = 0; i < jsonArray.length(); i++) {
            json = jsonArray.getJSONObject(i);
            if ((json.getString("displayName")).equals("Mobile")) {
                categoryId = json.getInt("piiCategoryId");
            }
        }

        return categoryId;
    }

}
